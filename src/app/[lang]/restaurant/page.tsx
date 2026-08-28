import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { LoopVidBand } from '@/components/loop-vid-band'
import { PageCtaConnect } from '@/components/page-cta-connect'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'NORA para restaurantes · NORA' : 'NORA for restaurants · NORA',
    description: es
      ? 'Proveedores, cambios de turno, reservas y notas de cocina pasan por NORA, para que el único fuego de tu día sea el de la cocina.'
      : 'Suppliers, shift swaps, reservations and kitchen notes run through NORA, so the only fire in your day is the one in the kitchen.',
    alternates: { canonical: `/${lang}/restaurant`, languages: { es: '/es/restaurant', en: '/en/restaurant' } },
  }
}

export default async function RestaurantPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <>
      <div className="light" data-nav="light">
        <section className="page-hero">
          <div className="sec-inner">
            <span className="kicker mono rev">{es ? 'NORA para restaurantes' : 'NORA for restaurants'}</span>
            <h1 className="rev">
              {es
                ? 'El servicio empieza a las 7. El caos empezaba a las 9 de la mañana.'
                : 'Service starts at 7. The chaos used to start at 9am.'}
            </h1>
            <span className="hrule" aria-hidden="true" />
            <p className="lede rev">
              {es
                ? 'Proveedores, cambios de turno, reservas y notas de cocina pasan por NORA, para que el único fuego de tu día sea el de la cocina.'
                : 'Suppliers, shift swaps, reservations and kitchen notes run through NORA, so the only fire in your day is the one in the kitchen.'}
            </p>
          </div>
        </section>

        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="sec-inner">
            <LoopVidBand
              videoSrc="/videos/loop-restaurant.mp4"
              imgSrc="/img/restaurant.jpg"
              imgAlt={es ? 'Un encargado de restaurante mirando su teléfono con calma durante el servicio' : 'A restaurant manager glancing calmly at his phone during service'}
              vbubble={
                <div className="vbubble">
                  <span className="mono">NORA</span>
                  {es ? 'Tu pedido de víveres llega en 2 horas' : 'Your grocery order is arriving in 2 hours'}
                </div>
              }
            />

            <div style={{ marginTop: '2rem' }}>
              {es ? (
                <>
                  <div className="moment rev">
                    <div>
                      <span className="mono">9:00 AM</span>
                      <h3>Un faltante del proveedor, ajustado</h3>
                      <p>El pedido cambia, la cocina se entera, el proveedor recibe una fecha límite. El miércoles se planea solo, con los hechos.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">No nos alcanza el salmón para mañana, podemos entregar el jueves.</div>
                      <div className="bub out">Entendido. Aviso a cocina y ajusto el pedido del miércoles. Confírmeme el jueves antes de las 5, por favor.</div>
                      <div className="sys">Cocina avisada ✓</div>
                      <div className="sys">Pedido ajustado ✓</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">3:20 PM</span>
                      <h3>Un cambio de turno, verificado y listo</h3>
                      <p>NORA revisa el horario, confirma con las dos partes, actualiza el calendario. Nadie te llama por el viernes.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">¿Puedo cambiar el viernes por la noche con Ana?</div>
                      <div className="bub out">Verificado: Ana está libre y aceptó. El horario quedó actualizado y el viernes está cubierto.</div>
                      <div className="sys">Horario actualizado ✓</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">8:45 PM</span>
                      <h3>Una reserva, en pleno servicio</h3>
                      <p>La mesa se reserva mientras el pase está lleno. El cliente recibe respuesta en segundos, no mañana.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">¿Mesa para 6 mañana a las 8?</div>
                      <div className="bub out">Listo: mesa para 6 mañana a las 8pm, a su nombre. Los esperamos.</div>
                      <div className="sys">Reserva confirmada ✓</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="moment rev">
                    <div>
                      <span className="mono">9:00 AM</span>
                      <h3>A supplier shortage, adjusted</h3>
                      <p>The order changes, the kitchen knows, the supplier gets a deadline. Wednesday plans itself around the facts.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">We are short on salmon for tomorrow, can deliver Thursday.</div>
                      <div className="bub out">Understood. I will let the kitchen know and adjust Wednesday&apos;s order. Please confirm Thursday by 5pm.</div>
                      <div className="sys">Kitchen notified ✓</div>
                      <div className="sys">Order adjusted ✓</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">3:20 PM</span>
                      <h3>A shift swap, checked and done</h3>
                      <p>NORA checks the rota, confirms both sides, updates the schedule. Nobody calls you about Friday.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Can I swap Friday night with Ana?</div>
                      <div className="bub out">Checked: Ana is free and agreed. The schedule is updated, and Friday is covered.</div>
                      <div className="sys">Schedule updated ✓</div>
                    </div>
                  </div>
                  <div className="moment rev">
                    <div>
                      <span className="mono">8:45 PM</span>
                      <h3>A reservation, mid-service</h3>
                      <p>The table is booked while the pass is full. The guest gets an answer in seconds, not tomorrow.</p>
                    </div>
                    <div className="mini-chat">
                      <div className="bub in">Table for 6 tomorrow at 8?</div>
                      <div className="bub out">Done: a table for 6 tomorrow at 8pm, under your name. We look forward to it.</div>
                      <div className="sys">Reservation confirmed ✓</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <h2 className="rev" style={{ marginTop: '3.5rem' }}>
              {es ? 'Lo que NORA absorbe en un restaurante' : 'What NORA absorbs at a restaurant'}
            </h2>
            <ul className="handle-list rev-seq">
              {es ? (
                <>
                  <li>Confirmaciones y faltantes de proveedores</li>
                  <li>Cambios de turno verificados contra el horario</li>
                  <li>Reservas a cualquier hora</li>
                  <li>Notas de preparación y platillos agotados</li>
                  <li>Reportes de incidentes con evidencia</li>
                  <li>El resumen al cierre del día</li>
                </>
              ) : (
                <>
                  <li>Supplier confirmations and shortages</li>
                  <li>Shift swaps checked against the rota</li>
                  <li>Reservations at any hour</li>
                  <li>Kitchen prep notes and 86 lists</li>
                  <li>Incident reports with evidence</li>
                  <li>The end-of-day summary</li>
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
