'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

const content = {
  en: {
    eyebrow: 'OPERATIONAL PEACE OF MIND',
    headline: 'NORA works in the gap between "should happen" and "did happen."',
    sub: 'Most operational problems start as something nobody confirmed, documented, or remembered to ask about again. NORA closes that gap automatically — before the owner wakes up.',
    states: [
      { label: 'Pending', sub: 'Assigned' },
      { label: 'Reported', sub: 'Employee says done' },
      { label: 'Verified', sub: 'Evidence confirmed' },
    ],
    stateNote: 'NORA holds every item open until it reaches Verified.',
    timelineTitle: 'NORA activity',
    timelineDate: 'Before the 7:00 AM briefing',
    events: [
      { time: '5:44', cat: 'REGISTER', text: 'Requested last night\'s closing photo from Carlos — not yet received', type: 'follow' },
      { time: '6:12', cat: 'REGISTER', text: 'Photo received. Record marked verified.', type: 'ok' },
      { time: '6:18', cat: 'INVENTORY', text: 'Bath supply count below reorder threshold — flagged for morning briefing', type: 'flag' },
      { time: '6:31', cat: 'MAINTENANCE', text: 'Room 7 AC follow-up confirmed resolved by Marcos', type: 'ok' },
      { time: '6:46', cat: 'STAFF', text: 'All shift confirmations received — full team present', type: 'ok' },
      { time: '7:00', cat: 'OWNER', text: 'Morning briefing sent. 1 item for awareness. No decision required.', type: 'brief' },
    ],
    ownerNote: 'The owner woke up to one message.',
  },
  es: {
    eyebrow: 'PAZ MENTAL OPERATIVA',
    headline: 'NORA trabaja en el espacio entre "debería pasar" y "sí pasó".',
    sub: 'La mayoría de los problemas operativos empiezan como algo que nadie confirmó, documentó o recordó preguntar de nuevo. NORA cierra ese espacio automáticamente — antes de que el dueño despierte.',
    states: [
      { label: 'Pendiente', sub: 'Asignado' },
      { label: 'Reportado', sub: 'Empleado dice listo' },
      { label: 'Verificado', sub: 'Evidencia confirmada' },
    ],
    stateNote: 'NORA mantiene cada asunto abierto hasta llegar a Verificado.',
    timelineTitle: 'Actividad de NORA',
    timelineDate: 'Antes del resumen de las 7:00 AM',
    events: [
      { time: '5:44', cat: 'CAJA', text: 'Solicité a Carlos la foto de cierre de anoche — no había sido enviada', type: 'follow' },
      { time: '6:12', cat: 'CAJA', text: 'Foto recibida. Registro marcado como verificado.', type: 'ok' },
      { time: '6:18', cat: 'INVENTARIO', text: 'Conteo de amenidades bajo el umbral de reorden — anotado para resumen', type: 'flag' },
      { time: '6:31', cat: 'MANTENIMIENTO', text: 'Seguimiento del A/C Hab. 7 confirmado resuelto por Marcos', type: 'ok' },
      { time: '6:46', cat: 'PERSONAL', text: 'Todas las confirmaciones de turno recibidas — equipo completo presente', type: 'ok' },
      { time: '7:00', cat: 'DUEÑO', text: 'Resumen enviado. 1 elemento informativo. Sin decisión requerida.', type: 'brief' },
    ],
    ownerNote: 'El dueño despertó con un solo mensaje.',
  },
}

const typeStyles: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  ok:     { dot: '#22c55e', bg: 'rgba(34,197,94,.07)',    border: 'rgba(34,197,94,.18)',   text: '#16a34a' },
  follow: { dot: '#f59e0b', bg: 'rgba(245,158,11,.07)',   border: 'rgba(245,158,11,.20)',  text: '#d97706' },
  flag:   { dot: '#f59e0b', bg: 'rgba(245,158,11,.07)',   border: 'rgba(245,158,11,.20)',  text: '#d97706' },
  brief:  { dot: '#14b8e6', bg: 'rgba(20,184,230,.07)',   border: 'rgba(20,184,230,.22)',  text: '#0891b2' },
}

