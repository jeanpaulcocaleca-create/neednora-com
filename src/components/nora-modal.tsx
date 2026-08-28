'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import {
  createConversation,
  sendMessage,
  collectWhatsApp,
  getHandoffUrl,
  normalizePhone,
  NoraSalesApiError,
} from '@/lib/nora-api'

type Msg = { role: 'user' | 'assistant'; content: string }
type WaPhase = 'idle' | 'submitting' | 'refreshing' | 'confirmed' | 'fallback' | 'error'

interface Props {
  lang: Locale
  isOpen: boolean
  onClose: () => void
}

// NoraModal: real NORA conversation (SALES-03C) inside the Gen 3 contact overlay shell.
// Replaces TalkToNora (scripted wizard). TryNora on the homepage is unchanged.
export function NoraModal({ lang, isOpen, onClose }: Props) {
  const es = lang === 'es'

  // Shown before the first real backend session is created. Replaced on first send.
  const starter = es
    ? 'Hola. Soy NORA. ¿Cómo funciona tu negocio? ¿Qué es lo más difícil de mantener bajo control hoy?'
    : "Hi. I'm NORA. Tell me about your business. What's hardest to keep under control today?"

  // ── conversation state (mirrors TryNora) ──────────────────────────────────
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: starter }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [offerWhatsAppMade, setOfferWhatsAppMade] = useState(false)

  // ── WA handoff state machine (mirrors TryNora) ────────────────────────────
  const [waPhone, setWaPhone] = useState('')
  const [waConsent, setWaConsent] = useState(false)
  const [waPhoneError, setWaPhoneError] = useState<string | null>(null)
  const [waUrl, setWaUrl] = useState<string | null>(null)
  const [waSubmitError, setWaSubmitError] = useState<string | null>(null)
  const [waPhase, setWaPhase] = useState<WaPhase>('idle')

  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // body.contact-open controls CSS backdrop/scroll-lock
  useEffect(() => {
    document.body.classList.toggle('contact-open', isOpen)
    return () => document.body.classList.remove('contact-open')
  }, [isOpen])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, busy])

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350)
  }, [isOpen])

  // Escape key closes overlay
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // ── send: creates session on first message, continues same token afterwards ──
  async function doSend() {
    const text = input.trim()
    if (!text || busy || offerWhatsAppMade) return

    setInput('')
    setBusy(true)
    // Optimistic: show user message immediately
    setMessages(prev => [...prev, { role: 'user', content: text }])

    try {
      let token = sessionToken

      if (!token) {
        // First message: create a real WebChatSession; replace hardcoded starter with live opener
        const { sessionToken: newToken, reply: opener } = await createConversation(lang)
        token = newToken
        setSessionToken(token)
        setMessages([
          { role: 'assistant', content: opener },
          { role: 'user', content: text },
        ])
      }

      const result = await sendMessage(token, text)
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }])

      // offer_whatsapp comes from the structured action field only — never string-match
      if (result.action?.type === 'offer_whatsapp') {
        setOfferWhatsAppMade(true)
      }
    } catch (err) {
      const apiErr = err instanceof NoraSalesApiError ? err : null
      const msg = apiErr?.message ?? (es
        ? 'No pude responder. Inténtalo de nuevo.'
        : "Unable to respond right now. Please try again.")
      if (apiErr?.retryable) setInput(text)
      if (apiErr?.code === 'SESSION_EXPIRED') setSessionToken(null)
      setMessages(prev => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setBusy(false)
    }
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    void doSend()
  }

  // ── WA handoff: phone collection → /whatsapp endpoint → fallbackWhatsappUrl ──
  async function resolveHandoffFresh(token: string) {
    setWaPhase('refreshing')
    try {
      const result = await getHandoffUrl(token)
      setWaUrl(result.whatsappUrl)
      setWaPhase('confirmed')
    } catch {
      setWaSubmitError(es
        ? 'No pudimos obtener tu enlace. Inténtalo de nuevo.'
        : "We couldn't retrieve your link. Please try again.")
      setWaPhase('error')
    }
  }

  async function submitHandoff() {
    if (waPhase === 'submitting' || waPhase === 'refreshing') return
    if (!waConsent) return
    if (!sessionToken) {
      setWaSubmitError(es
        ? 'La conversación expiró. Por favor vuelve a empezar.'
        : 'The conversation ended. Please start over.')
      setWaPhase('error')
      return
    }

    const normalized = normalizePhone(waPhone)
    if (!normalized) {
      setWaPhoneError(es
        ? 'Ingresa tu número con código de país, por ejemplo +52 55 1234 5678.'
        : 'Enter your number with country code, for example +1 404 555 1234.')
      return
    }

    setWaPhoneError(null)
    setWaSubmitError(null)
    setWaPhase('submitting')

    try {
      const result = await collectWhatsApp(sessionToken, normalized)

      if (result.status === 'already_sent') {
        await resolveHandoffFresh(sessionToken)
        return
      }

      setWaUrl(result.fallbackWhatsappUrl ?? null)
      setWaPhase(result.status === 'fallback_sent' ? 'fallback' : 'confirmed')
    } catch (err) {
      if (err instanceof NoraSalesApiError) {
        if (err.code === 'PHONE_INVALID') {
          setWaPhoneError(es
            ? 'Ingresa tu número con código de país, por ejemplo +52 55 1234 5678.'
            : 'Enter your number with country code, for example +1 404 555 1234.')
          setWaPhase('idle')
          return
        }
        if (err.code === 'PHONE_ALREADY_BOUND') {
          await resolveHandoffFresh(sessionToken)
          return
        }
      }
      const msg = err instanceof NoraSalesApiError
        ? err.message
        : (es
            ? 'No pudimos conectar con WhatsApp. Inténtalo de nuevo.'
            : "We couldn't connect to WhatsApp. Please try again.")
      setWaSubmitError(msg)
      setWaPhase('error')
    }
  }

  function retryWa() {
    setWaSubmitError(null)
    setWaPhase('idle')
  }

  function reset() {
    setMessages([{ role: 'assistant', content: starter }])
    setInput('')
    setSessionToken(null)
    setOfferWhatsAppMade(false)
    setWaPhone('')
    setWaConsent(false)
    setWaPhoneError(null)
    setWaUrl(null)
    setWaSubmitError(null)
    setWaPhase('idle')
  }

  // Unmounting on close resets all state — each overlay open starts fresh.
  // (The conversation continues on WhatsApp; the overlay is just the entry point.)
  if (!isOpen) return null

  return (
    <div
      className="contact open"
      id="contact"
      role="dialog"
      aria-modal="true"
      aria-label={es ? 'Hablar con NORA' : 'Talk to NORA'}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="contact-panel">
        <span className="sheet-handle" aria-hidden="true" />

        {/* ── Header: NORA identity ── */}
        <div className="contact-head">
          <span className="phone-avatar" aria-hidden="true">N</span>
          <div>
            <p className="phone-name">NORA</p>
            <p className="phone-status">
              {es ? 'usualmente responde en minutos' : 'usually replies in minutes'}
            </p>
          </div>
          <button
            className="contact-close"
            aria-label={es ? 'Cerrar' : 'Close'}
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* ── Chat body: message bubbles ── */}
        <div className="contact-body" aria-live="polite" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`bub ${m.role === 'assistant' ? 'in' : 'out'} enter`}>
              {m.content}
            </div>
          ))}
          {busy && (
            <div
              className="typing on"
              aria-hidden="true"
              style={{ alignSelf: 'flex-start', borderRadius: '14px 14px 14px 4px', background: 'var(--wa-in)' }}
            >
              <i /><i /><i />
            </div>
          )}
        </div>

        {/* ── Bottom: conversation input or WA handoff panel ── */}
        {!offerWhatsAppMade ? (
          <form className="contact-form" noValidate onSubmit={handleFormSubmit}>
            <div className="row">
              <input
                ref={inputRef}
                className="cf-input"
                type="text"
                aria-label={es ? 'Tu mensaje para NORA' : 'Your message to NORA'}
                placeholder={es ? 'Cuéntame de tu negocio…' : 'Tell me about your business…'}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={busy}
              />
              <button
                className="cf-send"
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={es ? 'Enviar' : 'Send'}
              >
                ↑
              </button>
            </div>
          </form>
        ) : (
          <div className="contact-form nora-wa-panel">
            {waPhase === 'idle' && (
              <>
                <p className="nora-wa-label">
                  {es ? 'Continuar en WhatsApp' : 'Continue on WhatsApp'}
                </p>
                <div>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={`cf-input${waPhoneError ? ' cf-input-err' : ''}`}
                    value={waPhone}
                    onChange={e => { setWaPhone(e.target.value); setWaPhoneError(null) }}
                    placeholder="+1 404 555 1234"
                    aria-label={es ? 'Tu número de WhatsApp' : 'Your WhatsApp number'}
                    aria-describedby={waPhoneError ? 'nora-wa-phone-err' : undefined}
                  />
                  {waPhoneError && (
                    <p id="nora-wa-phone-err" className="nora-wa-field-err" role="alert">
                      {waPhoneError}
                    </p>
                  )}
                </div>
                <label className="nora-wa-consent">
                  <input
                    type="checkbox"
                    checked={waConsent}
                    onChange={e => setWaConsent(e.target.checked)}
                  />
                  <span>
                    {es
                      ? 'Acepto que NORA me envíe un mensaje de WhatsApp.'
                      : 'I agree to receive a WhatsApp message from NORA.'}
                  </span>
                </label>
                <button
                  className="btn btn-solid"
                  onClick={() => void submitHandoff()}
                  disabled={!waConsent}
                  aria-disabled={!waConsent}
                  style={{ opacity: waConsent ? 1 : 0.45 }}
                >
                  {es ? 'Continuar →' : 'Continue →'}
                </button>
                <button className="nora-wa-back" onClick={reset}>
                  {es ? 'Empezar de nuevo' : 'Start over'}
                </button>
              </>
            )}

            {(waPhase === 'submitting' || waPhase === 'refreshing') && (
              <p className="nora-wa-connecting">
                {waPhase === 'refreshing'
                  ? (es ? 'Preparando tu enlace…' : 'Preparing your link…')
                  : (es ? 'Conectando…' : 'Connecting…')}
              </p>
            )}

            {(waPhase === 'confirmed' || waPhase === 'fallback') && (
              <>
                {waPhase === 'confirmed' && (
                  <p className="nora-wa-status-ok">
                    ✓ {es
                      ? 'NORA te está escribiendo en WhatsApp.'
                      : 'NORA is messaging you on WhatsApp.'}
                  </p>
                )}
                {waUrl ? (
                  <>
                    <a
                      className="cf-wa"
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {es ? 'Abrir WhatsApp →' : 'Open WhatsApp →'}
                    </a>
                    <p className="nora-wa-note">
                      {es
                        ? 'También puedes continuar ahora. Este enlace es temporal.'
                        : 'You can also continue now. For security, this link is temporary.'}
                    </p>
                  </>
                ) : (
                  <p className="nora-wa-note">
                    {es
                      ? 'NORA está intentando contactarte. Si no recibes nada, intenta de nuevo.'
                      : 'NORA is trying to reach you. If nothing arrives, please try again.'}
                  </p>
                )}
                <button className="nora-wa-back" onClick={reset}>
                  {es ? 'Empezar de nuevo' : 'Start over'}
                </button>
              </>
            )}

            {waPhase === 'error' && (
              <>
                <p className="nora-wa-note">{waSubmitError}</p>
                {sessionToken && (
                  <button className="btn btn-solid" onClick={retryWa}>
                    {es ? 'Intentar de nuevo' : 'Try again'}
                  </button>
                )}
                <button className="nora-wa-back" onClick={reset}>
                  {es ? 'Empezar de nuevo' : 'Start over'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
