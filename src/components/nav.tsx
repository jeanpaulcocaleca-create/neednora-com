'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { useContact } from '@/lib/contact-context'

// Nav manages only two local states:
// – scrolled: adds .scrolled class at scrollY > 24 (matches site.js original threshold)
// – menuOpen: adds body.menu-open and .nav-overlay.open
// body.light-nav is driven by SiteEffects (IntersectionObserver on [data-nav="light"]),
// exactly as the original site.js does — all body.light-nav CSS rules fire correctly.
export function Nav({ lang }: { lang: Locale }) {
  const { open: onOpenContact } = useContact()
  const es = lang === 'es'
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let last = false
    function onScroll() {
      const s = window.scrollY > 24
      if (s !== last) { last = s; setScrolled(s) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const altLang = es ? 'en' : 'es'
  const altLangLabel = es ? 'EN' : 'ES'

  function handleContactClick(e: React.MouseEvent) {
    e.preventDefault()
    setMenuOpen(false)
    onOpenContact()
  }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} aria-label="Main">
        <Link className="nav-mark" href={`/${lang}`}>
          <span className="dot" aria-hidden="true" />NORA
        </Link>
        <ul className="nav-links">
          <li><Link href={`/${lang}/how-it-works`}>{es ? 'Cómo funciona NORA' : 'How NORA works'}</Link></li>
          <li><Link href={`/${lang}/industries`}>{es ? 'Industrias' : 'Industries'}</Link></li>
          <li><Link href={`/${lang}/pricing`}>{es ? 'Precios' : 'Pricing'}</Link></li>
          <li><Link href={`/${lang}/about`}>{es ? 'Nosotros' : 'About'}</Link></li>
        </ul>
        <div className="nav-right">
          <Link className="nav-lang" href={`/${altLang}`} lang={altLang} hrefLang={altLang}>
            {altLangLabel}
          </Link>
          <button className="btn btn-solid" onClick={handleContactClick}>
            {es ? 'Hablar con NORA' : 'Talk to NORA'}
          </button>
          <button
            className="nav-burger"
            aria-label={menuOpen ? 'Close menu' : 'Menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-overlay${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <Link href={`/${lang}/how-it-works`} onClick={() => setMenuOpen(false)}>
          {es ? 'Cómo funciona NORA' : 'How NORA works'}
        </Link>
        <Link href={`/${lang}/industries`} onClick={() => setMenuOpen(false)}>
          {es ? 'Industrias' : 'Industries'}
        </Link>
        <Link href={`/${lang}/pricing`} onClick={() => setMenuOpen(false)}>
          {es ? 'Precios' : 'Pricing'}
        </Link>
        <Link href={`/${lang}/about`} onClick={() => setMenuOpen(false)}>
          {es ? 'Nosotros' : 'About'}
        </Link>
        <button className="btn btn-solid" style={{ marginTop: '2rem' }} onClick={handleContactClick}>
          {es ? 'Hablar con NORA' : 'Talk to NORA'}
        </button>
        <Link
          className="nav-lang"
          href={`/${altLang}`}
          lang={altLang}
          hrefLang={altLang}
          onClick={() => setMenuOpen(false)}
        >
          {es ? 'English' : 'Español'}
        </Link>
      </div>
    </>
  )
}
