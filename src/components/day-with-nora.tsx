'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

const content = {
  en: {
    eyebrow: "A DAY IN NORA'S MEMORY",
    headline: 'What NORA remembers.',
    sub: 'Every event in your business connects to the next. By the time the morning briefing arrives, NORA has been building the picture all day.',
    events: [
      {
        time: '7:02 AM',
        cat: 'TEAM',
        title: 'Daniel arrives',
        detail: 'Arrival registered. 4 tasks assigned. Priority order sent.',
        type: 'ok',
      },
      {
        time: '10:14 AM',
        cat: 'EXPENSE',
        title: 'Receipt from Marcos — $84.50',
        detail: 'AC filters purchased. Vendor recorded. Expense categorized. Inventory updated.',
        type: 'ok',
        link: true,
      },
      {
        time: '10:31 AM',
        cat: 'MAINTENANCE',
        title: 'Room 3 AC — completed',
        detail: 'Completion photo received. Work order closed. Verified.',
        type: 'ok',
      },
      {
        time: '2:36 PM',
        cat: 'INVENTORY',
        title: 'AC filters at 5 units — below minimum',
        detail: 'Minimum is 6. Linked to the morning purchase. Flagged for briefing.',
        type: 'warn',
      },
      {
        time: '5:48 PM',
        cat: 'REGISTER',
        title: "María hasn't sent register close",
        detail: 'NORA follows up. Reminder sent.',
        type: 'follow',
      },
      {
        time: '6:12 PM',
        cat: 'REGISTER',
        title: 'Closing evidence received',
        detail: 'Photo on file. Variance detected: -$12.00. Flagged for owner decision.',
        type: 'warn',
      },
    ],
    briefingLabel: 'NEXT MORNING · 7:00 AM',
    briefingTitle: 'Owner briefing',
    briefingBody: "Good morning.\n\nYesterday: 17 of 18 tasks completed.\n\nFor your attention:\n• $12 discrepancy — register close · María · last night\n• AC filters at 5 units (minimum 6) — suggest reorder\n\nCompleted without issues:\n✅ Team: 4/4 present\n✅ Room 3 AC — verified complete\n✅ Expense: $84.50 — receipt on file\n\nNothing else requires your attention.",
    continuityNote: 'The $84.50 receipt, the inventory flag, and the $12 discrepancy — all events you saw above, now in your morning briefing.',
  },
  es: {
    eyebrow: 'UN DÍA EN LA MEMORIA DE NORA',
    headline: 'Lo que NORA recuerda.',
    sub: 'Cada evento en su negocio se conecta con el siguiente. Cuando llega el resumen matutino, NORA lleva todo el día construyendo la imagen.',
    events: [
      {
        time: '7:02 AM',
        cat: 'PERSONAL',
        title: 'Daniel llega',
        detail: 'Llegada registrada. 4 tareas asignadas. Lista enviada en orden de prioridad.',
        type: 'ok',
      },
      {
        time: '10:14 AM',
        cat: 'GASTO',
        title: 'Recibo de Marcos — $84.50',
        detail: 'Filtros A/C comprados. Proveedor registrado. Gasto categorizado. Inventario actualizado.',
        type: 'ok',
        link: true,
      },
      {
        time: '10:31 AM',
        cat: 'MANTENIMIENTO',
        title: 'A/C Habitación 3 — completado',
        detail: 'Foto de finalización recibida. Orden de trabajo cerrada. Verificado.',
        type: 'ok',
      },
      {
        time: '2:36 PM',
        cat: 'INVENTARIO',
        title: 'Filtros A/C en 5 unidades — bajo mínimo',
        detail: 'Mínimo configurado: 6. Vinculado a la compra de esta mañana. Anotado para el resumen.',
        type: 'warn',
      },
      {
        time: '5:48 PM',
        cat: 'CAJA',
        title: 'María no ha enviado el cierre de caja',
        detail: 'NORA da seguimiento. Recordatorio enviado.',
        type: 'follow',
      },
      {
        time: '6:12 PM',
        cat: 'CAJA',
        title: 'Evidencia de cierre recibida',
        detail: 'Foto archivada. Diferencia detectada: -$12.00. Marcado para decisión del dueño.',
        type: 'warn',
      },
    ],
    briefingLabel: 'PRÓXIMA MAÑANA · 7:00 AM',
    briefingTitle: 'Resumen del dueño',
    briefingBody: 'Buenos días.\n\nAyer: 17 de 18 pendientes completados.\n\nPara su atención:\n• Diferencia de $12 — cierre de caja · María · anoche\n• Filtros A/C en 5 unidades (mínimo 6) — sugerido reordenar\n\nCompletado sin inconvenientes:\n✅ Equipo: 4/4 presentes\n✅ A/C Hab. 3 — verificado completo\n✅ Gasto: $84.50 — recibo archivado\n\nNo hay nada más que requiera su atención.',
    continuityNote: 'El recibo de $84.50, la alerta de inventario y la diferencia de $12 — todos los eventos que vio arriba, ahora en su resumen matutino.',
  },
}

