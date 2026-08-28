/**
 * Tests for the NORA proxy layer.
 *
 * Covers all requirements from SALES-03C Phase 1:
 *   1. Missing configuration fails safely
 *   2. API secret is injected server-side
 *   3. Secret is never returned to the browser
 *   4. Request bodies are forwarded correctly
 *   5. Backend 400/401/404/429/5xx responses are handled correctly
 *   6. Malformed JSON is handled safely
 *   7. Token/path handling cannot be abused (via isValidToken)
 *   8. Client-IP forwarding matches backend's trusted-proxy expectations
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { noraProxy, isValidToken } from '../nora-proxy'

// ── Helpers ────────────────────────────────────────────────────────────────

const VALID_TOKEN = 'a'.repeat(64)  // 64 hex chars — valid session token shape
const SECRET = 'test-secret-value'
const API_URL = 'https://nora.example.com'

/** Create a minimal request stub with a given JSON body. */
function makeReq(body: unknown): { text(): Promise<string> } {
  return { text: async () => JSON.stringify(body) }
}

/** Create a minimal request stub with raw text body. */
function makeRawReq(raw: string): { text(): Promise<string> } {
  return { text: async () => raw }
}

/** Create a mock upstream Response. */
function upstreamResponse(
  body: unknown,
  status: number,
  contentType = 'application/json',
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': contentType },
  })
}

// ── Setup ──────────────────────────────────────────────────────────────────

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

// ── Suite 1: Missing configuration ─────────────────────────────────────────

