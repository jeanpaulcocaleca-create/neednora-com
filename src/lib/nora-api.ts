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
  | 'PHONE_INVALID'
  | 'PHONE_ALREADY_BOUND'
  | 'OFFER_NOT_MADE'

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

// ── Result types ─────────────────────────────────────────────────────────────

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

export interface CollectWhatsAppResult {
  status: 'message_sent' | 'already_sent' | 'fallback_sent'
  fallbackWhatsappUrl?: string
}

export interface HandoffResult {
  whatsappUrl: string
}

// ── Phone normalisation ───────────────────────────────────────────────────────

/**
 * Strips common display formatting (spaces, dashes, parentheses, dots) and
 * validates E.164: + followed by 7–15 digits. Returns the stripped number on
 * success, null on failure. The 00-prefix alternative to + is also accepted.
 */
export function normalizePhone(input: string): string | null {
  const stripped = input.trim().replace(/[\s\-().]/g, '')
  const withPlus = stripped.startsWith('00') ? '+' + stripped.slice(2) : stripped
  return /^\+\d{7,15}$/.test(withPlus) ? withPlus : null
}

// ── API functions ─────────────────────────────────────────────────────────────

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

  if (!res.ok) throw statusToError(res.status)

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

  if (!res.ok) throw statusToError(res.status)

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

/**
 * Submits the visitor's phone number and explicit consent. The consent flag is
 * always sent as the boolean true — the backend controller validates
 * `body['consent'] !== true` and rejects strings or missing values.
 */
export async function collectWhatsApp(
  sessionToken: string,
  phone: string,
): Promise<CollectWhatsAppResult> {
  let res: Response
  try {
    res = await fetch(`/api/nora/conversations/${sessionToken}/whatsapp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone, consent: true }),
      cache: 'no-store',
    })
  } catch {
    throw new NoraSalesApiError('NETWORK_ERROR', USER_MESSAGES.NETWORK_ERROR, true)
  }

  const data = await res.json().catch(() => ({})) as Record<string, unknown>

  if (!res.ok) {
    if (res.status === 400) {
      const code = classify400Error(data)
      throw new NoraSalesApiError(code, USER_MESSAGES[code], false)
    }
    throw statusToError(res.status)
  }

  const status = data.status as CollectWhatsAppResult['status']
  return {
    status,
    fallbackWhatsappUrl:
      typeof data.fallbackWhatsappUrl === 'string' ? data.fallbackWhatsappUrl : undefined,
  }
}

/**
 * Requests a fresh WhatsApp deep link for an existing session. Called when
 * collectWhatsApp returns already_sent (original 15-min alias has likely
 * expired) or when PHONE_ALREADY_BOUND auto-recovery is triggered.
 */
export async function getHandoffUrl(sessionToken: string): Promise<HandoffResult> {
  let res: Response
  try {
    res = await fetch(`/api/nora/conversations/${sessionToken}/handoff`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
      cache: 'no-store',
    })
  } catch {
    throw new NoraSalesApiError('NETWORK_ERROR', USER_MESSAGES.NETWORK_ERROR, true)
  }

  const data = await res.json().catch(() => ({})) as Record<string, unknown>

  if (!res.ok) throw statusToError(res.status)

  if (typeof data.whatsappUrl !== 'string') {
    throw new NoraSalesApiError('SERVICE_UNAVAILABLE', USER_MESSAGES.SERVICE_UNAVAILABLE, true)
  }

  return { whatsappUrl: data.whatsappUrl }
}

// ── Private helpers ───────────────────────────────────────────────────────────

function statusToError(status: number): NoraSalesApiError {
  if (status === 404) return new NoraSalesApiError('SESSION_EXPIRED', USER_MESSAGES.SESSION_EXPIRED, false)
  if (status === 429) return new NoraSalesApiError('RATE_LIMITED', USER_MESSAGES.RATE_LIMITED, true)
  return new NoraSalesApiError('SERVICE_UNAVAILABLE', USER_MESSAGES.SERVICE_UNAVAILABLE, true)
}

function classify400Error(data: Record<string, unknown>): ErrorCode {
  const msg = typeof data.message === 'string' ? data.message.toLowerCase() : ''
  if (msg.includes('already bound')) return 'PHONE_ALREADY_BOUND'
  if (msg.includes('not been offered') || msg.includes('offer_not_made')) return 'OFFER_NOT_MADE'
  return 'PHONE_INVALID'
}

const USER_MESSAGES: Record<ErrorCode, string> = {
  SESSION_EXPIRED: 'This conversation has ended. Start a new one.',
  RATE_LIMITED: "You've sent quite a few messages. Please wait a moment before continuing.",
  SERVICE_UNAVAILABLE: 'NORA is temporarily unavailable. Please try again.',
  NETWORK_ERROR: 'NORA is temporarily unavailable. Please try again.',
  PHONE_INVALID: 'Enter your number with country code, for example +1 404 555 1234.',
  PHONE_ALREADY_BOUND: 'Unable to connect to WhatsApp. Please try again.',
  OFFER_NOT_MADE: 'Something went wrong. Please try again.',
}