const colors = {
  ok:     { dot: '#22c55e', line: 'rgba(34,197,94,.22)',    bg: 'rgba(34,197,94,.06)',   cat: '#15803d' },
  warn:   { dot: '#f59e0b', line: 'rgba(245,158,11,.28)',   bg: 'rgba(245,158,11,.06)',  cat: '#b45309' },
  follow: { dot: '#f59e0b', line: 'rgba(245,158,11,.22)',   bg: 'rgba(245,158,11,.05)',  cat: '#b45309' },
}

export function DayWithNora({ lang }: { lang: Locale }) {
  const c = content[lang]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const briefRef = useRef<HTMLDivElement>(null)
  const briefInView = useInView(briefRef, { once: true, margin: '-60px 0px' })

  return (
    <section style={{ background: 'linear-gradient(170deg, #081628 0%, #0a1c38 100%)', padding: '7rem 0' }}>
      <div className="container" ref={ref}>
        {/* Day summary stats — scan-friendly at a glance */}
        <motion.div
          className="dwn-stat-strip"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          {[
            { cls: 'dwn-stat-ok',   text: lang === 'es' ? '4/4 EQUIPO PRESENTE' : '4/4 TEAM PRESENT' },
            { cls: 'dwn-stat-ok',   text: lang === 'es' ? '17/18 TAREAS COMPLETAS' : '17/18 TASKS DONE' },
            { cls: 'dwn-stat-info', text: lang === 'es' ? '$84.50 GASTO' : '$84.50 EXPENSE' },
            { cls: 'dwn-stat-flag', text: lang === 'es' ? '$12 DISCREPANCIA' : '$12 DISCREPANCY' },
          ].map((s, i) => (
            <div key={i} className={`dwn-stat ${s.cls}`}>
              <span className="dwn-stat-dot" aria-hidden="true" />
              {s.text}
            </div>
          ))}
        </motion.div>

        <motion.div
          style={{ maxWidth: 560, marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow" style={{ marginBottom: '0.85rem' }}>{c.eyebrow}</div>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 3.5vw, 2.8rem)',
            fontWeight: 660,
            letterSpacing: '-0.032em',
            lineHeight: 1.15,
            color: '#f0f5ff',
            margin: '0 0 0.85rem',
          }}>
            {c.headline}
          </h2>
          <p style={{ color: '#7a90aa', fontSize: '1rem', lineHeight: 1.7, margin: 0, maxWidth: '50ch' }}>
            {c.sub}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="dwn-timeline">
          {c.events.map((ev, i) => {
            const col = colors[ev.type as keyof typeof colors] ?? colors.ok
            return (
              <motion.div
                key={i}
                className="dwn-event"
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Timeline line */}
                <div className="dwn-line-col">
                  <div className="dwn-dot" style={{ background: col.dot, boxShadow: `0 0 10px ${col.dot}55` }} />
                  {i < c.events.length - 1 && <div className="dwn-connector" />}
                </div>

                {/* Event content */}
                <div
                  className="dwn-card"
                  style={{
                    borderLeft: `2px solid ${col.line}`,
                    background: col.bg,
                    borderRadius: 'var(--r)',
                  }}
                >
                  <div className="dwn-card-top">
                    <time className="dwn-time">{ev.time}</time>
                    <span className="dwn-cat" style={{ color: col.cat }}>{ev.cat}</span>
                    {(ev as { link?: boolean }).link && (
                      <span className="dwn-link-tag">↓ {lang === 'es' ? 'ver detalle' : 'see detail'}</span>
                    )}
                  </div>
                  <div className="dwn-title">{ev.title}</div>
                  <div className="dwn-detail">{ev.detail}</div>
                </div>
              </motion.div>
            )
          })}

          {/* Briefing outcome */}
          <div ref={briefRef}>
            <motion.div
              className="dwn-event"
              initial={{ opacity: 0, x: -12 }}
              animate={briefInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="dwn-line-col">
                <div className="dwn-dot dwn-dot-brief" />
              </div>
              <div className="dwn-briefing">
                <div className="dwn-briefing-header">
                  <span className="dwn-briefing-label">{c.briefingLabel}</span>
                  <span className="dwn-briefing-title">{c.briefingTitle}</span>
                </div>
                <div className="dwn-briefing-body">{c.briefingBody}</div>
                <div className="dwn-continuity-note">{c.continuityNote}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .dwn-timeline {
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .dwn-event {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 1rem;
          align-items: start;
        }
        .dwn-line-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 0.35rem;
        }
        .dwn-dot {
          width: 11px; height: 11px;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .dwn-dot-brief {
          background: #14b8e6;
          box-shadow: 0 0 12px rgba(20,184,230,.5);
          width: 13px; height: 13px;
        }
        .dwn-connector {
          width: 1px;
          flex: 1;
          min-height: 28px;
          background: rgba(130,158,201,.14);
          margin: 4px 0;
        }
        .dwn-card {
          margin-bottom: 0.75rem;
          padding: 0.65rem 0.9rem;
        }
        .dwn-card-top {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.25rem;
        }
        .dwn-time {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: #3a5068;
          letter-spacing: 0.04em;
        }
        .dwn-cat {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .dwn-link-tag {
          font-size: 0.56rem;
          font-weight: 600;
          color: #14b8e6;
          letter-spacing: 0.04em;
          margin-left: auto;
        }
        .dwn-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #d0dff0;
          letter-spacing: -0.012em;
          margin-bottom: 0.2rem;
        }
        .dwn-detail {
          font-size: 0.78rem;
          color: #6a8099;
          line-height: 1.45;
        }

        /* Morning briefing */
        .dwn-briefing {
          margin-bottom: 0.75rem;
          border-radius: var(--r-lg);
          overflow: hidden;
          border: 1px solid rgba(20,184,230,.22);
          background: rgba(20,184,230,.04);
        }
        .dwn-briefing-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1rem;
          border-bottom: 1px solid rgba(20,184,230,.14);
          background: rgba(20,184,230,.06);
        }
        .dwn-briefing-label {
          font-family: var(--font-mono);
          font-size: 0.57rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #0891b2;
        }
        .dwn-briefing-title {
          font-size: 0.7rem;
          font-weight: 600;
          color: #5bd4f3;
          letter-spacing: 0.03em;
        }
        .dwn-briefing-body {
          padding: 0.85rem 1rem;
          font-size: 0.79rem;
          color: #a8bfd4;
          line-height: 1.65;
          white-space: pre-line;
        }
        .dwn-continuity-note {
          padding: 0.6rem 1rem;
          font-size: 0.72rem;
          color: #3a5568;
          border-top: 1px solid rgba(130,158,201,.08);
          font-style: italic;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .dwn-briefing-body { font-size: 0.74rem; }
        }
      `}</style>
    </section>
  )
}
