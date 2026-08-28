'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowUp, LockKeyhole, RotateCcw, Sparkles } from 'lucide-react'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import {
  createConversation, sendMessage,
  collectWhatsApp, getHandoffUrl, normalizePhone,
  NoraSalesApiError,
} from '@/lib/nora-api'

type Msg = { role: 'user' | 'assistant'; content: string }
type WaPhase = 'idle' | 'submitting' | 'refreshing' | 'confirmed' | 'fallback' | 'error'

export function TryNora({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const starter = es
    ? 'Hola, soy NORA. Antes de hablar de precios, quiero entender su negocio. ¿Qué tipo de negocio maneja y qué es lo que más le cuesta mantener bajo control hoy?'
    : 'Hi, I’m NORA. Before we talk about pricing, I want to understand your business. What kind of business do you run, and what is hardest to keep under control today?'
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: starter }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [offerWhatsAppMade, setOfferWhatsAppMade] = useState(false)
  const [waPhone, setWaPhone] = useState('')
  const [waConsent, setWaConsent] = useState(false)
  const [waPhoneError, setWaPhoneError] = useState<string | null>(null)
  const [waUrl, setWaUrl] = useState<string | null>(null)
  const [waSubmitError, setWaSubmitError] = useState<string | null>(null)
  const [waPhase, setWaPhase] = useState<WaPhase>('idle')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, busy])

  async function send(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy || offerWhatsAppMade) return

    setInput('')
    setBusy(true)

    // Optimistic: show user message immediately in every case
    setMessages(prev => [...prev, { role: 'user' as const, content: text }])

    try {
      let token = sessionToken

      if (!token) {
        // First message: create a live WebChatSession, capture the real NORA opener
        const { sessionToken: newToken, reply: opener } = await createConversation(lang)
        token = newToken
        setSessionToken(token)
        // Replace hardcoded starter + optimistic user msg with: real opener + user msg
        setMessages([
          { role: 'assistant', content: opener },
          { role: 'user', content: text },
        ])
      }

      // Send message and receive real NORA reply; reuse same token for every turn
      const result = await sendMessage(token, text)
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }])

      // Detect offer_whatsapp from structured action field only — never string match reply text
      if (result.action?.type === 'offer_whatsapp') {
        setOfferWhatsAppMade(true)
      }

    } catch (err) {
      const apiErr = err instanceof NoraSalesApiError ? err : null
      const msg = apiErr?.message ?? (es
        ? 'No pude responder en este momento. Inténtelo otra vez.'
        : 'I’m unable to respond right now. Please try again.')

      // Preserve typed text so user can re-send without retyping on retryable failures
      if (apiErr?.retryable) setInput(text)
      // Expired session: clear token so next send creates a fresh session automatically
      if (apiErr?.code === 'SESSION_EXPIRED') setSessionToken(null)

      setMessages(prev => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setBusy(false)
    }
  }

  async function resolveHandoffFresh(token: string) {
    setWaPhase('refreshing')
    try {
      const result = await getHandoffUrl(token)
      setWaUrl(result.whatsappUrl)
      setWaPhase('confirmed')
    } catch (err) {
      const msg = err instanceof NoraSalesApiError ? err.message
        : (es ? 'No pudimos obtener tu enlace. Inténtalo de nuevo.' : 'We couldn’t retrieve your link. Please try again.')
      setWaSubmitError(msg)
      setWaPhase('error')
    }
  }

  async function submitHandoff() {
    if (waPhase === 'submitting' || waPhase === 'refreshing') return
    if (!waConsent) return
    if (!sessionToken) {
      setWaSubmitError(es
        ? 'La conversación ha expirado. Por favor vuelve a empezar.'
        : 'The conversation has ended. Please start over.')
      setWaPhase('error')
      return
    }

    const normalized = normalizePhone(waPhone)
    if (!normalized) {
      setWaPhoneError(es
        ? 'Ingrese su número con código de país, por ejemplo +52 55 1234 5678.'
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
            ? 'Ingrese su número con código de país, por ejemplo +52 55 1234 5678.'
            : 'Enter your number with country code, for example +1 404 555 1234.')
          setWaPhase('idle')
          return
        }
        if (err.code === 'PHONE_ALREADY_BOUND') {
          await resolveHandoffFresh(sessionToken)
          return
        }
      }
      const msg = err instanceof NoraSalesApiError ? err.message
        : (es ? 'No pudimos conectar con WhatsApp. Inténtalo de nuevo.' : 'We couldn’t connect to WhatsApp. Please try again.')
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

  return (
    <section id="try-nora" className="section try-nora-section">
      <div className="try-nora-glow" aria-hidden="true" />
      <div className="container try-nora-layout">
        <div className="try-nora-copy">
          <div className="eyebrow">{es ? 'NO LEA SOBRE NORA. HABLE CON ELLA.' : 'DON’T READ ABOUT NORA. TALK TO HER.'}</div>
          <h2>{es ? 'Cuéntele cómo funciona su negocio.' : 'Tell her how your business works.'}</h2>
          <p>{es ? 'NORA hará unas preguntas, entenderá dónde se está perdiendo tiempo o información y le mostrará qué podría empezar a manejar por usted. Después, si tiene sentido, le muestra las opciones de precio.' : 'NORA will ask a few questions, understand where time or information is slipping away, and show you what she could start managing for you. Then, if it makes sense, she can show you pricing options.'}</p>
          <div className="demo-boundaries">
            <div><LockKeyhole size={17} /><span><b>{es ? 'Demo aislada' : 'Isolated demo'}</b>{es ? 'No puede ver datos de clientes reales.' : 'Cannot see real customer data.'}</span></div>
            <div><Sparkles size={17} /><span><b>{es ? 'Conversación real' : 'Real conversation'}</b>{es ? 'Escriba libremente, no es un cuestionario.' : 'Type naturally — this is not a questionnaire.'}</span></div>
          </div>
        </div>

        <div className="demo-window">
          <div className="demo-window-top">
            <div className="demo-nora-identity"><Image src="/brand/nora-icon.png" alt="" width={34} height={34} /><div><b>NORA</b><span>{es ? 'Demo de negocio' : 'Business demo'}</span></div></div>
            <div className="demo-window-actions"><span><i /> {es ? 'EN LÍNEA' : 'ONLINE'}</span><button onClick={reset} aria-label="Reset conversation"><RotateCcw size={15} /></button></div>
          </div>
          <div className="demo-messages" ref={scrollRef}>
            <div className="demo-day-label">{es ? 'HOY' : 'TODAY'}</div>
            {messages.map((m, i) => (
              <div key={i} className={`demo-message ${m.role}`}>
                {m.role === 'assistant' && <span className="demo-message-name">NORA</span>}
                <div>{m.content}</div>
              </div>
            ))}
            {busy && <div className="demo-typing"><span /><span /><span /></div>}
          </div>

          {!offerWhatsAppMade ? (
            <form onSubmit={send} className="demo-input-row">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={es ? 'Ej: Tengo 3 restaurantes y 42 empleados…' : 'Example: I have 3 restaurants and 42 employees…'} maxLength={800} aria-label="Message NORA" disabled={busy} />
              <button aria-label="Send" disabled={busy || !input.trim()}><ArrowUp size={19} /></button>
            </form>
          ) : (
            <div className="demo-wa-panel">
              {waPhase === 'idle' && (
                <>
                  <div className="demo-wa-heading">{es ? 'CONTINUAR EN WHATSAPP' : 'CONTINUE ON WHATSAPP'}</div>
                  <div>
                    <label className="demo-wa-label" htmlFor="demo-wa-phone">
                      {es ? 'Tu número de WhatsApp' : 'Your WhatsApp number'}
                    </label>
                    <input
                      id="demo-wa-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={waPhone}
                      onChange={e => { setWaPhone(e.target.value); setWaPhoneError(null) }}
                      placeholder="+1 404 555 1234"
                      className={`demo-wa-input${waPhoneError ? ' demo-wa-input-err' : ''}`}
                      aria-describedby={waPhoneError ? 'demo-wa-phone-err' : undefined}
                    />
                    {waPhoneError && (
                      <p id="demo-wa-phone-err" className="demo-wa-field-err" role="alert">{waPhoneError}</p>
                    )}
                  </div>
                  <label className="demo-wa-consent">
                    <input
                      type="checkbox"
                      checked={waConsent}
                      onChange={e => setWaConsent(e.target.checked)}
                    />
                    <span>{es ? 'Acepto que NORA me envíe un mensaje de WhatsApp.' : 'I agree to receive a WhatsApp message from NORA.'}</span>
                  </label>
                  <button
                    className="demo-wa-btn-primary"
                    onClick={() => void submitHandoff()}
                    disabled={!waConsent}
                    aria-disabled={!waConsent}
                  >
                    {es ? 'Continuar →' : 'Continue →'}
                  </button>
                  <button className="demo-wa-back" onClick={reset}>
                    {es ? 'Volver al inicio' : 'Return to start'}
                  </button>
                </>
              )}

              {(waPhase === 'submitting' || waPhase === 'refreshing') && (
                <p className="demo-wa-connecting">
                  {waPhase === 'refreshing'
                    ? (es ? 'Preparando tu enlace…' : 'Preparing your link…')
                    : (es ? 'Conectando…' : 'Connecting…')}
                </p>
              )}

              {waPhase === 'confirmed' && (
                <>
                  <div className="demo-wa-state-line">
                    <span className="demo-wa-state-check" aria-hidden="true">&#10003;</span>
                    <span>{es ? 'NORA te está escribiendo en WhatsApp.' : 'NORA is messaging you on WhatsApp.'}</span>
                  </div>
                  {waUrl ? (
                    <>
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="demo-wa-open-btn">
                        {es ? 'Abrir WhatsApp →' : 'Open WhatsApp →'}
                      </a>
                      <p className="demo-wa-note">{es
                        ? 'También puedes continuar ahora. Este enlace es temporal.'
                        : 'You can also continue now. For security, this link is temporary.'}</p>
                    </>
                  ) : (
                    <p className="demo-wa-note">{es
                      ? 'NORA está intentando contactarte. Si no recibes nada, intenta de nuevo.'
                      : 'NORA is trying to reach you. If nothing arrives, please try again.'}</p>
                  )}
                  <button className="demo-wa-back" onClick={reset}>
                    {es ? 'Volver al inicio' : 'Return to start'}
                  </button>
                </>
              )}

              {waPhase === 'fallback' && (
                <>
                  <div className="demo-wa-heading">{es ? 'CONTINUAR EN WHATSAPP' : 'CONTINUE ON WHATSAPP'}</div>
                  {waUrl ? (
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="demo-wa-open-btn">
                      {es ? 'Abrir WhatsApp con NORA →' : 'Open WhatsApp with NORA →'}
                    </a>
                  ) : (
                    <p className="demo-wa-note">{es
                      ? 'NORA está intentando contactarte. Si no recibes nada, intenta de nuevo.'
                      : 'NORA is trying to reach you. If nothing arrives, please try again.'}</p>
                  )}
                  <button className="demo-wa-back" onClick={reset}>
                    {es ? 'Volver al inicio' : 'Return to start'}
                  </button>
                </>
              )}

              {waPhase === 'error' && (
                <>
                  <p className="demo-wa-note" style={{ color: 'var(--dark-text-muted)' }}>{waSubmitError}</p>
                  {sessionToken && (
                    <button className="demo-wa-btn-primary" onClick={retryWa}>
                      {es ? 'Intentar de nuevo' : 'Try again'}
                    </button>
                  )}
                  <button className="demo-wa-back" onClick={reset}>
                    {es ? 'Volver al inicio' : 'Return to start'}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="demo-window-foot">
            {offerWhatsAppMade
              ? (es ? 'NORA está lista para continuar en WhatsApp.' : 'NORA is ready to continue on WhatsApp.')
              : (es ? 'NORA no ejecuta acciones reales desde esta demo.' : 'NORA cannot execute real operational actions from this demo.')}
          </div>
        </div>
      </div>
    </section>
  )
}
