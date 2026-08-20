import { NextRequest, NextResponse } from 'next/server'

// NORA_API_SECRET must remain server-side only — never use NEXT_PUBLIC_ prefix.
const NORA_API_URL    = process.env.NORA_API_URL    ?? ''
const NORA_API_SECRET = process.env.NORA_API_SECRET ?? ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!body.industry || typeof body.industry !== 'string') {
      return NextResponse.json({ error: 'Industry is required' }, { status: 400 })
    }

    if (!NORA_API_URL || !NORA_API_SECRET) {
      // Dev: backend not configured — log and surface an honest error (no false success).
      console.warn('[waitlist] NORA_API_URL or NORA_API_SECRET not configured — submission rejected')
      return NextResponse.json(
        { error: 'Waitlist service is not configured. Set NORA_API_URL and NORA_API_SECRET.' },
        { status: 503 },
      )
    }

    const res = await fetch(`${NORA_API_URL}/public/waitlist`, {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'X-NORA-Api-Secret': NORA_API_SECRET,
      },
      body: JSON.stringify({
        email:        body.email.trim(),
        industry:     body.industry,
        businessName: typeof body.businessName === 'string' ? body.businessName.trim() || undefined : undefined,
        source:       'website_nav',
      }),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      const msg  = (json as { error?: string }).error ?? 'Submission failed'
      return NextResponse.json({ error: msg }, { status: res.status })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
