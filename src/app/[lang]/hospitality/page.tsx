import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { LoopVidBand } from '@/components/loop-vid-band'
import { PageCtaConnect } from '@/components/page-cta-connect'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'NORA para hoteles y alojamientos · NORA' : 'NORA for hotels & lodges · NORA',
    description: es
      ? 'Preguntas de huéspedes, limpieza, mantenimiento y reservas pasan por una asistente que nunca termina su turno.'
      : 'Guest questions, housekeeping, maintenance and bookings run through one assistant that never clocks out.',
    alternates: { canonical: `/${lang}/hospitality`, languages: { es: '/es/hospitality', en: '/en/hospitality' } },
  }
}

export default async function HospitalityPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <>
      <div className="light" data-nav="light">
        <section className="page-hero">
          <div className="sec-inner">
            <span className="kicker mono rev">{es ? 'NORA para hoteles y alojamientos' : 'NORA for hotels & lodges'}</span>
            <h1 className="rev">
              {es ? 'El huésped escribe a las 11 de la noche. NORA ya está despierta.' : 'The guest writes at 11pm. NORA is already awake.'}
            </h1>
            <span className="hrule" aria-hidden="true" />
            <p className="lede rev">
              {es
                ? 'Preguntas de huéspedes, limpieza, mantenimiento y reservas pasan por una asistente que nunca termina su turno, en el idioma de tus huéspedes.'
                : 'Guest questions, housekeeping, maintenance and bookings run through one assistant that never clocks out, in the language your guests speak.'}
            </p>
          </div>
        </section>

        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="sec-inner">
            <LoopVidBand
              videoSrc="/videos/loop-hotel.mp4"
              imgSrc="/img/hotel.jpg"
              imgAlt={es ? 'El patio tranquilo de un hotel boutique en la luz de la mañana' : 'A calm boutique hotel courtyard in morning light'}
            />

            <div style={{ marginTop: '2rem' }}>
              {es ? (
                <>
                  <div className="moment rev">
                    <div>
                      <span className="mono">7:02 AM</span>
                      <h3>Una llegada temprana, resuelta</h3>
                      <p>El huésped pregunta, NORA verifica, limpieza se entera, la reserva se actualiza. Recepción lo descubre con el café, no en el check-in.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">¿Se puede hacer check-in temprano mañana? Aterrizamos a las 9.</div>
                      <div className="bub out">Buenas noticias: su habitación puede estar lista a las 10. Ya avisé a limpieza y dejé nota de su llegada.</div>
                      <div className="sys">Limpieza avisada ✓</div>
                      <div className="sys">Reserva actualizada ✓</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">12:40 PM</span>
                      <h3>Un aire goteando, dirigido</h3>
                      <p>Limpieza lo reporta, mantenimiento recibe el trabajo con el número de habitación y una foto, y el registro guarda la promesa.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">El aire de la habitación 12 está goteando.</div>
                      <div className="bub out">Gracias. Lo asigné a mantenimiento con la foto. La habitación queda bloqueada hasta que se arregle.</div>
                      <div className="sys">Mantenimiento asignado ✓</div>
                      <div className="sys">Habitación 12 bloqueada · seguimiento</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">9:30 PM</span>
                      <h3>Un checkout tardío, según tu política</h3>
                      <p>NORA conoce tus reglas y responde dentro de ellas. Solo te enteras si la respuesta necesita tu autoridad.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">¿Podemos salir a las 2pm el domingo?</div>
                      <div className="bub out">Claro que sí. Checkout tardío hasta las 2pm confirmado para la habitación 8. Que disfruten la noche.</div>
                      <div className="sys">Checkout actualizado ✓</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="moment rev">
                    <div>
                      <span className="mono">7:02 AM</span>
                      <h3>An early arrival, handled</h3>
                      <p>The guest asks, NORA checks, housekeeping knows, the reservation is updated. The front desk finds out at coffee, not at check-in.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Is early check-in possible tomorrow? We land at 9am.</div>
                      <div className="bub out">Good news: your room can be ready by 10am. I have noted your early arrival and told housekeeping.</div>
                      <div className="sys">Housekeeping notified ✓</div>
                      <div className="sys">Reservation updated ✓</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">12:40 PM</span>
                      <h3>A dripping AC, routed</h3>
                      <p>Housekeeping reports it, maintenance gets the job with the room number and a photo, and the record keeps the promise.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">AC in room 12 is dripping.</div>
                      <div className="bub out">Thank you. I assigned it to maintenance with the photo. The room is blocked until it is fixed.</div>
                      <div className="sys">Maintenance assigned ✓</div>
                      <div className="sys">Room 12 blocked · follow-up set</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">9:30 PM</span>
                      <h3>A late checkout, answered by policy</h3>
                      <p>NORA knows your rules and answers inside them. You only hear about it if the answer needs your authority.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Could we check out at 2pm on Sunday?</div>
                      <div className="bub out">Of course. Late checkout until 2pm is confirmed for room 8. Enjoy your evening.</div>
                      <div className="sys">Checkout updated ✓</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <h2 className="rev" style={{ marginTop: '3.5rem' }}>
              {es ? 'Lo que NORA absorbe en una propiedad' : 'What NORA absorbs at a property'}
            </h2>
            <ul className="handle-list rev-seq">
              {es ? (
                <>
                  <li>Preguntas de huéspedes a cualquier hora</li>
                  <li>Coordinación de limpieza</li>
                  <li>Solicitudes de mantenimiento con evidencia en fotos</li>
                  <li>Cambios y confirmaciones de reservas</li>
                  <li>Horarios y cambios de turno del personal</li>
                  <li>El resumen matutino de toda la propiedad</li>
                </>
              ) : (
                <>
                  <li>Guest questions at any hour</li>
                  <li>Housekeeping coordination</li>
                  <li>Maintenance requests with photo evidence</li>
                  <li>Booking changes and confirmations</li>
                  <li>Staff schedules and swaps</li>
                  <li>The morning summary of the whole property</li>
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
