'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

// Set NEXT_PUBLIC_NORA_WA_NUMBER (digits only, e.g. "50688888888")
// to activate the WhatsApp onboarding link and QR code.
// Until configured, the CTA renders in "coming soon" state.
const WA_NUMBER = process.env.NEXT_PUBLIC_NORA_WA_NUMBER ?? null

function buildWaUrl(lang: Locale): string | null {
  if (!WA_NUMBER) return null
  const msg =
    lang === 'es'
      ? 'Hola NORA. Quiero configurar NORA para mi negocio.'
      : 'Hi NORA. I want to set up NORA for my business.'
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

const content = {
  en: {
    eyebrow: 'GET STARTED',
    headline: 'Start from your phone.',
    sub: 'NORA guides the setup and only asks you to step in when an authorization requires you.',
    mobile: 'Start with NORA on WhatsApp',
    desktop: 'Continue on your phone',
    desktopSub: 'Scan to open the NORA onboarding conversation on WhatsApp',
    pendingNote: 'WhatsApp onboarding launching soon.',
    steps: [
      'WhatsApp opens',
      'NORA collects your business information',
      'NORA guides the WhatsApp authorization',
      'Your operation goes live',
    ],
  },
  es: {
    eyebrow: 'COMENZAR',
    headline: 'Empiece desde su teléfono.',
    sub: 'NORA lo guía durante la configuración y solo le pide intervenir cuando una autorización lo requiere.',
    mobile: 'Comenzar con NORA en WhatsApp',
    desktop: 'Continúe desde su teléfono',
    desktopSub: 'Escanee para abrir la conversación de configuración en WhatsApp',
    pendingNote: 'Configuración por WhatsApp próximamente.',
    steps: [
      'WhatsApp se abre',
      'NORA recopila la información de su negocio',
      'NORA guía la autorización de WhatsApp',
      'Su operación queda activa',
    ],
  },
}

export function WhatsAppCta({ lang }: { lang: Locale }) {
  const c = content[lang]
  const waUrl = buildWaUrl(lang)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section style={{
      background: 'linear-gradient(170deg, #07101e 0%, #0a1628 100%)',
      padding: '6rem 0',
      borderTop: '1px solid rgba(148,163,184,.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* WhatsApp ambient tint */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: -120, left: -100,
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,211,102,.05), transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="container" ref={ref}>
        <div className="wa-cta-grid">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="eyebrow" style={{ marginBottom: '0.8rem' }}>{c.eyebrow}</div>
            <h2 style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.8rem)',
              fontWeight: 660,
              letterSpacing: '-0.032em',
              lineHeight: 1.15,
              color: '#f0f5ff',
              margin: '0 0 0.9rem',
            }}>
              {c.headline}
            </h2>
            <p style={{ color: '#7a90aa', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 2rem', maxWidth: '48ch' }}>
              {c.sub}
            </p>

            {/* Step flow */}
            <div className="wa-steps">
              {c.steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="wa-step"
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <div className="wa-step-n">{i + 1}</div>
                  <span>{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: CTA */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="wa-cta-panel"
          >
            {/* Mobile CTA (visible on all screens, primary on mobile) */}
            <div className="wa-mobile-cta">
              <div className="wa-phone-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>

              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn wa-btn-active"
                >
                  {c.mobile}
                </a>
              ) : (
                <div className="wa-btn wa-btn-pending">
                  <span>{c.mobile}</span>
                  <span className="wa-pending-tag">{lang === 'es' ? 'Próximamente' : 'Coming soon'}</span>
                </div>
              )}

              {!waUrl && (
                <p className="wa-pending-note">{c.pendingNote}</p>
              )}
            </div>

            {/* Desktop QR (hidden on small screens) */}
            <div className="wa-desktop-qr">
              <div className="wa-qr-box" aria-label={c.desktopSub}>
                {/* QR placeholder — replace with real QR when WA_NUMBER is configured */}
                <div className="wa-qr-placeholder">
                  <div className="wa-qr-corner wa-qr-tl" />
                  <div className="wa-qr-corner wa-qr-tr" />
                  <div className="wa-qr-corner wa-qr-bl" />
                  <div className="wa-qr-center">
                    <div className="wa-qr-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(14,165,233,.5)">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="wa-qr-label">
                      {waUrl ? lang === 'es' ? 'Escanear' : 'Scan' : lang === 'es' ? 'Próximamente' : 'Coming soon'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="wa-qr-sub">{c.desktopSub}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .wa-cta-grid {
          display: grid;
          gap: 3.5rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .wa-cta-grid { grid-template-columns: 1fr 1fr; }
        }

        .wa-steps {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .wa-step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: #7a90aa;
        }
        .wa-step-n {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(37,211,102,.1);
          border: 1px solid rgba(37,211,102,.2);
          color: #25d366;
          font-size: 0.62rem;
          font-weight: 700;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        /* CTA panel */
        .wa-cta-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: flex-start;
        }
        @media (min-width: 900px) {
          .wa-cta-panel { align-items: center; }
        }

        .wa-mobile-cta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.65rem;
          width: 100%;
        }

        .wa-phone-icon {
          color: #25d366;
          margin-bottom: 0.25rem;
        }

        .wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.4rem;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: var(--font-sans);
          text-decoration: none;
          transition: opacity 0.15s;
          width: 100%;
          justify-content: center;
          max-width: 320px;
        }
        .wa-btn-active {
          background: #25d366;
          color: #0a1e12;
        }
        .wa-btn-active:hover { opacity: 0.88; }
        .wa-btn-pending {
          background: rgba(37,211,102,.08);
          border: 1px solid rgba(37,211,102,.2);
          color: #4a6278;
          flex-direction: column;
          gap: 0.2rem;
          cursor: default;
        }
        .wa-pending-tag {
          font-size: 0.65rem;
          font-weight: 500;
          color: #3a5270;
          letter-spacing: 0.05em;
        }
        .wa-pending-note {
          font-size: 0.75rem;
          color: #2e4455;
          margin: 0;
          font-style: italic;
        }

        /* Desktop QR */
        .wa-desktop-qr {
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        @media (min-width: 900px) {
          .wa-desktop-qr { display: flex; }
        }
        .wa-qr-box {
          width: 120px; height: 120px;
          border-radius: 12px;
          border: 1px solid rgba(37,211,102,.2);
          background: rgba(255,255,255,.02);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .wa-qr-placeholder {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-qr-corner {
          position: absolute;
          width: 18px; height: 18px;
          border: 2px solid rgba(37,211,102,.25);
        }
        .wa-qr-tl { top: 8px; left: 8px; border-right: none; border-bottom: none; border-radius: 3px 0 0 0; }
        .wa-qr-tr { top: 8px; right: 8px; border-left: none; border-bottom: none; border-radius: 0 3px 0 0; }
        .wa-qr-bl { bottom: 8px; left: 8px; border-right: none; border-top: none; border-radius: 0 0 0 3px; }
        .wa-qr-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        .wa-qr-label {
          font-size: 0.58rem;
          color: #2e4455;
          letter-spacing: 0.06em;
          font-weight: 600;
          text-transform: uppercase;
        }
        .wa-qr-sub {
          font-size: 0.72rem;
          color: #3a5270;
          text-align: center;
          margin: 0;
          max-width: 200px;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .wa-btn { font-size: 0.875rem; }
          .wa-step { font-size: 0.83rem; }
        }
      `}</style>
    </section>
  )
}
