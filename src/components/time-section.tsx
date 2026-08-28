'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'

export function TimeSection({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sec = sectionRef.current
    if (!sec) return
    const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)')
    const spans = sec.querySelectorAll<HTMLElement>('.litany span')
    if (!spans.length) return

    if (reduceMQ.matches) {
      spans.forEach(s => s.classList.add('lit'))
      return
    }

    const lio = new IntersectionObserver(entries => {
      entries.forEach(e => (e.target as HTMLElement).classList.toggle('lit', e.isIntersecting))
    }, { rootMargin: '-25% 0px -25% 0px' })
    spans.forEach(s => lio.observe(s))

    function applyRM() {
      if (reduceMQ.matches) spans.forEach(s => s.classList.add('lit'))
    }
    reduceMQ.addEventListener?.('change', applyRM)

    return () => {
      lio.disconnect()
      reduceMQ.removeEventListener?.('change', applyRM)
    }
  }, [])

  const litany = es
    ? ['Para crear.', 'Para crecer.', 'Para liderar.', 'Para estar con tu familia.', 'Para viajar.', 'Para vivir.']
    : ['To create.', 'To grow.', 'To lead.', 'To be with your family.', 'To travel.', 'To live.']

  return (
    <section className="sec light" id="time" ref={sectionRef}>
      <div className="sec-inner">
        <div className="rev-seq">
          <span className="kicker mono">{es ? 'Para lo que realmente es esto' : 'What this is really for'}</span>
          <h2>{es ? 'Recupera tu tiempo.' : 'Get your time back.'}</h2>
        </div>
        <div className="litany" aria-label={es ? 'Lo que hace posible el tiempo recuperado' : 'What recovered time makes possible'}>
          {litany.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
        <div className="gallery">
          <figure className="tall rev">
            <Image
              src="/img/family.jpg"
              alt={es ? 'Un padre desayunando con sus hijos a la luz cálida de la mañana' : 'A father having breakfast with his children in warm morning light'}
              width={1920}
              height={1080}
              loading="lazy"
            />
          </figure>
          <figure className="rev">
            <Image
              src="/img/travel.jpg"
              alt={es ? 'Una persona de pie en un sendero costero al amanecer' : 'A person standing on a coastal trail at dawn'}
              width={1920}
              height={1080}
              loading="lazy"
            />
          </figure>
          <figure className="rev">
            <Image
              src="/img/create.jpg"
              alt={es ? 'Manos bosquejando planes en una mesa de taller' : 'Hands sketching plans at a workshop table'}
              width={1920}
              height={1080}
              loading="lazy"
            />
          </figure>
        </div>
        <p className="body rev">
          {es
            ? 'Construiste el negocio para construir una vida. En algún momento, el negocio se llevó la vida. NORA devuelve las horas, una conversación manejada a la vez.'
            : 'You built the business to build a life. Somewhere along the way, the business took the life. NORA gives the hours back, one handled conversation at a time.'}
        </p>
      </div>
    </section>
  )
}
