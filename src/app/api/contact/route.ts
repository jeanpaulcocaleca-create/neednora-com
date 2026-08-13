import { NextRequest, NextResponse } from 'next/server'

interface ContactPayload {
  type?: string
  name?: string
  email?: string
  business?: string
  whatsapp?: string
  industry?: string
  subject?: string
  message?: string
}

async function sendViaResend(payload: ContactPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const to = process.env.NORA_LEAD_EMAIL ?? 'hello@neednora.com'
  const isEarlyAccess = payload.type === 'early_access'
  const subject = isEarlyAccess
    ? `New NORA lead: ${payload.name ?? '?'} — ${payload.business ?? 'unknown business'}`
    : `NORA contact: ${payload.subject ?? payload.name ?? 'inquiry'}`

  const html = `
<html><body style="font-family:system-ui,sans-serif;color:#111;max-width:520px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 20px;font-size:1.1rem;font-weight:600;border-bottom:1px solid #e5e7eb;padding-bottom:12px">
    ${isEarlyAccess ? '🟢 New NORA Lead' : '📩 NORA Contact Form'}
  </h2>
  <table style="width:100%;border-collapse:collapse;font-size:0.875rem">
    <tr><td style="padding:6px 0;color:#6b7280;width:120px">Name</td><td style="padding:6px 0;font-weight:500">${payload.name ?? '—'}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${payload.email}">${payload.email ?? '—'}</a></td></tr>
    ${payload.business ? `<tr><td style="padding:6px 0;color:#6b7280">Business</td><td style="padding:6px 0;font-weight:500">${payload.business}</td></tr>` : ''}
    ${payload.whatsapp ? `<tr><td style="padding:6px 0;color:#6b7280">WhatsApp</td><td style="padding:6px 0">${payload.whatsapp}</td></tr>` : ''}
    ${payload.industry ? `<tr><td style="padding:6px 0;color:#6b7280">Industry</td><td style="padding:6px 0">${payload.industry}</td></tr>` : ''}
    ${payload.message ? `<tr><td style="padding:6px 0;color:#6b7280;vertical-align:top">Message</td><td style="padding:6px 0">${payload.message}</td></tr>` : ''}
  </table>
  <p style="margin:20px 0 0;font-size:0.75rem;color:#9ca3af">Sent from neednora.com · ${new Date().toISOString()}</p>
</body></html>`

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NORA Website <noreply@neednora.com>',
        to: [to],
        subject,
        html,
        reply_to: payload.email,
      }),
    })
    return r.ok
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  let body: ContactPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { type = 'contact', name, email, message } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email?.trim() || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (type === 'contact' && !message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  // Structured log (always — useful in dev and as Vercel function logs)
  console.log('[nora-contact]', JSON.stringify({
    type,
    name,
    email,
    business: body.business ?? null,
    whatsapp: body.whatsapp ?? null,
    industry: body.industry ?? null,
    subject: body.subject ?? null,
    message: message?.substring(0, 200) ?? null,
    ts: new Date().toISOString(),
  }))

  // Send email via Resend when configured
  const sent = await sendViaResend(body)
  if (process.env.RESEND_API_KEY && !sent) {
    console.warn('[nora-contact] Resend delivery failed for', email)
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
