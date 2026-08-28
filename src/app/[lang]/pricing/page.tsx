import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { ContactButton } from '@/components/contact-button'
import { PageCtaConnect } from '@/components/page-cta-connect'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'Precios · NORA' : 'Pricing · NORA',
    description: es
      ? 'Los planes de NORA crecen con tu operación, de un solo número hasta negocios con varias sedes. El precio se define contigo en una llamada corta.'
      : 'NORA plans grow with your operation, from a single number to multi-location businesses. Pricing is set with you in one short call.',
    alternates: { canonical: `/${lang}/pricing`, languages: { es: '/es/pricing', en: '/en/pricing' } },
  }
}

export default async function PricingPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <>
      <div className="light" data-nav="light">
        <section className="page-hero">
          <div className="sec-inner">
            <span className="kicker mono rev">{es ? 'Precios' : 'Pricing'}</span>
            <h1 className="rev">
              {es
                ? 'A la medida de tu operación, no de una tabla de funciones.'
                : 'Sized to your operation, not to a feature grid.'}
            </h1>
            <span className="hrule" aria-hidden="true" />
            <p className="lede rev">
              {es
                ? 'Cada negocio carga una cantidad distinta de ruido. Cuéntale a NORA del tuyo y tendrás plan y precio en una llamada corta. Sin sorpresas, sin contratos que duren más que su utilidad.'
                : 'Every business carries a different amount of noise. Tell NORA about yours, and you will get a plan and a price in one short call. No surprises, no contracts that outlive their usefulness.'}
            </p>
          </div>
        </section>

        <section className="sec">
          <div className="sec-inner">
            <div className="pricing-grid rev-seq">
              <div className="price-card">
                <h3>{es ? 'Inicial' : 'Starter'}</h3>
                <p className="for">
                  {es ? 'Para dueños que dirigen un equipo pequeño desde un teléfono.' : 'For owners running a small team from one phone.'}
                </p>
                <ul>
                  {es ? (
                    <>
                      <li>NORA en tu número de WhatsApp</li>
                      <li>Respuestas, recordatorios y seguimientos</li>
                      <li>El resumen diario</li>
                      <li>Memoria operativa</li>
                    </>
                  ) : (
                    <>
                      <li>NORA on your WhatsApp number</li>
                      <li>Answers, reminders and follow-ups</li>
                      <li>The daily summary</li>
                      <li>Operational memory</li>
                    </>
                  )}
                </ul>
                <ContactButton>{es ? 'Hablar del plan Inicial' : 'Talk about Starter'}</ContactButton>
              </div>

              <div className="price-card hi">
                <span className="badge">{es ? 'El más elegido' : 'Most chosen'}</span>
                <h3>{es ? 'Equipo' : 'Team'}</h3>
                <p className="for">
                  {es ? 'Para operaciones con cuadrillas, proveedores y coordinación diaria.' : 'For operations with crews, vendors and daily coordination.'}
                </p>
                <ul>
                  {es ? (
                    <>
                      <li>Todo lo del plan Inicial</li>
                      <li>Cada mensaje a la persona correcta</li>
                      <li>Aprobaciones con tus límites</li>
                      <li>Evidencia y registros de responsabilidad</li>
                      <li>Reglas de escalación</li>
                    </>
                  ) : (
                    <>
                      <li>Everything in Starter</li>
                      <li>Routing to the right person</li>
                      <li>Approvals with your limits</li>
                      <li>Evidence and accountability records</li>
                      <li>Escalation rules</li>
                    </>
                  )}
                </ul>
                <ContactButton>{es ? 'Hablar del plan Equipo' : 'Talk about Team'}</ContactButton>
              </div>

              <div className="price-card">
                <h3>{es ? 'Multi-sede' : 'Multi-location'}</h3>
                <p className="for">
                  {es ? 'Para negocios con varias sedes o marcas.' : 'For businesses running several sites or brands.'}
                </p>
                <ul>
                  {es ? (
                    <>
                      <li>Todo lo del plan Equipo</li>
                      <li>Asistentes y reglas por sede</li>
                      <li>Roles y permisos</li>
                      <li>Resúmenes entre sedes</li>
                    </>
                  ) : (
                    <>
                      <li>Everything in Team</li>
                      <li>Per-location assistants and rules</li>
                      <li>Roles and permissions</li>
                      <li>Cross-location summaries</li>
                    </>
                  )}
                </ul>
                <ContactButton>{es ? 'Hablar del plan Multi-sede' : 'Talk about Multi-location'}</ContactButton>
              </div>
            </div>

            <div className="faq rev">
              <h2 style={{ marginBottom: '1.5rem' }}>
                {es ? 'Preguntas honestas, respuestas honestas' : 'Honest questions, honest answers'}
              </h2>
              {es ? (
                <>
                  <details>
                    <summary>¿NORA reemplaza mi número de teléfono?</summary>
                    <p>No. NORA se une al número de WhatsApp que tu negocio ya usa. Tus clientes notan respuestas más rápidas, no un número nuevo.</p>
                  </details>
                  <details>
                    <summary>¿NORA puede gastar dinero o comprometer trabajo?</summary>
                    <p>Nunca sin tu aprobación. Tú pones los límites, y todo lo que involucre dinero, riesgo o compromisos cruza la línea hacia ti primero.</p>
                  </details>
                  <details>
                    <summary>¿Qué pasa cuando NORA no sabe algo?</summary>
                    <p>Lo dice, y trae a la persona correcta. Puedes tomar cualquier conversación en cualquier momento, y NORA la entrega limpiamente.</p>
                  </details>
                  <details>
                    <summary>¿Qué idiomas habla?</summary>
                    <p>Español e inglés hoy, incluso mezclados en la misma conversación cuando hace falta. Vienen más idiomas en camino.</p>
                  </details>
                  <details>
                    <summary>¿Cuánto tarda en empezar?</summary>
                    <p>Días, no meses. Conecta tu WhatsApp, enséñale a NORA cómo funciona tu negocio, y deja que empiece a absorber el ruido.</p>
                  </details>
                </>
              ) : (
                <>
                  <details>
                    <summary>Does NORA replace my phone number?</summary>
                    <p>No. NORA joins the WhatsApp number your business already uses. Your customers notice faster answers, not a new number.</p>
                  </details>
                  <details>
                    <summary>Can NORA spend money or commit to work?</summary>
                    <p>Never without your approval. You set the limits, and anything involving money, risk or commitments crosses the line to you first.</p>
                  </details>
                  <details>
                    <summary>What happens when NORA does not know something?</summary>
                    <p>It says so, and it brings the right person in. You can take over any conversation at any moment, and NORA hands it off cleanly.</p>
                  </details>
                  <details>
                    <summary>What languages does it speak?</summary>
                    <p>Spanish and English today, side by side in the same conversation when needed. More languages are on the way.</p>
                  </details>
                  <details>
                    <summary>How long does it take to start?</summary>
                    <p>Days, not months. Connect your WhatsApp, teach NORA how your business runs, and let it start absorbing the noise.</p>
                  </details>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      <PageCtaConnect lang={lang} />
    </>
  )
}
