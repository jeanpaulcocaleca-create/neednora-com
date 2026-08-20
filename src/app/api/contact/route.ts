import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Log the submission server-side (Resend integration to be added in Phase 2)
    console.log('[contact] Submission received:', {
      type: body.type ?? 'contact',
      name: body.name,
      email: body.email,
      subject: body.subject ?? '—',
      business: body.business ?? '—',
      whatsapp: body.whatsapp ?? '—',
      industry: body.industry ?? '—',
      message: body.message?.substring(0, 100),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
