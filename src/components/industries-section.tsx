import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
)

export function IndustriesSection({ lang }: { lang: Locale }) {
  const es = lang === 'es'

  const cards = [
    {
      href: `/${lang}/hospitality`,
      img: '/img/hotel.jpg',
      alt: es
        ? 'Un tranquilo patio de hotel boutique a la luz de la mañana'
        : 'A calm boutique hotel courtyard in morning light',
      title: es ? 'Hoteles y posadas' : 'Hotels & lodges',
      desc: es
        ? 'Huéspedes, limpieza, mantenimiento y recepción, coordinados sin el ruido de radio.'
        : 'Guests, housekeeping, maintenance and front desk, coordinated without the radio chatter.',
    },
    {
      href: `/${lang}/painting`,
      img: '/img/painting.jpg',
      alt: es
        ? 'Un pintor trabajando en una pared alta al amanecer'
        : 'A painter working on a tall wall at dawn',
      title: es ? 'Pintura y oficios' : 'Painting & trades',
      desc: es
        ? 'Equipos, materiales, clientes y órdenes de cambio, con seguimiento mientras estás en obra.'
        : 'Crews, materials, clients and change orders, followed up while you are on site.',
    },
    {
      href: `/${lang}/restaurant`,
      img: '/img/restaurant.jpg',
      alt: es
        ? 'Un gerente de restaurante mirando tranquilamente su teléfono durante el servicio'
        : 'A restaurant manager glancing calmly at his phone during service',
      title: es ? 'Restaurantes' : 'Restaurants',
      desc: es
        ? 'Proveedores, turnos, reservaciones y cocina, alineados antes de que empiece el servicio.'
        : 'Suppliers, shifts, reservations and the kitchen, aligned before service starts.',
    },
  ]

  return (
    <section className="sec light" id="industries">
      <div className="sec-inner">
        <div className="rev-seq">
          <span className="kicker mono">{es ? 'Una NORA, muchos mundos' : 'One NORA, many worlds'}</span>
          <h2>
            {es
              ? 'El ruido suena diferente en cada negocio. NORA habla todos.'
              : 'The noise sounds different in every business. NORA speaks all of it.'}
          </h2>
        </div>
        <div className="ind-grid rev-seq">
          {cards.map(card => (
            <Link key={card.href} className="ind-card" href={card.href}>
              <Image
                src={card.img}
                alt={card.alt}
                width={1920}
                height={1080}
                loading="lazy"
              />
              <div className="ind-body">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="ind-link">
                  {es ? 'Ver NORA aquí' : 'See NORA here'} <ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="ind-more rev">
          {es
            ? 'También en construcción, servicios de campo, administración de propiedades, retail y más.'
            : 'Also in construction, field services, property management, retail and more.'}
        </p>
      </div>
    </section>
  )
}
