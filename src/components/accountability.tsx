'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

const content = {
  en: {
    eyebrow: 'OPERATIONAL HISTORY',
    headline: 'NORA tracks facts.\nYou make the decisions.',
    sub: 'Every missed procedure, completed task, early arrival, or commendation is stored as factual operational history — not an AI opinion. You always have the complete picture before deciding anything.',
    occurrences: [
      {
        n: '1st',
        label: 'First occurrence',
        msg: 'María, I didn\'t receive the required register-closing photo tonight. Please send it to complete the record. Thank you.',
        badge: 'DOCUMENTED',
        badgeColor: '#14b8e6',
        badgeBg: 'rgba(20,184,230,.08)',
      },
      {
        n: '2nd',
        label: 'Second occurrence',
        msg: 'María, this is the second time the register-closing photo hasn\'t arrived. I\'ve noted it in the record. Please send it, and let\'s avoid a third occurrence so this stays internal.',
        badge: 'NOTED',
        badgeColor: '#f59e0b',
        badgeBg: 'rgba(245,158,11,.08)',
      },
      {
        n: '3rd',
        label: 'Third occurrence',
        msg: 'According to configured procedure, this third occurrence has been escalated to management with the full documented history.',
        badge: 'ESCALATED',
        badgeColor: '#ef4444',
        badgeBg: 'rgba(239,68,68,.08)',
      },
    ],
    principle: 'Hiring, firing, raises, and promotions remain human decisions. NORA provides context, not verdicts.',
    historyLabel: 'EMPLOYEE HISTORY — ON REQUEST',
    history: [
      { icon: '✅', text: '94% of documented responsibilities completed' },
      { icon: '⚠️', text: '2 procedure misses on record — both register close' },
      { icon: '🟢', text: 'No late arrivals recorded this period' },
      { icon: '⭐', text: '3 early completions noted by management' },
    ],
    historyNote: 'Complete. Factual. Always available.',
  },
  es: {
    eyebrow: 'HISTORIAL OPERATIVO',
    headline: 'NORA registra hechos.\nUsted toma las decisiones.',
    sub: 'Cada procedimiento incumplido, tarea completada, llegada anticipada o reconocimiento queda almacenado como historial operativo factual — no como una opinión de IA. Usted siempre tiene la imagen completa antes de decidir.',
    occurrences: [
      {
        n: '1ra',
        label: 'Primera ocurrencia',
        msg: 'María, no recibí la foto de cierre de caja requerida esta noche. Por favor envíala para completar el registro. Gracias.',
        badge: 'DOCUMENTADO',
        badgeColor: '#14b8e6',
        badgeBg: 'rgba(20,184,230,.08)',
      },
      {
        n: '2da',
        label: 'Segunda ocurrencia',
        msg: 'María, es la segunda vez que no llega la foto de cierre de caja. Lo he anotado en el registro. Por favor envíala, y evitemos una tercera ocasión para que esto quede interno.',
        badge: 'ANOTADO',
        badgeColor: '#f59e0b',
        badgeBg: 'rgba(245,158,11,.08)',
      },
      {
        n: '3ra',
        label: 'Tercera ocurrencia',
        msg: 'Según el procedimiento configurado, esta tercera ocurrencia ha sido escalada a gerencia con el historial documentado completo.',
        badge: 'ESCALADO',
        badgeColor: '#ef4444',
        badgeBg: 'rgba(239,68,68,.08)',
      },
    ],
    principle: 'Las decisiones de contratación, despido, aumento o promoción siguen siendo humanas. NORA aporta contexto, no veredictos.',
    historyLabel: 'HISTORIAL DEL EMPLEADO — A PEDIDO',
    history: [
      { icon: '✅', text: 'Completó el 94% de sus responsabilidades documentadas' },
      { icon: '⚠️', text: '2 procedimientos incumplidos en registro — ambos cierre de caja' },
      { icon: '🟢', text: 'Sin llegadas tarde registradas en este período' },
      { icon: '⭐', text: '3 reconocimientos por completar antes de tiempo' },
    ],
    historyNote: 'Completo. Basado en hechos. Siempre disponible.',
  },
}

