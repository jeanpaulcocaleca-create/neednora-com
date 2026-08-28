import type { NextRequest } from 'next/server'
import { noraProxy, isValidToken } from '@/lib/nora-proxy'

/**
 * POST /api/nora/conversations/:token/handoff
 * Proxies → POST /public/sales/conversations/:token/handoff
 *
 * Generates a fresh WhatsApp deep-link alias for an existing session without
 * requiring a phone number or consent to be re-submitted. This route exists
 * to handle the 'already_sent' recovery path:
 *
 *   When POST /whatsapp returns status: 'already_sent', the phone is already
 *   bound to the session and a template was previously sent. The original
 *   alias link may have expired (15-minute TTL). Calling /handoff generates a
 *   new alias from the existing session so the frontend can show a fresh
 *   "Open WhatsApp" button without re-collecting the phone.
 *
 * Response: { whatsappUrl: string }
 *   - whatsappUrl is a wa.me deep link with a 6-char alias pre-filled.
 *
 * Decision to include this route in Phase 1:
 *   Phase A identified 'already_sent' as a required frontend state. Without
 *   this proxy route, the frontend would have no path to recover from an
 *   expired alias, leaving visitors stranded at the handoff step. Including
 *   it now avoids an architectural hole that would require a separate
 *   deployment cycle to fill.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params

  if (!isValidToken(token)) {
    return new Response(JSON.stringify({ error: 'invalid session token' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  return noraProxy(req, `/public/sales/conversations/${token}/handoff`)
}
