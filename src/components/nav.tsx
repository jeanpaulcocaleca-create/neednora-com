'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { X, Menu, MessageCircle } from 'lucide-react'
import { locales, type Locale } from '@/lib/i18n'

const WHATSAPP_URL = process.env.NEXT_PUBLIC_NORA_WHATSAPP_URL ?? ''

type Industry = {
  id: string
  en: string
  es: string
  active: boolean
}

const INDUSTRIES: Industry[] = [
  { id: 'hospitality',  en: 'Hospitality',  es: 'Hotelería',   active: true  },
  { id: 'painting',     en: 'Painting',     es: 'Pintura',     active: true  },
  { id: 'restaurant',   en: 'Restaurant',   es: 'Restaurante', active: true  },
  { id: 'property',     en: 'Property',     es: 'Inmobiliaria', active: false },
  { id: 'construction', en: 'Construction', es: 'Construcción', active: false },
]

function getAlternatePath(pathname: string, target: Locale): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return `/${target}`
    if (pathname.startsWith(`/${locale}/`)) return `/${target}${pathname.slice(locale.length + 1)}`
  }
  return `/${target}`
}

export function Nav({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndustry, setActiveIndustry] = useState('hospitality')
  const pathname = usePathname()
  const altLang: Locale = es ? 'en' : 'es'
  const altPath = getAlternatePath(pathname, altLang)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    document.documentElement.dataset.industry = activeIndustry
  }, [activeIndustry])

  const switchIndustry = useCallback((id: string) => {
    setActiveIndustry(id)
  }, [])

  const whatsappReady = Boolean(WHATSAPP_URL)
  const ctaLabel = es ? 'Habla con NORA' : 'Talk to NORA'
  const ctaSoon = es ? 'Próximamente disponible' : 'Coming soon'

  return (
    <>
      <header
        className={`nora-nav${scrolled ? ' nora-nav--scrolled' : ''}`}
        role="banner"
      >
        <div className="container nora-nav__inner">

          {/* Zone 1: Logo */}
          <Link href={`/${lang}`} aria-label="NORA" className="nora-nav__logo">
            <Image
              src="/brand/nora-icon.png"
              alt=""
              width={28}
              height={28}
              priority
              aria-hidden="true"
            />
            <span className="nora-nav__wordmark">NORA</span>
          </Link>

          {/* Zone 2: Industry pills */}
          <nav aria-label={es ? 'Seleccionar industria' : 'Select industry'} className="nora-nav__industries">
            {INDUSTRIES.map(ind => {
              const isActive = activeIndustry === ind.id
              const label = es ? ind.es : ind.en
              return (
                <button
                  key={ind.id}
                  className="industry-pill"
                  data-active={isActive ? 'true' : 'false'}
                  data-coming-soon={!ind.active ? 'true' : 'false'}
                  onClick={() => ind.active && switchIndustry(ind.id)}
                  aria-pressed={isActive}
                  title={!ind.active ? ctaSoon : undefined}
                  type="button"
                >
                  {label}
                  {!ind.active && (
                    <span className="nora-nav__soon-badge" aria-hidden="true">
                      soon
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Zone 3: Language + CTA */}
          <div className="nora-nav__actions">
            <Link
              href={altPath}
              className="nora-nav__lang-switch"
              aria-label={`Switch to ${altLang === 'es' ? 'Español' : 'English'}`}
            >
              {altLang.toUpperCase()}
            </Link>

            {whatsappReady ? (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary nora-nav__cta"
              >
                <MessageCircle size={15} aria-hidden="true" />
                {ctaLabel}
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-primary nora-nav__cta nora-nav__cta--soon"
                aria-disabled="true"
                title={ctaSoon}
                onClick={e => e.preventDefault()}
              >
                <MessageCircle size={15} aria-hidden="true" />
                {ctaLabel}
              </button>
            )}

            <button
              type="button"
              className="nora-nav__hamburger"
              onClick={() => setOpen(v => !v)}
              aria-expanded={open}
              aria-label={open
                ? (es ? 'Cerrar menú' : 'Close menu')
                : (es ? 'Abrir menú' : 'Open menu')
              }
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`nora-mobile-menu${open ? ' nora-mobile-menu--open' : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label={es ? 'Menú de navegación' : 'Navigation menu'}
      >
        <div className="nora-mobile-menu__industries">
          <p className="nora-mobile-menu__section-label">
            {es ? 'Tu industria' : 'Your industry'}
          </p>
          {INDUSTRIES.map(ind => {
            const isActive = activeIndustry === ind.id
            const label = es ? ind.es : ind.en
            return (
              <button
                key={ind.id}
                type="button"
                className="industry-pill nora-mobile-menu__pill"
                data-active={isActive ? 'true' : 'false'}
                data-coming-soon={!ind.active ? 'true' : 'false'}
                aria-pressed={isActive}
                onClick={() => {
                  if (ind.active) {
                    switchIndustry(ind.id)
                    setOpen(false)
                  }
                }}
              >
                {label}
                {!ind.active && (
                  <span className="nora-nav__soon-badge" aria-hidden="true">
                    soon
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="nora-mobile-menu__footer">
          <Link
            href={altPath}
            className="nora-mobile-menu__lang"
            onClick={() => setOpen(false)}
          >
            {altLang === 'es' ? 'Español' : 'English'}
          </Link>

          {whatsappReady ? (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary nora-mobile-menu__cta"
              onClick={() => setOpen(false)}
            >
              <MessageCircle size={16} aria-hidden="true" />
              {ctaLabel}
            </a>
          ) : (
            <div className="nora-mobile-menu__cta-coming">
              <span className="nora-mobile-menu__coming-label">
                {es ? 'WhatsApp' : 'WhatsApp'}
              </span>
              <p className="nora-mobile-menu__coming-desc">
                {es
                  ? 'El número oficial de NORA estará disponible muy pronto.'
                  : 'The official NORA WhatsApp number is coming soon.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
