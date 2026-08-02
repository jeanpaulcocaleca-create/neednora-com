'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Menu } from 'lucide-react'
import { getTranslations, locales, type Locale } from '@/lib/i18n'

function getAlternatePath(pathname: string, targetLocale: Locale): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return `/${targetLocale}`
    if (pathname.startsWith(`/${locale}/`)) return `/${targetLocale}${pathname.slice(locale.length + 1)}`
  }
  return `/${targetLocale}`
}

export function Nav({ lang }: { lang: Locale }) {
  const t = getTranslations(lang)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const altLang: Locale = lang === 'es' ? 'en' : 'es'
  const altPath = getAlternatePath(pathname, altLang)

  const desktopLinks = [
    { href: `/${lang}/#product-story`, label: t.nav.howItWorks },
    { href: `/${lang}/#capabilities`, label: t.nav.forBusiness },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ]

  const mobileLinks = [
    { href: `/${lang}/#product-story`, label: t.nav.howItWorks },
    { href: `/${lang}/#capabilities`, label: t.nav.forBusiness },
    { href: `/${lang}/privacy-policy`, label: 'Privacy Policy' },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <style>{`
        .nav-desktop { display: none; }
        .nav-toggle  { display: flex; }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
          .nav-toggle  { display: none; }
        }
      `}</style>

      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 'var(--nav-h)',
          zIndex: 100,
          background: scrolled ? 'var(--raised)' : 'var(--bg)',
          borderBottom: `1px solid ${scrolled ? 'var(--rim)' : 'transparent'}`,
          transition: 'background 250ms var(--ease), border-color 250ms var(--ease)',
        }}
      >
        <div
          className="container"
          style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* ── Wordmark ── */}
          <Link
            href={`/${lang}`}
            aria-label="NORA — Home"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
          >
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <rect x="0.5" y="0.5" width="13" height="13" rx="2.5"
                stroke="var(--accent)" strokeWidth="1.25" fill="none" />
              <rect x="3.5" y="3.5" width="7" height="7" rx="1"
                fill="var(--accent)" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.06em',
                color: 'var(--fg)',
              }}
            >
              NORA
            </span>
          </Link>

          {/* ── Desktop navigation ── */}
          <nav
            aria-label="Primary"
            className="nav-desktop"
            style={{ alignItems: 'center', gap: '0.25rem' }}
          >
            {desktopLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '0.35rem 0.7rem',
                  borderRadius: 'var(--r-sm)',
                  transition: 'color var(--t), background var(--t)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--fg)'
                  e.currentTarget.style.background = 'var(--raised)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {label}
              </Link>
            ))}

            {/* Language toggle */}
            <Link
              href={altPath}
              aria-label={`Switch to ${altLang === 'es' ? 'Español' : 'English'}`}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: 'var(--muted)',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--rim)',
                transition: 'color var(--t), border-color var(--t)',
                textDecoration: 'none',
                marginLeft: '0.25rem',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--fg)'
                e.currentTarget.style.borderColor = 'var(--accent-border)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.borderColor = 'var(--rim)'
              }}
            >
              {altLang.toUpperCase()}
            </Link>

            <div style={{ width: 1, height: 18, background: 'var(--rim)', margin: '0 0.5rem' }} aria-hidden="true" />
            <Link
              href={`/${lang}/#early-access`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'var(--blue)',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--r-sm)',
                transition: 'background var(--t)',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--blue)')}
            >
              {t.nav.earlyAccess}
            </Link>
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(v => !v)}
            className="nav-toggle"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--fg)', padding: '0.3rem', alignItems: 'center',
            }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        aria-hidden={!open}
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'var(--bg)',
          display: 'flex', flexDirection: 'column',
          padding: 'calc(var(--nav-h) + 2rem) var(--gutter) 3rem',
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          opacity: open ? 1 : 0,
          transition: 'transform 280ms var(--ease), opacity 280ms var(--ease)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <nav aria-label="Mobile" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {mobileLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                fontSize: '1.375rem', fontWeight: 600,
                letterSpacing: '-0.02em', color: 'var(--muted)',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--rim)',
                display: 'block',
              }}
            >
              {label}
            </Link>
          ))}
          {/* Language switcher in mobile */}
          <Link
            href={altPath}
            onClick={() => setOpen(false)}
            style={{
              fontSize: '1.375rem', fontWeight: 600,
              letterSpacing: '-0.02em', color: 'var(--subtle)',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--rim)',
              display: 'block',
            }}
          >
            {altLang === 'es' ? 'Español' : 'English'}
          </Link>
        </nav>
        <Link
          href={`/${lang}/#early-access`}
          onClick={() => setOpen(false)}
          style={{
            marginTop: '2rem', display: 'block', textAlign: 'center',
            background: 'var(--blue)', color: '#ffffff',
            fontSize: '1rem', fontWeight: 600,
            padding: '0.9rem 1.5rem', borderRadius: 'var(--r)',
          }}
        >
          {t.nav.earlyAccess}
        </Link>
      </div>
    </>
  )
}
