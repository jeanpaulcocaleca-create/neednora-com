'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n'
import { NORA_DATA } from '@/lib/nora-data'

export function Threshold({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const th = sectionRef.current
    if (!th) return
    const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)')
    const D = NORA_DATA
    const below = th.querySelector<HTMLDivElement>('.th-below')!
    const above = th.querySelector<HTMLDivElement>('.th-above')!
    const intervals: ReturnType<typeof setInterval>[] = []

    function reduced() { return reduceMQ.matches }
    function visible(el: HTMLElement) {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < innerHeight && !document.hidden
    }

    if (reduced()) {
      D.quiet.slice(0, 5).forEach(t => {
        const q = document.createElement('div')
        q.className = 'th-quiet'
        q.style.opacity = '0.85'; q.style.transform = 'none'
        q.textContent = t
        below.appendChild(q)
      })
      const a = document.createElement('div')
      a.className = 'th-item'
      a.style.opacity = '1'; a.style.transform = 'none'
      const dot = document.createElement('span')
      dot.className = 'dotu'
      a.appendChild(dot)
      a.appendChild(document.createTextNode(D.cross[0]))
      above.appendChild(a)
    } else {
      let qi = 0, ai = 0
      const iv1 = setInterval(() => {
        if (!visible(th)) return
        const q = document.createElement('div')
        q.className = 'th-quiet live'
        q.textContent = D.quiet[qi % D.quiet.length]
        qi++
        below.appendChild(q)
        setTimeout(() => {
          q.classList.remove('live'); q.classList.add('fade')
          setTimeout(() => q.remove(), 800)
        }, 3400)
        while (below.children.length > 6) below.removeChild(below.firstChild!)
      }, 1100)
      intervals.push(iv1)

      const iv2 = setInterval(() => {
        if (!visible(th)) return
        const a = document.createElement('div')
        a.className = 'th-item live'
        const dot = document.createElement('span')
        dot.className = 'dotu'
        a.appendChild(dot)
        a.appendChild(document.createTextNode(D.cross[ai % D.cross.length]))
        ai++
        above.appendChild(a)
        setTimeout(() => {
          a.classList.add('fade')
          setTimeout(() => a.remove(), 800)
        }, 5600)
        while (above.children.length > 2) above.removeChild(above.firstChild!)
      }, 6200)
      intervals.push(iv2)
    }

    return () => intervals.forEach(clearInterval)
  }, [])

  return (
    <section className="sec light" id="threshold" ref={sectionRef}>
      <div className="sec-inner">
        <div className="rev-seq">
          <span className="kicker mono">{es ? 'Tu atención tiene una puerta' : 'Your attention has a door'}</span>
          <h2>
            {es
              ? 'NORA decide qué puede esperar. Tú decides qué importa.'
              : 'NORA decides what can wait. You decide what matters.'}
          </h2>
        </div>
        <div className="zone rev">
          <div className="th-above" aria-label={es ? 'Lo que te llega' : 'What reaches you'} />
          <div className="th-line"><span className="lbl">{es ? 'Te llega' : 'Reaches you'}</span></div>
          <div className="th-below" aria-label={es ? 'Lo que NORA maneja silenciosamente' : 'What NORA handles quietly'} />
        </div>
        <p className="trustline rev">
          {es
            ? 'NORA actúa dentro de la autoridad que le das. Nada más. Todo es visible, y puedes intervenir en cualquier momento.'
            : 'NORA acts inside the authority you give it. Nothing more. Everything is visible, and you can step in at any moment.'}
        </p>
      </div>
    </section>
  )
}
