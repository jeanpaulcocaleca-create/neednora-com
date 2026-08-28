import type { Metadata } from 'next'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import { PageCtaConnect } from '@/components/page-cta-connect'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'Cómo funciona NORA · NORA' : 'How NORA works · NORA',
    description: es
      ? 'La gente sigue hablando en WhatsApp. NORA entiende, actúa dentro de tus reglas, te trae solo las decisiones, y recuerda todo.'
      : 'People keep talking on WhatsApp. NORA understands, acts inside your rules, brings you only the decisions, and remembers everything.',
    alternates: { canonical: `/${lang}/how-it-works`, languages: { es: '/es/how-it-works', en: '/en/how-it-works' } },
  }
}

export default async function HowItWorksPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <>
      <div className="light" data-nav="light">
        <section className="page-hero">
          <div className="sec-inner">
            <span className="kicker mono rev">{es ? 'Cómo funciona NORA' : 'How NORA works'}</span>
            <h1 className="rev">
              {es
                ? 'Nadie aprende software nuevo. NORA aprende tu negocio.'
                : 'Nobody learns new software. NORA learns your business.'}
            </h1>
            <span className="hrule" aria-hidden="true" />
            <p className="lede rev">
              {es
                ? 'Tu equipo, tus proveedores y tus clientes siguen hablando como siempre. NORA hace el resto, en cinco pasos silenciosos.'
                : 'Your team, your vendors and your customers keep talking the way they already do. NORA does the rest, in five quiet steps.'}
            </p>
          </div>
        </section>

        <section className="sec">
          <div className="sec-inner">
            <div className="steps">
              {es ? (
                <>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>NORA se une a tu WhatsApp</h3>
                      <p>Responde en el número de tu negocio, en el idioma de tus clientes, a cualquier hora. Sin apps que instalar, sin capacitar al equipo.</p>
                      <span className="ex">&ldquo;Buenos días, NORA.&rdquo;</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>Entiende lo que las cosas significan</h3>
                      <p>Un empleado que llega tarde no es solo un mensaje. Es un cambio de agenda, un supervisor por avisar, un seguimiento por programar. NORA lee la operación dentro de las palabras.</p>
                      <span className="ex">Llegada pendiente · seguimiento programado</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>Actúa dentro de tus reglas</h3>
                      <p>Responde preguntas de rutina, dirige solicitudes, confirma proveedores, persigue lo que quedó pendiente. Tú defines qué puede decidir NORA y qué te espera a ti.</p>
                      <span className="ex">Proveedor confirmado para el viernes ✓</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>Te trae solo las decisiones</h3>
                      <p>Un resumen por la mañana. La aprobación ocasional. Una emergencia real. Todo lo demás ya quedó atendido debajo de tu umbral.</p>
                      <span className="ex">Resumen de la mañana · sin pendientes</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>Recuerda todo</h3>
                      <p>Promesas, fotos, aprobaciones y pendientes se vuelven un registro operativo. Pregúntale a NORA quién dijo qué, y lo sabe.</p>
                      <span className="ex">3 fotos recibidas · Trabajo 204</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>NORA joins your WhatsApp</h3>
                      <p>It answers on your business number, in your customers&apos; language, at any hour. No app to install, no training for the team.</p>
                      <span className="ex">&ldquo;Buenos días, NORA.&rdquo;</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>It understands what things mean</h3>
                      <p>A late employee is not just a message. It is a schedule change, a supervisor to notify, a follow-up to set. NORA reads the operation inside the words.</p>
                      <span className="ex">Arrival pending · follow-up set</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>It acts inside your rules</h3>
                      <p>Answering routine questions, routing requests, confirming vendors, chasing what is unfinished. You define what NORA may decide and what waits for you.</p>
                      <span className="ex">Vendor confirmed for Friday ✓</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>It brings you only the decisions</h3>
                      <p>One morning summary. The rare approval. A real emergency. Everything else was already handled below your threshold.</p>
                      <span className="ex">Morning update · no action needed</span>
                    </div>
                  </div>
                  <div className="step rev">
                    <span className="num" aria-hidden="true" />
                    <div>
                      <h3>It remembers everything</h3>
                      <p>Promises, photos, approvals and pending items become an operational record. Ask NORA who said what, and it knows.</p>
                      <span className="ex">3 photos received · Job 204</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <figure className="img-band rev">
              <Image
                src="/img/owner.jpg"
                alt={es ? 'Un dueño de negocio sonriendo ante un resumen tranquilo en su teléfono' : 'A business owner smiling at a calm morning update on his phone'}
                loading="lazy"
                width={1920}
                height={1080}
              />
              <figcaption>
                {es ? 'Menos interrupciones. Mejores decisiones. Esa es toda la idea.' : 'Fewer interruptions. Better decisions. That is the whole idea.'}
              </figcaption>
            </figure>
          </div>
        </section>
      </div>

      <PageCtaConnect lang={lang} />
    </>
  )
}
