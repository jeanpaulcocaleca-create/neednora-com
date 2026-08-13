'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Menu } from 'lucide-react'
import { NoraBrand } from '@/components/brand'
import { locales, type Locale } from '@/lib/i18n'

function getAlternatePath(pathname: string, targetLocale: Locale): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return `/${targetLocale}`
    if (pathname.startsWith(`/${locale}/`)) return `/${targetLocale}${pathname.slice(locale.length + 1)}`
  }
  return `/${targetLocale}`
}

export function Nav({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const altLang: Locale = es ? 'en' : 'es'
  const altPath = getAlternatePath(pathname, altLang)

  const links = [
    { href: `/${lang}/#how-nora-works`, label: es ? 'Cómo trabaja' : 'How NORA works' },
    { href: `/${lang}/#try-nora`, label: es ? 'Prueba NORA' : 'Try NORA' },
    { href: `/${lang}/#product-story`, label: es ? 'Ver un caso' : 'See it in action' },
    { href: `/${lang}/contact`, label: es ? 'Contacto' : 'Contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container site-nav-inner">
          <Link href={`/${lang}`} aria-label="NORA — Home" className="nav-brand">
            <NoraBrand compact priority />
          </Link>

          <nav aria-label="Primary" className="nav-desktop-premium">
            {links.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            <Link href={altPath} className="language-chip" aria-label={`Switch to ${altLang}`}>{altLang.toUpperCase()}</Link>
            <Link href={`/${lang}/#try-nora`} className="nav-try-button">{es ? 'PRUEBA NORA' : 'TRY NORA'}</Link>
          </nav>

          <button className="nav-toggle-premium" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu-premium ${open ? 'open' : ''}`} aria-hidden={!open}>
        <nav>
          {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link href={altPath} onClick={() => setOpen(false)}>{altLang === 'es' ? 'Español' : 'English'}</Link>
        </nav>
        <Link href={`/${lang}/#try-nora`} onClick={() => setOpen(false)} className="btn-primary-premium">{es ? 'PRUEBA NORA' : 'TRY NORA'}</Link>
      </div>
    </>
  )
}
