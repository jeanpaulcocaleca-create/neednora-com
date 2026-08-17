'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

const DISMISS_KEY = 'nora-cookie-notice-dismissed'

export function CookieNotice({ lang }: { lang: Locale }) {
  const [visible, setVisible] = useState(false)
  const es = lang === 'es'

  useEffect(() => {
    const dismissed =
      typeof sessionStorage !== 'undefined' && sessionStorage.getItem(DISMISS_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(DISMISS_KEY, '1')
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label={es ? 'Aviso de almacenamiento' : 'Storage notice'}
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(calc(100% - 2rem), 520px)',
        background: 'var(--surface)',
        border: '1px solid var(--rim)',
        borderRadius: 'var(--r)',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: 9999,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        fontSize: '0.8125rem',
        color: 'var(--muted)',
        lineHeight: 1.5,
      }}
    >
      <p style={{ margin: 0, flex: 1 }}>
        {es ? (
          <>
            Este sitio usa{' '}
            <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>sessionStorage</strong>{' '}
            solo para la demostración. No se usan cookies de seguimiento.{' '}
            <Link href={`/${lang}/cookie-policy`} style={{ color: 'var(--accent)', whiteSpace: 'nowrap' }}>
              Más info
            </Link>
          </>
        ) : (
          <>
            This site uses{' '}
            <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>sessionStorage</strong>{' '}
            for the demo only. No tracking cookies.{' '}
            <Link href={`/${lang}/cookie-policy`} style={{ color: 'var(--accent)', whiteSpace: 'nowrap' }}>
              Learn more
            </Link>
          </>
        )}
      </p>
      <button
        onClick={dismiss}
        aria-label={es ? 'Cerrar aviso' : 'Dismiss notice'}
        style={{
          flexShrink: 0,
          background: 'none',
          border: '1px solid var(--rim)',
          borderRadius: 'var(--r)',
          padding: '0.3rem 0.75rem',
          cursor: 'pointer',
          color: 'var(--fg)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {es ? 'Entendido' : 'Got it'}
      </button>
    </div>
  )
}
