/**
 * Client-side API functions for the NORA sales conversation.
 *
 * All requests go to Next.js server-side proxy routes (/api/nora/…).
 * The NORA backend is never called directly from the browser.
 * NORA_SALES_API_SECRET and NORA_API_URL are server-side only variables
 * that this module must never access or expose.
 */

export type ErrorCode =
  | 'SESSION_EXPIRED'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'NETWORK_ERROR'

export class NoraSalesApiError extends Error {
  readonly code: ErrorCode
  readonly retryable: boolean

  constructor(code: ErrorCode, message: string, retryable: boolean) {
    super(message)
    this.name = 'NoraSalesApiError'
    this.code = code
    this.retryable = retryable
  }
}

export interface CreateConversationResult {
  sessionToken: string
  reply: string
}

export interface MessageAction {
  type: string
  reason?: string
}

export interface SendMessageResult {
  reply: string
  action?: MessageAction
}

export async function createConversation(locale: string): Promise<CreateConversationResult> {
  let res: Response
  try {
    res = await fetch('/api/nora/conversations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ locale }),
      cache: 'no-store',
    })
  } catch {
    throw new NoraSalesApiError('NETWORK_ERROR', USER_MESSAGES.NETWORK_ERROR, true)
  }

  const data = await res.json().catch(() => ({})) as Record<string, unknown>

  if (!res.ok) {
    throw statusToError(res.status)
  }

  if (typeof data.sessionToken !== 'string' || typeof data.reply !== 'string') {
    throw new NoraSalesApiError('SERVICE_UNAVAILABLE', USER_MESSAGES.SERVICE_UNAVAILABLE, true)
  }

  return { sessionToken: data.sessionToken, reply: data.reply }
}

export async function sendMessage(
  sessionToken: string,
  message: string,
): Promise<SendMessageResult> {
  let res: Response
  try {
    res = await fetch(`/api/nora/conversations/${sessionToken}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message }),
      cache: 'no-store',
    })
  } catch {
    throw new NoraSalesApiError('NETWORK_ERROR', USER_MESSAGES.NETWORK_ERROR, true)
  }

  const data = await res.json().catch(() => ({})) as Record<string, unknown>

  if (!res.ok) {
    throw statusToError(res.status)
  }

  const rawAction = data.action
  const action: MessageAction | undefined =
    rawAction !== null &&
    typeof rawAction === 'object' &&
    typeof (rawAction as Record<string, unknown>).type === 'string'
      ? (rawAction as MessageAction)
      : undefined

  return {
    reply: typeof data.reply === 'string' ? data.reply : '',
    action,
  }
}

function statusToError(status: number): NoraSalesApiError {
  if (status === 404) {
    return new NoraSalesApiError('SESSION_EXPIRED', USER_MESSAGES.SESSION_EXPIRED, false)
  }
  if (status === 429) {
    return new NoraSalesApiError('RATE_LIMITED', USER_MESSAGES.RATE_LIMITED, true)
  }
  return new NoraSalesApiError('SERVICE_UNAVAILABLE', USER_MESSAGES.SERVICE_UNAVAILABLE, true)
}

const USER_MESSAGES: Record<ErrorCode, string> = {
  SESSION_EXPIRED: 'This conversation has ended. Start a new one.',
  RATE_LIMITED: "You've sent quite a few messages. Please wait a moment before continuing.",
  SERVICE_UNAVAILABLE: 'NORA is temporarily unavailable. Please try again.',
  NETWORK_ERROR: 'NORA is temporarily unavailable. Please try again.',
}
