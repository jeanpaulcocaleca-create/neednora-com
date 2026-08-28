/**
 * Secure server-side proxy for the NORA public sales API.
 *
 * Security boundary
 * -----------------
 * All communication with the NORA backend is server-to-server only.
 * NORA_SALES_API_SECRET is injected here and must never be returned to the
 * browser or placed in any NEXT_PUBLIC_ variable.
 *
 * IP-forwarding and rate limiting
 * --------------------------------
 * The NORA backend (Render) uses resolveClientIp(), which takes the RIGHTMOST
 * X-Forwarded-For entry because Render's load balancer appends the real client
 * IP on the right for direct connections (defeating left-side spoofing).
 *
 * Through a Vercel → Render proxy chain, Render's LB always appends the Vercel
 * server IP as the rightmost entry regardless of what we forward. Forwarding the
 * browser's X-Forwarded-For header would therefore provide no per-user benefit
 * and would pollute the IP chain in backend audit logs. We do NOT forward it.
 *
 * Consequence: backend rate limiting keys on the Vercel egress IP (shared pool
 * across all website visitors). The API secret already prevents non-website
 * actors from abusing the endpoints. Future work: add X-Nora-Real-IP support to
 * the backend resolveClientIp() when the request is authenticated, allowing
 * per-browser-IP rate limiting without introducing a spoofable trust boundary.
 */

/** Maximum incoming body size. NORA sales bodies are small; 8 KB is generous. */
const MAX_BODY_BYTES = 8_192

/** 25 s — budget includes LLM response time in sendMessage. */
const UPSTREAM_TIMEOUT_MS = 25_000

/** Validates a 64-hex-char WebChatSession token. Prevents path-segment injection. */
export function isValidToken(token: unknown): token is string {
  return typeof token === 'string' && /^[0-9a-f]{64}$/.test(token)
}

/**
 * Forwards a POST request to the NORA backend at the given path, injecting the
 * API secret server-side. Returns a standard Response (Web API) so route handlers
 * can return it directly or wrap it in NextResponse.
 *
 * @param req - Anything with a .text() method (NextRequest, Request, or test stub)
 * @param upstreamPath - Path on the NORA backend, e.g. "/public/sales/conversations"
 */
export async function noraProxy(
  req: { text(): Promise<string> },
  upstreamPath: string,
): Promise<Response> {
  const apiUrl = (process.env.NORA_API_URL ?? '').replace(/\/+$/, '')
  const secret = process.env.NORA_SALES_API_SECRET ?? ''

  if (!apiUrl || !secret) {
    return jsonResponse({ error: 'service unavailable' }, 503)
  }

  const rawText = await req.text()

  if (rawText.length > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'request body too large' }, 413)
  }

  let body: unknown = {}
  if (rawText.length > 0) {
    try {
      body = JSON.parse(rawText)
    } catch {
      return jsonResponse({ error: 'invalid JSON in request body' }, 400)
    }
  }

  let upstreamRes: Response
  try {
    upstreamRes = await fetch(`${apiUrl}${upstreamPath}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-nora-api-secret': secret,  // injected server-side — never from request
        'accept': 'application/json',
      },
      body: JSON.stringify(body),
      // AbortSignal.timeout() is available in Node 18+ (required by Next.js 16).
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: 'no-store',
    })
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === 'TimeoutError'
    return jsonResponse(
      { error: isTimeout ? 'upstream timeout' : 'service unavailable' },
      503,
    )
  }

  // Status mapping (applied before body parsing so 401/5xx short-circuit safely):
  // 401 → 503: the backend rejected our secret — server config error, not a client error.
  //            Return a generic body; never forward the backend's auth error details.
  // 5xx → 503: upstream errors surface as service unavailable.
  // 400/404/429: pass through — these are legitimate client-state errors.
  const upstreamStatus = upstreamRes.status
  if (upstreamStatus === 401) {
    return jsonResponse({ error: 'service unavailable' }, 503)
  }
  if (upstreamStatus >= 500) {
    return jsonResponse({ error: 'service unavailable' }, 503)
  }

  // For client-error and success paths, parse and forward the upstream body.
  const ct = upstreamRes.headers.get('content-type') ?? ''
  if (!ct.includes('application/json')) {
    // Unexpected content type from an otherwise-successful upstream call.
    return jsonResponse({ error: 'unexpected response from upstream' }, 503)
  }

  let responseBody: unknown
  try {
    responseBody = await upstreamRes.json()
  } catch {
    // Upstream sent content-type: application/json but body is not valid JSON.
    return jsonResponse({ error: 'unexpected response from upstream' }, 503)
  }

  return jsonResponse(responseBody, upstreamStatus)
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
