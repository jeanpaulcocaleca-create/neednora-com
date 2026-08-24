import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

export default async function PaintingPage({
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
          {es ? 'NORA para Contratistas de Pintura' : 'NORA for Painting Contractors'}
        </p>
        <h1 className="industry-shell__headline">
          {es
            ? 'Tu negocio. Organizado.'
            : 'Business. Organized.'}
        </h1>
        <p className="industry-shell__body">
          {es
            ? 'NORA convierte WhatsApp en tu columna vertebral operativa — órdenes de trabajo, fotos de sitio, solicitudes de gastos y actualizaciones de progreso. Estructurado.'
            : 'NORA turns WhatsApp into your operational backbone — work orders, site photos, expense requests, and progress updates. Structured.'}
        </p>
        <Link href={`/${lang}/demo`} className="btn btn-primary industry-shell__cta">
          {es ? 'Solicitar una demo' : 'Request a demo'}
        </Link>
      </section>

      <section className="industry-shell__prep container">
        <p className="industry-shell__prep-text">
          {es
            ? 'La experiencia completa de NORA para Contratistas de Pintura se está preparando. Solicita una demo para verla en acción.'
            : 'The full NORA for Painting Contractors experience is being prepared. Request a demo to see it in action.'}
        </p>
      </section>
    </main>
  )
}
