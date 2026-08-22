import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Read inside the handler so env vars are always current (test-friendly + runtime-safe).
  // NORA_DEMO_API_SECRET MUST remain server-side only — never use a NEXT_PUBLIC_ prefix.
  const NORA_API_URL         = process.env.NORA_API_URL         ?? ''
  const NORA_DEMO_API_SECRET = process.env.NORA_DEMO_API_SECRET ?? ''

  try {
    const body = await req.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const type = typeof body.type === 'string' ? body.type : 'contact'

    // ── Contact / demo form → BE-12 ─────────────────────────────────────────
    // All industry pages ("Request a demo") link here. This is the live NORA
    // lead-capture path: Browser → Next.js /api/contact (server) → NORA backend.
    if (type === 'contact') {
      if (!NORA_API_URL || !NORA_DEMO_API_SECRET) {
        console.error('[contact] NORA_API_URL or NORA_DEMO_API_SECRET not configured')
        return NextResponse.json(
          { error: 'Service temporarily unavailable.' },
          { status: 503 },
        )
      }

      // Subject is not a BE-12 field; prepend it so the team sees context.
      const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
      const rawMsg  = (body.message as string).trim()
      const message = subject ? `[${subject}]\n\n${rawMsg}` : rawMsg

      let res: Response
      try {
        res = await fetch(`${NORA_API_URL}/public/demo-requests`, {
          method:  'POST',
          headers: {
            'Content-Type':      'application/json',
            'x-nora-api-secret': NORA_DEMO_API_SECRET,
          },
          body: JSON.stringify({
            email:     (body.email as string).trim(),
            firstName: (body.name  as string).trim() || undefined,
            message:   message || undefined,
            source:    'website_contact_form',
          }),
        })
      } catch (err) {
        console.error('[contact] Network error reaching NORA backend:', String(err))
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again shortly.' },
          { status: 503 },
        )
      }

      if (res.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a few minutes before trying again.' },
          { status: 429 },
        )
      }
      if (res.status === 400) {
        return NextResponse.json(
          { error: 'Invalid submission. Please check your details and try again.' },
          { status: 400 },
        )
      }
      if (res.status === 401) {
        // Integration misconfiguration — never expose secret details to the browser.
        console.error('[contact] NORA backend rejected API secret — check NORA_DEMO_API_SECRET in Vercel env vars')
        return NextResponse.json(
          { error: 'Service temporarily unavailable.' },
          { status: 500 },
        )
      }
      if (!res.ok) {
        console.error(`[contact] NORA backend returned unexpected status: ${res.status}`)
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again shortly.' },
          { status: 503 },
        )
      }

      return NextResponse.json({ ok: true }, { status: 200 })
    }

    // ── Other form types (early_access, etc.) ───────────────────────────────
    // The early access form collects WhatsApp number instead of email, so it
    // cannot be forwarded to BE-12 (which requires email). Log and acknowledge.
    console.log('[contact] Submission received:', {
      type,
      subject:   body.subject  ?? '—',
      business:  body.business ?? '—',
      industry:  body.industry ?? '—',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
