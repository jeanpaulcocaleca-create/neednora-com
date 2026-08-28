'use client'

import type { Locale } from '@/lib/i18n'
import { useContact } from '@/lib/contact-context'

export function StartCta({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const { open } = useContact()

  return (
    <section
      className="sec dark grainy"
      id="start"
      style={{ backgroundImage: "url('/img/hero-ending.jpg')" }}
    >
      <div className="sec-inner">
        <span className="kicker mono rev">
          {es ? 'Empieza la conversación' : 'Start the conversation'}
        </span>
        <h2 className="rev">{es ? 'Lista cuando tú estés.' : 'Ready when you are.'}</h2>
        <p className="lede rev">
          {es
            ? 'Cuéntale a NORA sobre tu negocio. Te mostrará cómo se siente el silencio.'
            : 'Tell NORA about your business. It will show you what quiet feels like.'}
        </p>
        <button className="btn btn-solid rev" onClick={open}>
          {es ? 'Hablar con NORA' : 'Talk to NORA'}
        </button>
      </div>
    </section>
  )
}
