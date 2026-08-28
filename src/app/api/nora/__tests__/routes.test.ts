/**
 * Route handler tests — token validation and path construction.
 *
 * These tests verify that each route handler correctly validates the session
 * token before forwarding to the proxy, and that it builds the right upstream
 * path. They do NOT re-test the proxy logic (covered in nora-proxy.test.ts).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Route handlers use `import type { NextRequest }` (type-only — no runtime dep).
// We import them directly and pass plain stubs.
import { POST as postConversations } from '../conversations/route'
import { POST as postMessages } from '../conversations/[token]/messages/route'
import { POST as postWhatsapp } from '../conversations/[token]/whatsapp/route'
import { POST as postHandoff } from '../conversations/[token]/handoff/route'

// ── Helpers ─────────────────────────────────────────────────────────────────

const VALID_TOKEN = '0'.repeat(64)
const SECRET = 'route-test-secret'
const API_URL = 'https://nora-route-test.example.com'

function makeReq(body: unknown = {}): { text(): Promise<string> } {
  return { text: async () => JSON.stringify(body) }
}

function makeParams(token: string): { params: Promise<{ token: string }> } {
  return { params: Promise.resolve({ token }) }
}

/** Fake a successful upstream response so tests don't depend on a real backend. */
function mockFetchSuccess(body: unknown = { ok: true }, status = 200): void {
  global.fetch = vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    ),
  ) as unknown as typeof global.fetch
}

// ── Setup ────────────────────────────────────────────────────────────────────

let originalFetch: typeof global.fetch

beforeEach(() => {
  originalFetch = global.fetch
  vi.stubEnv('NORA_API_URL', API_URL)
  vi.stubEnv('NORA_SALES_API_SECRET', SECRET)
})

