import type { NextRequest } from 'next/server'
import { noraProxy, isValidToken } from '@/lib/nora-proxy'

/**
 * POST /api/nora/conversations/:token/whatsapp
 * Proxies → POST /public/sales/conversations/:token/whatsapp
 *
 * Collects the prospect's phone number (with consent) and triggers the
 * proactive WhatsApp template. Falls back to an alias link if the template
 * cannot be delivered.
 *
 * Request body: { phone: string, consent: true }
 *   - consent MUST be the boolean true (not a string).
 *
 * Response: { ok: true, status: 'message_sent'|'fallback_sent'|'already_sent',
 *             fallbackWhatsappUrl?: string }
 *   - fallbackWhatsappUrl is always present for message_sent and fallback_sent.
 *   - The Open WhatsApp button must remain visible even when status is
 *     'message_sent' — Meta template delivery is not guaranteed post-acceptance.
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

  return noraProxy(req, `/public/sales/conversations/${token}/whatsapp`)
}
