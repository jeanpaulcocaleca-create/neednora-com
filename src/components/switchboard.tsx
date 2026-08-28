'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n'
import { NORA_DATA } from '@/lib/nora-data'

export function Switchboard({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const sbRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sbEl = sbRef.current
    if (!sbEl) return
    const sb: HTMLElement = sbEl

    const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)')
    const D = NORA_DATA
    const col = sb.querySelector<HTMLDivElement>('.msg-col')!
    const chipflow = sb.querySelector<HTMLDivElement>('.chipflow')!
    const stage = sb.querySelector<HTMLDivElement>('.stage')!
    const node = sb.querySelector<HTMLDivElement>('.nora-node')!
    let mi = 0, ci = 0
    const intervals: ReturnType<typeof setInterval>[] = []

    function reduced() { return reduceMQ.matches }
    function visible(el: HTMLElement) {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < innerHeight && !document.hidden
    }

    function flyToNora(fromEl: HTMLElement) {
      const s = stage.getBoundingClientRect()
      const f = fromEl.getBoundingClientRect()
      const n = node.getBoundingClientRect()
      const dot = document.createElement('span')
      dot.setAttribute('aria-hidden', 'true')
      const x0 = f.right - s.left - 6
      const y0 = f.top - s.top + f.height / 2 - 4
      const x1 = n.left - s.left + n.width / 2
      const y1 = n.top - s.top + n.height / 2
      const canCurve = window.CSS?.supports?.('offset-path', 'path("M0 0 L1 1")')
      if (canCurve) {
        const cx = x0 + (x1 - x0) * 0.55
        const cy = y1 + (y0 - y1) * 0.15
        dot.className = 'flydot curved'
        dot.style.offsetPath = `path("M ${x0.toFixed(0)} ${y0.toFixed(0)} Q ${cx.toFixed(0)} ${cy.toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}")`
        stage.appendChild(dot)
        requestAnimationFrame(() => requestAnimationFrame(() => {
          dot.style.offsetDistance = '100%'
          dot.style.transform = 'scale(.35)'
          dot.style.opacity = '0'
        }))
      } else {
        dot.className = 'flydot'
        dot.style.left = x0 + 'px'
        dot.style.top = y0 + 'px'
        stage.appendChild(dot)
        requestAnimationFrame(() => requestAnimationFrame(() => {
          dot.style.transform = `translate(${x1 - x0}px,${y1 - y0}px) scale(.35)`
          dot.style.opacity = '0'
        }))
      }
      setTimeout(() => {
        dot.remove()
        node.classList.add('rx')
        setTimeout(() => node.classList.remove('rx'), 520)
        pushChip()
        popTally()
      }, 560)
    }

    function pushMsg() {
      if (!visible(sb)) return
      const m = D.stream[mi % D.stream.length]
      mi++
      const el = document.createElement('div')
      el.className = 'msg live'
      const from = document.createElement('span')
      from.className = 'from'
      from.textContent = m.from
      el.appendChild(from)
      el.appendChild(document.createTextNode(m.text))
      col.appendChild(el)
      while (col.children.length > 5) col.removeChild(col.firstChild!)
      setTimeout(() => {
        el.classList.remove('live')
        el.classList.add('gone')
        flyToNora(el)
        setTimeout(() => el.remove(), 700)
      }, 1800 + Math.random() * 900)
    }

    function pushChip() {
      const c = document.createElement('div')
      c.className = 'chip live'
      c.textContent = D.chips[ci % D.chips.length]
      ci++
      chipflow.appendChild(c)
      while (chipflow.children.length > 3) chipflow.removeChild(chipflow.firstChild!)
      setTimeout(() => {
        c.classList.remove('live'); c.classList.add('fade')
        setTimeout(() => c.remove(), 700)
      }, 2600)
    }

    const tallyEl = sb.querySelector<HTMLElement>('.tally')
    function popTally() {
      if (!tallyEl) return
      tallyEl.classList.add('pop')
      setTimeout(() => tallyEl.classList.remove('pop'), 320)
    }

    if (!reduced()) {
      intervals.push(setInterval(pushMsg, 1100))
    } else {
      D.stream.slice(0, 3).forEach(m => {
        const el = document.createElement('div')
        el.className = 'msg'
        el.style.opacity = '1'; el.style.transform = 'none'
        const from = document.createElement('span')
        from.className = 'from'
        from.textContent = m.from
        el.appendChild(from)
        el.appendChild(document.createTextNode(m.text))
        col.appendChild(el)
      })
      D.chips.slice(0, 2).forEach(t => {
        const c = document.createElement('div')
        c.className = 'chip'
        c.style.opacity = '1'; c.style.transform = 'none'
        c.textContent = t
        chipflow.appendChild(c)
      })
    }

    // tally counter
    const tallyNum = sb.querySelector<HTMLElement>('.tally b')
    if (tallyNum) {
      const target = 27
      let cur = 0, counted = false
      const tio = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !counted) {
          counted = true
          if (reduced()) { tallyNum.textContent = String(target); return }
          const iv = setInterval(() => {
            cur += 1
            tallyNum.textContent = String(cur)
            if (cur >= target) clearInterval(iv)
          }, 40)
          intervals.push(iv)
        }
      }, { threshold: 0.4 })
      const tallyContainer = sb.querySelector<HTMLElement>('.tally')
      if (tallyContainer) tio.observe(tallyContainer)
    }

    // owner phone decision reveal
    const ownerPhone = sb.querySelector<HTMLElement>('.owner-phone')
    if (ownerPhone) {
      const oio = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          oio.disconnect()
          setTimeout(() => ownerPhone.classList.add('decided'), reduced() ? 0 : 1400)
        }
      }, { threshold: 0.5 })
      oio.observe(ownerPhone)
    }

    // approve interaction
    const yes = sb.querySelector<HTMLButtonElement>('.obtn.yes')
    if (yes) {
      yes.addEventListener('click', () => {
        yes.classList.add('approved')
        yes.textContent = yes.dataset.done ?? 'Approved ✓'
        const no = sb.querySelector<HTMLButtonElement>('.obtn.no')
        if (no) no.style.opacity = '.35'
      })
    }

    return () => {
      intervals.forEach(clearInterval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="sec light" id="switchboard" ref={sbRef}>
      <div className="sec-inner">
        <div className="rev-seq in-head">
          <span className="kicker mono">{es ? 'El problema, luego el punto' : 'The problem, then the point'}</span>
          <h2>
            {es
              ? 'Veintisiete conversaciones ocurrieron. Una te llegó a ti.'
              : 'Twenty-seven conversations happened. One reached you.'}
          </h2>
        </div>
        <div className="stage">
          <svg className="threads" viewBox="0 0 1180 420" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,80 C300,80 340,210 560,210"/>
            <path d="M0,210 C260,210 320,210 560,210"/>
            <path d="M0,340 C300,340 340,210 560,210"/>
            <path className="hot" d="M620,210 C820,210 880,210 1180,210"/>
          </svg>
          <div className="msg-col" aria-label={es ? 'Mensajes operativos llegando' : 'Operational messages arriving'} />
          <div className="nora-node rev">
            <span className="pulse" aria-hidden="true" />
            <span className="ringB" aria-hidden="true" />
            <span className="ringA" aria-hidden="true" />
            <span className="word">NORA</span>
            <div className="chipflow" aria-label={es ? 'Acciones que toma NORA' : 'Actions NORA takes'} />
          </div>
          <div className="owner-phone rev">
            <div className="ohead">
              <span>{es ? 'Tu teléfono' : 'Your phone'}</span>
              <span>7:30 AM</span>
            </div>
            <div className="ocard">
              <p className="otitle">{es ? 'Actualización matutina' : 'Morning update'}</p>
              <p>{es ? 'Todo está manejado. Una aprobación te necesita:' : 'Everything is handled. One approval needs you:'}</p>
              <div className="odecision">
                <span className="mono">{es ? 'Solicitud de compra' : 'Purchase request'}</span>
                <p className="amt">{es ? 'Repuestos · $425' : 'Replacement parts · $425'}</p>
                <div className="obtns">
                  <button className="obtn yes" data-done={es ? 'Aprobado ✓' : 'Approved ✓'}>
                    {es ? 'Aprobar' : 'Approve'}
                  </button>
                  <button className="obtn no">{es ? 'Después' : 'Later'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="tally"><b>0</b> {es ? 'manejados por NORA · 1 decisión para ti' : 'handled by NORA · 1 decision for you'}</p>
        <p className="sb-close rev">
          {es
            ? 'NORA protege tu atención. Ese es el producto completo.'
            : 'NORA protects your attention. That is the whole product.'}
        </p>
      </div>
    </section>
  )
}
