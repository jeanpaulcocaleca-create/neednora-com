'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Ports the global site.js behavior layer:
// – .rev / .rev-seq entrance reveal system
// – .sec / .hero-stage → anim-on toggle
// – [data-nav="light"] → body.light-nav
// – qline scroll driver (--q CSS custom property)
// – visibilitychange → body.paused
// pathname dep: re-runs on every client navigation so new page's elements are observed
export function SiteEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)')
    const timers: ReturnType<typeof setTimeout>[] = []

    // ── ENTRANCES: .rev, .rev-seq → .in ──
    const revEls = document.querySelectorAll<HTMLElement>('.rev, .rev-seq')
    const entranceIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        el.classList.add('in')
        if (el.classList.contains('rev-seq')) {
          const t = setTimeout(() => el.classList.add('done'), 1600)
          timers.push(t)
        }
        entranceIO.unobserve(el)
      })
    }, { threshold: 0.22 })

    if (reduceMQ.matches) {
      // Reduced motion: reveal everything immediately
      revEls.forEach(el => { el.classList.add('in'); if (el.classList.contains('rev-seq')) el.classList.add('done') })
    } else {
      revEls.forEach(el => entranceIO.observe(el))
    }

    // ── ANIM-ON: .sec, .hero-stage → toggle .anim-on for ambient loops ──
    const animIO = new IntersectionObserver(entries => {
      entries.forEach(e => (e.target as HTMLElement).classList.toggle('anim-on', e.isIntersecting))
    }, { threshold: 0.05 })

    document.querySelectorAll<HTMLElement>('.sec, .hero-stage').forEach(s => animIO.observe(s))

    // ── LIGHT-NAV: [data-nav="light"] → body.light-nav ──
    const lightNow = new Set<Element>()
    const lightIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) lightNow.add(e.target)
        else lightNow.delete(e.target)
      })
      document.body.classList.toggle('light-nav', lightNow.size > 0)
    }, { rootMargin: '0px 0px -94% 0px' })

    document.querySelectorAll<HTMLElement>('[data-nav="light"]').forEach(s => lightIO.observe(s))

    // ── QLINE: scroll → CSS --q variable ──
    const qline = document.querySelector<HTMLElement>('.qline')
    let lastQ = -1
    let raf: number | null = null

    function driveQ() {
      raf = null
      if (!qline) return
      const host = qline.parentElement
      if (!host) return
      const r = host.getBoundingClientRect()
      const total = r.height - window.innerHeight * 0.5
      const q = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.72) / total))
      if (Math.abs(q - lastQ) > 0.004) {
        lastQ = q
        qline.style.setProperty('--q', q.toFixed(3))
      }
    }

    function onScroll() {
      if (raf === null) raf = requestAnimationFrame(driveQ)
    }

    if (reduceMQ.matches) {
      if (qline) qline.style.setProperty('--q', '1')
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
      driveQ()
    }

    // ── HRULE: secondary page hero rule entrance (site.js threshold 0.5) ──
    const hruleIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        e.target.classList.add('in')
        hruleIO.unobserve(e.target)
      })
    }, { threshold: 0.5 })
    document.querySelectorAll<HTMLElement>('.hrule').forEach(el => hruleIO.observe(el))

    // ── MINI-CHAT: industry page chat bubbles stagger in on reach ──
    const miniChatIOs: IntersectionObserver[] = []
    if (!reduceMQ.matches) {
      document.querySelectorAll<HTMLElement>('.mini-chat').forEach(chat => {
        chat.classList.add('arm')
        const mio = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting) return
          mio.disconnect()
          const kids = Array.from(chat.children) as HTMLElement[]
          kids.forEach((k, i) => {
            setTimeout(() => k.classList.add('shown'), 350 + i * 520)
          })
        }, { threshold: 0.45 })
        mio.observe(chat)
        miniChatIOs.push(mio)
      })
    }

    // ── PAUSED: tab visibility ──
    function onVisibility() {
      document.body.classList.toggle('paused', document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ── REDUCED-MOTION LIVE: re-apply when user changes OS setting ──
    function onRM() {
      if (reduceMQ.matches) {
        document.querySelectorAll<HTMLElement>('.rev, .rev-seq').forEach(el => {
          el.classList.add('in')
          if (el.classList.contains('rev-seq')) el.classList.add('done')
        })
        if (qline) qline.style.setProperty('--q', '1')
      }
    }
    reduceMQ.addEventListener?.('change', onRM)

    return () => {
      entranceIO.disconnect()
      animIO.disconnect()
      lightIO.disconnect()
      hruleIO.disconnect()
      miniChatIOs.forEach(mio => mio.disconnect())
      timers.forEach(clearTimeout)
      window.removeEventListener('scroll', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      reduceMQ.removeEventListener?.('change', onRM)
      document.body.classList.remove('light-nav', 'paused')
    }
  }, [pathname])

  return null
}
