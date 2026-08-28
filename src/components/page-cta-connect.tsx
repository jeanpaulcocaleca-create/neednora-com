'use client'

import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'
import { useContact } from '@/lib/contact-context'

// Shared dark CTA section that appears on all Gen 3 secondary content pages.
// Ports the connect-stage signal animation from site.js exactly:
// click → signal dot travels the SVG wire → NORA wakes → contact overlay opens.
export function PageCtaConnect({ lang }: { lang: Locale }) {
  const { open } = useContact()
  const es = lang === 'es'
  const stageRef = useRef<HTMLDivElement>(null)
  const sendingRef = useRef(false)

  function handleYouClick() {
    const stage = stageRef.current
    if (!stage) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { open(); return }
    if (sendingRef.current) return
    sendingRef.current = true

    stage.classList.add('sending')
    const youBtn = stage.querySelector<HTMLElement>('.you-node')
    const noraMini = stage.querySelector<HTMLElement>('.nora-mini')
    if (!youBtn || !noraMini) return

    youBtn.classList.add('press')
    setTimeout(() => youBtn.classList.remove('press'), 220)

    const nr = noraMini.getBoundingClientRect()
    const sr = stage.getBoundingClientRect()
    const yr = youBtn.getBoundingClientRect()
    const x0 = yr.left - sr.left + yr.width / 2
    const y0 = yr.top - sr.top + yr.height / 2
    const x1 = nr.left - sr.left + nr.width / 2
    const y1 = nr.top - sr.top + nr.height / 2

    const dot = document.createElement('span')
    dot.setAttribute('aria-hidden', 'true')

    const canCurve = window.CSS?.supports?.('offset-path', 'path("M0 0 L1 1")')
    let wirePath: string | null = null
    const svgs = stage.querySelectorAll<SVGSVGElement>('.cpath')
    for (const svg of svgs) {
      if (getComputedStyle(svg).display !== 'none') {
        const vb = svg.viewBox.baseVal
        const svgRect = svg.getBoundingClientRect()
        const sxv = svgRect.width / vb.width
        const syv = svgRect.height / vb.height
        const trackD = svg.querySelector('.track')?.getAttribute('d') ?? ''
        const nums = (trackD.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
        if (nums.length === 8) {
          const p = nums.map((v, i) => (i % 2 === 0 ? v * sxv : v * syv).toFixed(1))
          wirePath = `M ${p[0]} ${p[1]} C ${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}`
        }
        break
      }
    }

    if (canCurve && wirePath) {
      dot.className = 'signal'
      ;(dot.style as CSSStyleDeclaration & { offsetPath: string; offsetDistance: string }).offsetPath = `path("${wirePath}")`
      ;(dot.style as CSSStyleDeclaration & { offsetDistance: string }).offsetDistance = '0%'
      stage.appendChild(dot)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ;(dot.style as CSSStyleDeclaration & { offsetDistance: string }).offsetDistance = '100%'
        dot.style.opacity = '0'
      }))
    } else {
      dot.className = 'signal linear'
      dot.style.left = `${x0 - 5}px`
      dot.style.top = `${y0 - 5}px`
      stage.appendChild(dot)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        dot.style.transform = `translate(${x1 - x0}px,${y1 - y0}px)`
        dot.style.opacity = '0'
      }))
    }

    setTimeout(() => {
      dot.remove()
      noraMini.classList.add('awake', 'rx')
      setTimeout(() => noraMini.classList.remove('rx'), 520)
    }, 480)

    setTimeout(() => {
      open()
      setTimeout(() => {
        sendingRef.current = false
        stage.classList.remove('sending')
      }, 700)
    }, 760)
  }

  return (
    <section className="sec cta-connect dark grainy">
      <div className="sec-inner">
        <span className="kicker mono rev">
          {es ? 'Empieza la conversación' : 'Start the conversation'}
        </span>
        <h2 className="rev">{es ? 'Cuando tú digas.' : 'Ready when you are.'}</h2>
        <div className="connect-stage rev" ref={stageRef}>
          <svg className="cpath cpath-h" viewBox="0 0 820 230" preserveAspectRatio="none" aria-hidden="true">
            <path className="track" d="M 150 172 C 340 172 480 66 662 66" />
            <path className="live" d="M 150 172 C 340 172 480 66 662 66" />
          </svg>
          <svg className="cpath cpath-v" viewBox="0 0 340 330" preserveAspectRatio="none" aria-hidden="true">
            <path className="track" d="M 170 300 C 130 230 210 130 170 62" />
            <path className="live" d="M 170 300 C 130 230 210 130 170 62" />
          </svg>
          <button
            className="you-node"
            aria-label={es ? 'Hablar con NORA' : 'Talk to NORA'}
            onClick={handleYouClick}
          >
            <span className="mono">{es ? 'Empieza aquí' : 'Start here'}</span>
            {es ? 'Tú' : 'You'}
          </button>
          <div className="nora-mini" aria-hidden="true">
            <span className="halo" />
            <span className="ringB" />
            <span className="ringA" />
            <span className="word">NORA</span>
          </div>
        </div>
      </div>
    </section>
  )
}
