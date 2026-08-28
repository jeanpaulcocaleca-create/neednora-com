/**
 * nora-api.test.ts — proves the 15 Phase 2 invariants at the API layer.
 * All fetch calls go to /api/nora/… proxy routes; the secret never touches this module.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  createConversation,
  sendMessage,
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

  // 2. Opening reply comes from API, not hardcoded
  it('returns the API reply verbatim — not a hardcoded string', async () => {
    const reply = 'Custom backend reply — unique to this test'
    stubFetch(okResponse(201, { sessionToken: VALID_TOKEN, reply }))
    const result = await createConversation('en')
    expect(result.reply).toBe(reply)
  })

  // 3. sessionToken captured correctly
  it('returns the sessionToken from the API response', async () => {
    stubFetch(okResponse(201, { sessionToken: TOKEN_B, reply: 'Hi' }))
    const result = await createConversation('en')
    expect(result.sessionToken).toBe(TOKEN_B)
  })
})

// --------------------------------------------------------------------------
// 3 + 4. Multiple messages reuse the same sessionToken in the URL
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

  // 5. User message sent correctly
  it('sends the user message in the request body', async () => {
    const mock = stubFetch(okResponse(200, { reply: 'ok' }))
    await sendMessage(VALID_TOKEN, 'my exact message text')
    const [, init] = mock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(init.body as string) as { message: string }
    expect(body.message).toBe('my exact message text')
  })

  // 6. NORA reply returned correctly
  it('returns the NORA reply verbatim from the API response', async () => {
    const reply = 'NORA says: got it, processing now'
    stubFetch(okResponse(200, { reply }))
    const result = await sendMessage(VALID_TOKEN, 'hi')
    expect(result.reply).toBe(reply)
  })
})

// --------------------------------------------------------------------------
// 8. offer_whatsapp detected from STRUCTURED action (not string matching)
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
    // String matching must never trigger offer_whatsapp
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
// 9. No /whatsapp or /handoff calls in Phase 2
// --------------------------------------------------------------------------

describe('Phase 2 scope — no WhatsApp or handoff functions', () => {
  it('does not export collectWhatsApp or handoff (Phase 3 functions)', async () => {
    const mod = await import('../nora-api')
    expect((mod as Record<string, unknown>).collectWhatsApp).toBeUndefined()
    expect((mod as Record<string, unknown>).handoff).toBeUndefined()
    expect((mod as Record<string, unknown>).sendWhatsApp).toBeUndefined()
  })
})

// --------------------------------------------------------------------------
// 10–13. Error handling — typed errors with correct codes
// --------------------------------------------------------------------------

describe('error handling', () => {
  // 10. Session creation failure
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

  // 11. Message send failure
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

  // 12. 429 rate limited
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

  // 13. 503 service unavailable
  it('throws SERVICE_UNAVAILABLE on 500 from sendMessage', async () => {
    stubFetch(okResponse(500, { error: 'internal server error' }))
    const err = await sendMessage(VALID_TOKEN, 'hi').catch(e => e)
    expect(err).toBeInstanceOf(NoraSalesApiError)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
  })

  // 14. 404 session expired
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
// 15. Secret never in client-side module (static analysis)
// --------------------------------------------------------------------------

describe('security — client-side boundary', () => {
  it('nora-api.ts never reads NORA_SALES_API_SECRET from process.env', () => {
    const source = readFileSync(resolve(__dirname, '../nora-api.ts'), 'utf-8')
    // The variable name may appear in comments; what must not appear is code that READS it
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

// --------------------------------------------------------------------------
// 16. Curated demo is independent — conversations.ts has no backend coupling
// --------------------------------------------------------------------------

describe('demo independence', () => {
  it('conversations.ts does not import from nora-api or call fetch', () => {
    const source = readFileSync(resolve(__dirname, '../conversations.ts'), 'utf-8')
    expect(source).not.toContain('nora-api')
    expect(source).not.toContain('/api/nora')
    expect(source).not.toContain('fetch(')
  })

  it('conversations.ts still exports all 10 curated scenarios', async () => {
    const { scenarios } = await import('../conversations')
    expect(scenarios).toHaveLength(10)
  })
})
