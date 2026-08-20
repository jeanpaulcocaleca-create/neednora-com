'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Check, MessageCircle, ShieldCheck } from 'lucide-react'
import { NoraBrand } from '@/components/brand'
import type { Locale } from '@/lib/i18n'

const ownerBrief = {
  en: {
    hello: 'Good morning, Jean Paul.',
    body: 'Everything scheduled yesterday was completed. I followed up on two missing reports and received both. There is nothing requiring your attention this morning.',
    note: 'If you want any report or detail, just ask me.',
    status: 'Everything under control',
  },
  es: {
    hello: 'Buenos días, Jean Paul.',
    body: 'Todo lo programado ayer fue completado. Di seguimiento a dos reportes faltantes y ya recibí ambos. No hay nada que requiera su atención esta mañana.',
    note: 'Si quiere algún reporte o detalle, solo dígame.',
    status: 'Todo bajo control',
  },
}

const backgroundEvents = {
  en: [
    ['REGISTER', 'Closing photo received · verified', '06:12'],
    ['INVENTORY', 'Low stock flagged · housekeeping', '06:18'],
    ['MAINTENANCE', 'Follow-up completed · Room 7 AC', '06:31'],
    ['STAFF', 'Yesterday responsibilities confirmed', '06:46'],
  ],
  es: [
    ['CAJA', 'Foto de cierre recibida · verificada', '06:12'],
    ['INVENTARIO', 'Stock bajo detectado · limpieza', '06:18'],
    ['MANTENIMIENTO', 'Seguimiento completado · A/C Hab. 7', '06:31'],
    ['PERSONAL', 'Responsabilidades de ayer confirmadas', '06:46'],
  ],
}

export function Hero({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const brief = ownerBrief[lang]
  const events = backgroundEvents[lang]

  return (
    <section className="hero-premium" aria-label="NORA introduction">
      <div className="hero-aurora" aria-hidden="true" />
      <div className="hero-gridlines" aria-hidden="true" />

      <div className="container hero-premium-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-brand-lockup">
            <NoraBrand priority />
          </div>

          <div className="eyebrow hero-eyebrow">
            {es ? 'EL SISTEMA OPERATIVO QUE NO SE OLVIDA' : 'THE OPERATING SYSTEM THAT DOESN’T FORGET'}
          </div>

          <h1 className="hero-title">
            {es ? (
              <>Su negocio no debería depender de que <span>usted recuerde todo.</span></>
            ) : (
              <>Your business shouldn’t depend on <span>you remembering everything.</span></>
            )}
          </h1>

          <p className="hero-lede">
            {es
              ? 'NORA pregunta, da seguimiento, verifica, documenta y mantiene a su equipo en movimiento. Usted entra cuando realmente hace falta.'
              : 'NORA asks, follows up, verifies, documents, and keeps your team moving. You step in only when you’re actually needed.'}
          </p>

          <div className="hero-actions">
            <Link href={`/${lang}/#try-nora`} className="btn-primary-premium">
              {es ? 'PRUEBA NORA' : 'TRY NORA'}
              <ArrowRight size={17} />
            </Link>
            <Link href={`/${lang}/#how-nora-works`} className="btn-secondary-premium">
              {es ? 'Ver cómo trabaja' : 'See how she works'}
            </Link>
          </div>

          <div className="hero-trustline">
            <span><ShieldCheck size={15} /> {es ? 'Aislada por negocio' : 'Business-isolated'}</span>
            <span><MessageCircle size={15} /> WhatsApp-first</span>
            <span><Check size={15} /> {es ? 'Solo escala lo importante' : 'Escalates only what matters'}</span>
          </div>
        </motion.div>

        <motion.div
          className="owner-brief-shell"
          initial={{ opacity: 0, x: 26, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="owner-brief-topbar">
            <div className="owner-brief-identity">
              <img src="/brand/nora-icon.png" alt="" className="owner-brief-icon" />
              <div>
                <strong>NORA</strong>
                <span>{es ? 'Operations OS' : 'Operations OS'}</span>
              </div>
            </div>
            <span className="live-pill"><i /> {es ? 'ACTIVA' : 'LIVE'}</span>
          </div>

          <div className="owner-message-card">
            <div className="message-meta">07:00 AM · {es ? 'RESUMEN DEL DUEÑO' : 'OWNER BRIEFING'}</div>
            <h2>{brief.hello}</h2>
            <p>{brief.body}</p>
            <p className="owner-message-note">{brief.note}</p>
            <div className="all-clear"><Check size={15} /> {brief.status}</div>
          </div>

          <div className="behind-scenes-label">{es ? 'LO QUE NORA YA HIZO ANTES DE ESCRIBIRLE' : 'WHAT NORA ALREADY DID BEFORE MESSAGING YOU'}</div>
          <div className="event-stack">
            {events.map(([label, detail, time], index) => (
              <motion.div
                className="event-row"
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.11 }}
              >
                <span className="event-check"><Check size={12} /></span>
                <div className="event-copy"><b>{label}</b><span>{detail}</span></div>
                <time>{time}</time>
              </motion.div>
            ))}
          </div>

          <div className="owner-brief-footer">
            <span>{es ? '4 rutinas verificadas' : '4 routines verified'}</span>
            <span>{es ? '0 decisiones pendientes' : '0 decisions pending'}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
