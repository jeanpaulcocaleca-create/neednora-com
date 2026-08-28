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