export function Accountability({ lang }: { lang: Locale }) {
  const c = content[lang]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const histRef = useRef<HTMLDivElement>(null)
  const histInView = useInView(histRef, { once: true, margin: '-60px 0px' })

  return (
    <section style={{ background: 'linear-gradient(170deg, #07101e 0%, #080f1c 100%)', padding: '7rem 0' }}>
      <div className="container" ref={ref}>
        <div className="acc-grid">
          {/* Left: copy + occurrences */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="eyebrow" style={{ marginBottom: '0.9rem' }}>{c.eyebrow}</div>
              <h2 style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.8rem)',
                fontWeight: 660,
                letterSpacing: '-0.032em',
                lineHeight: 1.15,
                color: '#f0f5ff',
                margin: '0 0 0.9rem',
                whiteSpace: 'pre-line',
              }}>
                {c.headline}
              </h2>
              <p style={{ color: '#7a90aa', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 2.5rem', maxWidth: '50ch' }}>
                {c.sub}
              </p>
            </motion.div>

            {/* Three occurrences */}
            <div className="acc-occurrences">
              {c.occurrences.map((occ, i) => (
                <motion.div
                  key={i}
                  className="acc-occ"
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="acc-occ-header">
                    <div
                      className="acc-occ-n"
                      style={{ color: occ.badgeColor, borderColor: `${occ.badgeColor}30`, background: occ.badgeBg }}
                    >
                      {occ.n}
                    </div>
                    <span className="acc-occ-label">{occ.label}</span>
                    <span
                      className="acc-badge"
                      style={{ color: occ.badgeColor, background: occ.badgeBg, borderColor: `${occ.badgeColor}25` }}
                    >
                      {occ.badge}
                    </span>
                  </div>
                  <p className="acc-occ-msg">{occ.msg}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              style={{ fontSize: '0.8rem', color: '#4a6278', marginTop: '1.5rem', lineHeight: 1.6, maxWidth: '46ch' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.65 }}
            >
              {c.principle}
            </motion.p>
          </div>

          {/* Right: history query */}
          <div ref={histRef}>
            <motion.div
              className="acc-history"
              initial={{ opacity: 0, x: 18 }}
              animate={histInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="acc-history-header">
                <div className="acc-hist-name">
                  <span className="acc-hist-avatar">M</span>
                  <div>
                    <b>María</b>
                    <span>{lang === 'es' ? 'Últimos 90 días' : 'Last 90 days'}</span>
                  </div>
                </div>
                <div className="acc-history-label">{c.historyLabel}</div>
              </div>
              <div className="acc-history-body">
                {c.history.map((h, i) => (
                  <motion.div
                    key={i}
                    className="acc-hist-row"
                    initial={{ opacity: 0, x: 10 }}
                    animate={histInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.15 + i * 0.1 }}
                  >
                    <span className="acc-hist-icon">{h.icon}</span>
                    <span className="acc-hist-text">{h.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="acc-history-foot">{c.historyNote}</div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .acc-grid {
          display: grid;
          gap: 4rem;
          align-items: start;
        }
        @media (min-width: 960px) {
          .acc-grid { grid-template-columns: 1fr 1fr; }
        }

        .acc-occurrences {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .acc-occ {
          border: 1px solid rgba(130,158,201,.12);
          border-radius: var(--r);
          background: rgba(255,255,255,.02);
          overflow: hidden;
        }
        .acc-occ-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.9rem;
          border-bottom: 1px solid rgba(130,158,201,.08);
        }
        .acc-occ-n {
          width: 28px; height: 28px;
          border-radius: 6px;
          border: 1px solid;
          display: grid;
          place-items: center;
          font-size: 0.6rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .acc-occ-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #8090aa;
          flex: 1;
          letter-spacing: 0.01em;
        }
        .acc-badge {
          font-size: 0.57rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          border: 1px solid;
        }
        .acc-occ-msg {
          font-size: 0.79rem;
          color: #8090aa;
          line-height: 1.58;
          margin: 0;
          padding: 0.65rem 0.9rem;
        }

        /* History */
        .acc-history {
          border-radius: var(--r-xl);
          border: 1px solid rgba(130,158,201,.16);
          overflow: hidden;
          background: #090f1d;
          box-shadow: 0 24px 60px rgba(0,0,0,.24);
        }
        .acc-history-header {
          padding: 1rem 1.1rem 0.75rem;
          border-bottom: 1px solid rgba(130,158,201,.1);
        }
        .acc-hist-name {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.6rem;
        }
        .acc-hist-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #1e3050;
          display: grid;
          place-items: center;
          color: #90b4da;
          font-weight: 700;
          font-size: 0.88rem;
          flex-shrink: 0;
        }
        .acc-hist-name b {
          color: #eef4ff;
          font-size: 0.9rem;
          display: block;
        }
        .acc-hist-name span {
          color: #4a6278;
          font-size: 0.67rem;
          display: block;
          margin-top: 0.1rem;
        }
        .acc-history-label {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #344960;
        }
        .acc-history-body {
          padding: 0.85rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .acc-hist-row {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
        }
        .acc-hist-icon {
          font-size: 0.88rem;
          flex-shrink: 0;
          line-height: 1.4;
        }
        .acc-hist-text {
          font-size: 0.8rem;
          color: #8090aa;
          line-height: 1.5;
        }
        .acc-history-foot {
          padding: 0.65rem 1.1rem;
          border-top: 1px solid rgba(130,158,201,.08);
          font-size: 0.68rem;
          color: #3a5068;
          background: rgba(0,0,0,.1);
          font-style: italic;
        }
      `}</style>
    </section>
  )
}
