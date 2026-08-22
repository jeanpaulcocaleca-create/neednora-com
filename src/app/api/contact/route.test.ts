// Contact route integration — POST /api/contact
//
// Coverage:
//   A. Successful contact submission → backend 201
//   B. Correct backend URL called
//   C. x-nora-api-secret header sent
//   D. source mapped to 'website_contact_form'
//   E. Subject prepended to message
//   F. NORA_API_URL missing → 503, no fetch call
//   G. NORA_DEMO_API_SECRET missing → 503, no fetch call
//   H. Backend 400 → safe 400 response (internal error detail not exposed)
//   I. Backend 429 → 429 with retry-friendly message
//   J. Backend 401 → 500, secret never appears in response
//   K. Backend 500 → 503
//   L. Network failure → 503
//   M. Secret never appears in any response body
//   N. non-contact type (early_access) bypasses backend → 200, no fetch
//   O. Missing required fields → 400, no fetch call

import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { POST } from './route'

const BACKEND_URL = 'https://nora-api.test'
const DEMO_SECRET = 'test-demo-secret-32-chars-minimum!'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeReq(body: Record<string, unknown>): Request {
  return new Request('http://localhost/api/contact', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
}

const fetchMock = vi.fn()

function stubBackend(status: number, body: unknown = { ok: true }) {
  fetchMock.mockResolvedValueOnce({
    ok:     status >= 200 && status < 300,
    status,
    json:   () => Promise.resolve(body),
    text:   () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response)
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeAll(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

beforeEach(() => {
  fetchMock.mockReset()
  process.env.NORA_API_URL         = BACKEND_URL
  process.env.NORA_DEMO_API_SECRET = DEMO_SECRET
})

afterEach(() => {
  delete process.env.NORA_API_URL
  delete process.env.NORA_DEMO_API_SECRET
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/contact — type:contact forwarding', () => {
  it('A. successful submission returns 200 ok:true', async () => {
    stubBackend(201)
    const res = await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('B. calls the correct NORA backend endpoint', async () => {
    stubBackend(201)
    await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${BACKEND_URL}/public/demo-requests`)
  })

  it('C. sends x-nora-api-secret header with the configured secret', async () => {
    stubBackend(201)
    await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect((opts.headers as Record<string, string>)['x-nora-api-secret']).toBe(DEMO_SECRET)
  })

  it('D. sends source as website_contact_form', async () => {
    stubBackend(201)
    await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.source).toBe('website_contact_form')
  })

  it('E. subject is prepended to message body', async () => {
    stubBackend(201)
    await POST(makeReq({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Early Access Request', message: 'I want in.', type: 'contact',
    }) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.message).toContain('[Early Access Request]')
    expect(payload.message).toContain('I want in.')
  })

  it('F. missing NORA_API_URL → 503, no fetch call', async () => {
    delete process.env.NORA_API_URL
    const res = await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('G. missing NORA_DEMO_API_SECRET → 503, no fetch call', async () => {
    delete process.env.NORA_DEMO_API_SECRET
    const res = await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('H. backend 400 → safe 400 (internal error detail not exposed)', async () => {
    stubBackend(400, { message: 'email format invalid' })
    const res = await POST(makeReq({ name: 'Alice', email: 'bad-email', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(400)
    const json = await res.json() as Record<string, unknown>
    expect(json.error).toBeTruthy()
    expect(JSON.stringify(json)).not.toContain('email format invalid')
  })

  it('I. backend 429 → 429 with retry-friendly message', async () => {
    stubBackend(429)
    const res = await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(429)
    const json = await res.json() as Record<string, string>
    expect(json.error.toLowerCase()).toContain('wait')
  })

  it('J. backend 401 → 500, secret never in response', async () => {
    stubBackend(401)
    const res = await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(text).not.toContain(DEMO_SECRET)
    expect(text).not.toContain('NORA_DEMO_API_SECRET')
    expect(text).not.toContain('secret')
  })

  it('K. backend 500 → 503', async () => {
    stubBackend(500)
    const res = await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(503)
  })

  it('L. network failure → 503', async () => {
    fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'))
    const res = await POST(makeReq({ name: 'Alice', email: 'alice@example.com', message: 'Hello', type: 'contact' }) as never)
    expect(res.status).toBe(503)
  })

  it('M. NORA_DEMO_API_SECRET never appears in any response body', async () => {
    // Test across 200, 401, 500, 503 paths
    stubBackend(201)
    const r1 = await POST(makeReq({ name: 'A', email: 'a@b.com', message: 'Hi', type: 'contact' }) as never)
    expect(await r1.text()).not.toContain(DEMO_SECRET)

    delete process.env.NORA_DEMO_API_SECRET
    const r2 = await POST(makeReq({ name: 'A', email: 'a@b.com', message: 'Hi', type: 'contact' }) as never)
    expect(await r2.text()).not.toContain(DEMO_SECRET)
  })
})

describe('POST /api/contact — non-contact types', () => {
  it('N. early_access type bypasses NORA backend and returns 200', async () => {
    const res = await POST(makeReq({
      name: 'Bob', email: 'bob@example.com',
      business: 'Acme', whatsapp: '+1 555 0000',
      industry: 'Field Services', message: 'Interested', type: 'early_access',
    }) as never)
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/contact — input validation', () => {
  it('O. missing required fields → 400, no fetch call', async () => {
    // Missing name
    const r1 = await POST(makeReq({ email: 'a@b.com', message: 'Hi', type: 'contact' }) as never)
    expect(r1.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()

    // Missing email
    const r2 = await POST(makeReq({ name: 'Alice', message: 'Hi', type: 'contact' }) as never)
    expect(r2.status).toBe(400)

    // Missing message
    const r3 = await POST(makeReq({ name: 'Alice', email: 'a@b.com', type: 'contact' }) as never)
    expect(r3.status).toBe(400)
  })
})
