'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/i18n'

function NoraCanvas({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const canvas = t.hero.canvas

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 400,
        background: 'linear-gradient(160deg, #0C1020 0%, #080C18 100%)',
        border: '1px solid #1E2840',
        borderTop: '1px solid rgba(0,180,216,0.35)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,180,216,0.07), 0 24px 72px rgba(0,0,0,0.55)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.8rem 1.1rem',
          borderBottom: '1px solid #1E2840',
          background: 'rgba(10,14,24,0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="pulse-dot" aria-hidden="true" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#EEF2FF', letterSpacing: '-0.01em' }}>
            {canvas.title}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#4A5A7A', letterSpacing: '-0.01em' }}>
            {canvas.subtitle}
          </span>
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {canvas.live}
        </span>
      </div>

      {/* Threads */}
      {canvas.threads.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: '0.85rem 1.1rem 0.85rem 1.4rem',
            borderLeft: `2.5px solid ${t.accentColor}`,
            borderBottom: i < canvas.threads.length - 1 ? '1px solid rgba(30,40,64,0.7)' : 'none',
            background: t.accentBg,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: t.accentColor,
                }}>
                  {t.category}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#4A5A7A', fontFamily: 'var(--font-mono)' }}>
                  {t.id}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#EEF2FF', lineHeight: 1.35, marginBottom: '0.2rem' }}>
                {t.title}
              </div>
              <div style={{ fontSize: '0.73rem', color: '#7A8AAA', lineHeight: 1.4 }}>
                {t.detail}
              </div>
            </div>
            <div style={{
              flexShrink: 0,
              fontSize: '0.62rem', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              color: t.statusColor,
              padding: '0.15rem 0.4rem',
              borderRadius: 4,
              border: `1px solid ${t.statusColor}33`,
              background: `${t.statusColor}0D`,
              marginTop: '0.1rem',
            }}>
              {t.statusLabel}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Footer */}
      <div style={{
        padding: '0.6rem 1.1rem',
        background: 'rgba(10,14,24,0.5)',
        borderTop: '1px solid #1E2840',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.72rem', color: '#4A5A7A' }}>
          {canvas.footer}
        </span>
        <span style={{ fontSize: '0.68rem', color: '#00B4D8', letterSpacing: '-0.01em' }}>
          {canvas.updated}
        </span>
      </div>
    </div>
  )
}

export function Hero({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const h = t.hero

  return (
    <section
      aria-label="Hero"
      style={{
        background: 'var(--ds-bg)',
        paddingTop: 'calc(var(--nav-h) + 5rem)',
        paddingBottom: '5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(0,180,216,0.13) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 80% 80% at 70% 40%, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 70% 40%, black 10%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 600, height: 600,
          background: 'radial-gradient(ellipse at center, rgba(0,180,216,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div className="hero-grid" style={{ display: 'grid', gap: '3.5rem', alignItems: 'center' }}>

          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="eyebrow" style={{ marginBottom: '1.25rem', color: 'var(--accent)' }}>
              {h.eyebrow}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
                fontWeight: 700,
                letterSpacing: '-0.033em',
                lineHeight: 1.05,
                marginBottom: '1.25rem',
                color: 'var(--ds-fg)',
              }}
            >
              {h.headline}
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
                color: 'var(--ds-muted)',
                lineHeight: 1.6,
                fontWeight: 400,
                marginBottom: '0.6rem',
                maxWidth: '48ch',
              }}
            >
              {h.subhead}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link
                href={`/${lang}/#early-access`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  background: 'var(--blue)', color: '#ffffff',
                  fontWeight: 600, fontSize: '0.9375rem',
                  padding: '0.75rem 1.5rem', borderRadius: 'var(--r)',
                  transition: 'background var(--t)', letterSpacing: '-0.01em',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--blue)')}
              >
                {h.ctaPrimary}
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
              </Link>
              <Link
                href={`/${lang}/#product-story`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  color: 'var(--ds-muted)', fontWeight: 500,
                  fontSize: '0.9375rem', letterSpacing: '-0.01em',
                  transition: 'color var(--t)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ds-fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--ds-muted)')}
              >
                {h.ctaSecondary}
              </Link>
            </div>
          </motion.div>

          {/* Right: NORA canvas */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hero-canvas-wrap"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <NoraCanvas lang={lang} />
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (min-width: 880px) {
          .hero-grid {
            grid-template-columns: 52% 48% !important;
          }
          .hero-canvas-wrap {
            justify-content: flex-end !important;
          }
        }
        .hero-break { display: none; }
        @media (min-width: 640px) { .hero-break { display: inline; } }
      `}</style>
    </section>
  )
}
