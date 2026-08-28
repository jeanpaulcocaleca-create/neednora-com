import type { Metadata } from 'next'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import { PageCtaConnect } from '@/components/page-cta-connect'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'Sobre NORA · NORA' : 'About NORA · NORA',
    description: es
      ? 'NORA nació dentro de operaciones reales, con una convicción simple: el dueño es el héroe, y su atención es el recurso más caro del negocio.'
      : 'NORA was built inside real operations, around a simple belief: the owner is the hero, and their attention is the most expensive resource in the business.',
    alternates: { canonical: `/${lang}/about`, languages: { es: '/es/about', en: '/en/about' } },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <>
      <div className="light" data-nav="light">
        <section className="page-hero">
          <div className="sec-inner">
            <span className="kicker mono rev">{es ? 'Sobre NORA' : 'About NORA'}</span>
            <h1 className="rev">
              {es
                ? 'Nacida dentro de operaciones reales, no alrededor de una demo.'
                : 'Built inside real operations, not around a demo.'}
            </h1>
            <span className="hrule" aria-hidden="true" />
            <p className="lede rev">
              {es
                ? 'NORA creció donde el ruido es real: recepciones de hotel a medianoche, cuadrillas al amanecer, proveedores contra el reloj. Existe porque quienes la construyeron vivieron el problema que resuelve.'
                : 'NORA grew up where the noise is real: hospitality desks at midnight, crews at dawn, vendors on deadline. It exists because its builders lived the problem it solves.'}
            </p>
          </div>
        </section>

        <section className="sec">
          <div className="sec-inner">
            {es ? (
              <div className="prose rev">
                <h2>La convicción</h2>
                <p>El software de negocios insiste en pedirle más al dueño: otro panel, otra bandeja, otra contraseña. NORA parte de la idea contraria. El dueño ya hace demasiado. La meta no son más paneles de control. Son menos interrupciones.</p>
                <p>Por eso NORA se coloca entre la operación y el dueño. Escucha donde la gente ya habla, responde lo que se le confía responder, coordina las piezas en movimiento, recuerda lo que se prometió, y solo trae adelante lo que de verdad necesita el criterio del dueño.</p>
                <h2>El nombre</h2>
                <p>NORA significa Networked Operations and Response Assistant. En la práctica es más simple: NORA es la colega tranquila y capaz que toda operación quisiera tener. La que responde a las 6 de la mañana sin mal humor, nunca pierde una foto y nunca olvida un seguimiento.</p>
                <h2>La línea que no cruzamos</h2>
                <p>NORA trabaja para el dueño, dentro de la autoridad que el dueño le da. Cada acción es visible, cada registro está disponible, y una persona puede tomar el control en cualquier momento. La confianza no es una función del producto. Es el piso sobre el que está construido.</p>
              </div>
            ) : (
              <div className="prose rev">
                <h2>The belief</h2>
                <p>Business software keeps asking owners to do more: another dashboard, another inbox, another login. NORA starts from the opposite idea. The owner already does too much. The goal is not more control panels. It is fewer interruptions.</p>
                <p>So NORA stands between the operation and the owner. It listens where people already talk, answers what it is trusted to answer, coordinates the moving pieces, remembers what was promised, and brings forward only what genuinely needs an owner&apos;s judgment.</p>
                <h2>The name</h2>
                <p>NORA stands for Networked Operations and Response Assistant. In practice, it is simpler than that: NORA is the calm, competent colleague every operation wishes it had. The one who answers at 6am without being grumpy, never loses a photo, and never forgets a follow-up.</p>
                <h2>The line we do not cross</h2>
                <p>NORA works for the owner, inside the authority the owner grants. Every action is visible, every record is available, and a human can take over at any moment. Trust is not a feature. It is the foundation the product stands on.</p>
              </div>
            )}

            <figure className="img-band rev">
              <Image
                src="/img/owner.jpg"
                alt={es ? 'Un dueño de negocio sonriendo con su teléfono en la mañana' : 'A business owner smiling at his phone in the early morning'}
                loading="lazy"
                width={1920}
                height={1080}
              />
              <figcaption>{es ? 'El producto no es el software. Es la calma.' : 'The product is not the software. It is the quiet.'}</figcaption>
            </figure>
          </div>
        </section>
      </div>

      <PageCtaConnect lang={lang} />
    </>
  )
}
