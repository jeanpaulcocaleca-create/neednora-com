'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n'
import { NORA_DATA, type ScenarioMsg } from '@/lib/nora-data'

export function WatchNora({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const demo = sectionRef.current
    if (!demo) return
    const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)')
    const D = NORA_DATA
    const scroll = demo.querySelector<HTMLDivElement>('.phone-scroll')!
    const tabs = demo.querySelectorAll<HTMLButtonElement>('.tab')
    let current = D.scenarios[0]
    let playToken = 0

    function reduced() { return reduceMQ.matches }
    function visible(el: HTMLElement) {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < innerHeight && !document.hidden
    }

    function makeBub(m: ScenarioMsg, still: boolean): HTMLElement {
      let el: HTMLElement
      if (m.who === 'sys') {
        el = document.createElement('div')
        el.className = 'sys' + (still ? '' : ' live')
        el.textContent = m.text
        if (still) { el.style.opacity = '1'; el.style.transform = 'none' }
        return el
      }
      el = document.createElement('div')
      el.className = 'bub ' + m.who + (still ? '' : ' live')
      el.textContent = m.text
      if (m.tr) {
        const tr = document.createElement('span')
        tr.className = 'tr'
        tr.textContent = m.tr
        el.appendChild(tr)
      }
      if (m.meta) {
        const meta = document.createElement('span')
        meta.className = 'meta'
        meta.textContent = m.meta
        el.appendChild(meta)
      }
      if (still) { el.style.opacity = '1'; el.style.transform = 'none' }
      return el
    }

    function renderStatic(sc: typeof D.scenarios[0]) {
      scroll.innerHTML = ''
      sc.msgs.forEach(m => scroll.appendChild(makeBub(m, true)))
    }

    function play(sc: typeof D.scenarios[0]) {
      const token = ++playToken
      scroll.innerHTML = ''
      const typing = document.createElement('div')
      typing.className = 'typing'
      typing.innerHTML = '<i></i><i></i><i></i>'
      scroll.appendChild(typing)
      let i = 0
      function next() {
        if (token !== playToken) return
        if (!visible(demo!)) { setTimeout(next, 900); return }
        if (i >= sc.msgs.length) {
          setTimeout(() => { if (token === playToken) play(sc) }, 5200)
          return
        }
        const m = sc.msgs[i]; i++
        let delay = 450
        if (m.who === 'out') {
          typing.classList.add('on')
          scroll.appendChild(typing)
          delay = 1150
        }
        setTimeout(() => {
          if (token !== playToken) return
          typing.classList.remove('on')
          scroll.insertBefore(makeBub(m, false), typing)
          scroll.scrollTop = scroll.scrollHeight
          next()
        }, delay)
      }
      setTimeout(next, 700)
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(o => o.setAttribute('aria-selected', 'false'))
        tab.setAttribute('aria-selected', 'true')
        current = D.scenarios.find(s => s.id === tab.dataset.sc) ?? D.scenarios[0]
        if (reduced()) renderStatic(current)
        else play(current)
      })
    })

    if (reduced()) {
      renderStatic(current)
    } else {
      let started = false
      const dio = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !started) { started = true; play(current) }
      }, { threshold: 0.35 })
      const phone = demo.querySelector<HTMLDivElement>('.phone')
      if (phone) dio.observe(phone)
    }
  }, [])

  return (
    <section className="sec light" id="demo" ref={sectionRef}>
      <div className="sec-inner">
        <div className="wrap">
          <div className="rev-seq">
            <span className="kicker mono">{es ? 'NORA en acción' : 'Watch NORA work'}</span>
            <h2>{es ? 'La gente habla. NORA hace el resto.' : 'People just talk. NORA does the rest.'}</h2>
            <p className="lede">
              {es
                ? 'Tu equipo ya vive en WhatsApp. NORA trabaja donde ya están, en sus propias palabras, en su propio idioma.'
                : 'Your team already lives on WhatsApp. NORA works where they already are, in their own words, in their own language.'}
            </p>
            <div className="tabs" role="tablist" aria-label={es ? 'Elige un ejemplo de industria' : 'Choose an industry example'}>
              <button className="tab" role="tab" aria-selected="true" data-sc="crew">
                {es ? 'Equipo de campo' : 'Field crew'}
              </button>
              <button className="tab" role="tab" aria-selected="false" data-sc="hotel">
                {es ? 'Hotel' : 'Hotel'}
              </button>
              <button className="tab" role="tab" aria-selected="false" data-sc="rest">
                {es ? 'Restaurante' : 'Restaurant'}
              </button>
            </div>
            <p className="demo-caption">
              {es ? 'No hiciste nada. Ese es el punto.' : 'You did nothing. That is the point.'}
            </p>
          </div>
          <div className="phone rev" aria-label={es ? 'Una conversación de WhatsApp manejada por NORA' : 'A WhatsApp conversation handled by NORA'}>
            <div className="phone-top">
              <span className="phone-avatar" aria-hidden="true">N</span>
              <div>
                <p className="phone-name">NORA</p>
                <p className="phone-status">online</p>
              </div>
            </div>
            <div className="phone-scroll" />
          </div>
        </div>
      </div>
    </section>
  )
}
