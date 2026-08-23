import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'

const NAV_LINKS = (lang: string, es: boolean) => [
  { href: `/${lang}/#how-nora-works`, label: es ? 'Cómo trabaja'          : 'How NORA works' },
  { href: `/${lang}/#try-nora`,       label: es ? 'Prueba NORA'           : 'Try NORA' },
  { href: `/${lang}/privacy-policy`,  label: es ? 'Privacidad'            : 'Privacy' },
  { href: `/${lang}/terms-of-service`,label: es ? 'Términos'              : 'Terms' },
  { href: `/${lang}/data-deletion`,   label: es ? 'Eliminación de datos'  : 'Data deletion' },
  { href: `/${lang}/contact`,         label: es ? 'Contacto'              : 'Contact' },
]

export function Footer({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  return (
    <footer
      role="contentinfo"
      style={{
        background: 'var(--neutral-10)',
        color: 'var(--dark-text-muted)',
        padding: '3rem 0 2rem',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          gap: '2rem', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '28ch' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Image src="/brand/nora-icon.png" alt="NORA" width={28} height={28} />
              <span style={{
                fontWeight: 700, fontSize: '0.9375rem',
                color: 'var(--dark-text)', letterSpacing: '0.04em',
                fontFamily: 'var(--font-body)',
              }}>
                NORA
              </span>
            </span>
            <p style={{ fontSize: '0.875rem', color: 'var(--dark-text-muted)', lineHeight: 1.65, margin: 0 }}>
              {es
                ? 'Networked Operations & Response Assistant. Menos persecución. Más control. Más paz mental.'
                : 'Networked Operations & Response Assistant. Less chasing. More control. More peace of mind.'}
            </p>
          </div>

          <nav
            aria-label={es ? 'Pie de página' : 'Footer'}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
          >
            {NAV_LINKS(lang, es).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: '0.875rem', color: 'var(--dark-text-muted)',
                  textDecoration: 'none', transition: 'color 150ms ease',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--dark-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--dark-text-faint)' }}>
            © 2026 NORA.{' '}
            {es ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--dark-text-faint)' }}>
            neednora.com
          </span>
        </div>
      </div>
    </footer>
  )
}
