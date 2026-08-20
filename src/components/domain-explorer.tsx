'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { getTranslations, type Locale } from '@/lib/i18n'

interface Row {
  key: string
  value: string
  isWarn?: boolean
  isOk?: boolean
  isBlue?: boolean
  isDanger?: boolean
}

interface DomainMessage {
  sender: string
  initials: string
  text: string
  time: string
  isNora?: boolean
}

interface Domain {
  id: string
  label: string
  description: string
  message: DomainMessage
  rows: Row[]
}

function MiniWA({ domain }: { domain: Domain }) {
  const m = domain.message
  return (
    <div
      style={{
        background: 'var(--wa-bg)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: 'var(--wa-header)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 0.85rem',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="wa-avatar" style={{ fontSize: '0.65rem' }} aria-hidden="true">{m.initials}</div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e9edef' }}>{m.sender}</span>
      </div>
      <div style={{ padding: '0.75rem' }}>
        <div
          style={{
            background: m.isNora ? 'var(--wa-sent)' : 'var(--wa-recv)',
            padding: '0.55rem 0.75rem 0.4rem',
            borderRadius: m.isNora ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
            maxWidth: '90%',
            alignSelf: m.isNora ? 'flex-end' : 'flex-start',
            marginLeft: m.isNora ? 'auto' : 0,
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--wa-text)', lineHeight: 1.5, margin: 0 }}>
            {m.text}
          </p>
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            fontSize: '0.62rem', color: 'var(--wa-time)',
            marginTop: '0.25rem',
          }}>
            {m.time}
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniNora({ domain }: { domain: Domain }) {
  return (
    <div
      style={{
        background: 'var(--ls-surface)',
        border: '1px solid var(--ls-border)',
        borderTop: '2px solid var(--ls-accent)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      }}
    >
      <div style={{
        padding: '0.55rem 0.9rem',
        background: 'var(--ls-raised)',
        borderBottom: '1px solid var(--ls-border)',
        fontSize: '0.67rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.07em',
        color: 'var(--ls-muted)',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ls-accent)', display: 'inline-block' }} aria-hidden="true" />
        NORA
      </div>
      <div style={{ padding: '0.75rem 0.9rem' }}>
        {domain.rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: 'flex', gap: '0.6rem',
              padding: '0.28rem 0',
              borderBottom: i < domain.rows.length - 1 ? '1px solid var(--ls-border)' : 'none',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: '0.68rem', color: 'var(--ls-subtle)', minWidth: 86, paddingTop: '0.05rem', flexShrink: 0 }}>
              {r.key}
            </span>
            <span style={{
              fontSize: '0.78rem', fontWeight: 500,
              color: r.isWarn ? '#D97706' : r.isOk ? '#059669' : r.isBlue ? '#2563EB' : 'var(--ls-fg)',
            }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DomainExplorer({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const de = t.domainExplorer
  const domains: Domain[] = de.domains

  const [active, setActive] = useState<string>(domains[0].id)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  const activeDomain = domains.find(d => d.id === active) ?? domains[0]

  return (
    <section
      id="capabilities"
      style={{
        background: 'var(--ls-bg)',
        padding: '6rem 0',
        scrollMarginTop: 'var(--nav-h)',
      }}
    >
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '3rem' }}
        >
          <div className="eyebrow-light" style={{ marginBottom: '0.75rem' }}>
            {de.eyebrow}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700, letterSpacing: '-0.025em',
              lineHeight: 1.1, marginBottom: '0.6rem',
              color: 'var(--ls-fg)',
            }}
          >
            {de.headline}
          </h2>
          <p style={{ color: 'var(--ls-muted)', fontSize: '1rem', margin: 0, maxWidth: '50ch' }}>
            {de.subhead}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="explorer-layout"
          style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}
        >
          {/* Left: Domain selector */}
          <nav aria-label="Operational domains" style={{ display: 'flex', flexDirection: 'column' }}>
            {domains.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                aria-pressed={active === d.id}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '0.85rem 1rem',
                  border: 'none',
                  borderLeft: `3px solid ${active === d.id ? 'var(--ls-accent)' : 'transparent'}`,
                  borderRadius: `0 var(--r-sm) var(--r-sm) 0`,
                  background: active === d.id ? 'rgba(0,148,179,0.06)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 150ms, border-color 150ms',
                  marginBottom: i < domains.length - 1 ? '0.15rem' : 0,
                }}
                onMouseEnter={e => {
                  if (active !== d.id) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  if (active !== d.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: active === d.id ? 600 : 400,
                  color: active === d.id ? 'var(--ls-fg)' : 'var(--ls-muted)',
                  lineHeight: 1.35,
                  transition: 'color 150ms, font-weight 0ms',
                }}>
                  {d.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Right: Active domain panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <p style={{
                fontSize: '0.9375rem', color: 'var(--ls-muted)',
                lineHeight: 1.65, marginBottom: '1.5rem',
                maxWidth: '52ch',
              }}>
                {activeDomain.description}
              </p>

              <div
                className="mini-pipeline"
                style={{ display: 'grid', gridTemplateColumns: '1fr 32px 1fr', alignItems: 'center', gap: '0' }}
              >
                <MiniWA domain={activeDomain} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                    <line x1="0" y1="8" x2="18" y2="8" stroke="var(--ls-accent)" strokeWidth="1.5" />
                    <path d="M 14 4 L 20 8 L 14 12" stroke="var(--ls-accent)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  </svg>
                </div>
                <MiniNora domain={activeDomain} />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .explorer-layout {
            grid-template-columns: 1fr !important;
          }
          .mini-pipeline {
            grid-template-columns: 1fr !important;
            gap: 0.6rem !important;
          }
          .mini-pipeline > div:nth-child(2) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
