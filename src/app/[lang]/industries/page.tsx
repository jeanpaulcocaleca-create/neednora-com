import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { PageCtaConnect } from '@/components/page-cta-connect'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'Industrias · NORA' : 'Industries · NORA',
    description: es
      ? 'La misma inteligencia de NORA, adaptada a hoteles, oficios, restaurantes y cualquier operación donde demasiada comunicación llega a muy pocas personas.'
      : 'The same NORA intelligence, adapted to hotels, trades, restaurants and any operation where too much communication reaches too few people.',
    alternates: { canonical: `/${lang}/industries`, languages: { es: '/es/industries', en: '/en/industries' } },
  }
}

export default async function IndustriesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <>
      <div className="light" data-nav="light">
        <section className="page-hero">
          <div className="sec-inner">
            <span className="kicker mono rev">{es ? 'Un solo NORA, muchos mundos' : 'One NORA, many worlds'}</span>
            <h1 className="rev">
              {es ? 'Cada negocio tiene su propio ruido. NORA aprende el tuyo.' : 'Every business has its own noise. NORA learns yours.'}
            </h1>
            <span className="hrule" aria-hidden="true" />
            <p className="lede rev">
              {es
                ? 'El problema es universal: demasiada comunicación operativa llegando a muy pocas personas. NORA adapta su vocabulario, sus reglas y sus prioridades a tu mundo.'
                : 'The problem is universal: too much operational communication reaching too few people. NORA adapts its vocabulary, its rules and its priorities to your world.'}
            </p>
          </div>
        </section>

        <section className="sec">
          <div className="sec-inner">
            <div className="ind-grid rev-seq">
              <Link className="ind-card" href={`/${lang}/hospitality`}>
                <Image src="/img/hotel.jpg" alt={es ? 'El patio tranquilo de un hotel boutique en la luz de la mañana' : 'A calm boutique hotel courtyard in morning light'} loading="lazy" width={1920} height={1080} />
                <div className="ind-body">
                  <h3>{es ? 'Hoteles y alojamientos' : 'Hotels & lodges'}</h3>
                  <p>{es ? 'Huéspedes, limpieza, mantenimiento y recepción, coordinados sin el radio encendido todo el día.' : 'Guests, housekeeping, maintenance and front desk, coordinated without the radio chatter.'}</p>
                  <span className="ind-link">
                    {es ? 'Ver a NORA aquí' : 'See NORA here'}{' '}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </Link>

              <Link className="ind-card" href={`/${lang}/painting`}>
                <Image src="/img/painting.jpg" alt={es ? 'Un pintor trabajando en una pared alta al amanecer' : 'A painter working on a tall wall at dawn'} loading="lazy" width={1920} height={1080} />
                <div className="ind-body">
                  <h3>{es ? 'Pintura y oficios' : 'Painting & trades'}</h3>
                  <p>{es ? 'Cuadrillas, materiales, clientes y cambios de alcance, con seguimiento mientras tú estás en obra.' : 'Crews, materials, clients and change orders, followed up while you are on site.'}</p>
                  <span className="ind-link">
                    {es ? 'Ver a NORA aquí' : 'See NORA here'}{' '}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </Link>

              <Link className="ind-card" href={`/${lang}/restaurant`}>
                <Image src="/img/restaurant.jpg" alt={es ? 'Un encargado de restaurante mirando su teléfono con calma durante el servicio' : 'A restaurant manager glancing calmly at his phone during service'} loading="lazy" width={1920} height={1080} />
                <div className="ind-body">
                  <h3>{es ? 'Restaurantes' : 'Restaurants'}</h3>
                  <p>{es ? 'Proveedores, turnos, reservas y la cocina, alineados antes de que empiece el servicio.' : 'Suppliers, shifts, reservations and the kitchen, aligned before service starts.'}</p>
                  <span className="ind-link">
                    {es ? 'Ver a NORA aquí' : 'See NORA here'}{' '}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </Link>
            </div>

            <h2 className="rev" style={{ marginTop: '4.5rem' }}>
              {es ? 'El ruido que NORA absorbe, en todas partes' : 'The noise NORA absorbs, everywhere'}
            </h2>
            <ul className="handle-list rev-seq">
              {es ? (
                <>
                  <li>Las preguntas que se repiten cada semana</li>
                  <li>Llegadas tarde y cambios de turno</li>
                  <li>Confirmaciones y entregas de proveedores</li>
                  <li>Evidencia en fotos del trabajo terminado</li>
                  <li>Solicitudes de compra esperando un sí</li>
                  <li>El seguimiento que nadie recordó</li>
                </>
              ) : (
                <>
                  <li>Questions that repeat every week</li>
                  <li>Late arrivals and shift changes</li>
                  <li>Vendor confirmations and deliveries</li>
                  <li>Photo evidence of finished work</li>
                  <li>Purchase requests waiting for a yes</li>
                  <li>The follow-up nobody remembered</li>
                </>
              )}
            </ul>
            <p className="lede rev" style={{ marginTop: '2.5rem' }}>
              {es
                ? 'También en construcción, servicios de campo, administración de propiedades, comercio, turismo y operaciones con varias sedes. Si tu teléfono no se detiene, NORA es para ti.'
                : 'Also in construction, field services, property management, retail, tourism and multi-location operations. If your phone never stops, NORA is for you.'}
            </p>
          </div>
        </section>
      </div>

      <PageCtaConnect lang={lang} />
    </>
  )
}
