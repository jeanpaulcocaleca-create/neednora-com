'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  scenarios,
  NORA_INITIAL,
  SITUATIONS_LABEL,
  TRY_ANOTHER,
  START_OVER,
  type Scenario,
  type FollowUpChoice,
} from '@/lib/conversations'
import {
  createConversation,
  sendMessage,
  NoraSalesApiError,
} from '@/lib/nora-api'
import type { Locale } from '@/lib/i18n'

type Phase =
  // Curated demo phases
  | 'situations'
  | 'nora-thinking'
  | 'nora-replied'
  | 'follow-thinking'
  | 'follow-replied'
  // Live NORA phases
  | 'live-connecting'
  | 'live-ready'
  | 'live-sending'
  | 'live-offer-wa'
  | 'live-error'

interface ChatMsg {
  role: 'user' | 'nora'
  text: string
}

const LIVE_PHASES: Phase[] = [
  'live-connecting',
  'live-ready',
  'live-sending',
  'live-offer-wa',
  'live-error',
]

const FALLBACK_ERROR = 'NORA is temporarily unavailable. Please try again.'

export function TryNora({ lang }: { lang: Locale }) {
  const l = lang

  // ── Demo state ───────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('situations')
  const [selected, setSelected] = useState<Scenario | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'nora', text: NORA_INITIAL[l] },
  ])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // ── Live mode state ──────────────────────────────────────────────────────
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const [liveError, setLiveError] = useState<string | null>(null)
  const [offerWhatsAppMade, setOfferWhatsAppMade] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ── Reset on locale change ───────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPhase('situations')
    setSelected(null)
    setMessages([{ role: 'nora', text: NORA_INITIAL[l] }])
    setSessionToken(null)
    setInputText('')
    setPendingMessage(null)
    setLiveError(null)
    setOfferWhatsAppMade(false)
  }, [l])

  // ── Auto-scroll messages ─────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, phase])

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  // ── Demo actions ─────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPhase('situations')
    setSelected(null)
    setMessages([{ role: 'nora', text: NORA_INITIAL[l] }])
    setSessionToken(null)
    setInputText('')
    setPendingMessage(null)
    setLiveError(null)
    setOfferWhatsAppMade(false)
  }, [l])

  const pickSituation = useCallback((s: Scenario) => {
    setSelected(s)
    setMessages([
      { role: 'nora', text: NORA_INITIAL[l] },
      { role: 'user', text: s.situation[l] },
    ])
    setPhase('nora-thinking')
    timerRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { role: 'nora', text: s.noraReply[l] }])
      setPhase('nora-replied')
    }, 950)
  }, [l])

  const pickChoice = useCallback((choice: FollowUpChoice) => {
    setMessages(prev => [...prev, { role: 'user', text: choice.label[l] }])
    setPhase('follow-thinking')
    timerRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { role: 'nora', text: choice.noraReply[l] }])
      setPhase('follow-replied')
    }, 750)
  }, [l])

  // ── Live mode: start a session ───────────────────────────────────────────
  const activateLiveMode = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPhase('live-connecting')
    setMessages([])
    setInputText('')
    setPendingMessage(null)
    setLiveError(null)
    setOfferWhatsAppMade(false)
    setSessionToken(null)

    try {
      const { sessionToken: token, reply } = await createConversation(l)
      setSessionToken(token)
      setMessages([{ role: 'nora', text: reply }])
      setPhase('live-ready')
      setTimeout(() => inputRef.current?.focus(), 100)
    } catch (err) {
      const msg = err instanceof NoraSalesApiError ? err.message : FALLBACK_ERROR
      setLiveError(msg)
      setPhase('live-error')
    }
  }, [l])

  // ── Live mode: send a message ────────────────────────────────────────────
  const sendLiveMessage = useCallback(async () => {
    const text = inputText.trim()
    // Guard: no message, no session, or already mid-flight
    if (!text || !sessionToken || phase === 'live-sending' || phase === 'live-connecting') return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInputText('')
    setPendingMessage(text)
    setPhase('live-sending')

    try {
      const result = await sendMessage(sessionToken, text)
      setPendingMessage(null)
      setMessages(prev => [...prev, { role: 'nora', text: result.reply }])

      // Structural action detection — never string-match on result.reply
      if (result.action?.type === 'offer_whatsapp') {
        setOfferWhatsAppMade(true)
        setPhase('live-offer-wa')
      } else {
        setPhase('live-ready')
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    } catch (err) {
      const isExpired = err instanceof NoraSalesApiError && err.code === 'SESSION_EXPIRED'
      const msg = err instanceof NoraSalesApiError ? err.message : FALLBACK_ERROR

      if (isExpired) {
        setSessionToken(null)
        setPendingMessage(null)
      }

      setLiveError(msg)
      setPhase('live-error')
    }
  }, [inputText, sessionToken, phase])

  // ── Live mode: retry after error ─────────────────────────────────────────
  const retryLive = useCallback(() => {
    setLiveError(null)
    if (sessionToken && pendingMessage) {
      // A message send failed — restore the text so the user can resend
      setInputText(pendingMessage)
      setPendingMessage(null)
      setPhase('live-ready')
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      // No session (creation failed or expired) — start fresh
      void activateLiveMode()
    }
  }, [sessionToken, pendingMessage, activateLiveMode])

  // ── Derived booleans ─────────────────────────────────────────────────────
  const isLivePhase = LIVE_PHASES.includes(phase)
  // Typing indicator in the left panel: demo thinking OR live waiting for reply
  const showTypingIndicator =
    phase === 'nora-thinking' ||
    phase === 'follow-thinking' ||
    phase === 'live-connecting' ||
    phase === 'live-sending'
  // Demo-only right-panel thinking state
  const isDemoThinking = phase === 'nora-thinking' || phase === 'follow-thinking'
  const showFollowUp = phase === 'nora-replied' && selected?.followUp
  const showDone = phase === 'nora-replied' && !selected?.followUp
  const showAfterChoice = phase === 'follow-replied'

  return (
    <section
      id="try-nora"
      style={{
        background: 'linear-gradient(170deg, #0a1428 0%, #0c1a32 100%)',
        padding: '7rem 0',
        scrollMarginTop: 'var(--nav-h)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" className="tn-ambient" />

      <div className="container" style={{ position: 'relative' }}>

        {/* Section header */}
        <div style={{ marginBottom: '3rem', maxWidth: 600 }}>
          <div className="eyebrow" style={{ marginBottom: '0.8rem' }}>
            {isLivePhase
              ? (l === 'es' ? 'NORA EN VIVO' : 'NORA LIVE')
              : (l === 'es' ? 'PRUEBA NORA' : 'TRY NORA')}
          </div>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
            fontWeight: 660,
            letterSpacing: '-0.032em',
            lineHeight: 1.15,
            color: '#f0f5ff',
            margin: '0 0 0.7rem',
          }}>
            {isLivePhase
              ? (l === 'es' ? 'Tu turno. Habla con NORA.' : 'Your turn. Talk to NORA.')
              : (l === 'es'
                  ? 'Seleccione una situación. Vea qué hace NORA.'
                  : 'Select a situation. See what NORA does.')}
          </h2>
          <p style={{ color: '#6a8aaa', fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>
            {isLivePhase
              ? (l === 'es' ? 'NORA responde en tiempo real.' : 'NORA responds in real time.')
              : (l === 'es'
                  ? 'Situaciones reales de negocio. Respuestas reales de NORA.'
                  : 'Real business situations. Real NORA responses.')}
          </p>
        </div>

        {/* Main interactive area */}
        <div className="tn-layout">

          {/* LEFT: NORA conversation window */}
          <div className="tn-window">
            <div className="tn-win-header">
              <div className="tn-identity">
                <Image src="/brand/nora-icon.png" alt="" width={28} height={28} />
                <div>
                  <b>NORA</b>
                  <span>
                    {isLivePhase
                      ? (l === 'es' ? 'Conversación en vivo' : 'Live conversation')
                      : (l === 'es' ? 'Demo interactivo' : 'Interactive demo')}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <span className="tn-live"><i />{l === 'es' ? 'EN LÍNEA' : 'ONLINE'}</span>
                {phase !== 'situations' && (
                  <button className="tn-reset" onClick={reset} aria-label={l === 'es' ? 'Reiniciar' : 'Reset'}>
                    <RotateCcw size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="tn-messages" ref={scrollRef}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`tn-msg tn-msg-${msg.role}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  {msg.role === 'nora' && (
                    <span className="tn-msg-name">NORA</span>
                  )}
                  <div className="tn-bubble">{msg.text}</div>
                </motion.div>
              ))}

              <AnimatePresence>
                {showTypingIndicator && (
                  <motion.div
                    className="tn-msg tn-msg-nora"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="tn-msg-name">NORA</span>
                    <div className="tn-typing"><span /><span /><span /></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Situations / Follow-up / Live input */}
          <div className="tn-right-panel">
            <AnimatePresence mode="wait">

              {/* 10 situation cards */}
              {phase === 'situations' && (
                <motion.div
                  key="situations"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="tn-situations"
                >
                  <div className="tn-situations-label">{SITUATIONS_LABEL[l]}</div>
                  <div className="tn-situation-list">
                    {scenarios.map((s, i) => (
                      <motion.button
                        key={s.id}
                        className="tn-situation-btn"
                        onClick={() => pickSituation(s)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="tn-sit-quote">&ldquo;</span>
                        <span className="tn-sit-text">{s.situation[l]}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Demo thinking state */}
              {isDemoThinking && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="tn-panel-state"
                >
                  <div className="tn-thinking-dot" />
                  <span style={{ color: '#4a6278', fontSize: '0.8rem' }}>
                    {l === 'es' ? 'NORA está respondiendo...' : 'NORA is responding...'}
                  </span>
                </motion.div>
              )}

              {/* Follow-up choices */}
              {showFollowUp && selected?.followUp && (
                <motion.div
                  key="followup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="tn-choices"
                >
                  <div className="tn-situations-label">
                    {l === 'es' ? 'NORA NECESITA SABER' : 'NORA NEEDS TO KNOW'}
                  </div>
                  {selected.followUp.choices.map(c => (
                    <button
                      key={c.id}
                      className="tn-choice-btn"
                      onClick={() => pickChoice(c)}
                    >
                      {c.label[l]}
                    </button>
                  ))}
                  <button className="tn-secondary-btn" onClick={reset} style={{ marginTop: '0.5rem' }}>
                    {START_OVER[l]}
                  </button>
                </motion.div>
              )}

              {/* After response: "NORA handled it" + Talk to NORA CTA */}
              {(showDone || showAfterChoice) && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="tn-choices"
                >
                  <div className="tn-check-line">
                    <span className="tn-check">✓</span>
                    <span style={{ color: '#6a9aaa', fontSize: '0.82rem' }}>
                      {l === 'es' ? 'NORA lo manejó.' : 'NORA handled it.'}
                    </span>
                  </div>
                  <button className="tn-choice-btn tn-talk-btn" onClick={() => void activateLiveMode()}>
                    {l === 'es' ? 'Hablar con NORA →' : 'Talk to NORA →'}
                  </button>
                  <button className="tn-choice-btn tn-choice-primary" onClick={reset}>
                    {TRY_ANOTHER[l]}
                  </button>
                  <button className="tn-secondary-btn" onClick={reset}>
                    {START_OVER[l]}
                  </button>
                </motion.div>
              )}

              {/* Live: connecting */}
              {phase === 'live-connecting' && (
                <motion.div
                  key="live-connecting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="tn-panel-state"
                >
                  <div className="tn-thinking-dot" />
                  <span style={{ color: '#4a6278', fontSize: '0.8rem' }}>
                    {l === 'es' ? 'Conectando con NORA...' : 'Connecting to NORA...'}
                  </span>
                </motion.div>
              )}

              {/* Live: input area (ready or sending) */}
              {(phase === 'live-ready' || phase === 'live-sending') && (
                <motion.div
                  key="live-input"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="tn-live-area"
                >
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        void sendLiveMessage()
                      }
                    }}
                    disabled={phase === 'live-sending'}
                    placeholder={l === 'es' ? 'Escribe tu mensaje...' : 'Type your message...'}
                    className="tn-live-input"
                    rows={3}
                  />
                  <button
                    className="tn-live-send"
                    onClick={() => void sendLiveMessage()}
                    disabled={!inputText.trim() || phase === 'live-sending'}
                  >
                    {phase === 'live-sending'
                      ? (l === 'es' ? 'NORA está respondiendo...' : 'NORA is responding...')
                      : (l === 'es' ? 'Enviar →' : 'Send →')}
                  </button>
                  <button className="tn-secondary-btn" onClick={reset}>
                    {l === 'es' ? 'Volver al demo' : 'Return to demo'}
                  </button>
                </motion.div>
              )}

              {/* Live: WhatsApp offer (Phase 3 placeholder — no phone collection here) */}
              {phase === 'live-offer-wa' && (
                <motion.div
                  key="live-offer-wa"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="tn-choices"
                >
                  <div className="tn-situations-label" style={{ color: '#1e5a3a' }}>
                    {l === 'es' ? 'CONTINUAR EN WHATSAPP' : 'CONTINUE ON WHATSAPP'}
                  </div>
                  {/* offerWhatsAppMade is true here — Phase 3 will use this state to render phone collection */}
                  <button className="tn-choice-btn tn-wa-btn" disabled>
                    {l === 'es' ? 'Continuar en WhatsApp →' : 'Continue on WhatsApp →'}
                  </button>
                  <p style={{ color: '#2e4a5e', fontSize: '0.72rem', margin: '0.1rem 0 0', lineHeight: 1.5 }}>
                    {l === 'es' ? 'Disponible próximamente.' : 'Available in the next phase.'}
                  </p>
                  <button className="tn-secondary-btn" onClick={reset} style={{ marginTop: '0.5rem' }}>
                    {l === 'es' ? 'Volver al demo' : 'Return to demo'}
                  </button>
                </motion.div>
              )}

              {/* Live: error state */}
              {phase === 'live-error' && (
                <motion.div
                  key="live-error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="tn-choices"
                >
                  <p style={{ color: '#7a9ab8', fontSize: '0.82rem', lineHeight: 1.55, margin: '0 0 0.65rem' }}>
                    {liveError}
                  </p>
                  <button className="tn-choice-btn tn-choice-primary" onClick={retryLive}>
                    {l === 'es' ? 'Intentar de nuevo' : 'Try again'}
                  </button>
                  <button className="tn-secondary-btn" onClick={reset} style={{ marginTop: '0.25rem' }}>
                    {l === 'es' ? 'Volver al demo' : 'Return to demo'}
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Trust note — only shown in demo mode */}
        {!isLivePhase && (
          <p style={{ fontSize: '0.72rem', color: '#2e4a5e', marginTop: '2rem', margin: '2rem 0 0' }}>
            {l === 'es'
              ? 'Demo aislada — sin conexión a datos reales de clientes. La IA no está expuesta al público.'
              : 'Isolated demo — no real customer data. AI is not exposed to the public.'}
          </p>
        )}
        {/* The unused offerWhatsAppMade state is available for Phase 3 phone collection */}
        {offerWhatsAppMade && null}
      </div>

      <style>{`
        .tn-ambient {
          position: absolute;
          width: 600px; height: 600px;
          top: -200px; right: -100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,.07), transparent 65%);
          pointer-events: none;
          animation: tn-ambient-breathe 9s ease-in-out infinite;
        }
        @keyframes tn-ambient-breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tn-ambient { animation: none; }
        }

        .tn-layout {
          display: grid;
          gap: 2rem;
          align-items: start;
        }
        @media (min-width: 900px) {
          .tn-layout {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
            align-items: stretch;
          }
        }

        /* Conversation window */
        .tn-window {
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(130,158,201,.16);
          background: #0a1422;
          box-shadow: 0 32px 80px rgba(0,0,0,.38);
          display: flex;
          flex-direction: column;
          min-height: 380px;
        }
        @media (min-width: 900px) {
          .tn-window { min-height: 440px; }
        }
        .tn-win-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 1rem;
          background: #0d1830;
          border-bottom: 1px solid rgba(130,158,201,.11);
          flex-shrink: 0;
        }
        .tn-identity {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }
        .tn-identity b {
          display: block;
          font-size: 0.8rem;
          color: #f0f5ff;
          letter-spacing: 0.07em;
        }
        .tn-identity span {
          display: block;
          font-size: 0.6rem;
          color: #4a6278;
          margin-top: 0.06rem;
        }
        .tn-live {
          display: inline-flex;
          align-items: center;
          gap: 0.28rem;
          font-size: 0.55rem;
          font-weight: 750;
          letter-spacing: 0.08em;
          color: #4fd5a0;
        }
        .tn-live i {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #22cc87;
        }
        .tn-reset {
          width: 26px; height: 26px;
          border-radius: 6px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(148,163,184,.1);
          color: #6a7f99;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.14s;
        }
        .tn-reset:hover { background: rgba(255,255,255,.07); }

        .tn-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          background: radial-gradient(circle at 50% 0%, rgba(14,165,233,.04), transparent 40%), #080f1c;
          scroll-behavior: smooth;
        }
        .tn-msg { display: flex; flex-direction: column; max-width: 88%; }
        .tn-msg-nora { align-self: flex-start; }
        .tn-msg-user { align-self: flex-end; }
        .tn-msg-name {
          display: block;
          font-size: 0.52rem;
          font-weight: 750;
          letter-spacing: 0.09em;
          color: #3db8d8;
          margin: 0 0 0.14rem 0.1rem;
        }
        .tn-bubble {
          padding: 0.65rem 0.85rem;
          border-radius: 13px;
          font-size: 0.82rem;
          line-height: 1.58;
          white-space: pre-wrap;
        }
        .tn-msg-nora .tn-bubble {
          color: #c4d5e8;
          background: #132030;
          border: 1px solid rgba(130,158,201,.09);
          border-top-left-radius: 3px;
        }
        .tn-msg-user .tn-bubble {
          color: #fff;
          background: linear-gradient(135deg, #0b6ed6, #0857b0);
          border-top-right-radius: 3px;
        }
        .tn-typing {
          width: 48px; height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border-radius: 10px;
          background: #132030;
          border: 1px solid rgba(130,158,201,.09);
        }
        .tn-typing span {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #5a7a95;
          animation: tn-dot 1s ease-in-out infinite;
        }
        .tn-typing span:nth-child(2) { animation-delay: .14s; }
        .tn-typing span:nth-child(3) { animation-delay: .28s; }
        @keyframes tn-dot { 50% { transform: translateY(-3px); opacity: .45; } }

        /* Right panel */
        .tn-right-panel {
          min-height: 380px;
          position: relative;
        }
        @media (min-width: 900px) {
          .tn-right-panel { min-height: 440px; }
        }

        .tn-situations {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .tn-situations-label {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #2e4a5e;
          margin-bottom: 0.3rem;
        }
        .tn-situation-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          overflow-y: auto;
          max-height: 420px;
        }
        @media (min-width: 900px) {
          .tn-situation-list { max-height: 390px; }
        }
        .tn-situation-btn {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
          border: 1px solid rgba(130,158,201,.13);
          background: rgba(255,255,255,.025);
          color: #8aabca;
          font-size: 0.82rem;
          font-weight: 400;
          line-height: 1.45;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.14s, background 0.14s, color 0.14s;
          font-family: var(--font-sans);
          width: 100%;
        }
        .tn-situation-btn:hover {
          border-color: rgba(14,165,233,.38);
          background: rgba(14,165,233,.05);
          color: #cce8ff;
        }
        .tn-sit-quote {
          color: rgba(14,165,233,.4);
          font-size: 1rem;
          line-height: 1;
          margin-top: 0.05rem;
          flex-shrink: 0;
          font-style: normal;
        }

        /* Choice buttons */
        .tn-choices {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 0.5rem;
        }
        .tn-choice-btn {
          display: block;
          width: 100%;
          padding: 0.72rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(130,158,201,.22);
          background: rgba(255,255,255,.03);
          color: #a0c4e0;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.14s, background 0.14s, color 0.14s;
          font-family: var(--font-sans);
        }
        .tn-choice-btn:hover {
          border-color: rgba(14,165,233,.4);
          background: rgba(14,165,233,.07);
          color: #cce8ff;
        }
        .tn-choice-primary {
          border-color: rgba(14,165,233,.35);
          background: rgba(14,165,233,.07);
          color: #6ccfee;
        }
        .tn-choice-primary:hover {
          background: rgba(14,165,233,.14);
        }

        /* "Talk to NORA" CTA — stronger visual than tn-choice-primary */
        .tn-talk-btn {
          border-color: rgba(14,165,233,.55);
          background: rgba(14,165,233,.11);
          color: #7de0f8;
          font-weight: 600;
          text-align: center;
        }
        .tn-talk-btn:hover {
          border-color: rgba(14,165,233,.75);
          background: rgba(14,165,233,.19);
          color: #b3eeff;
        }

        /* WhatsApp offer button (disabled placeholder — Phase 3 will enable) */
        .tn-wa-btn {
          border-color: rgba(34,197,94,.28);
          background: rgba(34,197,94,.04);
          color: #4fd5a0;
          text-align: center;
          opacity: 0.55;
          cursor: default;
        }

        .tn-secondary-btn {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          color: #3a5570;
          font-size: 0.77rem;
          cursor: pointer;
          text-align: left;
          transition: color 0.14s;
          font-family: var(--font-sans);
        }
        .tn-secondary-btn:hover { color: #6a8aaa; }

        .tn-panel-state {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 0;
        }
        .tn-thinking-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(14,165,233,.4);
          animation: tn-dot 1s ease-in-out infinite;
          flex-shrink: 0;
        }

        .tn-check-line {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.6rem 0;
        }
        .tn-check {
          color: #22c55e;
          font-size: 1rem;
          line-height: 1;
        }

        /* Live mode input area */
        .tn-live-area {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding-top: 0.25rem;
        }
        .tn-live-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,.02);
          border: 1px solid rgba(130,158,201,.18);
          border-radius: 10px;
          color: #c4d5e8;
          font-family: var(--font-sans);
          font-size: 0.84rem;
          line-height: 1.6;
          padding: 0.75rem 0.9rem;
          resize: none;
          outline: none;
          transition: border-color 0.14s;
          min-height: 88px;
        }
        .tn-live-input::placeholder { color: #2e4a5e; }
        .tn-live-input:focus { border-color: rgba(14,165,233,.38); }
        .tn-live-input:disabled { opacity: 0.4; cursor: not-allowed; }
        .tn-live-send {
          display: block;
          width: 100%;
          padding: 0.72rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(14,165,233,.38);
          background: rgba(14,165,233,.08);
          color: #6ccfee;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: border-color 0.14s, background 0.14s, color 0.14s;
          font-family: var(--font-sans);
        }
        .tn-live-send:hover:not(:disabled) {
          background: rgba(14,165,233,.15);
          color: #aaddff;
        }
        .tn-live-send:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 640px) {
          .tn-situation-list { max-height: 340px; }
          .tn-bubble { font-size: 0.79rem; }
          .tn-situation-btn { font-size: 0.79rem; }
        }
      `}</style>
    </section>
  )
}
