'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/i18n'

const CONTACT_EMAIL = 'jeanpaulcocaleca@gmail.com'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function Contact({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = use(params)
  const t = getTranslations(lang)
  const ct = t.contact
  const [state, setState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      type: 'contact',
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="container">
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '4rem 0 6rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>{ct.title}</div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
              {ct.headline}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: 0, maxWidth: '45ch' }}>
              {ct.subhead}
            </p>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.9rem',
              background: 'var(--surface)', border: '1px solid var(--rim)',
              borderRadius: 'var(--r-lg)', padding: '1.1rem 1.25rem',
              marginBottom: '2.5rem', transition: 'border-color var(--t)', textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--rim)')}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--r)',
              background: 'var(--accent-10)', border: '1px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Mail size={16} color="var(--accent)" strokeWidth={1.75} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--subtle)', marginBottom: '0.15rem' }}>
                {ct.directLabel}
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--fg)' }}>
                {CONTACT_EMAIL}
              </div>
            </div>
          </a>

          {state === 'success' ? (
            <div style={{
              background: 'var(--ok-10)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--r-lg)', padding: '1.5rem', textAlign: 'center',
            }}>
              <p style={{ color: 'var(--ok)', fontWeight: 500, fontSize: '0.9375rem', margin: '0 0 0.5rem' }}>
                {ct.successTitle}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', margin: 0 }}>{ct.successBody}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="contact-row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label htmlFor="c-name" style={labelStyle}>{ct.fields.name.label}</label>
                  <input
                    id="c-name" name="name" type="text" required autoComplete="name"
                    placeholder={ct.fields.name.placeholder}
                    style={fieldStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label htmlFor="c-email" style={labelStyle}>{ct.fields.email.label}</label>
                  <input
                    id="c-email" name="email" type="email" required autoComplete="email"
                    placeholder={ct.fields.email.placeholder}
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label htmlFor="c-subject" style={labelStyle}>{ct.fields.subject.label}</label>
                <select
                  id="c-subject" name="subject" required defaultValue=""
                  style={{ ...fieldStyle, color: 'var(--fg)' }}
                >
                  <option value="" disabled>{ct.fields.subject.placeholder}</option>
                  {ct.fields.subject.options.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label htmlFor="c-message" style={labelStyle}>{ct.fields.message.label}</label>
                <textarea
                  id="c-message" name="message" rows={5} required
                  placeholder={ct.fields.message.placeholder}
                  style={{ ...fieldStyle, resize: 'vertical', minHeight: 120 }}
                />
              </div>

              {state === 'error' && (
                <p role="alert" style={{
                  fontSize: '0.875rem', color: 'var(--danger)', margin: 0,
                  padding: '0.65rem 0.9rem', background: 'rgba(239,68,68,0.08)',
                  borderRadius: 'var(--r-sm)', border: '1px solid rgba(239,68,68,0.2)',
                }}>
                  {ct.errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.4rem',
                  background: state === 'loading' ? 'var(--subtle)' : 'var(--blue)',
                  color: '#ffffff', fontWeight: 600, fontSize: '0.9375rem',
                  padding: '0.75rem 1.4rem', borderRadius: 'var(--r)', border: 'none',
                  cursor: state === 'loading' ? 'wait' : 'pointer',
                  transition: 'background var(--t)', marginTop: '0.25rem', alignSelf: 'flex-start',
                }}
              >
                {state === 'loading' ? ct.submitting : ct.submit}
                {state !== 'loading' && <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />}
              </button>
            </form>
          )}

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rim)' }}>
            <Link href={`/${lang}`} style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
              ← {lang === 'es' ? 'Volver a neednora.com' : 'Back to neednora.com'}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 500px) {
          .contact-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.8125rem', fontWeight: 500, color: 'var(--muted)', letterSpacing: '-0.01em',
}

const fieldStyle: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--rim)',
  borderRadius: 'var(--r)', color: 'var(--fg)',
  fontSize: '0.9375rem', padding: '0.65rem 0.85rem',
  width: '100%', outline: 'none', fontFamily: 'var(--font-sans)',
}
