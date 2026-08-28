'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n'

export function MemoryFlip({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const flipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const flipEl = flipRef.current
    if (!flipEl) return
    const flip: HTMLDivElement = flipEl
    const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)')
    let flippedOnce = false

    const fio = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !flippedOnce) {
        flippedOnce = true
        setTimeout(() => flip.classList.add('flipped'), reduceMQ.matches ? 0 : 900)
      }
    }, { threshold: 0.5 })
    fio.observe(flip)

    function toggle() { flip.classList.toggle('flipped') }
    flip.addEventListener('click', toggle)
    flip.setAttribute('tabindex', '0')
    flip.setAttribute('role', 'button')
    flip.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
    })

    function applyRM() {
      if (reduceMQ.matches) flip.classList.add('flipped')
    }
    reduceMQ.addEventListener?.('change', applyRM)

    return () => {
      fio.disconnect()
      flipEl.removeEventListener('click', toggle)
      reduceMQ.removeEventListener?.('change', applyRM)
    }
  }, [])

  return (
    <section className="sec light" id="memory">
      <div className="sec-inner">
        <div className="wrap">
          <div className="rev-seq">
            <span className="kicker mono">{es ? 'Nada se pierde' : 'Nothing gets lost'}</span>
            <h2>{es ? 'Las conversaciones desaparecen. NORA recuerda.' : 'Conversations disappear. NORA remembers.'}</h2>
            <p className="lede">
              {es
                ? 'Quién dijo qué. Qué se prometió. Qué sigue abierto. Pregúntale a NORA, y sabe.'
                : 'Who said what. What was promised. What is still open. Ask NORA, and it knows.'}
            </p>
          </div>
          <div>
            <div
              className="flip rev"
              ref={flipRef}
              aria-label={es ? 'Una conversación convirtiéndose en un registro operativo' : 'A conversation becoming an operational record'}
            >
              <div className="flip-inner">
                <div className="face chat">
                  {es ? (
                    <>
                      <div className="bub in">El equipo terminó la sección norte. Enviando fotos.</div>
                      <div className="bub out">Recibido, gracias. Anoté la promesa de entrega para el viernes. Confirmaré el recorrido final con Daniel.</div>
                      <div className="bub in">Perfecto.</div>
                    </>
                  ) : (
                    <>
                      <div className="bub in">Team finished the north section. Sending photos.</div>
                      <div className="bub out">Received, thank you. I noted the delivery promise for Friday. I will confirm the final walkthrough with Daniel.</div>
                      <div className="bub in">Perfect.</div>
                    </>
                  )}
                </div>
                <div className="face rec">
                  <p className="rtitle">{es ? 'Trabajo 204 · Sección norte' : 'Job 204 · North section'}</p>
                  <div className="rrow"><span className="rk">{es ? 'Prometido' : 'Promised'}</span><span className="rv">{es ? 'Terminar antes del viernes' : 'Finish by Friday'}</span></div>
                  <div className="rrow"><span className="rk">{es ? 'Evidencia' : 'Evidence'}</span><span className="rv ok">{es ? '3 fotos recibidas ✓' : '3 photos received ✓'}</span></div>
                  <div className="rrow"><span className="rk">{es ? 'Aprobado por' : 'Approved by'}</span><span className="rv">Daniel</span></div>
                  <div className="rrow"><span className="rk">{es ? 'Pendiente' : 'Pending'}</span><span className="rv">{es ? 'Recorrido final' : 'Final walkthrough'}</span></div>
                </div>
              </div>
            </div>
            <p className="flip-hint">{es ? 'Toca la tarjeta' : 'Tap the card'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
