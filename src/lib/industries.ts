export type IndustryStatus = 'live' | 'coming-soon'

export type SubIndustry = {
  id: string
  en: string
  es: string
  status: IndustryStatus
  /** Canonical destination path (relative, no lang prefix). Live industries only. */
  href?: string
}

export type IndustryCategory = {
  id: string
  en: string
  es: string
  industries: SubIndustry[]
}

export const INDUSTRY_TAXONOMY: IndustryCategory[] = [
  {
    id: 'hospitality',
    en: 'Hospitality & Travel',
    es: 'Hotelería y Turismo',
    industries: [
      { id: 'hospitality',      en: 'Hotels & Lodges',        es: 'Hoteles y Lodges',            status: 'live', href: 'hospitality' },
      { id: 'vacation-rentals', en: 'Vacation Rentals',       es: 'Alquileres Vacacionales',      status: 'coming-soon' },
      { id: 'tour-operators',   en: 'Tour Operators',         es: 'Operadores Turísticos',        status: 'coming-soon' },
    ],
  },
  {
    id: 'trades',
    en: 'Trades & Field Services',
    es: 'Oficios y Servicios en Campo',
    industries: [
      { id: 'painting',      en: 'Painting Contractors',    es: 'Contratistas de Pintura',     status: 'live', href: 'painting' },
      { id: 'construction',  en: 'Construction',            es: 'Construcción',                status: 'coming-soon' },
      { id: 'maintenance',   en: 'Maintenance Services',    es: 'Servicios de Mantenimiento',  status: 'coming-soon' },
      { id: 'landscaping',   en: 'Landscaping',             es: 'Paisajismo',                  status: 'coming-soon' },
    ],
  },
  {
    id: 'food',
    en: 'Food & Service',
    es: 'Alimentos y Servicio',
    industries: [
      { id: 'restaurant', en: 'Restaurants',  es: 'Restaurantes', status: 'live', href: 'restaurant' },
      { id: 'cafes-bars', en: 'Cafés & Bars', es: 'Cafés y Bares', status: 'coming-soon' },
      { id: 'catering',   en: 'Catering',     es: 'Catering',     status: 'coming-soon' },
    ],
  },
  {
    id: 'property',
    en: 'Property Operations',
    es: 'Operaciones Inmobiliarias',
    industries: [
      { id: 'property-management', en: 'Property Management',   es: 'Gestión de Propiedades',      status: 'coming-soon' },
      { id: 'facilities',          en: 'Facilities Management', es: 'Gestión de Instalaciones',    status: 'coming-soon' },
    ],
  },
]

export function getLiveIndustries(): SubIndustry[] {
  return INDUSTRY_TAXONOMY.flatMap(cat => cat.industries.filter(i => i.status === 'live'))
}
