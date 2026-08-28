'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'

type Step = 'name' | 'business' | 'team' | 'reach' | 'note' | 'done'

interface Lead {
  name?: string
  business?: string
  team?: string
  whatsapp?: string
  email?: string
  note?: string
  page?: string
}

interface Bub { text: string; side: 'in' | 'out' }

const WA_NUMBER = '+14703524993'
const WA_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, '')}`

const I18N = {
  en: {
    q_name: "Hi. I'm NORA. What's your name?",
    ph_name: 'Your name',
    q_business: "Nice to meet you, {name}. What’s your business called, and what does it do?",
    ph_business: 'Business name and what it does',
    q_team: 'How big is the team?',
    q_reach: 'Where can I reach you?',
    ph_whatsapp: 'WhatsApp number',
    ph_email: 'Email',
    q_note: 'Anything you want me to know before we talk?',
    ph_note: 'Optional',
    success: "Done. I'll be in touch shortly. If you'd rather not wait:",
    wa_label: 'Continue in WhatsApp',
    chips: ['Just me', '2 to 10', '11 to 50', 'More than 50'],
    chip_vals: ['solo', '2-10', '11-50', '50+'],
    status: 'usually replies in minutes',
    close: 'Close',
  },
  es: {
    q_name: 'Hola. Soy NORA. ¿Cómo te llamas?',
    ph_name: 'Tu nombre',
    q_business: 'Mucho gusto, {name}. ¿Cómo se llama tu negocio y qué hace?',
    ph_business: 'Nombre del negocio y qué hace',
    q_team: '¿De qué tamaño es el equipo?',
    q_reach: '¿Dónde puedo encontrarte?',
    ph_whatsapp: 'Número de WhatsApp',
    ph_email: 'Correo electrónico',
    q_note: '¿Hay algo que deba saber antes de hablar?',
    ph_note: 'Opcional',
    success: 'Listo. Me pondré en contacto pronto. Si prefieres no esperar:',
    wa_label: 'Continuar en WhatsApp',
    chips: ['Solo yo', '2 a 10', '11 a 50', 'Más de 50'],
    chip_vals: ['solo', '2-10', '11-50', '50+'],
    status: 'usualmente responde en minutos',
    close: 'Cerrar',
  },
}

interface TalkToNoraProps {
  lang: Locale
  isOpen: boolean
  onClose: () => void
  autoOpen?: boolean
}

export function TalkToNora({ lang, isOpen, onClose, autoOpen }: TalkToNoraProps) {
  const es = lang === 'es'
  const t = es ? I18N.es : I18N.en
  const [step, setStep] = useState<Step>('name')
  const [lead, setLead] = useState<Lead>({})
  const [bubbles, setBubbles] = useState<Bub[]>([])
  const [inputMode, setInputMode] = useState<'text' | 'two' | 'chips' | 'done'>('text')
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [typing, setTyping] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [originX, setOriginX] = useState<number | undefined>()
  const [originY, setOriginY] = useState<number | undefined>()
  const bodyRef = useRef<HTMLDivElement>(null)
  const input1Ref = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('contact-open')
    } else {
      document.body.classList.remove('contact-open')
    }
    return () => document.body.classList.remove('contact-open')
  }, [isOpen])

  // Open via keyboard hash
  useEffect(() => {
    if (autoOpen && !initialized) {
      // triggered by /demo page
    }
  }, [autoOpen, initialized])

  function scrollBody() {
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }, 50)
  }

  function noraSays(text: string, cb?: () => void) {
    if (prefersReduced.current) {
      setBubbles(b => [...b, { text, side: 'in' }])
      scrollBody()
      cb?.()
      return
    }
    setTyping(true)
    scrollBody()
    setTimeout(() => {
      setTyping(false)
      setBubbles(b => [...b, { text, side: 'in' }])
      scrollBody()
      cb?.()
    }, 650)
  }

  function userSays(text: string) {
    setBubbles(b => [...b, { text, side: 'out' }])
    scrollBody()
  }

  function focusInput1(after = 350) {
    setTimeout(() => input1Ref.current?.focus(), after)
  }

  function startConversation() {
    if (initialized) return
    setInitialized(true)
    setLead({ page: window.location.pathname })
    const delay = prefersReduced.current ? 0 : 500
    setTimeout(() => {
      noraSays(t.q_name, () => {
        setInputMode('text')
        focusInput1()
      })
    }, delay)
  }

  useEffect(() => {
    if (isOpen && !initialized) startConversation()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  function askStep(s: Step) {
    setStep(s)
    if (s === 'name') {
      noraSays(t.q_name, () => { setInputMode('text'); focusInput1() })
    } else if (s === 'business') {
      noraSays(t.q_business.replace('{name}', lead.name ?? ''), () => {
        setInputMode('text'); focusInput1()
      })
    } else if (s === 'team') {
      noraSays(t.q_team, () => { setInputMode('chips') })
    } else if (s === 'reach') {
      noraSays(t.q_reach, () => {
        setInputMode('two'); focusInput1()
      })
    } else if (s === 'note') {
      noraSays(t.q_note, () => { setInputMode('text'); focusInput1() })
    }
  }

  async function finish(finalLead: Lead) {
    setInputMode('done')
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', ...finalLead }),
      })
    } catch { /* best-effort */ }
    noraSays(t.success)
  }

  function submitCurrent() {
    const v1 = input1.trim()
    if (step === 'name') {
      if (!v1) { input1Ref.current?.focus(); return }
      const updated = { ...lead, name: v1 }
      setLead(updated)
      userSays(v1)
      setInput1('')
      askStep('business')
    } else if (step === 'business') {
      if (!v1) { input1Ref.current?.focus(); return }
      const updated = { ...lead, business: v1 }
      setLead(updated)
      userSays(v1)
      setInput1('')
      askStep('team')
    } else if (step === 'reach') {
      const em = input2.trim()
      const emOk = /.+@.+\..+/.test(em)
      if (!v1 && !emOk) { input1Ref.current?.focus(); return }
      const updated = { ...lead, whatsapp: v1 || undefined, email: em || undefined }
      setLead(updated)
      userSays([v1, em].filter(Boolean).join(' · '))
      setInput1(''); setInput2('')
      askStep('note')
    } else if (step === 'note') {
      const updated = { ...lead, note: v1 || undefined }
      if (v1) userSays(v1)
      setInput1('')
      void finish(updated)
    }
  }

  function handleChip(val: string, label: string) {
    if (step !== 'team') return
    const updated = { ...lead, team: val }
    setLead(updated)
    userSays(label)
    askStep('reach')
  }

  function handleClose() {
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && inputMode !== 'two') {
      e.preventDefault()
      submitCurrent()
    }
  }

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  return (
    <>
      {/* Wave ripple on open */}
      {originX !== undefined && (
        <div
          className="cwave go"
          style={{ left: originX, top: originY }}
          aria-hidden="true"
        />
      )}

      <div
        className="contact open"
        id="contact"
        role="dialog"
        aria-label={es ? 'Hablar con NORA' : 'Talk to NORA'}
        onClick={e => { if (e.target === e.currentTarget) handleClose() }}
      >
        <div className="contact-panel" ref={panelRef}>
          <span className="sheet-handle" aria-hidden="true" />
          <div className="contact-head">
            <span className="phone-avatar" aria-hidden="true">N</span>
            <div>
              <p className="phone-name">NORA</p>
              <p className="phone-status">{t.status}</p>
            </div>
            <button className="contact-close" aria-label={t.close} onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>

          <div className="contact-body" aria-live="polite" ref={bodyRef}>
            {bubbles.map((b, i) => (
              <div key={i} className={`bub ${b.side} enter`}>{b.text}</div>
            ))}
            {typing && (
              <div className="typing on" style={{ alignSelf: 'flex-start', borderRadius: '14px 14px 14px 4px', background: 'var(--wa-in)' }}>
                <i /><i /><i />
              </div>
            )}
            {inputMode === 'done' && (
              <a
                className="cf-wa"
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ alignSelf: 'flex-start' }}
              >
                {t.wa_label}
              </a>
            )}
          </div>

          <form
            className="contact-form"
            noValidate
            onSubmit={e => { e.preventDefault(); submitCurrent() }}
          >
            <div className="cf-chips" style={{ display: inputMode === 'chips' ? 'flex' : 'none' }}>
              {t.chips.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  className="cf-chip"
                  onClick={() => handleChip(t.chip_vals[i], label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              className="cf-input cf-input2"
              style={{ display: inputMode === 'two' ? 'block' : 'none' }}
              type="email"
              autoComplete="email"
              aria-label={es ? 'Correo electrónico' : 'Email'}
              placeholder={t.ph_email}
              value={input2}
              onChange={e => setInput2(e.target.value)}
            />

            <div className="row" style={{ display: inputMode === 'chips' || inputMode === 'done' ? 'none' : 'flex' }}>
              <input
                ref={input1Ref}
                className="cf-input"
                type={step === 'reach' ? 'tel' : 'text'}
                autoComplete={step === 'reach' ? 'tel' : step === 'name' ? 'name' : 'off'}
                aria-label={es ? 'Tu respuesta' : 'Your answer'}
                placeholder={
                  step === 'name' ? t.ph_name :
                  step === 'business' ? t.ph_business :
                  step === 'reach' ? t.ph_whatsapp :
                  step === 'note' ? t.ph_note : ''
                }
                value={input1}
                onChange={e => setInput1(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="cf-send" type="submit">
                {es ? 'Enviar' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
