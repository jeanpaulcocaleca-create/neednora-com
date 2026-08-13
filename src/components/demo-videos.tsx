'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

const content = {
  en: {
    eyebrow: 'SEE NORA IN ACTION',
    headline: 'Every workflow.\nVisible.',
    sub: 'Short demonstrations of NORA managing real operational scenarios — from first message to resolution.',
    coming: 'Demos coming soon',
    demos: [
      { time: '~45s',  title: 'The 7 AM Owner Briefing', dot: '#14b8e6' },
      { time: '~1m',   title: 'Receipt → Expense → Inventory', dot: '#22c55e' },
      { time: '~1m',   title: 'Missing Register Close', dot: '#f59e0b' },
      { time: '~1.5m', title: 'Maintenance: Report to Resolution', dot: '#f59e0b' },
      { time: '~40s',  title: 'Inventory via WhatsApp', dot: '#8b5cf6' },
      { time: '~1m',   title: 'Mobile WhatsApp Onboarding', dot: '#25d366' },
    ],
  },
  es: {
    eyebrow: 'NORA EN ACCIÓN',
    headline: 'Cada flujo operativo.\nVisible.',
    sub: 'Demostraciones cortas de NORA gestionando escenarios operativos reales — del primer mensaje a la resolución.',
    coming: 'Demos próximamente',
    demos: [
      { time: '~45s',  title: 'El Resumen de las 7 AM', dot: '#14b8e6' },
      { time: '~1m',   title: 'Recibo → Gasto → Inventario', dot: '#22c55e' },
      { time: '~1m',   title: 'Cierre de Caja Faltante', dot: '#f59e0b' },
      { time: '~1.5m', title: 'Mantenimiento: del Reporte a la Resolución', dot: '#f59e0b' },
      { time: '~40s',  title: 'Inventario vía WhatsApp', dot: '#8b5cf6' },
      { time: '~1m',   title: 'Configuración desde el Teléfono', dot: '#25d366' },
    ],
  },
}

export function DemoVideos({ lang }: { lang: Locale }) {
  const c = content[lang]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      id="demos"
      style={{
        background: 'var(--ds-bg)',
        padding: '6rem 0',
        borderTop: '1px solid rgba(148,163,184,.07)',
        scrollMarginTop: 'var(--nav-h)',
      }}
    >
      <div className="container">
        <div className="dv-layout">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="eyebrow" style={{ marginBottom: '0.85rem' }}>{c.eyebrow}</div>
            <h2 style={{
              fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.033em',
              lineHeight: 1.1,
              color: 'var(--ds-fg)',
              marginBottom: '0.85rem',
              whiteSpace: 'pre-line',
            }}>
              {c.headline}
            </h2>
            <p style={{ color: 'var(--ds-muted)', fontSize: '1rem', lineHeight: 1.68, margin: 0, maxWidth: '52ch' }}>
              {c.sub}
            </p>
          </motion.div>

          <motion.div
            className="dv-list-panel"
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="dv-coming">{c.coming}</div>
            <div className="dv-list">
              {c.demos.map((d, i) => (
                <motion.div
                  key={i}
                  className="dv-item"
                  initial={{ opacity: 0, x: 8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.07 }}
                >
                  <span className="dv-dot" style={{ background: d.dot }} aria-hidden="true" />
                  <span className="dv-title">{d.title}</span>
                  <span className="dv-time">{d.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .dv-layout {
          display: grid;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .dv-layout { grid-template-columns: 1fr 1fr; }
        }
        .dv-list-panel {
          border: 1px solid rgba(130,158,201,.13);
          border-radius: 14px;
          background: var(--ds-raised);
          overflow: hidden;
        }
        .dv-coming {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3a5068;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(130,158,201,.1);
          background: rgba(255,255,255,.015);
        }
        .dv-list {
          padding: 0.35rem 0;
        }
        .dv-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1rem;
          border-bottom: 1px solid rgba(130,158,201,.07);
          transition: background 0.14s;
        }
        .dv-item:last-child { border-bottom: none; }
        .dv-item:hover { background: rgba(255,255,255,.02); }
        .dv-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          opacity: 0.65;
        }
        .dv-title {
          flex: 1;
          font-size: 0.85rem;
          color: #8090aa;
        }
        .dv-time {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: #3a5068;
          letter-spacing: 0.04em;
        }
      `}</style>
    </section>
  )
}
