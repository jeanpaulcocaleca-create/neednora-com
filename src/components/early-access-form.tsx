'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/i18n'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const fieldStyle: React.CSSProperties = {
  background: '#0A0E18',
  border: '1px solid #1E2840',
  borderRadius: 'var(--r)',
  color: '#EEF2FF',
  fontSize: '0.9375rem',
  padding: '0.7rem 0.9rem',
  width: '100%',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  transition: 'border-color 200ms, box-shadow 200ms',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#7A8AAA',
  display: 'block',
  marginBottom: '0.35rem',
}

function focusField(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'rgba(0,180,216,0.55)'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,180,216,0.08)'
}
function blurField(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = '#1E2840'
  e.currentTarget.style.boxShadow = 'none'
}

export function EarlyAccessForm({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const ea = t.earlyAccess
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name:     (form.elements.namedItem('name')     as HTMLInputElement).value,
      business: (form.elements.namedItem('business') as HTMLInputElement).value,
      whatsapp: (form.elements.namedItem('whatsapp') as HTMLInputElement).value,
      industry: (form.elements.namedItem('industry') as HTMLSelectElement).value,
      message:  (form.elements.namedItem('message')  as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'early_access' }),
      })
      if (!res.ok) throw new Error('Request failed')
      setState('success')
    } catch {
      setState('error')
      setErrorMsg(ea.errorMsg)
    }
  }

  if (state === 'success') {
    return (
      <section
        id="early-access"
        style={{ background: 'var(--ds-bg)', padding: '8rem 0', scrollMarginTop: 'var(--nav-h)' }}
      >
        <div className="container">
          <div style={{
            maxWidth: 520, margin: '0 auto',
            textAlign: 'center', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
          }}>
            <CheckCircle size={48} color="var(--ok)" strokeWidth={1.5} aria-hidden="true" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ds-fg)' }}>
              {ea.successTitle}
            </h2>
            <p style={{ color: 'var(--ds-muted)', fontSize: '1rem', textAlign: 'center', lineHeight: 1.65 }}>
              {ea.successBody}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="early-access"
      style={{
        background: 'var(--ds-bg)',
        padding: '8rem 0',
        scrollMarginTop: 'var(--nav-h)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: 700, height: 400,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative' }}>
        <div className="ea-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

          {/* Left: Form */}
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: '0.85rem' }}>
                {ea.eyebrow}
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 700, letterSpacing: '-0.028em', lineHeight: 1.1,
                  color: 'var(--ds-fg)', marginBottom: '0.75rem',
                }}
              >
                {ea.headline}
              </h2>
              <p style={{ color: 'var(--ds-muted)', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
                {ea.subhead}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="ea-name" style={labelStyle}>{ea.fields.name.label}</label>
                <input
                  id="ea-name" name="name" type="text" required autoComplete="name"
                  placeholder={ea.fields.name.placeholder}
                  style={fieldStyle}
                  onFocus={focusField} onBlur={blurField}
                />
              </div>

              <div>
                <label htmlFor="ea-business" style={labelStyle}>{ea.fields.business.label}</label>
                <input
                  id="ea-business" name="business" type="text" required autoComplete="organization"
                  placeholder={ea.fields.business.placeholder}
                  style={fieldStyle}
                  onFocus={focusField} onBlur={blurField}
                />
              </div>

              <div>
                <label htmlFor="ea-whatsapp" style={labelStyle}>{ea.fields.whatsapp.label}</label>
                <input
                  id="ea-whatsapp" name="whatsapp" type="tel" required autoComplete="tel"
                  placeholder={ea.fields.whatsapp.placeholder}
                  style={fieldStyle}
                  onFocus={focusField} onBlur={blurField}
                />
              </div>

              <div>
                <label htmlFor="ea-industry" style={labelStyle}>{ea.fields.industry.label}</label>
                <select
                  id="ea-industry" name="industry" required defaultValue=""
                  style={{ ...fieldStyle, color: '#EEF2FF' }}
                  onFocus={focusField} onBlur={blurField}
                >
                  <option value="" disabled style={{ color: '#4A5A7A' }}>{ea.fields.industry.placeholder}</option>
                  {ea.fields.industry.options.map(ind => (
                    <option key={ind} value={ind} style={{ background: '#0A0E18', color: '#EEF2FF' }}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ea-message" style={labelStyle}>
                  {ea.fields.message.label}{' '}
                  <span style={{ color: '#4A5A7A', fontWeight: 400 }}>{ea.fields.message.optional}</span>
                </label>
                <textarea
                  id="ea-message" name="message" rows={3}
                  placeholder={ea.fields.message.placeholder}
                  style={{ ...fieldStyle, resize: 'vertical', minHeight: 80 }}
                  onFocus={focusField} onBlur={blurField}
                />
              </div>

              {state === 'error' && (
                <p
                  role="alert"
                  style={{
                    fontSize: '0.875rem', color: 'var(--danger)', margin: 0,
                    padding: '0.75rem', background: 'rgba(239,68,68,0.08)',
                    borderRadius: 'var(--r-sm)', border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.4rem',
                  background: state === 'loading' ? '#1E2840' : 'var(--blue)',
                  color: state === 'loading' ? 'var(--ds-muted)' : '#ffffff',
                  fontWeight: 600, fontSize: '0.9375rem',
                  padding: '0.85rem 1.5rem',
                  borderRadius: 'var(--r)', border: 'none',
                  cursor: state === 'loading' ? 'wait' : 'pointer',
                  transition: 'background var(--t)',
                  letterSpacing: '-0.01em',
                  marginTop: '0.25rem',
                  boxShadow: state === 'loading' ? 'none' : '0 4px 16px rgba(59,130,246,0.3)',
                }}
              >
                {state === 'loading' ? ea.submitting : ea.submit}
                {state !== 'loading' && <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />}
              </button>
            </form>
          </div>

          {/* Right: What happens next */}
          <div style={{ paddingTop: '0.5rem' }}>
            <div style={{
              fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--ds-subtle)',
              marginBottom: '2rem',
            }}>
              {ea.nextStepsTitle}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {ea.nextSteps.map((s, i) => (
                <div key={s.step} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      border: '1px solid var(--ds-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--ds-raised)',
                      fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)',
                      letterSpacing: '0.04em',
                    }}>
                      {s.step}
                    </div>
                    {i < ea.nextSteps.length - 1 && (
                      <div style={{ width: 1, flex: 1, minHeight: 32, background: 'var(--ds-border)', marginTop: '0.5rem' }} aria-hidden="true" />
                    )}
                  </div>
                  <div style={{ paddingTop: '0.35rem' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ds-fg)', marginBottom: '0.35rem', letterSpacing: '-0.015em' }}>
                      {s.title}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--ds-muted)', lineHeight: 1.6, margin: 0 }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ea-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  )
}
