'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

const content = {
  en: {
    eyebrow: 'NORA WAS ALREADY WORKING',
    headline: 'Before you woke up,\nNORA was already handling things.',
    sub: 'Asks. Confirms. Follows up. Stores evidence. Alerts you only when something actually needs your decision.',
    events: [
      { time: '5:44', cat: 'REGISTER', text: "Carlos hadn't sent last night's closing photo. I requested it.", type: 'follow' },
      { time: '6:12', cat: 'REGISTER', text: 'Photo received. Record marked verified.', type: 'ok' },
      { time: '6:18', cat: 'INVENTORY', text: 'Bath supply count below reorder threshold — flagged for morning briefing.', type: 'flag' },
      { time: '6:31', cat: 'MAINTENANCE', text: 'Room 7 AC follow-up confirmed resolved. Marcos sent photo evidence.', type: 'ok' },
      { time: '6:46', cat: 'TEAM', text: 'All shift confirmations received — full team scheduled for today.', type: 'ok' },
      { time: '7:00', cat: 'OWNER', text: 'Morning briefing sent. 1 inventory note. No decision required.', type: 'brief' },
    ],
    ownerMsg: "Everything is under control.\n1 item for your awareness — bath supplies below reorder level.",
    ownerLabel: 'The owner woke up to one message.',
  },
  es: {
    eyebrow: 'NORA YA ESTABA TRABAJANDO',
    headline: 'Antes de que usted despertara,\nNORA ya estaba gestionando.',
    sub: 'Pregunta. Confirma. Da seguimiento. Guarda evidencia. Solo lo alerta cuando algo realmente necesita su decisión.',
    events: [
      { time: '5:44', cat: 'CAJA', text: 'Carlos no había enviado la foto de cierre de anoche. La solicité.', type: 'follow' },
      { time: '6:12', cat: 'CAJA', text: 'Foto recibida. Registro marcado como verificado.', type: 'ok' },
      { time: '6:18', cat: 'INVENTARIO', text: 'Conteo de amenidades bajo el umbral de reorden — anotado para el resumen.', type: 'flag' },
      { time: '6:31', cat: 'MANTENIMIENTO', text: 'Seguimiento A/C Hab. 7 confirmado resuelto. Marcos envió foto de evidencia.', type: 'ok' },
      { time: '6:46', cat: 'PERSONAL', text: 'Todas las confirmaciones de turno recibidas — equipo completo programado para hoy.', type: 'ok' },
      { time: '7:00', cat: 'DUEÑO', text: 'Resumen matutino enviado. 1 nota de inventario. Sin decisión requerida.', type: 'brief' },
    ],
    ownerMsg: 'Todo está bajo control.\n1 elemento informativo — amenidades bajo el nivel de reorden.',
    ownerLabel: 'El dueño despertó con un solo mensaje.',
  },
}

const dot: Record<string, string> = {
  ok: '#22c55e', follow: '#f59e0b', flag: '#f59e0b', brief: '#14b8e6',
}
const border: Record<string, string> = {
  ok: 'rgba(34,197,94,.22)', follow: 'rgba(245,158,11,.25)', flag: 'rgba(245,158,11,.25)', brief: 'rgba(20,184,230,.25)',
}
const bg: Record<string, string> = {
  ok: 'rgba(34,197,94,.055)', follow: 'rgba(245,158,11,.055)', flag: 'rgba(245,158,11,.055)', brief: 'rgba(20,184,230,.065)',
}
const catColor: Record<string, string> = {
  ok: '#15803d', follow: '#b45309', flag: '#b45309', brief: '#0891b2',
}

