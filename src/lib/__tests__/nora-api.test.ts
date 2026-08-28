/**
 * nora-api.test.ts — proves the Phase 2 and Phase 3 API-layer invariants.
 * All fetch calls go to /api/nora/… proxy routes; the secret never touches this module.
 *
 * Adaptation note (R1 port):
 *   Two test groups present in the neednora-com reference are intentionally
 *   omitted here until the corresponding features exist in this codebase:
 *   - "demo independence" (conversations.ts not yet ported — pending founder approval)
 *   - try-nora.tsx handoff-specific static checks (Open WhatsApp link, consent
 *     checkbox comment) — those features live in try-nora.tsx and are not yet
 *     ported in R1.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  createConversation,
  sendMessage,
  collectWhatsApp,
  getHandoffUrl,
  normalizePhone,
  NoraSalesApiError,
  type MessageAction,
} from '../nora-api'

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

type FetchResponse = {
  ok: boolean
  status: number
  json: () => Promise<unknown>
}

function stubFetch(...responses: FetchResponse[]): ReturnType<typeof vi.fn> {
  const mock = vi.fn()
  for (const r of responses) mock.mockResolvedValueOnce(r)
  vi.stubGlobal('fetch', mock)
  return mock
}

function stubFetchNetworkError(): void {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new TypeError('fetch failed')))
}

function okResponse(status: number, body: unknown): FetchResponse {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

const VALID_TOKEN = 'a'.repeat(64)
const TOKEN_B = 'b'.repeat(64)

afterEach(() => vi.unstubAllGlobals())

// --------------------------------------------------------------------------
// 1. Exactly one fetch call to /api/nora/conversations
// --------------------------------------------------------------------------

describe('createConversation — session creation', () => {
  it('creates exactly one fetch request', async () => {
    const mock = stubFetch(okResponse(201, { sessionToken: VALID_TOKEN, reply: 'Hello' }))
    await createConversation('en')
    expect(mock).toHaveBeenCalledOnce()
  })

  it('calls the correct proxy URL (not the backend directly)', async () => {
    const mock = stubFetch(okResponse(201, { sessionToken: VALID_TOKEN, reply: 'Hi' }))
    await createConversation('en')
    const [url] = mock.mock.calls[0] as [string, ...unknown[]]
    expect(url).toBe('/api/nora/conversations')
    expect(url).not.toContain('render.com')
    expect(url).not.toContain('onrender.com')
  })

  it('sends the locale in the request body', async () => {
    const mock = stubFetch(okResponse(201, { sessionToken: VALID_TOKEN, reply: 'Hola' }))
    await createConversation('es')
    const [, init] = mock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(init.body as string) as { locale: string }
    expect(body.locale).toBe('es')
  })

  it('returns the API reply verbatim — not a hardcoded string', async () => {
    const reply = 'Custom backend reply — unique to this test'
    stubFetch(okResponse(201, { sessionToken: VALID_TOKEN, reply }))
    const result = await createConversation('en')
    expect(result.reply).toBe(reply)
  })

  it('returns the sessionToken from the API response', async () => {
    stubFetch(okResponse(201, { sessionToken: TOKEN_B, reply: 'Hi' }))
    const result = await createConversation('en')
    expect(result.sessionToken).toBe(TOKEN_B)
  })
})

// --------------------------------------------------------------------------
// sendMessage — sessionToken usage and reply handling
// --------------------------------------------------------------------------

describe('sendMessage — sessionToken usage', () => {
  it('sends to the correct proxy URL containing the sessionToken', async () => {
    const mock = stubFetch(okResponse(200, { reply: 'ok' }))
    await sendMessage(VALID_TOKEN, 'hello')
    const [url] = mock.mock.calls[0] as [string, ...unknown[]]
    expect(url).toBe(`/api/nora/conversations/${VALID_TOKEN}/messages`)
  })

  it('uses the SAME sessionToken in URL for multiple consecutive messages', async () => {
    const mock = stubFetch(
      okResponse(200, { reply: 'First' }),
      okResponse(200, { reply: 'Second' }),
    )
    await sendMessage(VALID_TOKEN, 'message 1')
    await sendMessage(VALID_TOKEN, 'message 2')
    const [url1] = mock.mock.calls[0] as [string, ...unknown[]]
    const [url2] = mock.mock.calls[1] as [string, ...unknown[]]
    expect(url1).toBe(`/api/nora/conversations/${VALID_TOKEN}/messages`)
    expect(url2).toBe(url1)
  })

  it('sends the user message in the request body', async () => {
    const mock = stubFetch(okResponse(200, { reply: 'ok' }))
    await sendMessage(VALID_TOKEN, 'my exact message text')
    const [, init] = mock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(init.body as string) as { message: string }
    expect(body.message).toBe('my exact message text')
  })

  it('returns the NORA reply verbatim from the API response', async () => {
    const reply = 'NORA says: got it, processing now'
    stubFetch(okResponse(200, { reply }))
    const result = await sendMessage(VALID_TOKEN, 'hi')
    expect(result.reply).toBe(reply)
  })
})

// --------------------------------------------------------------------------
// offer_whatsapp — structural detection (never string matching)
// --------------------------------------------------------------------------

describe('offer_whatsapp — structural detection', () => {
  it('returns action.type when backend sends offer_whatsapp action', async () => {
    const backendAction: MessageAction = { type: 'offer_whatsapp', reason: 'high_intent' }
    stubFetch(okResponse(200, { reply: 'Continue on WhatsApp?', action: backendAction }))
    const result = await sendMessage(VALID_TOKEN, 'hi')
    expect(result.action?.type).toBe('offer_whatsapp')
    expect(result.action?.reason).toBe('high_intent')
  })

  it('does NOT set action when reply text contains "whatsapp" but no action field', async () => {
    stubFetch(okResponse(200, { reply: 'You can continue on whatsapp if you want.' }))
    const result = await sendMessage(VALID_TOKEN, 'hi')
    expect(result.action).toBeUndefined()
  })

  it('does NOT set action when action field is a string instead of an object', async () => {
    stubFetch(okResponse(200, { reply: 'ok', action: 'offer_whatsapp' }))
    const result = await sendMessage(VALID_TOKEN, 'hi')
    expect(result.action).toBeUndefined()
  })

  it('does NOT set action when action.type is missing', async () => {
    stubFetch(okResponse(200, { reply: 'ok', action: { reason: 'something' } }))
    const result = await sendMessage(VALID_TOKEN, 'hi')
    expect(result.action).toBeUndefined()
  })
})

// --------------------------------------------------------------------------
// Error handling — typed errors with correct codes
// --------------------------------------------------------------------------

describe('error handling', () => {
  it('throws NoraSalesApiError on network error from createConversation', async () => {
    stubFetchNetworkError()
    await expect(createConversation('en')).rejects.toBeInstanceOf(NoraSalesApiError)
  })

  it('throws SERVICE_UNAVAILABLE on 503 from createConversation', async () => {
    stubFetch(okResponse(503, { error: 'service unavailable' }))
    const err = await createConversation('en').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
    expect(err.retryable).toBe(true)
  })

  it('createConversation error message is user-safe (no internal details)', async () => {
    stubFetch(okResponse(503, { error: 'internal secret leak' }))
    const err = await createConversation('en').catch(e => e)
    expect(err.message).not.toContain('internal secret leak')
    expect(err.message.length).toBeGreaterThan(0)
  })

  it('throws NoraSalesApiError on network error from sendMessage', async () => {
    stubFetchNetworkError()
    await expect(sendMessage(VALID_TOKEN, 'hi')).rejects.toBeInstanceOf(NoraSalesApiError)
  })

  it('throws SERVICE_UNAVAILABLE on 503 from sendMessage', async () => {
    stubFetch(okResponse(503, { error: 'service unavailable' }))
    const err = await sendMessage(VALID_TOKEN, 'hi').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
  })

  it('throws RATE_LIMITED on 429 response from sendMessage', async () => {
    stubFetch(okResponse(429, { error: 'rate limited' }))
    const err = await sendMessage(VALID_TOKEN, 'hi').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('RATE_LIMITED')
    expect(err.retryable).toBe(true)
  })

  it('throws RATE_LIMITED on 429 response from createConversation', async () => {
    stubFetch(okResponse(429, { error: 'rate limited' }))
    const err = await createConversation('en').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('RATE_LIMITED')
  })

  it('throws SERVICE_UNAVAILABLE on 500 from sendMessage', async () => {
    stubFetch(okResponse(500, { error: 'internal server error' }))
    const err = await sendMessage(VALID_TOKEN, 'hi').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
  })

  it('throws SESSION_EXPIRED on 404 (invalid or expired session)', async () => {
    stubFetch(okResponse(404, { error: 'not found' }))
    const err = await sendMessage(VALID_TOKEN, 'hi').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SESSION_EXPIRED')
    expect(err.retryable).toBe(false)
  })

  it('SESSION_EXPIRED message tells user to start a new conversation', async () => {
    stubFetch(okResponse(404, { error: 'not found' }))
    const err = await sendMessage(VALID_TOKEN, 'hi').catch(e => e)
    expect(err.message.toLowerCase()).toContain('new')
  })
})

// --------------------------------------------------------------------------
// Security — client-side boundary (nora-api.ts static analysis)
// --------------------------------------------------------------------------

describe('security — client-side boundary', () => {
  it('nora-api.ts never reads NORA_SALES_API_SECRET from process.env', () => {
    const source = readFileSync(resolve(__dirname, '../nora-api.ts'), 'utf-8')
    expect(source).not.toContain("process.env.NORA_SALES_API_SECRET")
    expect(source).not.toContain("process.env['NORA_SALES_API_SECRET']")
  })

  it('nora-api.ts never reads NORA_API_URL from process.env', () => {
    const source = readFileSync(resolve(__dirname, '../nora-api.ts'), 'utf-8')
    expect(source).not.toContain("process.env.NORA_API_URL")
    expect(source).not.toContain("process.env['NORA_API_URL']")
  })

  it('nora-api.ts never calls render.com or onrender.com directly', () => {
    const source = readFileSync(resolve(__dirname, '../nora-api.ts'), 'utf-8')
    expect(source).not.toContain('render.com')
  })

  it('all fetch calls go through /api/nora/ proxy routes, not the backend', async () => {
    const mock = stubFetch(okResponse(201, { sessionToken: VALID_TOKEN, reply: 'Hi' }))
    await createConversation('en')
    const [url] = mock.mock.calls[0] as [string, ...unknown[]]
    expect(url).toMatch(/^\/api\/nora\//)
  })
})

// ==========================================================================
// PHASE 3 — WhatsApp handoff (normalizePhone, collectWhatsApp, getHandoffUrl)
// ==========================================================================

// --------------------------------------------------------------------------
// P3-1. normalizePhone — E.164 normalisation and validation
// --------------------------------------------------------------------------

describe('normalizePhone — E.164 normalisation', () => {
  it('accepts a bare E.164 number (+12015551234)', () => {
    expect(normalizePhone('+12015551234')).toBe('+12015551234')
  })

  it('accepts E.164 with spaces and strips them', () => {
    expect(normalizePhone('+1 404 555 1234')).toBe('+14045551234')
  })

  it('accepts E.164 with dashes and strips them', () => {
    expect(normalizePhone('+1-404-555-1234')).toBe('+14045551234')
  })

  it('accepts E.164 with parentheses around area code and strips them', () => {
    expect(normalizePhone('+1 (404) 555-1234')).toBe('+14045551234')
  })

  it('accepts E.164 with dots and strips them', () => {
    expect(normalizePhone('+1.404.555.1234')).toBe('+14045551234')
  })

  it('converts 00-prefix to + prefix and validates', () => {
    expect(normalizePhone('0014045551234')).toBe('+14045551234')
  })

  it('accepts Costa Rica number with spaces (+506 8888 8888)', () => {
    expect(normalizePhone('+506 8888 8888')).toBe('+50688888888')
  })

  it('rejects a number with no + and no 00 prefix', () => {
    expect(normalizePhone('14045551234')).toBeNull()
  })

  it('rejects a number that is too short (fewer than 7 digits after +)', () => {
    expect(normalizePhone('+12345')).toBeNull()
  })

  it('rejects a number with letters', () => {
    expect(normalizePhone('+1800COLLECT')).toBeNull()
  })

  it('rejects an empty string', () => {
    expect(normalizePhone('')).toBeNull()
  })

  it('rejects whitespace only', () => {
    expect(normalizePhone('   ')).toBeNull()
  })
})

// --------------------------------------------------------------------------
// P3-2. collectWhatsApp — URL, consent boolean, and status handling
// --------------------------------------------------------------------------

describe('collectWhatsApp — WhatsApp opt-in submission', () => {
  it('calls the correct proxy URL containing the sessionToken', async () => {
    const mock = stubFetch(okResponse(200, { status: 'message_sent', fallbackWhatsappUrl: 'https://wa.me/link/abc' }))
    await collectWhatsApp(VALID_TOKEN, '+12015551234')
    const [url] = mock.mock.calls[0] as [string, ...unknown[]]
    expect(url).toBe(`/api/nora/conversations/${VALID_TOKEN}/whatsapp`)
    expect(url).not.toContain('render.com')
  })

  it('always sends consent as the boolean true — never a string', async () => {
    const mock = stubFetch(okResponse(200, { status: 'message_sent', fallbackWhatsappUrl: 'https://wa.me/link/abc' }))
    await collectWhatsApp(VALID_TOKEN, '+12015551234')
    const [, init] = mock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(init.body as string) as { consent: unknown; phone: string }
    expect(body.consent).toBe(true)
    expect(typeof body.consent).toBe('boolean')
    expect(body.phone).toBe('+12015551234')
  })

  it('returns message_sent status with fallbackWhatsappUrl', async () => {
    const url = 'https://wa.me/link/message_sent_test'
    stubFetch(okResponse(200, { status: 'message_sent', fallbackWhatsappUrl: url }))
    const result = await collectWhatsApp(VALID_TOKEN, '+12015551234')
    expect(result.status).toBe('message_sent')
    expect(result.fallbackWhatsappUrl).toBe(url)
  })

  it('returns fallback_sent status with fallbackWhatsappUrl', async () => {
    const url = 'https://wa.me/link/fallback_test'
    stubFetch(okResponse(200, { status: 'fallback_sent', fallbackWhatsappUrl: url }))
    const result = await collectWhatsApp(VALID_TOKEN, '+12015551234')
    expect(result.status).toBe('fallback_sent')
    expect(result.fallbackWhatsappUrl).toBe(url)
  })

  it('returns already_sent status with no fallbackWhatsappUrl', async () => {
    stubFetch(okResponse(200, { status: 'already_sent' }))
    const result = await collectWhatsApp(VALID_TOKEN, '+12015551234')
    expect(result.status).toBe('already_sent')
    expect(result.fallbackWhatsappUrl).toBeUndefined()
  })

  it('throws PHONE_INVALID on 400 with invalid phone message', async () => {
    stubFetch(okResponse(400, {
      statusCode: 400,
      message: 'Invalid phone number — must be E.164 format (e.g. +50688888888)',
      error: 'Bad Request',
    }))
    const err = await collectWhatsApp(VALID_TOKEN, '+bad').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('PHONE_INVALID')
    expect(err.retryable).toBe(false)
  })

  it('throws PHONE_ALREADY_BOUND on 400 with "already bound" message', async () => {
    stubFetch(okResponse(400, {
      statusCode: 400,
      message: 'A different phone number is already bound to this session',
      error: 'Bad Request',
    }))
    const err = await collectWhatsApp(VALID_TOKEN, '+12015551234').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('PHONE_ALREADY_BOUND')
    expect(err.retryable).toBe(false)
  })

  it('throws OFFER_NOT_MADE on 400 with "not been offered" message', async () => {
    stubFetch(okResponse(400, {
      statusCode: 400,
      message: 'WhatsApp has not been offered in this session yet',
      error: 'Bad Request',
    }))
    const err = await collectWhatsApp(VALID_TOKEN, '+12015551234').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('OFFER_NOT_MADE')
  })

  it('throws NETWORK_ERROR on network failure', async () => {
    stubFetchNetworkError()
    const err = await collectWhatsApp(VALID_TOKEN, '+12015551234').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('NETWORK_ERROR')
    expect(err.retryable).toBe(true)
  })

  it('throws SESSION_EXPIRED on 404', async () => {
    stubFetch(okResponse(404, { error: 'not found' }))
    const err = await collectWhatsApp(VALID_TOKEN, '+12015551234').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SESSION_EXPIRED')
  })

  it('throws RATE_LIMITED on 429', async () => {
    stubFetch(okResponse(429, { error: 'rate limited' }))
    const err = await collectWhatsApp(VALID_TOKEN, '+12015551234').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('RATE_LIMITED')
    expect(err.retryable).toBe(true)
  })

  it('throws SERVICE_UNAVAILABLE on 503', async () => {
    stubFetch(okResponse(503, { error: 'unavailable' }))
    const err = await collectWhatsApp(VALID_TOKEN, '+12015551234').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
    expect(err.retryable).toBe(true)
  })
})

// --------------------------------------------------------------------------
// P3-3. getHandoffUrl — fresh alias after already_sent or PHONE_ALREADY_BOUND
// --------------------------------------------------------------------------

describe('getHandoffUrl — fresh WhatsApp deep link', () => {
  it('calls the correct proxy URL containing the sessionToken', async () => {
    const mock = stubFetch(okResponse(200, { whatsappUrl: 'https://wa.me/link/fresh' }))
    await getHandoffUrl(VALID_TOKEN)
    const [url] = mock.mock.calls[0] as [string, ...unknown[]]
    expect(url).toBe(`/api/nora/conversations/${VALID_TOKEN}/handoff`)
    expect(url).not.toContain('render.com')
  })

  it('returns the whatsappUrl from the API response verbatim', async () => {
    const wa = 'https://wa.me/link/abc123'
    stubFetch(okResponse(200, { whatsappUrl: wa }))
    const result = await getHandoffUrl(VALID_TOKEN)
    expect(result.whatsappUrl).toBe(wa)
  })

  it('throws SERVICE_UNAVAILABLE when whatsappUrl is missing from 200 response', async () => {
    stubFetch(okResponse(200, { ok: true }))
    const err = await getHandoffUrl(VALID_TOKEN).catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
  })

  it('throws SESSION_EXPIRED on 404', async () => {
    stubFetch(okResponse(404, { error: 'not found' }))
    const err = await getHandoffUrl(VALID_TOKEN).catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SESSION_EXPIRED')
  })

  it('throws NETWORK_ERROR on network failure', async () => {
    stubFetchNetworkError()
    const err = await getHandoffUrl(VALID_TOKEN).catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('NETWORK_ERROR')
    expect(err.retryable).toBe(true)
  })
})

// --------------------------------------------------------------------------
// P3-4. Static analysis — no secrets or direct backend URLs in UI code
// --------------------------------------------------------------------------

describe('Phase 3 security — client boundary', () => {
  it('try-nora.tsx never contains render.com URLs', () => {
    const source = readFileSync(
      resolve(__dirname, '../../components/try-nora.tsx'),
      'utf-8',
    )
    expect(source).not.toContain('render.com')
    expect(source).not.toContain('onrender.com')
  })

  it('try-nora.tsx never reads NORA_SALES_API_SECRET from process.env', () => {
    const source = readFileSync(
      resolve(__dirname, '../../components/try-nora.tsx'),
      'utf-8',
    )
    expect(source).not.toContain("process.env.NORA_SALES_API_SECRET")
    expect(source).not.toContain("process.env['NORA_SALES_API_SECRET']")
  })
})

// ==========================================================================
// R2 — Live chat wiring: try-nora.tsx static verification
// ==========================================================================

describe('R2 integration — try-nora.tsx static verification', () => {
  const tryNoraPath = resolve(__dirname, '../../components/try-nora.tsx')
  const readTryNora = () => readFileSync(tryNoraPath, 'utf-8')

  // Invariant 1 + 2: live wiring exists — nora-api is imported
  it('try-nora.tsx imports from @/lib/nora-api (live mode is wired)', () => {
    expect(readTryNora()).toContain('@/lib/nora-api')
  })

  // Invariant 3 + 4: no raw fetch in component — all calls go through nora-api layer
  it('try-nora.tsx makes no direct fetch() calls — all backend calls via nora-api', () => {
    const source = readTryNora()
    // Direct fetch would bypass the proxy security layer
    expect(source).not.toContain("fetch('/api/nora-demo/chat'")
    expect(source).not.toContain('fetch(')
  })

  // Invariant 5: duplicate send blocked — busy guard present
  it('try-nora.tsx guards against duplicate sends with busy state', () => {
    expect(readTryNora()).toContain('busy')
  })

  // Invariant 6: offer_whatsapp detected from structured action.type only
  it('offer_whatsapp detected from action?.type (structural), not reply string matching', () => {
    const source = readTryNora()
    expect(source).toContain('offer_whatsapp')   // the literal action type value
    expect(source).toContain('action?.type')      // structural check on the action object
  })

  // Invariant 7: R3 supersedes — collectWhatsApp and getHandoffUrl are now wired
  it('try-nora.tsx imports collectWhatsApp for WhatsApp handoff (R3)', () => {
    expect(readTryNora()).toContain('collectWhatsApp')
  })

  it('try-nora.tsx imports getHandoffUrl for handoff URL resolution (R3)', () => {
    expect(readTryNora()).toContain('getHandoffUrl')
  })

  // Invariant 11: approved visual shell preserved — critical class names intact
  it('approved visual class names preserved in try-nora.tsx', () => {
    const source = readTryNora()
    expect(source).toContain('try-nora-section')
    expect(source).toContain('demo-window')
    expect(source).toContain('demo-messages')
    expect(source).toContain('demo-input-row')
    expect(source).toContain('demo-window-top')
    expect(source).toContain('demo-window-foot')
    expect(source).toContain('demo-typing')
  })

  // Invariant 12: curated demo route still exists (file not deleted)
  it('/api/nora-demo/chat route file still exists — curated demo route preserved', () => {
    const chatRoutePath = resolve(__dirname, '../../app/api/nora-demo/chat/route.ts')
    expect(() => readFileSync(chatRoutePath, 'utf-8')).not.toThrow()
  })

  // Invariant 13: hero.tsx and simple-message.tsx untouched
  it('hero.tsx is unchanged — contains distinctive redesign content, no nora-api import', () => {
    const source = readFileSync(resolve(__dirname, '../../components/hero.tsx'), 'utf-8')
    expect(source).toContain('INDUSTRY_CONFIG')   // redesign-specific SVG hub system
    expect(source).not.toContain('nora-api')
    expect(source).not.toContain('createConversation')
  })

  it('simple-message.tsx is unchanged — contains redesign content, no nora-api import', () => {
    const source = readFileSync(resolve(__dirname, '../../components/simple-message.tsx'), 'utf-8')
    expect(source).toContain('SimpleMessage')
    expect(source).not.toContain('nora-api')
  })
})

// ==========================================================================
// R3 — WhatsApp handoff: try-nora.tsx static verification (25 invariants)
// ==========================================================================

describe('R3 integration — try-nora.tsx WhatsApp handoff static verification', () => {
  const tryNoraPath = resolve(__dirname, '../../components/try-nora.tsx')
  const readTryNora = () => readFileSync(tryNoraPath, 'utf-8')

  // 1. Phone collection appears only after structured offer_whatsapp
  it('demo-wa-panel is gated by offerWhatsAppMade — phone form never shown pre-offer', () => {
    const source = readTryNora()
    expect(source).toContain('offerWhatsAppMade')
    expect(source).toContain('demo-wa-panel')
    // The WA panel is inside the else branch of !offerWhatsAppMade
    expect(source).toContain('!offerWhatsAppMade')
  })

  // 2. No phone collection before offer_whatsapp — chat form shown when offer not made
  it('demo-input-row (chat form) present when !offerWhatsAppMade — no pre-offer phone field', () => {
    const source = readTryNora()
    expect(source).toContain('!offerWhatsAppMade')
    expect(source).toContain('demo-input-row')
    // demo-wa-phone only inside the WA panel block
    expect(source).toContain('demo-wa-phone')
  })

  // 3. Consent defaults false — never pre-checked
  it('waConsent initialised to false — consent is never pre-checked', () => {
    const source = readTryNora()
    expect(source).toMatch(/waConsent.*=.*useState\(false\)/)
  })

  // 4. Submission blocked without consent — guard present before API call
  it('submitHandoff returns early when waConsent is false', () => {
    const source = readTryNora()
    expect(source).toContain('if (!waConsent) return')
    expect(source).toContain('disabled={!waConsent}')
  })

  // 5. Phone normalization is wired into the component
  it('normalizePhone is imported and called with user input in submitHandoff', () => {
    const source = readTryNora()
    expect(source).toContain('normalizePhone')
    expect(source).toContain('normalizePhone(waPhone)')
  })

  // 6. Personal WhatsApp numbers not rejected — no business account type check
  it('no business account type restriction in try-nora.tsx or nora-api.ts', () => {
    const tryNora = readTryNora()
    const noraApi = readFileSync(resolve(__dirname, '../nora-api.ts'), 'utf-8')
    for (const source of [tryNora, noraApi]) {
      expect(source).not.toContain('businessAccount')
      expect(source).not.toContain('isBusinessAccount')
      expect(source).not.toContain('whatsapp.business')
      expect(source).not.toContain('Business API')
    }
  })

  // 7. Valid phone + consent calls collectWhatsApp with sessionToken and normalized phone
  it('submitHandoff calls collectWhatsApp(sessionToken, normalized)', () => {
    const source = readTryNora()
    expect(source).toContain('collectWhatsApp(sessionToken, normalized)')
  })

  // 8. Same existing sessionToken used — not a new session
  it('createConversation called exactly once in the file — not in submitHandoff', () => {
    const source = readTryNora()
    const callCount = (source.match(/createConversation\(/g) ?? []).length
    expect(callCount).toBe(1)
  })

  // 9. consent is boolean true — sent by nora-api.ts, never overridden client-side
  it('nora-api.ts sends consent as boolean true; try-nora.tsx never overrides it', () => {
    const apiSource = readFileSync(resolve(__dirname, '../nora-api.ts'), 'utf-8')
    expect(apiSource).toContain('consent: true')
    // Component must not send a consent value itself — that is nora-api's job
    expect(readTryNora()).not.toContain('consent: true')
    expect(readTryNora()).not.toContain('consent: false')
  })

  // 10. No new WebChatSession created during handoff
  it('resolveHandoffFresh calls getHandoffUrl — not createConversation', () => {
    const source = readTryNora()
    expect(source).toContain('getHandoffUrl(')
    // Confirm resolveHandoffFresh does not call createConversation
    const freshFn = source.split('resolveHandoffFresh')[1]?.split('async function ')[0] ?? ''
    expect(freshFn).not.toContain('createConversation')
  })

  // 11. message_sent (confirmed phase) shows Open WhatsApp button
  it("waPhase === 'confirmed' renders demo-wa-open-btn (Open WhatsApp)", () => {
    const source = readTryNora()
    expect(source).toContain("waPhase === 'confirmed'")
    const confirmedBlock = source.split("waPhase === 'confirmed'")[1] ?? ''
    expect(confirmedBlock).toContain('demo-wa-open-btn')
  })

  // 12. Open WhatsApp remains prominently available on message_sent — link not removed
  it('confirmed state always renders the Open WhatsApp anchor when waUrl is present', () => {
    const source = readTryNora()
    const confirmedBlock = source.split("waPhase === 'confirmed'")[1] ?? ''
    // Both the anchor and the href={waUrl} must be inside the confirmed block
    expect(confirmedBlock).toContain('href={waUrl}')
    expect(confirmedBlock).toContain('demo-wa-open-btn')
    expect(confirmedBlock).toContain('Open WhatsApp')
  })

  // 13. fallback_sent (fallback phase) shows Open WhatsApp button
  it("waPhase === 'fallback' renders demo-wa-open-btn (Open WhatsApp with NORA)", () => {
    const source = readTryNora()
    expect(source).toContain("waPhase === 'fallback'")
    const fallbackBlock = source.split("waPhase === 'fallback'")[1] ?? ''
    expect(fallbackBlock).toContain('demo-wa-open-btn')
  })

  // 14. Backend fallbackWhatsappUrl used exactly — no client-side URL reconstruction
  it('Open WhatsApp href uses waUrl state (backend URL) — never reconstructed from phone', () => {
    const source = readTryNora()
    expect(source).toContain('href={waUrl}')
    expect(source).not.toContain('wa.me/+')
    expect(source).not.toContain('https://wa.me/')
    expect(source).not.toContain('wa.me/${')
  })

  // 15. already_sent calls getHandoffUrl (via resolveHandoffFresh)
  it("already_sent triggers resolveHandoffFresh — which calls getHandoffUrl", () => {
    const source = readTryNora()
    expect(source).toContain("'already_sent'")
    const alreadySentContext = source.split("'already_sent'")[1]?.split('return')[0] ?? ''
    expect(alreadySentContext).toContain('resolveHandoffFresh')
  })

  // 16. already_sent does not ask for phone again — goes to resolveHandoffFresh, not idle
  it("already_sent path does not reset to idle (no re-collection of phone)", () => {
    const source = readTryNora()
    const alreadySentContext = source.split("'already_sent'")[1]?.split('return')[0] ?? ''
    expect(alreadySentContext).not.toContain("setWaPhase('idle')")
    expect(alreadySentContext).not.toContain("setWaPhone('')")
  })

  // 17. Duplicate handoff submit blocked while submitting or refreshing
  it('submitHandoff returns early when waPhase is submitting or refreshing', () => {
    const source = readTryNora()
    expect(source).toContain("waPhase === 'submitting' || waPhase === 'refreshing') return")
  })

  // 18. Invalid phone preserves input — setWaPhone('') only in reset(), not in error handlers
  it("invalid phone error sets waPhoneError and returns — does not clear waPhone", () => {
    const source = readTryNora()
    // PHONE_INVALID handler sets error and returns — phone preserved
    expect(source).toContain("'PHONE_INVALID'")
    expect(source).toContain('setWaPhoneError(')
    // setWaPhone('') must appear only once (in reset())
    const clearCalls = (source.match(/setWaPhone\(''\)/g) ?? []).length
    expect(clearCalls).toBe(1)
  })

  // 19. Network failure preserves phone — submitHandoff's catch sets error state, not phone
  it("network failure in submitHandoff calls setWaPhase('error') — waPhone not cleared", () => {
    const source = readTryNora()
    expect(source).toContain("setWaPhase('error')")
    // setWaPhone('') appears only once — in reset() — never in catch blocks
    const clearCalls = (source.match(/setWaPhone\(''\)/g) ?? []).length
    expect(clearCalls).toBe(1)
  })

  // 20. Reset clears all handoff state
  it("reset() clears every piece of WA handoff state", () => {
    const source = readTryNora()
    const resetBlock = source.split('function reset()')[1]?.split('function ')[0] ?? ''
    expect(resetBlock).toContain("setWaPhone('')")
    expect(resetBlock).toContain('setWaConsent(false)')
    expect(resetBlock).toContain('setWaPhoneError(null)')
    expect(resetBlock).toContain('setWaUrl(null)')
    expect(resetBlock).toContain('setWaSubmitError(null)')
    expect(resetBlock).toContain("setWaPhase('idle')")
    expect(resetBlock).toContain('setOfferWhatsAppMade(false)')
    expect(resetBlock).toContain('setSessionToken(null)')
  })

  // 21. No direct Render URL in client component
  it('try-nora.tsx contains no render.com or onrender.com URLs', () => {
    const source = readTryNora()
    expect(source).not.toContain('render.com')
    expect(source).not.toContain('onrender.com')
  })

  // 22. No NORA_SALES_API_SECRET in client component
  it('try-nora.tsx never references NORA_SALES_API_SECRET', () => {
    const source = readTryNora()
    expect(source).not.toContain('NORA_SALES_API_SECRET')
    expect(source).not.toContain('NEXT_PUBLIC_NORA_SALES_API_SECRET')
  })

  // 23. No static wa.me reconstruction — backend URL used as-is
  it('try-nora.tsx contains no hardcoded wa.me link', () => {
    expect(readTryNora()).not.toContain('wa.me')
  })

  // 24. offer_whatsapp detection remains structural — no reply string matching
  it("offer_whatsapp detected via action?.type only — no string match on reply text", () => {
    const source = readTryNora()
    expect(source).toContain("action?.type === 'offer_whatsapp'")
    expect(source).not.toContain("reply.includes('whatsapp')")
    expect(source).not.toContain(".includes('offer_whatsapp')")
    expect(source).not.toContain('.includes("whatsapp")')
  })

  // 25. Existing protected redesign components untouched
  it('hero.tsx, simple-message.tsx, nav.tsx, signal-section.tsx contain no R3 additions', () => {
    const files = [
      resolve(__dirname, '../../components/hero.tsx'),
      resolve(__dirname, '../../components/simple-message.tsx'),
      resolve(__dirname, '../../components/nav.tsx'),
      resolve(__dirname, '../../components/signal-section.tsx'),
    ]
    for (const filePath of files) {
      const source = readFileSync(filePath, 'utf-8')
      expect(source).not.toContain('demo-wa-panel')
      expect(source).not.toContain('collectWhatsApp')
      expect(source).not.toContain('submitHandoff')
      expect(source).not.toContain('waPhone')
    }
  })
})
