// Contact route integration — POST /api/contact
//
// type:contact — now routes to BE-12.2 /public/contact-inquiry
//   A. type:'contact' calls /public/contact-inquiry (not /public/demo-requests)
//   B. contact no longer calls /public/demo-requests
//   C. contact payload contains: name, email, subject, message, source
//   D. contact payload does NOT contain demo-specific fields
//      (companyName, industryType, employeeCount, whatsappNumber, firstName)
//   E. backend non-2xx → website returns error (not ok:true)
//   F. x-nora-api-secret header sent; value never appears in response body
//   G. missing NORA_API_URL → 503, no fetch call
//   H. missing NORA_DEMO_API_SECRET → 503, no fetch call
//   I. backend 400 → safe 400 (internal error detail not exposed)
//   J. backend 429 → 429 with retry-friendly message
//   K. backend 401 → 500, secret never in response
//   L. backend 500 → 503
//   M. network failure → 503
//   N. missing subject → 400, no fetch call
//   O. missing name/email/message → 400 (shared validation gate)
//
// type:demo_request — routes to BE-12 /public/demo-requests (unchanged)
//   G. still calls /public/demo-requests
//   H. mapping correct: name→firstName, businessName→companyName,
//      industry→industryType, teamSize→employeeCount, whatsappNumber passed through
//   I. demo behavior backward-compatible
//   (full suite A–P kept below)
//
// non-contact types:
//   J. unknown/invalid types bypass NORA backend, return 200, no fetch

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

// ── type:contact ──────────────────────────────────────────────────────────────

const CONTACT_BODY = {
  name:    'Alice Lund',
  email:   'alice@example.com',
  subject: 'General inquiry',
  message: 'Hello, I have a question.',
  type:    'contact',
}