export function NoraWorking({ lang }: { lang: Locale }) {
  const c = content[lang]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      id="how-nora-works"
      style={{ background: 'linear-gradient(170deg, #06101e 0%, #07121e 100%)', padding: '7rem 0', scrollMarginTop: 'var(--nav-h)', position: 'relative' }}
    >
      {/* Ambient background glow — alive but subtle */}
      <div aria-hidden="true" className="ambient-breathe" style={{
        position: 'absolute',
        width: 600, height: 400,
        top: -100, left: -150,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,.06), transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div className="container" ref={ref} style={{ position: 'relative' }}>
        {/* Header */}
        <motion.div
          style={{ maxWidth: 580, marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>{c.eyebrow}</div>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 3.5vw, 2.8rem)',
            fontWeight: 660,
            letterSpacing: '-0.032em',
            lineHeight: 1.15,
            color: '#f0f5ff',
            margin: '0 0 1rem',
            whiteSpace: 'pre-line',
          }}>
            {c.headline}
          </h2>
          <p style={{ color: '#7a90aa', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            {c.sub}
          </p>
        </motion.div>

        {/* Timeline panel */}
        <motion.div
          className="nw-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="nw-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="nw-live-dot" aria-hidden="true" />
              <span className="nw-panel-title">{lang === 'es' ? 'ACTIVIDAD DE NORA' : 'NORA ACTIVITY'}</span>
            </div>
            <span className="nw-panel-date">{lang === 'es' ? 'Antes del resumen de las 7:00 AM' : 'Before the 7:00 AM briefing'}</span>
          </div>

          <div className="nw-events">
            {c.events.map((ev, i) => (
              <motion.div
                key={i}
                className="nw-event"
                initial={{ opacity: 0, x: 8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.38, delay: 0.28 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <time className="nw-time">{ev.time}</time>
                <div
                  className="nw-dot"
                  aria-hidden="true"
                  style={{ background: dot[ev.type] }}
                />
                <div
                  className="nw-body"
                  style={{ borderLeft: `2px solid ${border[ev.type]}`, background: bg[ev.type] }}
                >
                  <span className="nw-cat" style={{ color: catColor[ev.type] }}>{ev.cat}</span>
                  <span className="nw-text">{ev.text}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Owner outcome */}
          <div className="nw-outcome">
            <div className="nw-owner-msg">{c.ownerMsg}</div>
            <div className="nw-owner-label">
              <span className="nw-check-icon">✓</span>
              {c.ownerLabel}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .nw-panel {
          background: #07101c;
          border-radius: 18px;
          border: 1px solid rgba(130,158,201,.14);
          overflow: hidden;
          box-shadow: 0 28px 80px rgba(0,0,0,.28);
          max-width: 820px;
        }
        .nw-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.85rem 1.2rem;
          border-bottom: 1px solid rgba(130,158,201,.1);
          background: rgba(255,255,255,.015);
        }
        .nw-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,.6);
          flex-shrink: 0;
        }
        .nw-panel-title {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6a7f99;
        }
        .nw-panel-date {
          font-size: 0.63rem;
          color: #3a5068;
          font-family: var(--font-mono);
          letter-spacing: 0.04em;
        }
        .nw-events {
          padding: 0.85rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .nw-event {
          display: grid;
          grid-template-columns: 38px 10px 1fr;
          gap: 0.65rem;
          align-items: start;
        }
        .nw-time {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: #3a5068;
          padding-top: 0.5rem;
          text-align: right;
        }
        .nw-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-top: 0.56rem;
          flex-shrink: 0;
        }
        .nw-body {
          padding: 0.42rem 0.72rem;
          border-radius: 0 8px 8px 0;
          display: flex;
          flex-direction: column;
          gap: 0.16rem;
        }
        .nw-cat {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .nw-text {
          font-size: 0.79rem;
          color: #8fa5be;
          line-height: 1.44;
        }
        .nw-outcome {
          border-top: 1px solid rgba(130,158,201,.08);
          padding: 1rem 1.2rem;
          background: rgba(0,0,0,.12);
        }
        .nw-owner-msg {
          font-size: 0.85rem;
          color: #c8d8eb;
          line-height: 1.6;
          white-space: pre-line;
          margin-bottom: 0.65rem;
          padding: 0.85rem 1rem;
          background: rgba(20,184,230,.05);
          border: 1px solid rgba(20,184,230,.14);
          border-radius: 10px;
        }
        .nw-owner-label {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          color: #46607a;
        }
        .nw-check-icon { color: #22c55e; font-weight: 700; }
        @media (max-width: 640px) {
          .nw-text { font-size: 0.74rem; }
        }
      `}</style>
    </section>
  )
}
