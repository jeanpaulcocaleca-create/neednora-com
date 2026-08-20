'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { getTranslations, type Locale } from '@/lib/i18n'

export function TrustSection({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const tr = t.trust
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section
      style={{
        background: 'var(--ls-surface)',
        padding: '6rem 0',
        borderTop: '1px solid var(--ls-border)',
      }}
    >
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '4rem', maxWidth: 600 }}
        >
          <div className="eyebrow-light" style={{ marginBottom: '0.85rem' }}>
            {tr.eyebrow}
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--ls-fg)',
              marginBottom: '0.85rem',
            }}
          >
            {tr.headline}
          </h2>
          <p style={{ color: 'var(--ls-muted)', fontSize: '1.0625rem', lineHeight: 1.65, margin: 0, maxWidth: '50ch' }}>
            {tr.subhead}
          </p>
        </motion.div>

        <div className="trust-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {tr.points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                paddingTop: '2rem',
                paddingRight: i < tr.points.length - 1 ? '2.5rem' : 0,
                paddingLeft: i > 0 ? '2.5rem' : 0,
                borderTop: '2px solid var(--ls-accent)',
                borderLeft: i > 0 ? `1px solid var(--ls-border)` : 'none',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  letterSpacing: '-0.018em',
                  color: 'var(--ls-fg)',
                  marginBottom: '0.65rem',
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ls-muted)', lineHeight: 1.65, margin: 0 }}>
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          style={{
            marginTop: '3rem',
            paddingTop: '1.75rem',
            borderTop: '1px solid var(--ls-border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem 2rem',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.8125rem', color: 'var(--ls-subtle)' }}>
            {tr.legalLabel}
          </span>
          {tr.legalLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={`/${lang}${href}`}
              style={{
                fontSize: '0.875rem',
                color: 'var(--ls-accent)',
                fontWeight: 500,
                transition: 'opacity var(--t)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {label} →
            </Link>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .trust-items {
            grid-template-columns: 1fr !important;
          }
          .trust-items > div {
            border-left: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  )
}
