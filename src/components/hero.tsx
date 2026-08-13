'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, MessageCircle, ShieldCheck } from 'lucide-react'
import { NoraBrand } from '@/components/brand'
import type { Locale } from '@/lib/i18n'

const SESSION_KEY = 'nora-intro-seen'

const conv = {
  es: [
    { from: 'employee', sender: 'Daniel', time: '7:03 AM', text: 'Buenos días NORA, ya llegué.' },
    { from: 'nora', time: '7:03 AM', text: 'Buenos días, Daniel. Llegada registrada.\nHoy tiene 4 pendientes. Le envié la lista en orden de prioridad.' },
    { from: 'owner', sender: 'Dueño', time: '7:08 AM', text: '¿Llegó todo el equipo?' },
    { from: 'nora', time: '7:08 AM', text: 'Sí. Los 4 empleados programados ya están presentes.\nTodo el equipo está completo.' },
  ],
  en: [
    { from: 'employee', sender: 'Daniel', time: '7:03 AM', text: 'Good morning NORA, I just arrived.' },
    { from: 'nora', time: '7:03 AM', text: 'Good morning, Daniel. Arrival registered.\nYou have 4 tasks for today. I\'ve sent them in priority order.' },
    { from: 'owner', sender: 'Owner', time: '7:08 AM', text: 'Has everyone arrived?' },
    { from: 'nora', time: '7:08 AM', text: 'Yes. All 4 scheduled team members are present.\nEveryone is here.' },
  ],
}

export function Hero({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const messages = conv[lang]
  const [introVisible, setIntroVisible] = useState(false)
  const [skipIntro, setSkipIntro] = useState(true)
  const [visible, setVisible] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const already = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)
    if (!already) {
      setSkipIntro(false)
      setIntroVisible(true)
      sessionStorage.setItem(SESSION_KEY, '1')
      const t1 = setTimeout(() => setIntroVisible(false), 1500)
      const t2 = setTimeout(() => setSkipIntro(true), 2100)
      timersRef.current = [t1, t2]
    }
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const delays = [700, 2000, 3500, 5000]
    const ts = delays.map((d, i) => setTimeout(() => setVisible(i + 1), d))
    timersRef.current.push(...ts)
    return () => ts.forEach(clearTimeout)
  }, [])

  const copyDelay = skipIntro ? 0 : 1.4

  return (
    <>
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className="brand-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35 } }}
            exit={{ opacity: 0, transition: { duration: 0.55 } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }}
              className="brand-intro-inner"
            >
              <div className="brand-intro-name">NORA</div>
              <motion.div
                className="brand-intro-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.55 } }}
              >
                Networked&nbsp;·&nbsp;Operations&nbsp;·&nbsp;Response&nbsp;·&nbsp;Assistant
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero-premium" aria-label="NORA introduction">
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-gridlines" aria-hidden="true" />

        <div className="container hero-premium-grid">
          {/* ── Left: copy ── */}
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: copyDelay, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-brand-lockup">
              <NoraBrand priority />
            </div>

            <p className="eyebrow hero-eyebrow">
              {es ? 'SISTEMA OPERATIVO PARA NEGOCIOS' : 'BUSINESS OPERATING SYSTEM'}
            </p>

            <h1 className="hero-title-v3">
              {es ? 'Tu Negocio. Organizado.' : 'Business. Organized.'}
            </h1>

            <p className="hero-lede-v3">
              {es
                ? 'NORA pregunta, confirma, documenta y da seguimiento. Solo lo interrumpe cuando algo realmente necesita su decisión.'
                : 'NORA asks, confirms, documents, and follows up. It only interrupts you when something actually needs your decision.'}
            </p>

            <div className="hero-actions">
              <Link href={`/${lang}/#try-nora`} className="btn-primary-premium">
                {es ? 'PRUEBA NORA' : 'TRY NORA'}
                <ArrowRight size={15} />
              </Link>
              <Link href={`/${lang}/#how-nora-works`} className="btn-secondary-premium">
                {es ? 'Ver cómo trabaja' : 'See how she works'}
              </Link>
            </div>

            <div className="hero-trustline">
              <span><ShieldCheck size={13} /> {es ? 'Aislada por negocio' : 'Business-isolated'}</span>
              <span><MessageCircle size={13} /> WhatsApp-first</span>
              <span><Check size={13} /> {es ? 'Solo escala lo importante' : 'Escalates only what matters'}</span>
            </div>
          </motion.div>

          {/* ── Right: conversation panel ── */}
          <motion.div
            className="hero-conv-shell"
            initial={{ opacity: 0, x: 22, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: copyDelay + 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="hconv-header">
              <div className="hconv-identity">
                <Image src="/brand/nora-icon.png" alt="" width={30} height={30} />
                <div>
                  <b>NORA</b>
                  <span>{es ? 'Sistema Operativo' : 'Operating System'}</span>
                </div>
              </div>
              <span className="hconv-live"><i />{es ? 'ACTIVA' : 'LIVE'}</span>
            </div>

            {/* Date strip */}
            <div className="hconv-strip">
              <span className="hconv-date">{es ? 'HOY · MAÑANA' : 'TODAY · MORNING'}</span>
              <span className="hconv-team">
                <Check size={9} />
                {es ? '4 empleados programados' : '4 employees scheduled'}
              </span>
            </div>

            {/* Message thread */}
            <div className="hconv-body">
              {messages.map((msg, i) =>
                visible > i ? (
                  <motion.div
                    key={i}
                    className={`hconv-msg hconv-msg-${msg.from}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {msg.from !== 'nora' && (
                      <div className="hconv-sender">{msg.sender}</div>
                    )}
                    <div className="hconv-bubble">{msg.text}</div>
                    <div className="hconv-time">{msg.time}</div>
                  </motion.div>
                ) : null,
              )}

              {/* Typing indicator */}
              {[1, 3].includes(visible) && (
                <motion.div
                  key={`typing-${visible}`}
                  className="hconv-msg hconv-msg-nora"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="hconv-typing"><span /><span /><span /></div>
                </motion.div>
              )}
            </div>

            {/* Footer note */}
            {visible >= 4 && (
              <motion.div
                className="hconv-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Check size={11} />
                {es
                  ? 'El equipo está completo. Nada que verificar.'
                  : 'Team is complete. Nothing for you to check.'}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