afterEach(() => {
  global.fetch = originalFetch
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

// ── POST /api/nora/conversations ─────────────────────────────────────────────

describe('POST /api/nora/conversations', () => {
  it('proxies to /public/sales/conversations', async () => {
    let capturedUrl = ''
    global.fetch = vi.fn((url: unknown) => {
      capturedUrl = url as string
      return Promise.resolve(
        new Response(JSON.stringify({ sessionToken: VALID_TOKEN, reply: 'Hi' }), {
          status: 201,
          headers: { 'content-type': 'application/json' },
        }),
      )
    }) as unknown as typeof global.fetch

    const res = await postConversations(makeReq({ locale: 'en' }) as never)

    expect(capturedUrl).toBe(`${API_URL}/public/sales/conversations`)
    expect(res.status).toBe(201)
  })

  it('returns 503 when env vars are missing', async () => {
    vi.stubEnv('NORA_API_URL', '')
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postConversations(makeReq({}) as never)

    expect(res.status).toBe(503)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

// ── POST /api/nora/conversations/[token]/messages ───────────────────────────

describe('POST /api/nora/conversations/[token]/messages', () => {
  it('rejects an empty token with 400', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postMessages(makeReq({}) as never, makeParams(''))

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects a 63-char hex token (too short) with 400', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postMessages(makeReq({}) as never, makeParams('a'.repeat(63)))

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects a 65-char hex token (too long) with 400', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postMessages(makeReq({}) as never, makeParams('a'.repeat(65)))

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects path-traversal token with 400', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postMessages(makeReq({}) as never, makeParams('../../../etc/passwd'))

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects tokens with uppercase chars with 400', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postMessages(makeReq({}) as never, makeParams('A'.repeat(64)))

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('accepts a valid 64-hex token and proxies to the correct path', async () => {
    let capturedUrl = ''
    global.fetch = vi.fn((url: unknown) => {
      capturedUrl = url as string
      return Promise.resolve(
        new Response(JSON.stringify({ reply: 'OK' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      )
    }) as unknown as typeof global.fetch

    const res = await postMessages(
      makeReq({ message: 'hello' }) as never,
      makeParams(VALID_TOKEN),
    )

    expect(capturedUrl).toBe(`${API_URL}/public/sales/conversations/${VALID_TOKEN}/messages`)
    expect(res.status).toBe(200)
  })

  it('does not include the token in the response body', async () => {
    mockFetchSuccess({ reply: 'OK' }, 200)

    const res = await postMessages(
      makeReq({ message: 'hello' }) as never,
      makeParams(VALID_TOKEN),
    )

    const body = await res.json() as Record<string, unknown>
    // The session token itself is not secret, but the API secret must not appear
    expect(JSON.stringify(body)).not.toContain(SECRET)
  })
})

// ── POST /api/nora/conversations/[token]/whatsapp ───────────────────────────

describe('POST /api/nora/conversations/[token]/whatsapp', () => {
  it('rejects invalid token with 400', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postWhatsapp(makeReq({}) as never, makeParams('bad-token'))

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('proxies to the correct upstream path with valid token', async () => {
    let capturedUrl = ''
    global.fetch = vi.fn((url: unknown) => {
      capturedUrl = url as string
      return Promise.resolve(
        new Response(
          JSON.stringify({ ok: true, status: 'message_sent', fallbackWhatsappUrl: 'https://wa.me/...' }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      )
    }) as unknown as typeof global.fetch

    const res = await postWhatsapp(
      makeReq({ phone: '+50688888888', consent: true }) as never,
      makeParams(VALID_TOKEN),
    )

    expect(capturedUrl).toBe(`${API_URL}/public/sales/conversations/${VALID_TOKEN}/whatsapp`)
    expect(res.status).toBe(200)
  })

  it('passes through 400 INVALID_PHONE from backend', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({ message: 'Invalid phone number — must be E.164 format' }),
          { status: 400, headers: { 'content-type': 'application/json' } },
        ),
      ),
    ) as unknown as typeof global.fetch

    const res = await postWhatsapp(
      makeReq({ phone: 'not-a-phone', consent: true }) as never,
      makeParams(VALID_TOKEN),
    )

    expect(res.status).toBe(400)
    const body = await res.json() as Record<string, unknown>
    expect(JSON.stringify(body)).toContain('E.164')
  })
})

// ── POST /api/nora/conversations/[token]/handoff ─────────────────────────────

describe('POST /api/nora/conversations/[token]/handoff', () => {
  it('rejects invalid token with 400', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await postHandoff(makeReq({}) as never, makeParams('not-hex'))

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('proxies to the correct upstream path', async () => {
    let capturedUrl = ''
    global.fetch = vi.fn((url: unknown) => {
      capturedUrl = url as string
      return Promise.resolve(
        new Response(
          JSON.stringify({ whatsappUrl: 'https://wa.me/123?text=NORA+ABCDEF' }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      )
    }) as unknown as typeof global.fetch

    const res = await postHandoff(makeReq({}) as never, makeParams(VALID_TOKEN))

    expect(capturedUrl).toBe(`${API_URL}/public/sales/conversations/${VALID_TOKEN}/handoff`)
    expect(res.status).toBe(200)
    const body = await res.json() as Record<string, unknown>
    expect(body).toHaveProperty('whatsappUrl')
  })

  it('returns 404 when session is not found', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ message: 'Session not found or expired' }), {
          status: 404,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    ) as unknown as typeof global.fetch

    const res = await postHandoff(makeReq({}) as never, makeParams(VALID_TOKEN))

    expect(res.status).toBe(404)
  })
})

// ── Cross-route: secret never appears in responses ──────────────────────────

describe('cross-route: API secret containment', () => {
  const routes = [
    {
      name: 'conversations',
      fn: (req: never) => postConversations(req),
      params: undefined,
    },
    {
      name: 'messages',
      fn: (req: never) => postMessages(req, makeParams(VALID_TOKEN)),
      params: makeParams(VALID_TOKEN),
    },
    {
      name: 'whatsapp',
      fn: (req: never) => postWhatsapp(req, makeParams(VALID_TOKEN)),
      params: makeParams(VALID_TOKEN),
    },
    {
      name: 'handoff',
      fn: (req: never) => postHandoff(req, makeParams(VALID_TOKEN)),
      params: makeParams(VALID_TOKEN),
    },
  ]

  for (const { name, fn } of routes) {
    it(`[${name}] response headers do not contain x-nora-api-secret`, async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }),
        ),
      ) as unknown as typeof global.fetch

      const res = await fn(makeReq({}) as never)
      expect(res.headers.get('x-nora-api-secret')).toBeNull()
    })

    it(`[${name}] response body does not echo the API secret`, async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }),
        ),
      ) as unknown as typeof global.fetch

      const res = await fn(makeReq({}) as never)
      const text = await res.text()
      expect(text).not.toContain(SECRET)
    })
  }
})