describe('missing configuration', () => {
  it('returns 503 when NORA_API_URL is missing', async () => {
    vi.stubEnv('NORA_API_URL', '')
    global.fetch = vi.fn()

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toMatchObject({ error: 'service unavailable' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 503 when NORA_SALES_API_SECRET is missing', async () => {
    vi.stubEnv('NORA_SALES_API_SECRET', '')
    global.fetch = vi.fn()

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toMatchObject({ error: 'service unavailable' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 503 when both env vars are missing', async () => {
    vi.stubEnv('NORA_API_URL', '')
    vi.stubEnv('NORA_SALES_API_SECRET', '')
    global.fetch = vi.fn()

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

// ── Suite 2: API secret injection ──────────────────────────────────────────

describe('API secret injection', () => {
  it('injects x-nora-api-secret header on every outgoing request', async () => {
    const capturedHeaders: Record<string, string> = {}
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      const h = init?.headers as Record<string, string> | undefined
      if (h) Object.assign(capturedHeaders, h)
      return Promise.resolve(upstreamResponse({ sessionToken: 'abc', reply: 'Hi' }, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(capturedHeaders['x-nora-api-secret']).toBe(SECRET)
  })

  it('uses the env var value, not any header from the incoming request', async () => {
    const capturedHeaders: Record<string, string> = {}
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      const h = init?.headers as Record<string, string> | undefined
      if (h) Object.assign(capturedHeaders, h)
      return Promise.resolve(upstreamResponse({}, 200))
    }) as unknown as typeof global.fetch

    // Even if someone passes a crafted header in the request, we ignore it — the
    // proxy always reads from process.env.
    await noraProxy(makeReq({}), '/some/path')

    expect(capturedHeaders['x-nora-api-secret']).toBe(SECRET)
  })
})

// ── Suite 3: Secret never returned to the browser ──────────────────────────

describe('secret never returned to browser', () => {
  it('does not include x-nora-api-secret in response headers', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(upstreamResponse({ ok: true }, 200)),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.headers.get('x-nora-api-secret')).toBeNull()
  })

  it('maps backend 401 (secret rejected) to 503 — never leaks auth mechanism', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(upstreamResponse({ message: 'Unauthorized' }, 401)),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    // The word "unauthorized" or "secret" must not appear in the body that reaches the browser
    const body = await res.json() as Record<string, unknown>
    const bodyStr = JSON.stringify(body).toLowerCase()
    expect(bodyStr).not.toContain('secret')
    expect(bodyStr).not.toContain('unauthorized')
  })
})

// ── Suite 4: Request body forwarding ───────────────────────────────────────

describe('request body forwarding', () => {
  it('forwards JSON body to upstream verbatim', async () => {
    let capturedBody: unknown
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string)
      return Promise.resolve(upstreamResponse({ reply: 'Hi' }, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(makeReq({ message: 'Hello NORA' }), '/public/sales/conversations')

    expect(capturedBody).toEqual({ message: 'Hello NORA' })
  })

  it('forwards nested body fields correctly', async () => {
    let capturedBody: unknown
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string)
      return Promise.resolve(upstreamResponse({ ok: true }, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(
      makeReq({ phone: '+50688888888', consent: true }),
      '/public/sales/conversations/abc/whatsapp',
    )

    expect(capturedBody).toEqual({ phone: '+50688888888', consent: true })
  })

  it('sends empty object when request body is empty', async () => {
    let capturedBody: unknown
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string)
      return Promise.resolve(upstreamResponse({ sessionToken: 'xyz', reply: 'Hi' }, 201))
    }) as unknown as typeof global.fetch

    await noraProxy(makeRawReq(''), '/public/sales/conversations')

    expect(capturedBody).toEqual({})
  })

  it('constructs the correct upstream URL', async () => {
    let capturedUrl: string = ''
    global.fetch = vi.fn((url: unknown) => {
      capturedUrl = url as string
      return Promise.resolve(upstreamResponse({}, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(capturedUrl).toBe(`${API_URL}/public/sales/conversations`)
  })

  it('strips trailing slash from NORA_API_URL before joining', async () => {
    vi.stubEnv('NORA_API_URL', `${API_URL}/`)
    let capturedUrl: string = ''
    global.fetch = vi.fn((url: unknown) => {
      capturedUrl = url as string
      return Promise.resolve(upstreamResponse({}, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(capturedUrl).toBe(`${API_URL}/public/sales/conversations`)
    // Ensure trailing slash stripping doesn't produce a double-slash in the path segment
    const pathPart = capturedUrl.replace(/^https?:\/\//, '')
    expect(pathPart).not.toContain('//')
  })

  it('sends content-type application/json on every request', async () => {
    let capturedCt: string = ''
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      const h = init?.headers as Record<string, string> | undefined
      capturedCt = h?.['content-type'] ?? ''
      return Promise.resolve(upstreamResponse({}, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(makeReq({ locale: 'en' }), '/public/sales/conversations')

    expect(capturedCt).toBe('application/json')
  })
})

// ── Suite 5: Backend status code handling ──────────────────────────────────

describe('backend status code handling', () => {
  const cases: [number, number][] = [
    [200, 200],
    [201, 201],
    [400, 400],  // bad request — pass through (e.g. invalid phone)
    [401, 503],  // unauthorized — secret misconfiguration, never expose
    [404, 404],  // session not found — pass through
    [429, 429],  // rate limit — pass through so frontend can react
    [500, 503],  // upstream internal error → service unavailable
    [502, 503],
    [503, 503],
    [504, 503],
  ]

  for (const [upstream, expected] of cases) {
    it(`maps upstream ${upstream} → ${expected}`, async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve(upstreamResponse({ code: `test_${upstream}` }, upstream)),
      ) as unknown as typeof global.fetch

      const res = await noraProxy(makeReq({}), '/public/sales/conversations')

      expect(res.status).toBe(expected)
    })
  }

  it('preserves upstream JSON body for 400 (client error details)', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        upstreamResponse({ message: 'Invalid phone number — must be E.164 format' }, 400),
      ),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({ phone: 'bad' }), '/x/whatsapp')
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body).toMatchObject({ message: expect.stringContaining('E.164') })
  })

  it('preserves upstream JSON body for 429 (rate limit details)', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(upstreamResponse({ message: 'Too many requests' }, 429)),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/x/messages')

    expect(res.status).toBe(429)
    const body = await res.json()
    expect(body).toMatchObject({ message: 'Too many requests' })
  })
})

// ── Suite 6: Malformed JSON handling ───────────────────────────────────────

describe('malformed JSON handling', () => {
  it('returns 400 for invalid JSON in request body', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await noraProxy(makeRawReq('not-json{{{'), '/public/sales/conversations')

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toMatchObject({ error: expect.stringContaining('JSON') })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 400 for truncated JSON', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const res = await noraProxy(makeRawReq('{"message": "hello"'), '/x/messages')

    expect(res.status).toBe(400)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 413 for oversized request body', async () => {
    global.fetch = vi.fn() as unknown as typeof global.fetch

    const oversized = 'x'.repeat(9_000)  // > 8 KB limit
    const res = await noraProxy(makeRawReq(oversized), '/public/sales/conversations')

    expect(res.status).toBe(413)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('handles non-JSON upstream response gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response('<html>Internal Server Error</html>', {
          status: 500,
          headers: { 'content-type': 'text/html' },
        }),
      ),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(typeof body).toBe('object')
    expect(body).not.toBeNull()
  })

  it('handles upstream that returns JSON with a broken body', async () => {
    // Response claims JSON but body is not parseable
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response('}{broken json', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toMatchObject({ error: expect.any(String) })
  })
})

// ── Suite 7: Token validation ───────────────────────────────────────────────

describe('isValidToken — token abuse prevention', () => {
  it('accepts a valid 64-hex-char token', () => {
    expect(isValidToken('a'.repeat(64))).toBe(true)
    expect(isValidToken('0123456789abcdef'.repeat(4))).toBe(true)
    expect(isValidToken('f'.repeat(64))).toBe(true)
  })

  it('rejects tokens that are too short', () => {
    expect(isValidToken('a'.repeat(63))).toBe(false)
    expect(isValidToken('')).toBe(false)
    expect(isValidToken('a')).toBe(false)
  })

  it('rejects tokens that are too long', () => {
    expect(isValidToken('a'.repeat(65))).toBe(false)
    expect(isValidToken('a'.repeat(128))).toBe(false)
  })

  it('rejects tokens with uppercase hex (backend validates lowercase)', () => {
    expect(isValidToken('A'.repeat(64))).toBe(false)
    expect(isValidToken('ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789')).toBe(false)
  })

  it('rejects tokens with non-hex characters', () => {
    expect(isValidToken('g'.repeat(64))).toBe(false)
    expect(isValidToken('z'.repeat(64))).toBe(false)
    expect(isValidToken('!'.repeat(64))).toBe(false)
  })

  it('rejects path-traversal injection attempts', () => {
    // These would be dangerous if naively interpolated into the upstream URL
    expect(isValidToken('../../../admin')).toBe(false)
    expect(isValidToken('%2e%2e%2f%2e%2e%2fadmin')).toBe(false)
    expect(isValidToken('a'.repeat(60) + '/../')).toBe(false)
  })

  it('rejects null and non-string values', () => {
    expect(isValidToken(null)).toBe(false)
    expect(isValidToken(undefined)).toBe(false)
    expect(isValidToken(123)).toBe(false)
    expect(isValidToken({})).toBe(false)
  })

  it('rejects a token with embedded semicolons or shell metacharacters', () => {
    expect(isValidToken('; rm -rf /'.padEnd(64, 'a'))).toBe(false)
    expect(isValidToken('$(cat /etc/passwd)' + 'a'.repeat(46))).toBe(false)
  })
})

// ── Suite 8: IP forwarding and rate-limit alignment ────────────────────────

describe('IP forwarding — Render trusted-proxy semantics', () => {
  it('does NOT forward X-Forwarded-For to the backend', async () => {
    const capturedHeaders: Record<string, string> = {}
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      const h = init?.headers as Record<string, string> | undefined
      if (h) Object.assign(capturedHeaders, h)
      return Promise.resolve(upstreamResponse({}, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(makeReq({}), '/public/sales/conversations')

    // Verify no IP-related headers are forwarded that could be spoofed or
    // that would create a misleading IP chain in backend rate-limit logs.
    expect(capturedHeaders['x-forwarded-for']).toBeUndefined()
    expect(capturedHeaders['x-real-ip']).toBeUndefined()
    expect(capturedHeaders['x-nora-real-ip']).toBeUndefined()
  })

  it('does NOT include method: GET or other verbs — always POST', async () => {
    let capturedMethod = ''
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) => {
      capturedMethod = init?.method ?? ''
      return Promise.resolve(upstreamResponse({}, 200))
    }) as unknown as typeof global.fetch

    await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(capturedMethod).toBe('POST')
  })
})

// ── Suite 9: Network failures ───────────────────────────────────────────────

describe('network failure handling', () => {
  it('returns 503 when upstream is unreachable', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('ECONNREFUSED')),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toMatchObject({ error: 'service unavailable' })
  })

  it('returns 503 with "upstream timeout" on AbortError', async () => {
    global.fetch = vi.fn(() => {
      const err = new DOMException('The operation was aborted', 'TimeoutError')
      return Promise.reject(err)
    }) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toMatchObject({ error: 'upstream timeout' })
  })
})

// ── Suite 10: Response shape ────────────────────────────────────────────────

describe('proxy response shape', () => {
  it('returns content-type: application/json on all responses', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(upstreamResponse({ sessionToken: 'x', reply: 'Hi' }, 201)),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.headers.get('content-type')).toContain('application/json')
  })

  it('returns content-type: application/json even on error responses', async () => {
    vi.stubEnv('NORA_API_URL', '')

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    expect(res.headers.get('content-type')).toContain('application/json')
  })

  it('does not include x-nora-api-secret in any response header', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(upstreamResponse({ ok: true }, 200)),
    ) as unknown as typeof global.fetch

    const res = await noraProxy(makeReq({}), '/public/sales/conversations')

    // Exhaustive check: no header name contains "secret" or the actual secret value
    const headers: Record<string, string> = {}
    res.headers.forEach((val, key) => { headers[key] = val })
    const headerStr = JSON.stringify(headers).toLowerCase()
    expect(headerStr).not.toContain('secret')
    expect(headerStr).not.toContain(SECRET.toLowerCase())
  })
})
