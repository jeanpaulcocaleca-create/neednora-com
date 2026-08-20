import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

export default async function HospitalityPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <main className="industry-shell">
      <section className="industry-shell__hero container">
        <p className="industry-shell__eyebrow">
          {es ? 'NORA para Hotelería y Turismo' : 'NORA for Hotels & Lodges'}
        </p>
        <h1 className="industry-shell__headline">
          {es
            ? 'Tu negocio. Organizado.'
            : 'Business. Organized.'}
        </h1>
        <p className="industry-shell__body">
          {es
            ? 'NORA convierte las conversaciones de WhatsApp en operaciones estructuradas — turnos, solicitudes de huéspedes, mantenimiento y reportes, sin que tu equipo salga de WhatsApp.'
            : 'NORA turns WhatsApp conversations into structured operations — shifts, guest requests, maintenance, and reporting — without asking your team to use anything other than WhatsApp.'}
        </p>
        <Link href={`/${lang}/contact`} className="btn btn-primary industry-shell__cta">
          {es ? 'Solicitar una demo' : 'Request a demo'}
        </Link>
      </section>

      <section className="industry-shell__prep container">
        <p className="industry-shell__prep-text">
          {es
            ? 'La experiencia completa de NORA para Hoteles y Lodges se está preparando. Solicita una demo para verla en acción.'
            : 'The full NORA for Hotels & Lodges experience is being prepared. Request a demo to see it in action.'}
        </p>
      </section>
    </main>
  )
}
