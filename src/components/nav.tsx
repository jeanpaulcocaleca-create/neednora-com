'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X, Menu, MessageCircle, ChevronDown, ArrowLeft, Check } from 'lucide-react'
import { locales, type Locale } from '@/lib/i18n'
import { INDUSTRY_TAXONOMY, type SubIndustry } from '@/lib/industries'

const WHATSAPP_URL = process.env.NEXT_PUBLIC_NORA_WHATSAPP_URL ?? ''

function getAlternatePath(pathname: string, target: Locale): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return `/${target}`
    if (pathname.startsWith(`/${locale}/`)) return `/${target}${pathname.slice(locale.length + 1)}`
  }
  return `/${target}`
}

// ── Waitlist form — shared between desktop dropdown and mobile menu ──────────

type WaitlistStatus = 'idle' | 'loading' | 'success' | 'error'

function WaitlistForm({
  industry,
  lang,
  onBack,
  onSuccess,
}: {
  industry: SubIndustry
  lang: Locale
  onBack: () => void
  onSuccess: () => void
}) {
  const es = lang === 'es'
  const [email, setEmail] = useState('')
  const [business, setBusiness] = useState('')
  const [status, setStatus] = useState<WaitlistStatus>('idle')
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess

  useEffect(() => {
    if (status !== 'success') return
    const t = setTimeout(() => onSuccessRef.current(), 2400)
    return () => clearTimeout(t)
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          businessName: business.trim() || undefined,
          industry: industry.id,
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const industryName = es ? industry.es : industry.en

  if (status === 'success') {
    return (
      <div className="nav-waitlist-success" role="status" aria-live="polite">
        <div className="nav-waitlist-success-icon" aria-hidden="true">
          <Check size={16} strokeWidth={2.5} />
        </div>
        <p className="nav-waitlist-success-title">
          {es ? '¡Anotado!' : "You're on the list."}
        </p>
        <p className="nav-waitlist-success-sub">
          {es
            ? `Te avisaremos cuando NORA para ${industryName} esté disponible.`
            : `We'll notify you when NORA for ${industryName} launches.`}
        </p>
      </div>
    )
  }

  return (
    <form className="nav-waitlist-form" onSubmit={handleSubmit} noValidate>
      <button type="button" className="nav-waitlist-back" onClick={onBack}>
        <ArrowLeft size={13} aria-hidden="true" />
        {es ? 'Todas las industrias' : 'All industries'}
      </button>
      <p className="nav-waitlist-headline">
        {es ? `NORA para ${industryName} llega pronto.` : `NORA for ${industryName} is coming soon.`}
      </p>
      <p className="nav-waitlist-sub">
        {es ? 'Sé el primero en saber cuándo lanza.' : 'Be the first to know when it launches.'}
      </p>
      <div className="nav-waitlist-fields">
        <input
          type="email"
          className="nav-waitlist-input"
          placeholder={es ? 'tu@email.com' : 'your@email.com'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          aria-label={es ? 'Correo electrónico' : 'Email address'}
        />
        <input
          type="text"
          className="nav-waitlist-input"
          placeholder={es ? 'Nombre del negocio (opcional)' : 'Business name (optional)'}
          value={business}
          onChange={e => setBusiness(e.target.value)}
          aria-label={es ? 'Nombre del negocio' : 'Business name'}
        />
      </div>
      {status === 'error' && (
        <p className="nav-waitlist-error" role="alert">
          {es ? 'Algo salió mal. Por favor intenta de nuevo.' : 'Something went wrong. Please try again.'}
        </p>
      )}
      <button
        type="submit"
        className="btn btn-primary nav-waitlist-submit"
        disabled={status === 'loading' || !email.trim()}
      >
        {status === 'loading' ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Notificarme' : 'Notify me')}
      </button>
    </form>
  )
}

// ── Status chip ──────────────────────────────────────────────────────────────

function StatusChip({ status, es }: { status: SubIndustry['status']; es: boolean }) {
  const isLive = status === 'live'
  return (
    <span className={`nav-dropdown__status${isLive ? ' nav-dropdown__status--live' : ' nav-dropdown__status--soon'}`}>
      {isLive ? 'Live' : (es ? 'Pronto' : 'Soon')}
    </span>
  )
}

// ── Nav ──────────────────────────────────────────────────────────────────────

export function Nav({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [waitlistIndustry, setWaitlistIndustry] = useState<SubIndustry | null>(null)
  const [mobileWaitlistIndustry, setMobileWaitlistIndustry] = useState<SubIndustry | null>(null)
  const [activeIndustry, setActiveIndustry] = useState('hospitality')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const altLang: Locale = es ? 'en' : 'es'
  const altPath = getAlternatePath(pathname, altLang)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    document.documentElement.dataset.industry = activeIndustry
  }, [activeIndustry])

  // Click-outside closes the desktop dropdown
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOpen])

  // Escape closes the desktop dropdown
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDropdown()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOpen])

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false)
    setWaitlistIndustry(null)
  }, [])

  const handleLiveIndustrySelect = useCallback((ind: SubIndustry) => {
    setActiveIndustry(ind.id)
    closeDropdown()
    if (ind.href) router.push(`/${lang}/${ind.href}`)
  }, [closeDropdown, lang, router])

  const handleMobileLiveIndustrySelect = useCallback((ind: SubIndustry) => {
    setActiveIndustry(ind.id)
    setMobileOpen(false)
    if (ind.href) router.push(`/${lang}/${ind.href}`)
  }, [lang, router])

  const handleWaitlistSuccess = useCallback(() => {
    closeDropdown()
  }, [closeDropdown])

  const handleMobileWaitlistSuccess = useCallback(() => {
    setMobileWaitlistIndustry(null)
    setMobileOpen(false)
  }, [])

  const handleMobileWaitlistBack = useCallback(() => {
    setMobileWaitlistIndustry(null)
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

          {/* Zone 2: Nav links */}
          <nav
            aria-label={es ? 'Navegación principal' : 'Main navigation'}
            className="nora-nav__links"
          >
            <a href="#how-it-works" className="nav-link">
              {es ? 'Cómo funciona' : 'How it works'}
            </a>

            {/* Industries dropdown */}
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-link nav-dropdown__trigger${dropdownOpen ? ' nav-link--active' : ''}`}
                onClick={() => dropdownOpen ? closeDropdown() : setDropdownOpen(true)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {es ? 'Industrias' : 'Industries'}
                <ChevronDown
                  size={13}
                  aria-hidden="true"
                  className={`nav-dropdown__chevron${dropdownOpen ? ' nav-dropdown__chevron--open' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="nav-dropdown__panel"
                  role="dialog"
                  aria-label={es ? 'Menú de industrias' : 'Industries menu'}
                >
                  {waitlistIndustry ? (
                    <WaitlistForm
                      industry={waitlistIndustry}
                      lang={lang}
                      onBack={() => setWaitlistIndustry(null)}
                      onSuccess={handleWaitlistSuccess}
                    />
                  ) : (
                    <div className="nav-dropdown__categories">
                      {/* Left column: Hospitality + Trades */}
                      <div className="nav-dropdown__col">
                        {INDUSTRY_TAXONOMY.slice(0, 2).map(cat => (
                          <div key={cat.id} className="nav-dropdown__group">
                            <p className="nav-dropdown__group-label">{es ? cat.es : cat.en}</p>
                            {cat.industries.map(ind => {
                              const isLive = ind.status === 'live'
                              return (
                                <button
                                  key={ind.id}
                                  type="button"
                                  className={`nav-dropdown__item${isLive ? ' nav-dropdown__item--live' : ' nav-dropdown__item--soon'}`}
                                  onClick={() => isLive
                                    ? handleLiveIndustrySelect(ind)
                                    : setWaitlistIndustry(ind)
                                  }
                                >
                                  <span>{es ? ind.es : ind.en}</span>
                                  <StatusChip status={ind.status} es={es} />
                                </button>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                      {/* Right column: Food + Property */}
                      <div className="nav-dropdown__col">
                        {INDUSTRY_TAXONOMY.slice(2, 4).map(cat => (
                          <div key={cat.id} className="nav-dropdown__group">
                            <p className="nav-dropdown__group-label">{es ? cat.es : cat.en}</p>
                            {cat.industries.map(ind => {
                              const isLive = ind.status === 'live'
                              return (
                                <button
                                  key={ind.id}
                                  type="button"
                                  className={`nav-dropdown__item${isLive ? ' nav-dropdown__item--live' : ' nav-dropdown__item--soon'}`}
                                  onClick={() => isLive
                                    ? handleLiveIndustrySelect(ind)
                                    : setWaitlistIndustry(ind)
                                  }
                                >
                                  <span>{es ? ind.es : ind.en}</span>
                                  <StatusChip status={ind.status} es={es} />
                                </button>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <a href="#pricing" className="nav-link">
              {es ? 'Precios' : 'Pricing'}
            </a>
            <a href="#about" className="nav-link">
              {es ? 'Nosotros' : 'About'}
            </a>
          </nav>

          {/* Zone 3: Actions */}
          <div className="nora-nav__actions">
            <Link
              href={`/${lang}/demo`}
              className="btn btn-ghost nora-nav__demo-cta"
            >
              {es ? 'Solicitar demo' : 'Request a demo'}
            </Link>

            <Link
              href={`/${lang}`}
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
              onClick={() => setMobileOpen(v => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen
                ? (es ? 'Cerrar menú' : 'Close menu')
                : (es ? 'Abrir menú' : 'Open menu')
              }
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`nora-mobile-menu${mobileOpen ? ' nora-mobile-menu--open' : ''}`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label={es ? 'Menú de navegación' : 'Navigation menu'}
      >
        {/* Waitlist sub-view */}
        {mobileWaitlistIndustry ? (
          <div className="nora-mobile-menu__body">
            <WaitlistForm
              industry={mobileWaitlistIndustry}
              lang={lang}
              onBack={handleMobileWaitlistBack}
              onSuccess={handleMobileWaitlistSuccess}
            />
          </div>
        ) : (
          <>
            <nav className="nora-mobile-menu__body" aria-label={es ? 'Menú móvil' : 'Mobile menu'}>
              <a
                href="#how-it-works"
                className="nora-mobile-menu__link"
                onClick={() => setMobileOpen(false)}
              >
                {es ? 'Cómo funciona' : 'How it works'}
              </a>

              {/* Industries — full taxonomy, always visible */}
              <p className="nora-mobile-menu__section-label" role="presentation">
                {es ? 'Industrias' : 'Industries'}
              </p>
              {INDUSTRY_TAXONOMY.map(cat => (
                <div key={cat.id} className="nora-mobile-menu__category">
                  <p className="nora-mobile-menu__category-label">
                    {es ? cat.es : cat.en}
                  </p>
                  {cat.industries.map(ind => {
                    const isLive = ind.status === 'live'
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        className={`nora-mobile-menu__industry${isLive ? ' nora-mobile-menu__industry--live' : ' nora-mobile-menu__industry--soon'}`}
                        onClick={() => isLive
                          ? handleMobileLiveIndustrySelect(ind)
                          : setMobileWaitlistIndustry(ind)
                        }
                      >
                        <span>{es ? ind.es : ind.en}</span>
                        <StatusChip status={ind.status} es={es} />
                      </button>
                    )
                  })}
                </div>
              ))}

              <a
                href="#pricing"
                className="nora-mobile-menu__link"
                onClick={() => setMobileOpen(false)}
              >
                {es ? 'Precios' : 'Pricing'}
              </a>
              <a
                href="#about"
                className="nora-mobile-menu__link"
                onClick={() => setMobileOpen(false)}
              >
                {es ? 'Nosotros' : 'About'}
              </a>
            </nav>

            <div className="nora-mobile-menu__footer">
              <Link
                href={`/${lang}/demo`}
                className="btn btn-ghost nora-mobile-menu__cta"
                onClick={() => setMobileOpen(false)}
              >
                {es ? 'Solicitar demo' : 'Request a demo'}
              </Link>

              {whatsappReady ? (
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary nora-mobile-menu__cta"
                  onClick={() => setMobileOpen(false)}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {ctaLabel}
                </a>
              ) : (
                <div className="nora-mobile-menu__cta-coming">
                  <span className="nora-mobile-menu__coming-label">WhatsApp</span>
                  <p className="nora-mobile-menu__coming-desc">
                    {es
                      ? 'El número oficial de NORA estará disponible muy pronto.'
                      : 'The official NORA WhatsApp number is coming soon.'}
                  </p>
                </div>
              )}

              <Link
                href={altPath}
                className="nora-mobile-menu__lang"
                onClick={() => setMobileOpen(false)}
              >
                {altLang === 'es' ? 'Español' : 'English'}
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
