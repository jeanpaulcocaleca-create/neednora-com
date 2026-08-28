import type { Locale } from '@/lib/i18n'

export function TrustSection({ lang }: { lang: Locale }) {
  const es = lang === 'es'

  const cards = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 8h10M18 8h2M4 16h2M10 16h10"/>
          <circle cx="15" cy="8" r="2.2"/>
          <circle cx="7" cy="16" r="2.2"/>
        </svg>
      ),
      text: es ? 'Tú fijas los límites. NORA pregunta cuando se requiere autoridad.' : 'You set the limits. NORA asks when authority is required.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/>
          <circle cx="12" cy="12" r="2.6"/>
        </svg>
      ),
      text: es ? 'Cada acción queda registrada y es visible.' : 'Every action is recorded and visible.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 4v10M12 4l-4 4M12 4l4 4"/>
          <path d="M4 18c2.5 2 13.5 2 16 0"/>
        </svg>
      ),
      text: es ? 'La escalación está incorporada. Lo urgente llega a ti rápido.' : 'Escalation is built in. Urgent things find you fast.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
          <rect x="5" y="11" width="14" height="9" rx="2"/>
          <path d="M12 15v2"/>
        </svg>
      ),
      text: es ? 'Puedes tomar el control de cualquier conversación, en cualquier momento.' : 'You can take over any conversation, any time.',
    },
  ]

  return (
    <section className="sec light" id="trust">
      <div className="sec-inner">
        <div className="rev-seq">
          <span className="kicker mono">{es ? 'Confianza, por diseño' : 'Trust, by design'}</span>
          <h2>{es ? 'En control, siempre.' : 'In control, always.'}</h2>
        </div>
        <div className="grid rev-seq">
          {cards.map((card, i) => (
            <div key={i} className="tcard">
              {card.icon}
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
