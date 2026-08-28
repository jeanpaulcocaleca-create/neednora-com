'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n'
import { useContact } from '@/lib/contact-context'

export function Hero({ lang }: { lang: Locale }) {
  const { open: onOpenContact } = useContact()
  const es = lang === 'es'
  const stageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const hero = heroRef.current!
    const video = stage.querySelector<HTMLVideoElement>('#hero-video')!
    const posterLayer = stage.querySelector<HTMLDivElement>('.hero-poster')!
    const ringWrap = stage.querySelector<HTMLDivElement>('.ring-wrap')
    const ringCircle = stage.querySelector<SVGCircleElement>('.ring circle')

    const VIDEO_URL = '/videos/hero-scrub.mp4'
    const POSTER_URL = '/img/hero-poster.jpg'
    const VIDEO_BYTES = 3771959

    // ── bands ──
    const bandEls = Array.from(stage.querySelectorAll<HTMLDivElement>('.band'))
    const bands = bandEls.map(el => ({
      el,
      a: parseFloat(el.dataset.a ?? '0'),
      b: parseFloat(el.dataset.b ?? '1'),
      ramp: el.dataset.ramp ? parseFloat(el.dataset.ramp) : null,
      op: -1, k: -1, ks: -1, kb: -1, on: false,
    }))

    // ── seeded RNG for stable char offsets ──
    function rng(seed: number) {
      let s = seed >>> 0
      return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
    }
    function split(el: HTMLElement, mode: 'words' | 'chars', seed: number) {
      const text = el.textContent ?? ''
      el.setAttribute('aria-label', text)
      el.textContent = ''
      const r = rng(seed)
      const vis = document.createElement('span')
      vis.setAttribute('aria-hidden', 'true')
      const words = text.split(' ')
      words.forEach((word, wi) => {
        const w = document.createElement('span')
        w.className = 'w'
        if (mode === 'words') {
          w.style.setProperty('--th', (wi / Math.max(1, words.length) * 0.4 + r() * 0.05).toFixed(3))
        }
        if (mode === 'chars') {
          for (let i = 0; i < word.length; i++) {
            const c = document.createElement('span')
            c.className = 'c'
            c.textContent = word[i]
            c.style.setProperty('--th', (r() * 0.55).toFixed(3))
            c.style.setProperty('--jx', ((r() - 0.5) * 90).toFixed(1) + 'px')
            c.style.setProperty('--jy', ((r() - 0.5) * 60).toFixed(1) + 'px')
            c.style.setProperty('--jr', ((r() - 0.5) * 40).toFixed(1) + 'deg')
            w.appendChild(c)
          }
        } else {
          w.textContent = word
        }
        vis.appendChild(w)
        if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '))
      })
      el.appendChild(vis)
    }

    const b1h = stage.querySelector<HTMLElement>('#band1 .bh')
    const b2h = stage.querySelector<HTMLElement>('#band2 .bh')
    const b4h = stage.querySelector<HTMLElement>('#band4 h1')
    if (b1h) split(b1h, 'chars', 7)
    if (b2h) split(b2h, 'words', 11)
    if (b4h) split(b4h, 'words', 5)

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    const smoothstep = (p: number, e0: number, e1: number) => {
      const t = clamp((p - e0) / (e1 - e0), 0, 1)
      return t * t * (3 - 2 * t)
    }

    // ── load-ramp for band 1 ──
    let loadK = 0, loadK0: number | null = null
    function tickLoadK(now: number) {
      if (loadK0 === null) loadK0 = now
      loadK = clamp((now - loadK0 - 500) / 1400, 0, 1)
      updateCaptions(shown)
      if (loadK < 1 && scrubOn) requestAnimationFrame(tickLoadK)
    }

    function updateCaptions(p: number) {
      for (let i = 0; i < bands.length; i++) {
        const bd = bands[i]
        const f = Math.min(0.02, (bd.b - bd.a) / 3)
        let op = smoothstep(p, bd.a, bd.a + f) * (1 - smoothstep(p, bd.b - f, bd.b))
        if (i === 0) op = 1 - smoothstep(p, bd.b - f, bd.b)
        if (i === bands.length - 1) op = smoothstep(p, bd.a, bd.a + f)
        const ramp = bd.ramp ?? Math.min(0.025, (bd.b - bd.a) * 0.35)
        let k = clamp((p - bd.a) / ramp, 0, 1)
        if (i === 0) k = Math.max(k, loadK)
        if (i === bands.length - 1) k = clamp((p - bd.a) / (ramp * 1.4), 0, 1)
        if (Math.abs(op - bd.op) > 0.004) {
          bd.op = op
          bd.el.style.opacity = op.toFixed(3)
          const on = op > 0.02
          if (bd.on !== on) { bd.on = on; bd.el.classList.toggle('on', on) }
          if (i === 0) stage?.style.setProperty('--noise', op.toFixed(3))
        }
        if (Math.abs(k - bd.k) > 0.008) {
          bd.k = k
          bd.el.style.setProperty('--k', k.toFixed(3))
        }
        if (i === bands.length - 1) {
          const ks = clamp((p - 0.80) * 9, 0, 1)
          const kb = clamp((p - 0.86) * 10, 0, 1)
          if (Math.abs(ks - bd.ks) > 0.008) { bd.ks = ks; bd.el.style.setProperty('--ks', ks.toFixed(3)) }
          if (Math.abs(kb - bd.kb) > 0.008) { bd.kb = kb; bd.el.style.setProperty('--kb', kb.toFixed(3)) }
        }
      }
    }

    // ── gated seeks ──
    let seekBusy = false, pendingTime: number | null = null
    function requestSeek(t: number) {
      if (!video.duration) return
      if (seekBusy) { pendingTime = t; return }
      seekBusy = true
      video.currentTime = t
    }
    function onSeeked() {
      seekBusy = false
      if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t) }
    }
    function onVideoError() { seekBusy = false; pendingTime = null }
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onVideoError)

    // ── progress + RAF lerp ──
    function heroProgress() {
      const r = hero.getBoundingClientRect()
      const range = r.height - window.innerHeight
      if (range <= 0) return 0
      return clamp(-r.top / range, 0, 1)
    }
    let target = 0, shown = 0, rafId: number | null = null, lastTick = 0, heroOnScreen = true

    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now))
      lastTick = now
      const k = 0.16
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667))
      if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0 }
      else rafId = requestAnimationFrame(tick)
      if (video.duration) requestSeek(shown * (video.duration - 0.05))
      updateCaptions(shown)
    }

    function onScroll() {
      target = heroProgress()
      if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(entries => {
      heroOnScreen = entries[0].isIntersecting
      if (!heroOnScreen && rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
      if (heroOnScreen) onScroll()
    })
    io.observe(hero)

    // ── streamed Blob loader ──
    let initDone = false
    let blobUrl: string | null = null
    let abortCtrl: AbortController | null = null

    function failVideo() {
      if (ringWrap) {
        const cue = document.createElement('div')
        cue.className = 'scroll-cue'
        cue.setAttribute('aria-hidden', 'true')
        cue.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>'
        ringWrap.replaceWith(cue)
      }
    }

    video.addEventListener('error', () => { if (!video.src) return; failVideo() })

    function loadHeroBlob() {
      abortCtrl = new AbortController()
      const watchdog = setTimeout(() => abortCtrl?.abort(), 20000)
      return fetch(VIDEO_URL, { priority: 'low' as RequestInit['priority'], signal: abortCtrl.signal })
        .then(res => {
          if (!res.ok) throw new Error('http ' + res.status)
          const total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES
          const reader = res.body!.getReader()
          const chunks: Uint8Array[] = []
          let got = 0, lastRing = 0
          let wdog = watchdog
          function pump(): Promise<void> {
            return reader.read().then(({ done, value }) => {
              if (done) return
              clearTimeout(wdog)
              wdog = setTimeout(() => abortCtrl?.abort(), 20000)
              chunks.push(value)
              got += value.length
              const frac = Math.min(1, got / total)
              const now = performance.now()
              if (ringCircle && (now - lastRing > 100 || frac === 1)) {
                lastRing = now
                ringCircle.style.strokeDashoffset = String(Math.round(126 * (1 - frac)))
              }
              return pump()
            })
          }
          return pump().then(() => {
            clearTimeout(wdog)
            if (ringCircle) ringCircle.style.strokeDashoffset = '0'
            blobUrl = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'video/mp4' }))
            video.src = blobUrl
            video.load()
            video.addEventListener('canplay', () => {
              requestSeek(heroProgress() * (video.duration - 0.05))
              stage?.classList.add('video-ready')
            }, { once: true })
          })
        })
    }

    function initHeroOnce() {
      if (initDone) return
      initDone = true
      posterLayer.style.backgroundImage = `url('${POSTER_URL}')`
      let started = false
      function start() {
        if (started) return; started = true
        loadHeroBlob().catch(failVideo)
      }
      const img = new Image()
      img.onload = start; img.onerror = start
      img.src = POSTER_URL
      setTimeout(start, 4000)
    }

    // ── five static-hero gates ──
    const GATES = [
      '(max-width: 720px)',
      '(orientation: portrait) and (max-width: 1024px)',
      '(orientation: portrait) and (pointer: coarse)',
      '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
      '(prefers-reduced-motion: reduce)',
    ]
    let scrubOn = false

    function enableScrub() {
      if (scrubOn) return; scrubOn = true
      initHeroOnce()
      window.addEventListener('scroll', onScroll, { passive: true })
      bands.forEach(b => { b.op = -1; b.k = -1; b.ks = -1; b.kb = -1 })
      loadK0 = null
      requestAnimationFrame(tickLoadK)
      updateCaptions(heroProgress())
      onScroll()
    }

    function disableScrub() {
      if (!scrubOn) return; scrubOn = false
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
    }

    function applyHeroMode() {
      if (GATES.some(q => matchMedia(q).matches)) disableScrub()
      else enableScrub()
    }

    const mqls = GATES.map(q => matchMedia(q))
    mqls.forEach(m => {
      if (m.addEventListener) m.addEventListener('change', applyHeroMode)
    })
    applyHeroMode()

    // ── cleanup ──
    return () => {
      disableScrub()
      io.disconnect()
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onVideoError)
      mqls.forEach(m => {
        if (m.removeEventListener) m.removeEventListener('change', applyHeroMode)
      })
      abortCtrl?.abort()
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleContactClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const r = e.currentTarget.getBoundingClientRect()
    onOpenContact()
  }

  return (
    <header className="hero" id="hero" ref={heroRef}>
      <div className="hero-stage grainy" id="hero-stage" ref={stageRef}>
        <div className="hero-poster" aria-hidden="true" />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video id="hero-video" className="hero-video" preload="none" muted playsInline aria-hidden tabIndex={-1} />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="flecks" aria-hidden="true">
          <span className="fleck" style={{ left: '5%', animationDuration: '22s', animationDelay: '-4s' }} />
          <span className="fleck" style={{ left: '14%', animationDuration: '17s', animationDelay: '-11s', width: '8px', height: '11px' }} />
          <span className="fleck" style={{ left: '27%', animationDuration: '25s', animationDelay: '-7s' }} />
          <span className="fleck" style={{ left: '44%', animationDuration: '19s', animationDelay: '-15s', width: '7px', height: '10px' }} />
          <span className="fleck" style={{ left: '58%', animationDuration: '23s', animationDelay: '-2s' }} />
          <span className="fleck" style={{ left: '71%', animationDuration: '16s', animationDelay: '-9s', width: '9px', height: '12px' }} />
          <span className="fleck" style={{ left: '83%', animationDuration: '26s', animationDelay: '-18s' }} />
          <span className="fleck" style={{ left: '92%', animationDuration: '20s', animationDelay: '-6s', width: '8px', height: '11px' }} />
        </div>
        <div className="cue-hero" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        <div className="band" id="band1" data-a="0" data-b="0.20">
          <span className="kicker mono">NORA · Networked Operations &amp; Response Assistant</span>
          <p className="bh">
            {es ? 'Todo termina llegándote a ti.' : 'Everything ends up reaching you.'}
          </p>
        </div>
        <div className="band" id="band2" data-a="0.23" data-b="0.43">
          <p className="bh">
            {es
              ? 'Preguntas. Reportes. Aprobaciones. Seguimientos. Todo el día, todos los días.'
              : 'Questions. Reports. Approvals. Follow-ups. All day, every day.'}
          </p>
        </div>
        <div className="band" id="band3" data-a="0.46" data-b="0.64">
          <p className="bh soft" aria-hidden="true">{es ? 'NORA se encarga del ruido.' : 'NORA takes the noise.'}</p>
          <p className="bh sharp">{es ? 'NORA se encarga del ruido.' : 'NORA takes the noise.'}</p>
        </div>
        <div className="band band-light" id="band4" data-a="0.70" data-b="1">
          <h1>{es ? 'Tu Negocio. Organizado.' : 'Business. Organized.'}</h1>
          <p className="sub">
            {es
              ? 'NORA escucha, responde, coordina y recuerda. Solo lo importante te llega a ti.'
              : 'NORA listens, answers, coordinates and remembers. Only what matters reaches you.'}
          </p>
          <div className="cta-row">
            <button className="btn btn-solid" onClick={handleContactClick}>
              {es ? 'Hablar con NORA' : 'Talk to NORA'}
            </button>
            <a className="btn btn-ghost ghost-ink" href={`/${lang}/how-it-works`}>
              {es ? 'Ver cómo funciona NORA' : 'See how NORA works'}
            </a>
          </div>
          <span className="qseed" aria-hidden="true" />
        </div>

        <div className="ring-wrap" aria-hidden="true">
          <svg className="ring" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="126" style={{ strokeDashoffset: 126 }} />
          </svg>
        </div>
      </div>

      {/* Static hero fallback for mobile/reduced-motion */}
      <div className="hero-static grainy" style={{ backgroundImage: "url('/img/hero-poster.jpg')" }}>
        <div className="hero-static-inner">
          <span className="kicker mono">NORA · Networked Operations &amp; Response Assistant</span>
          <h1>{es ? 'Tu Negocio. Organizado.' : 'Business. Organized.'}</h1>
          <p className="sub">
            {es
              ? 'Tu negocio nunca para de hablar. NORA escucha, responde, coordina y recuerda. Solo lo importante te llega a ti.'
              : 'Your business never stops talking. NORA listens, answers, coordinates and remembers. Only what matters reaches you.'}
          </p>
          <div className="cta-row">
            <button className="btn btn-solid" onClick={handleContactClick}>
              {es ? 'Hablar con NORA' : 'Talk to NORA'}
            </button>
            <a className="btn btn-ghost" href={`/${lang}/how-it-works`}>
              {es ? 'Ver cómo funciona' : 'See how NORA works'}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
