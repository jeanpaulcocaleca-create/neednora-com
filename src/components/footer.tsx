import Link from 'next/link'
import { getTranslations, type Locale } from '@/lib/i18n'

export function Footer({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)

  const links = t.footer.links.map(l => ({
    href: `/${lang}${l.href}`,
    label: l.label,
  }))

  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--rim)',
        background: 'var(--raised)',
        padding: '3rem 0 2.5rem',
        marginTop: '6rem',
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--accent)', flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.01em', color: 'var(--fg)' }}>
                NORA
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--subtle)', maxWidth: 'none', lineHeight: 1.5 }}>
              {t.footer.tagline}
            </p>
          </div>

          <nav aria-label="Footer" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1.25rem' }}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: '0.8125rem', color: 'var(--muted)', transition: 'color var(--t)', whiteSpace: 'nowrap' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <hr className="divider" style={{ margin: '2rem 0 1.5rem' }} aria-hidden="true" />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p style={{ margin: 0, fontSize: '0.78125rem', color: 'var(--subtle)', maxWidth: 'none' }}>
            {t.footer.copyright}
          </p>
          <p style={{ margin: 0, fontSize: '0.78125rem', color: 'var(--subtle)', fontFamily: 'var(--font-mono)', maxWidth: 'none' }}>
            neednora.com
          </p>
        </div>
      </div>
    </footer>
  )
}
