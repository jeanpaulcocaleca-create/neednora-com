'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { getTranslations, type Locale } from '@/lib/i18n'

function WaPanel({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const ps = t.productStory
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="wa-screen"
      style={{
        boxShadow: '0 8px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <div className="wa-header">
        <div className="wa-avatar" aria-hidden="true">MG</div>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e9edef' }}>Marcos · Field Team</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--wa-time)' }}>{ps.waRole}</div>
        </div>
      </div>

      <div className="wa-body">
        {ps.waMessages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: m.sent ? 'flex-end' : 'flex-start' }}
          >
            {m.sender && (
              <div style={{ fontSize: '0.63rem', color: 'var(--accent)', marginBottom: '0.15rem', paddingLeft: 2 }}>
                {m.sender}
              </div>
            )}
            <div className={`wa-bubble${m.sent ? ' sent' : ''}`}>
              <span>{m.text}</span>
              <div className="wa-meta">
                {m.time}
                {m.sent && <span style={{ color: 'var(--wa-tick)' }} aria-hidden="true">✓✓</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function NoraPanel({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const nora = t.productStory.nora
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="nora-card-light"
      style={{ borderTop: '2px solid var(--ls-accent)' }}
    >
      <div className="nora-card-light-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ls-accent)', display: 'inline-block' }}
            aria-hidden="true"
          />
          {nora.headerLabel}
        </div>
        <span style={{ fontSize: '0.62rem', color: 'var(--ls-subtle)', letterSpacing: 0, textTransform: 'none', fontWeight: 400 }}>
          {nora.headerMeta}
        </span>
      </div>

      <div className="nora-card-light-body">
        {nora.rows.map((r, i) => (
          <motion.div
            key={r.key}
            className="nora-row-light"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.45 + i * 0.09 }}
          >
            <span className="nora-key-light">{r.key}</span>
            <span className="nora-val-light">
              {i === nora.rows.length - 1
                ? <span className="badge-warn-ls badge" style={{ fontSize: '0.64rem' }}>{r.value}</span>
                : r.value}
            </span>
          </motion.div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.85rem' }}>
          {nora.subCards.map((sc, i) => (
            <motion.div
              key={sc.id}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.12 }}
              style={{
                borderLeft: `3px solid ${sc.borderColor}`,
                borderRadius: '0 var(--r) var(--r) 0',
                background: 'var(--ls-raised)',
                padding: '0.6rem 0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ls-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {sc.label} · {sc.id}
                </span>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 600, color: sc.statusColor,
                  background: `${sc.borderColor}18`, padding: '0.1rem 0.4rem',
                  borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>
                  {sc.statusLabel}
                </span>
              </div>
              {sc.items.map((item, j) => (
                <div key={j} style={{ fontSize: '0.78rem', color: 'var(--ls-muted)', lineHeight: 1.5 }}>
                  {item}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.15 }}
          style={{
            marginTop: '0.85rem', paddingTop: '0.75rem',
            borderTop: '1px solid var(--ls-border)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', flexShrink: 0 }} aria-hidden="true" />
          <span style={{ fontSize: '0.78rem', color: 'var(--ls-muted)' }}>
            {nora.briefingNote}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Connector({ inView }: { inView: boolean }) {
  return (
    <div
      className="story-connector"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      aria-hidden="true"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="connector-horizontal">
        <motion.line
          x1="2" y1="18" x2="28" y2="18"
          stroke="var(--ls-accent)" strokeWidth="1.5"
          strokeDasharray="26"
          initial={{ strokeDashoffset: 26 }}
          animate={inView ? { strokeDashoffset: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.path
          d="M 23 13 L 29 18 L 23 23"
          stroke="var(--ls-accent)" strokeWidth="1.5"
          fill="none" strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: 0.95 }}
        />
      </svg>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="connector-vertical" style={{ display: 'none' }}>
        <motion.line
          x1="18" y1="2" x2="18" y2="28"
          stroke="var(--ls-accent)" strokeWidth="1.5"
          strokeDasharray="26"
          initial={{ strokeDashoffset: 26 }}
          animate={inView ? { strokeDashoffset: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.path
          d="M 13 23 L 18 29 L 23 23"
          stroke="var(--ls-accent)" strokeWidth="1.5"
          fill="none" strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: 0.95 }}
        />
      </svg>
    </div>
  )
}

interface BriefingItem { text: string; ok?: boolean; warn?: boolean; danger?: boolean }
interface BriefingCol { label: string; borderColor: string; items: BriefingItem[] }

function OwnerBriefing({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const briefing = t.productStory.briefing
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  const cols: BriefingCol[] = briefing.cols

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="nora-card-light"
      style={{ borderTop: '2px solid #059669', maxWidth: 860, margin: '0 auto' }}
    >
      <div
        className="nora-card-light-header"
        style={{ background: 'var(--ls-raised)', borderBottom: '1px solid var(--ls-border)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} aria-hidden="true" />
          {briefing.title}
        </div>
        <span style={{ fontSize: '0.68rem', color: 'var(--ls-subtle)', textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>
          {briefing.time}
        </span>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}
        className="briefing-cols"
      >
        {cols.map((col, ci) => (
          <div
            key={col.label}
            style={{
              padding: '1.1rem 1.25rem',
              borderRight: ci < cols.length - 1 ? `1px solid var(--ls-border)` : 'none',
              borderTop: `2px solid ${col.borderColor}22`,
            }}
          >
            <div style={{
              fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--ls-subtle)', marginBottom: '0.65rem',
            }}>
              {col.label}
            </div>
            {col.items.map((item, ii) => (
              <motion.div
                key={ii}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.25 + ci * 0.1 + ii * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  marginBottom: '0.45rem',
                  paddingLeft: '0.5rem',
                  borderLeft: item.danger ? '2px solid #EF4444' : item.warn ? '2px solid #F59E0B' : '2px solid transparent',
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: 'var(--ls-fg)', lineHeight: 1.45, fontWeight: 400 }}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function ProductStory({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const ps = t.productStory
  const pipelineRef = useRef<HTMLDivElement>(null)
  const pipelineInView = useInView(pipelineRef, { once: true, margin: '-80px 0px' })

  return (
    <section
      id="product-story"
      style={{
        background: 'var(--ls-bg)',
        padding: '6rem 0',
        scrollMarginTop: 'var(--nav-h)',
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px 0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '3.5rem' }}
        >
          <div className="eyebrow-light" style={{ marginBottom: '0.75rem' }}>
            {ps.eyebrow}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 700, letterSpacing: '-0.028em',
              lineHeight: 1.1, marginBottom: '0.75rem',
              color: 'var(--ls-fg)',
            }}
          >
            {ps.headline}
          </h2>
          <p style={{ color: 'var(--ls-muted)', fontSize: '1rem', margin: 0, maxWidth: '54ch' }}>
            {ps.subhead}
          </p>
        </motion.div>

        <div ref={pipelineRef} className="story-pipeline" style={{ marginBottom: '3rem' }}>
          <WaPanel lang={lang} />
          <Connector inView={pipelineInView} />
          <NoraPanel lang={lang} />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--ls-muted)' }}>
            {ps.briefing.ownerNote}
          </div>
          <OwnerBriefing lang={lang} />
        </div>
      </div>

      <style>{`
        .story-pipeline {
          display: grid;
          grid-template-columns: 1fr 48px 1fr;
          align-items: center;
          gap: 0;
          max-width: 860px;
          margin: 0 auto 0;
        }
        @media (max-width: 700px) {
          .story-pipeline {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .story-connector { transform: rotate(90deg); }
          .briefing-cols {
            grid-template-columns: 1fr !important;
          }
          .briefing-cols > div {
            border-right: none !important;
            border-bottom: 1px solid var(--ls-border);
          }
          .briefing-cols > div:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  )
}
