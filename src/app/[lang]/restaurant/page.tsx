import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

export default async function RestaurantPage({
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
          {es ? 'NORA para Restaurantes' : 'NORA for Restaurants'}
        </p>
        <h1 className="industry-shell__headline">
          {es
            ? 'Tu negocio. Organizado.'
            : 'Business. Organized.'}
        </h1>
        <p className="industry-shell__body">
          {es
            ? 'NORA captura cada cambio de turno, solicitud de insumos y reporte de mantenimiento desde WhatsApp — y los convierte en operaciones organizadas.'
            : 'NORA captures every shift handoff, supply request, and maintenance report from WhatsApp — and turns them into organized operations.'}
        </p>
        <Link href={`/${lang}/demo`} className="btn btn-primary industry-shell__cta">
          {es ? 'Solicitar una demo' : 'Request a demo'}
        </Link>
      </section>

      <section className="industry-shell__prep container">
        <p className="industry-shell__prep-text">
          {es
            ? 'La experiencia completa de NORA para Restaurantes se está preparando. Solicita una demo para verla en acción.'
            : 'The full NORA for Restaurants experience is being prepared. Request a demo to see it in action.'}
        </p>
      </section>
    </main>
  )
}