export function PeaceOfMind({ lang }: { lang: Locale }) {
  const c = content[lang]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const evRef = useRef<HTMLDivElement>(null)
  const evInView = useInView(evRef, { once: true, margin: '-60px 0px' })

  return (
    <section id="how-nora-works" style={{ background: 'var(--ls-bg)', padding: '7rem 0', scrollMarginTop: 'var(--nav-h)' }}>
      <div className="container">
        <div className="pom-grid" ref={ref}>

          {/* Left — editorial copy + state machine */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="pom-copy"
          >
            <div className="eyebrow-light" style={{ marginBottom: '1rem' }}>{c.eyebrow}</div>
            <h2 style={{
              fontSize: 'clamp(1.95rem, 3.8vw, 3.1rem)',
              fontWeight: 700,
              letterSpacing: '-0.033em',
              lineHeight: 1.1,
              color: 'var(--ls-fg)',
              marginBottom: '1.1rem',
            }}>
              {c.headline}
            </h2>
            <p style={{ color: 'var(--ls-muted)', fontSize: '1rem', lineHeight: 1.72, margin: '0 0 2.5rem', maxWidth: '52ch' }}>
              {c.sub}
            </p>

            {/* State machine visual */}
            <div className="pom-states">
              {c.states.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="pom-state"
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.12 }}
                >
                  <div className="pom-state-inner">
                    <div className="pom-state-dot" style={{
                      background: i === 2 ? '#22c55e' : i === 1 ? '#f59e0b' : 'var(--ls-subtle)',
                    }} />
                    <div className="pom-state-label">{s.label}</div>
                    <div className="pom-state-sub">{s.sub}</div>
                  </div>
                  {i < c.states.length - 1 && (
                    <motion.div
                      className="pom-state-arrow"
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.12, ease: 'easeOut' }}
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--ls-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
              {c.stateNote}
            </p>
          </motion.div>

          {/* Right — NORA morning timeline (dark panel) */}
          <motion.div
            ref={evRef}
            initial={{ opacity: 0, x: 22 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="pom-panel"
          >
            <div className="pom-panel-header">
              <div className="pom-panel-title">
                <span className="pom-live-dot" aria-hidden="true" />
                {c.timelineTitle}
              </div>
              <span className="pom-panel-date">{c.timelineDate}</span>
            </div>

            <div className="pom-events">
              {c.events.map((ev, i) => {
                const s = typeStyles[ev.type] ?? typeStyles.ok
                return (
                  <motion.div
                    key={i}
                    className="pom-event"
                    initial={{ opacity: 0, x: 10 }}
                    animate={evInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.38, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <time className="pom-event-time">{ev.time}</time>
                    <div
                      className="pom-event-dot"
                      style={{ background: s.dot }}
                      aria-hidden="true"
                    />
                    <div className="pom-event-body" style={{ borderLeft: `2px solid ${s.border}`, background: s.bg }}>
                      <span className="pom-event-cat" style={{ color: s.text }}>{ev.cat}</span>
                      <span className="pom-event-text">{ev.text}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="pom-panel-footer">
              <span className="pom-check-icon" aria-hidden="true">✓</span>
              {c.ownerNote}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .pom-grid {
          display: grid;
          gap: 4rem;
          align-items: start;
        }
        @media (min-width: 960px) {
          .pom-grid { grid-template-columns: 1fr 1fr; }
        }

        .pom-copy { max-width: 560px; }

        .pom-states {
          display: flex;
          gap: 0;
          align-items: stretch;
        }
        .pom-state {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }
        .pom-state-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1rem 0.75rem;
          background: var(--ls-surface);
          border: 1px solid var(--ls-border);
          border-radius: var(--r);
          flex: 1;
          min-width: 0;
        }
        .pom-state-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          margin-bottom: 0.55rem;
          flex-shrink: 0;
        }
        .pom-state-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--ls-fg);
          letter-spacing: -0.01em;
          margin-bottom: 0.2rem;
        }
        .pom-state-sub {
          font-size: 0.7rem;
          color: var(--ls-muted);
          line-height: 1.3;
        }
        .pom-state-arrow {
          width: 28px;
          flex-shrink: 0;
          height: 1.5px;
          background: var(--ls-border);
          transform-origin: left;
        }

        /* Dark panel */
        .pom-panel {
          background: #050c18;
          border-radius: 18px;
          border: 1px solid rgba(130,158,201,.16);
          overflow: hidden;
          box-shadow: 0 24px 72px rgba(0,0,0,.22);
        }
        .pom-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.1rem;
          border-bottom: 1px solid rgba(130,158,201,.12);
          background: rgba(255,255,255,.018);
        }
        .pom-panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7a90ad;
        }
        .pom-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,.6);
          flex-shrink: 0;
        }
        .pom-panel-date {
          font-size: 0.67rem;
          color: #3d5067;
          font-family: var(--font-mono);
          letter-spacing: 0.04em;
        }

        .pom-events {
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .pom-event {
          display: grid;
          grid-template-columns: 38px 10px 1fr;
          gap: 0.6rem;
          align-items: start;
        }
        .pom-event-time {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: #3d5067;
          padding-top: 0.52rem;
          text-align: right;
        }
        .pom-event-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-top: 0.58rem;
          flex-shrink: 0;
        }
        .pom-event-body {
          padding: 0.45rem 0.7rem;
          border-radius: 0 8px 8px 0;
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
        }
        .pom-event-cat {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .pom-event-text {
          font-size: 0.78rem;
          color: #8fa5be;
          line-height: 1.45;
        }

        .pom-panel-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.1rem;
          border-top: 1px solid rgba(130,158,201,.08);
          font-size: 0.75rem;
          color: #4a6278;
          background: rgba(0,0,0,.15);
        }
        .pom-check-icon {
          color: #22c55e;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .pom-states { flex-direction: column; }
          .pom-state { flex-direction: column; }
          .pom-state-arrow { width: 1.5px; height: 18px; margin: 0 auto; transform-origin: top; }
          .pom-state-inner { width: 100%; }
        }
      `}</style>
    </section>
  )
}
