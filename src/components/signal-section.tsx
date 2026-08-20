'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { getTranslations, type Locale } from '@/lib/i18n'

export function SignalSection({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const s = t.signal
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  const pillars = s.pillars.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }))

  return (
    <section
      aria-labelledby="signal-headline"
      style={{
        background: 'var(--ds-bg)',
        padding: '8rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 800, height: 400,
          background: 'radial-gradient(ellipse at 50% -20%, rgba(0,180,216,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" ref={ref} style={{ position: 'relative' }}>

        {/* Headline block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 720, marginBottom: '5rem' }}
        >
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
            {s.eyebrow}
          </div>

          <h2
            id="signal-headline"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.033em',
              lineHeight: 1.08,
              color: 'var(--ds-fg)',
              marginBottom: '1.5rem',
            }}
          >
            {s.headline}{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
              {s.headlineAccent}
            </em>
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
              color: 'var(--ds-muted)',
              lineHeight: 1.65,
              maxWidth: '58ch',
              margin: 0,
            }}
          >
            {s.body}
          </p>
        </motion.div>

        {/* Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid rgba(30,40,64,0.9)',
          }}
          className="signal-pillars"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                padding: '2.5rem 2rem 2rem',
                borderRight: i < pillars.length - 1 ? '1px solid rgba(30,40,64,0.9)' : 'none',
                overflow: 'hidden',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '-0.5rem', right: '0.5rem',
                  fontSize: '7rem', fontWeight: 700,
                  lineHeight: 1, letterSpacing: '-0.04em',
                  color: 'var(--ds-fg)',
                  opacity: 0.03,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {p.num}
              </div>

              <div style={{ width: 28, height: 2, background: 'var(--accent)', borderRadius: 2, marginBottom: '1.5rem' }} aria-hidden="true" />

              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--ds-fg)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--ds-muted)',
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: '34ch',
                }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 700px) {
          .signal-pillars {
            grid-template-columns: 1fr !important;
          }
          .signal-pillars > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(30,40,64,0.9);
          }
          .signal-pillars > div:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  )
}
