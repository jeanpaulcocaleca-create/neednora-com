import type { NextRequest } from 'next/server'
import { noraProxy } from '@/lib/nora-proxy'

/**
 * POST /api/nora/conversations
 * Proxies → POST /public/sales/conversations
 *
 * Creates a new WebChatSession on the NORA backend.
 * Returns { sessionToken: string, reply: string } on success.
 */
export async function POST(req: NextRequest): Promise<Response> {
  return noraProxy(req, '/public/sales/conversations')
}
