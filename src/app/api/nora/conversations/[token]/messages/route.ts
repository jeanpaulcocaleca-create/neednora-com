import type { NextRequest } from 'next/server'
import { noraProxy, isValidToken } from '@/lib/nora-proxy'

/**
 * POST /api/nora/conversations/:token/messages
 * Proxies → POST /public/sales/conversations/:token/messages
 *
 * Sends a chat message within an existing session.
 * Returns { reply: string, action?: { type: string, reason?: string } }.
 * The `action` field signals UI transitions (e.g. offer_whatsapp).
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

  return noraProxy(req, `/public/sales/conversations/${token}/messages`)
}
