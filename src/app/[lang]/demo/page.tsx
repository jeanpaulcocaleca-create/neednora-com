'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { getTranslations, type Locale } from '@/lib/i18n'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type ErrorKind = 'generic' | '400' | '429'

const labelStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  letterSpacing: '-0.01em',
  display: 'block',
  marginBottom: '0.35rem',
}

const fieldStyle: React.CSSProperties = {
  background: 'var(--neutral-pure)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-md)',
  color: 'var(--text-primary)',
  fontSize: '0.9375rem',
  padding: '0.65rem 0.85rem',
  width: '100%',
  outline: 'none',
  fontFamily: 'var(--font-body)',
}

const groupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

export default function DemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langRaw } = use(params)
  const lang = langRaw as Locale
  const t = getTranslations(lang)
  const dm = t.demo

  const [state, setState] = useState<FormState>('idle')
  const [errorKind, setErrorKind] = useState<ErrorKind>('generic')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorKind('generic')

    const form = e.currentTarget
    const body: Record<string, string | undefined> = {
      name:           (form.elements.namedItem('name')            as HTMLInputElement).value,
      email:          (form.elements.namedItem('email')           as HTMLInputElement).value,
      whatsappNumber: (form.elements.namedItem('whatsappNumber')  as HTMLInputElement).value,
      businessName:   (form.elements.namedItem('businessName')    as HTMLInputElement).value,
      industry:       (form.elements.namedItem('industry')        as HTMLSelectElement).value,
      teamSize:       (form.elements.namedItem('teamSize')        as HTMLSelectElement).value || undefined,
      message:        (form.elements.namedItem('message')         as HTMLTextAreaElement).value || undefined,
      type:           'demo_request',
    }

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })

      if (res.status === 429) { setErrorKind('429'); setState('error'); return }
      if (res.status === 400) { setErrorKind('400'); setState('error'); return }
      if (!res.ok)             { setErrorKind('generic'); setState('error'); return }

      setState('success')
    } catch {
      setErrorKind('generic')
      setState('error')
    }
  }

  const errorMessage =
    errorKind === '429' ? dm.error429 :
    errorKind === '400' ? dm.error400 :
    dm.errorMsg

  if (state === 'success') {
    return (
      <div style={{
        paddingTop: 'var(--nav-h)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="container">
          <div style={{
            maxWidth: 520,
            margin: '0 auto',
            padding: '4rem 0',
            textAlign: 'center',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#10B981', fontSize: '1.25rem',
            }}>
              ✓
            </div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}>
              {dm.successTitle}
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.65,
              margin: '0 0 2rem',
            }}>
              {dm.successBody}
            </p>
            <Link
              href={`/${lang}`}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              {dm.successBack}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 'var(--nav-h)', paddingBottom: '6rem' }}>
      <div className="container">
        <div
          className="demo-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            gap: '5rem',
            maxWidth: 1060,
            margin: '0 auto',
            paddingTop: '4rem',
          }}
        >
          {/* ── Context panel ─────────────────────────────────────────────── */}
          <div style={{ paddingTop: '0.25rem' }}>
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>
              {dm.eyebrow}
            </div>
            <h1 style={{
              fontSize: 'clamp(1.875rem, 3.5vw, 2.625rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}>
              {dm.headline}
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.7,
              margin: '0 0 2rem',
            }}>
              {dm.subhead}
            </p>

            <div style={{ borderTop: '1px solid var(--border-faint)', paddingTop: '2rem' }}>
              <p style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                margin: '0 0 1.5rem',
              }}>
                {dm.next.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {dm.next.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      flexShrink: 0,
                      width: 24, height: 24,
                      borderRadius: '50%',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: 'var(--text-tertiary)',
                      marginTop: '0.05rem',
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: '0 0 0.25rem',
                        letterSpacing: '-0.01em',
                      }}>
                        {step.label}
                      </p>
                      <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Form ──────────────────────────────────────────────────────── */}
          <div>
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Name + Email */}
              <div className="demo-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={groupStyle}>
                  <label htmlFor="dm-name" style={labelStyle}>{dm.fields.name.label}</label>
                  <input
                    id="dm-name" name="name" type="text" required autoComplete="name"
                    placeholder={dm.fields.name.placeholder}
                    className="demo-field"
                    style={fieldStyle}
                  />
                </div>
                <div style={groupStyle}>
                  <label htmlFor="dm-email" style={labelStyle}>{dm.fields.email.label}</label>
                  <input
                    id="dm-email" name="email" type="email" required autoComplete="email"
                    placeholder={dm.fields.email.placeholder}
                    className="demo-field"
                    style={fieldStyle}
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div style={groupStyle}>
                <label htmlFor="dm-whatsapp" style={labelStyle}>{dm.fields.whatsapp.label}</label>
                <input
                  id="dm-whatsapp" name="whatsappNumber" type="tel" required autoComplete="tel"
                  placeholder={dm.fields.whatsapp.placeholder}
                  className="demo-field"
                  style={fieldStyle}
                />
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  margin: '0.3rem 0 0',
                  lineHeight: 1.5,
                }}>
                  {dm.fields.whatsapp.hint}
                </p>
              </div>

              {/* Business name */}
              <div style={groupStyle}>
                <label htmlFor="dm-business" style={labelStyle}>{dm.fields.businessName.label}</label>
                <input
                  id="dm-business" name="businessName" type="text" required autoComplete="organization"
                  placeholder={dm.fields.businessName.placeholder}
                  className="demo-field"
                  style={fieldStyle}
                />
              </div>

              {/* Industry */}
              <div style={groupStyle}>
                <label htmlFor="dm-industry" style={labelStyle}>{dm.fields.industry.label}</label>
                <select
                  id="dm-industry" name="industry" required defaultValue=""
                  className="demo-field demo-select"
                  style={fieldStyle}
                >
                  <option value="" disabled>{dm.fields.industry.placeholder}</option>
                  {dm.fields.industry.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Divider before optional fields */}
              <div style={{ borderTop: '1px solid var(--border-faint)', margin: '0.25rem 0' }} />

              {/* Team size (optional) */}
              <div style={groupStyle}>
                <label htmlFor="dm-teamsize" style={labelStyle}>
                  {dm.fields.teamSize.label}{' '}
                  <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>
                    {dm.fields.teamSize.optional}
                  </span>
                </label>
                <select
                  id="dm-teamsize" name="teamSize" defaultValue=""
                  className="demo-field demo-select"
                  style={fieldStyle}
                >
                  <option value="">{dm.fields.teamSize.placeholder}</option>
                  {dm.fields.teamSize.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Message (optional) */}
              <div style={groupStyle}>
                <label htmlFor="dm-message" style={labelStyle}>
                  {dm.fields.message.label}{' '}
                  <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>
                    {dm.fields.message.optional}
                  </span>
                </label>
                <textarea
                  id="dm-message" name="message" rows={4}
                  placeholder={dm.fields.message.placeholder}
                  className="demo-field"
                  style={{ ...fieldStyle, resize: 'vertical', minHeight: 96 }}
                />
              </div>

              {/* Error */}
              {state === 'error' && (
                <p
                  role="alert"
                  style={{
                    fontSize: '0.875rem',
                    color: '#EF4444',
                    margin: 0,
                    padding: '0.65rem 0.9rem',
                    background: 'rgba(239,68,68,0.06)',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid rgba(239,68,68,0.18)',
                  }}
                >
                  {errorMessage}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: state === 'loading' ? 'var(--text-tertiary)' : 'var(--cta-bg)',
                  color: 'var(--cta-text)',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  padding: '0.85rem 2rem',
                  borderRadius: 'var(--r-md)',
                  border: 'none',
                  cursor: state === 'loading' ? 'wait' : 'pointer',
                  transition: 'background var(--dur-base)',
                  marginTop: '0.5rem',
                  width: '100%',
                  letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {state === 'loading' ? dm.submitting : dm.submit}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .demo-field:focus {
          border-color: var(--neutral-7) !important;
          box-shadow: 0 0 0 3px rgba(28,26,24,0.06);
          outline: none;
        }
        .demo-select option {
          background: var(--neutral-pure);
          color: var(--text-primary);
        }
        @media (max-width: 820px) {
          .demo-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (max-width: 500px) {
          .demo-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
