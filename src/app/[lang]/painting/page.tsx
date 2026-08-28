import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { LoopVidBand } from '@/components/loop-vid-band'
import { PageCtaConnect } from '@/components/page-cta-connect'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'NORA para pintura y oficios · NORA' : 'NORA for painting & trades · NORA',
    description: es
      ? 'Asistencia de cuadrillas, materiales, avances al cliente y cambios de alcance pasan por NORA, para que la obra avance mientras tus manos están ocupadas.'
      : 'Crew attendance, materials, client updates and change orders run through NORA, so the job moves while your hands are busy.',
    alternates: { canonical: `/${lang}/painting`, languages: { es: '/es/painting', en: '/en/painting' } },
  }
}

export default async function PaintingPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <>
      <div className="light" data-nav="light">
        <section className="page-hero">
          <div className="sec-inner">
            <span className="kicker mono rev">{es ? 'NORA para pintura y oficios' : 'NORA for painting & trades'}</span>
            <h1 className="rev">
              {es ? 'Tú estás en la escalera. NORA está en el teléfono.' : 'You are on a ladder. NORA is on the phone.'}
            </h1>
            <span className="hrule" aria-hidden="true" />
            <p className="lede rev">
              {es
                ? 'Asistencia de cuadrillas, materiales, avances al cliente y cambios de alcance pasan por NORA, para que la obra avance mientras tus manos están ocupadas.'
                : 'Crew attendance, materials, client updates and change orders run through NORA, so the job moves while your hands are busy.'}
            </p>
          </div>
        </section>

        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="sec-inner">
            <LoopVidBand
              videoSrc="/videos/loop-painting.mp4"
              imgSrc="/img/painting.jpg"
              imgAlt={es ? 'Un pintor trabajando en una pared alta al amanecer' : 'A painter working on a tall wall at dawn'}
            />

            <div style={{ marginTop: '2rem' }}>
              {es ? (
                <>
                  <div className="moment rev">
                    <div>
                      <span className="mono">6:42 AM</span>
                      <h3>Un llegada tarde, absorbida</h3>
                      <p>El supervisor se entera, la agenda se ajusta, el seguimiento queda programado. Tú lo ves en el resumen de la mañana, si acaso.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Buenos días. Voy 20 minutos tarde. Disculpas.</div>
                      <div className="bub out">Gracias, José. Le aviso a su supervisor. Avíseme cuando llegue para enviarle su lista de trabajo.</div>
                      <div className="sys">Supervisor informado ✓</div>
                      <div className="sys">Llegada pendiente · NORA dará seguimiento</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">10:15 AM</span>
                      <h3>Un cambio de alcance, preparado para ti</h3>
                      <p>El cliente pide más trabajo. NORA prepara el cambio y te lo trae. Las decisiones de dinero siempre cruzan la línea hacia ti.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">¿Podemos agregar las puertas del garaje al trabajo?</div>
                      <div className="bub out">Con gusto. Preparo el cambio de alcance y se lo envío hoy al dueño para su aprobación.</div>
                      <div className="sys">Cambio preparado · esperando tu aprobación</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">4:50 PM</span>
                      <h3>Trabajo terminado, en el registro</h3>
                      <p>Llegan las fotos, la promesa se marca cumplida, el recorrido queda agendado. Nada vive solo en un chat.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Pared norte lista, envío fotos.</div>
                      <div className="bub out">Recibido, gracias. Marqué la sección como terminada y propuse el viernes para el recorrido con el cliente.</div>
                      <div className="sys">3 fotos recibidas ✓</div>
                      <div className="sys">Recorrido propuesto · viernes</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="moment rev">
                    <div>
                      <span className="mono">6:42 AM</span>
                      <h3>A late crew member, absorbed</h3>
                      <p>The supervisor knows, the schedule shifts, the follow-up is set. You hear about it in the morning summary, if at all.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Buenos días. Voy 20 minutos tarde. Disculpas.</div>
                      <div className="bub out">Gracias, José. Le aviso a su supervisor. Avíseme cuando llegue para enviarle su lista de trabajo.</div>
                      <div className="sys">Supervisor informado ✓</div>
                      <div className="sys">Llegada pendiente · NORA dará seguimiento</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">10:15 AM</span>
                      <h3>A change order, drafted for you</h3>
                      <p>The client asks for more scope. NORA drafts the change order and brings it to you. Money decisions always cross the line to you.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Can we add the garage doors to the job?</div>
                      <div className="bub out">Happy to. I will prepare the change order and send it to you today for approval.</div>
                      <div className="sys">Change order drafted · awaiting your approval</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">4:50 PM</span>
                      <h3>Finished work, on the record</h3>
                      <p>Photos arrive, the promise is checked off, the walkthrough is scheduled. Nothing lives only in a chat.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">North wall done, sending photos.</div>
                      <div className="bub out">Received, thank you. I noted the section as finished and proposed Friday for the client walkthrough.</div>
                      <div className="sys">3 photos received ✓</div>
                      <div className="sys">Walkthrough proposed · Friday</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <h2 className="rev" style={{ marginTop: '3.5rem' }}>
              {es ? 'Lo que NORA absorbe en una obra' : 'What NORA absorbs on a job'}
            </h2>
            <ul className="handle-list rev-seq">
              {es ? (
                <>
                  <li>Asistencia y horarios de cuadrillas</li>
                  <li>Pedidos y entregas de materiales</li>
                  <li>Avances al cliente con fotos</li>
                  <li>Cambios de alcance preparados para tu aprobación</li>
                  <li>Confirmaciones de proveedores</li>
                  <li>El resumen diario de cada obra</li>
                </>
              ) : (
                <>
                  <li>Crew attendance and schedules</li>
                  <li>Materials orders and deliveries</li>
                  <li>Client updates with photos</li>
                  <li>Change orders drafted for your approval</li>
                  <li>Vendor confirmations</li>
                  <li>The daily summary of every job</li>
                </>
              )}
            </ul>
          </div>
        </section>
      </div>

      <PageCtaConnect lang={lang} />
    </>
  )
}