describe('POST /api/contact — type:contact forwarding', () => {
  it('A. calls /public/contact-inquiry (not /public/demo-requests)', async () => {
    stubBackend(200)
    await POST(makeReq(CONTACT_BODY) as never)
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${BACKEND_URL}/public/contact-inquiry`)
  })

  it('B. contact no longer calls /public/demo-requests', async () => {
    stubBackend(200)
    await POST(makeReq(CONTACT_BODY) as never)
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).not.toContain('demo-requests')
  })

  it('C. payload contains name, email, subject, message, source', async () => {
    stubBackend(200)
    await POST(makeReq(CONTACT_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.name).toBe('Alice Lund')
    expect(payload.email).toBe('alice@example.com')
    expect(payload.subject).toBe('General inquiry')
    expect(payload.message).toBe('Hello, I have a question.')
    expect(payload.source).toBe('website_contact_form')
  })

  it('D. payload does NOT contain demo-specific fields', async () => {
    stubBackend(200)
    await POST(makeReq(CONTACT_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string) as Record<string, unknown>
    expect(payload).not.toHaveProperty('companyName')
    expect(payload).not.toHaveProperty('industryType')
    expect(payload).not.toHaveProperty('employeeCount')
    expect(payload).not.toHaveProperty('whatsappNumber')
    expect(payload).not.toHaveProperty('firstName')
  })

  it('E. backend 503 → website returns error, not ok:true', async () => {
    stubBackend(503)
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).not.toBe(200)
    const json = await res.json() as Record<string, unknown>
    expect(json).not.toHaveProperty('ok')
    expect(json.error).toBeTruthy()
  })

  it('E. backend 500 → website returns error (no silent success)', async () => {
    stubBackend(500)
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).not.toBe(200)
    const json = await res.json() as Record<string, unknown>
    expect(json).not.toMatchObject({ ok: true })
  })

  it('F. x-nora-api-secret header sent with configured secret', async () => {
    stubBackend(200)
    await POST(makeReq(CONTACT_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect((opts.headers as Record<string, string>)['x-nora-api-secret']).toBe(DEMO_SECRET)
  })

  it('F. NORA_DEMO_API_SECRET never appears in any response body', async () => {
    stubBackend(200)
    const r1 = await POST(makeReq(CONTACT_BODY) as never)
    expect(await r1.text()).not.toContain(DEMO_SECRET)

    delete process.env.NORA_DEMO_API_SECRET
    const r2 = await POST(makeReq(CONTACT_BODY) as never)
    expect(await r2.text()).not.toContain(DEMO_SECRET)
  })

  it('G. missing NORA_API_URL → 503, no fetch call', async () => {
    delete process.env.NORA_API_URL
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('H. missing NORA_DEMO_API_SECRET → 503, no fetch call', async () => {
    delete process.env.NORA_DEMO_API_SECRET
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('I. backend 400 → safe 400 (internal error detail not exposed)', async () => {
    stubBackend(400, { message: 'subject format invalid' })
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(400)
    const json = await res.json() as Record<string, unknown>
    expect(json.error).toBeTruthy()
    expect(JSON.stringify(json)).not.toContain('subject format invalid')
  })

  it('J. backend 429 → 429 with retry-friendly message', async () => {
    stubBackend(429)
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(429)
    const json = await res.json() as Record<string, string>
    expect(json.error.toLowerCase()).toContain('wait')
  })

  it('K. backend 401 → 500, secret never in response', async () => {
    stubBackend(401)
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(text).not.toContain(DEMO_SECRET)
    expect(text).not.toContain('NORA_DEMO_API_SECRET')
    expect(text).not.toContain('secret')
  })

  it('L. backend 500 → 503', async () => {
    stubBackend(500)
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(503)
  })

  it('M. network failure → 503', async () => {
    fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'))
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(503)
  })

  it('N. missing subject → 400, no fetch call', async () => {
    const body = { ...CONTACT_BODY }
    delete (body as Partial<typeof CONTACT_BODY>).subject
    const res = await POST(makeReq(body) as never)
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('O. missing name → 400 (shared validation gate)', async () => {
    const res = await POST(makeReq({ email: 'a@b.com', message: 'Hi', subject: 'Q', type: 'contact' }) as never)
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('O. missing email → 400 (shared validation gate)', async () => {
    const res = await POST(makeReq({ name: 'Alice', message: 'Hi', subject: 'Q', type: 'contact' }) as never)
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('O. missing message → 400 (shared validation gate)', async () => {
    const res = await POST(makeReq({ name: 'Alice', email: 'a@b.com', subject: 'Q', type: 'contact' }) as never)
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('successful contact submission returns 200 ok:true', async () => {
    stubBackend(200)
    const res = await POST(makeReq(CONTACT_BODY) as never)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('subject sent as separate field, message not prepended', async () => {
    stubBackend(200)
    await POST(makeReq({
      ...CONTACT_BODY,
      subject: 'Pricing question',
      message: 'How much does it cost?',
    }) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.subject).toBe('Pricing question')
    expect(payload.message).toBe('How much does it cost?')
    // message must NOT have subject prepended in brackets
    expect(payload.message).not.toContain('[Pricing question]')
  })
})

// ── non-contact types ─────────────────────────────────────────────────────────

describe('POST /api/contact — non-contact types', () => {
  it('J. early_access type bypasses NORA backend and returns 200', async () => {
    const res = await POST(makeReq({
      name: 'Bob', email: 'bob@example.com',
      business: 'Acme', whatsapp: '+1 555 0000',
      industry: 'Field Services', message: 'Interested', type: 'early_access',
    }) as never)
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('J. unknown type bypasses NORA backend and returns 200', async () => {
    const res = await POST(makeReq({
      name: 'Bob', email: 'bob@example.com', message: 'Hi', type: 'future_type',
    }) as never)
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

// ── type:demo_request — G, H, I (must not regress) ───────────────────────────

describe('POST /api/contact — type:demo_request forwarding', () => {
  const DEMO_BODY = {
    name:           'Carlos Morales',
    email:          'carlos@example.com',
    whatsappNumber: '+506 8888-0000',
    businessName:   'Basecamp Monteverde',
    industry:       'Hotels & Lodges',
    type:           'demo_request',
  }

  it('G. still calls /public/demo-requests', async () => {
    stubBackend(201)
    await POST(makeReq(DEMO_BODY) as never)
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${BACKEND_URL}/public/demo-requests`)
  })

  it('H. name mapped to firstName', async () => {
    stubBackend(201)
    await POST(makeReq(DEMO_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.firstName).toBe('Carlos Morales')
  })

  it('H. businessName mapped to companyName', async () => {
    stubBackend(201)
    await POST(makeReq(DEMO_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.companyName).toBe('Basecamp Monteverde')
  })

  it('H. industry mapped to industryType', async () => {
    stubBackend(201)
    await POST(makeReq(DEMO_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.industryType).toBe('Hotels & Lodges')
  })

  it('H. whatsappNumber forwarded in payload', async () => {
    stubBackend(201)
    await POST(makeReq(DEMO_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.whatsappNumber).toBe('+506 8888-0000')
  })

  it('H. teamSize mapped to employeeCount when provided', async () => {
    stubBackend(201)
    await POST(makeReq({ ...DEMO_BODY, teamSize: '6–15' }) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.employeeCount).toBe('6–15')
  })

  it('H. source is website_demo_page', async () => {
    stubBackend(201)
    await POST(makeReq(DEMO_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(opts.body as string)
    expect(payload.source).toBe('website_demo_page')
  })

  it('I. successful demo submission → 200 ok:true', async () => {
    stubBackend(201)
    const res = await POST(makeReq(DEMO_BODY) as never)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('I. x-nora-api-secret header sent with configured secret', async () => {
    stubBackend(201)
    await POST(makeReq(DEMO_BODY) as never)
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect((opts.headers as Record<string, string>)['x-nora-api-secret']).toBe(DEMO_SECRET)
  })

  it('I. message is optional — submission without message accepted', async () => {
    stubBackend(201)
    const body: Record<string, unknown> = { ...DEMO_BODY }
    delete body.message
    const res = await POST(makeReq(body) as never)
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('I. missing required fields → 400, no fetch call', async () => {
    const required = ['name', 'email', 'whatsappNumber', 'businessName', 'industry'] as const
    for (const field of required) {
      fetchMock.mockReset()
      const body: Record<string, unknown> = { ...DEMO_BODY }
      delete body[field]
      const res = await POST(makeReq(body) as never)
      expect(res.status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    }
  })

  it('I. backend 429 → 429 with retry-friendly message', async () => {
    stubBackend(429)
    const res = await POST(makeReq(DEMO_BODY) as never)
    expect(res.status).toBe(429)
    const json = await res.json() as Record<string, string>
    expect(json.error.toLowerCase()).toContain('wait')
  })

  it('I. backend 401 → 500, secret never in response', async () => {
    stubBackend(401)
    const res = await POST(makeReq(DEMO_BODY) as never)
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(text).not.toContain(DEMO_SECRET)
    expect(text).not.toContain('NORA_DEMO_API_SECRET')
    expect(text).not.toContain('secret')
  })

  it('I. backend 500 → 503', async () => {
    stubBackend(500)
    const res = await POST(makeReq(DEMO_BODY) as never)
    expect(res.status).toBe(503)
  })

  it('I. network failure → 503', async () => {
    fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'))
    const res = await POST(makeReq(DEMO_BODY) as never)
    expect(res.status).toBe(503)
  })

  it('I. NORA_DEMO_API_SECRET never appears in any response body', async () => {
    stubBackend(201)
    const r1 = await POST(makeReq(DEMO_BODY) as never)
    expect(await r1.text()).not.toContain(DEMO_SECRET)

    delete process.env.NORA_DEMO_API_SECRET
    const r2 = await POST(makeReq(DEMO_BODY) as never)
    expect(await r2.text()).not.toContain(DEMO_SECRET)
  })
})
