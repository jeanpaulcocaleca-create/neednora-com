import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

export function Footer({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const altLang = es ? 'en' : 'es'

  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand">
          <span className="nav-mark"><span className="dot" aria-hidden="true" />NORA</span>
          <p>
            {es
              ? 'Asistente de Operaciones y Respuestas en Red. NORA maneja el ruido del negocio para que tú no tengas que hacerlo.'
              : 'Networked Operations & Response Assistant. NORA handles the business noise so you don\'t have to.'}
          </p>
        </div>
        <div>
          <h4>{es ? 'Producto' : 'Product'}</h4>
          <ul>
            <li><Link href={`/${lang}/how-it-works`}>{es ? 'Cómo funciona NORA' : 'How NORA works'}</Link></li>
            <li><Link href={`/${lang}/industries`}>{es ? 'Industrias' : 'Industries'}</Link></li>
            <li><Link href={`/${lang}/pricing`}>{es ? 'Precios' : 'Pricing'}</Link></li>
            <li><Link href={`/${lang}/demo`}>{es ? 'Solicitar demo' : 'Request a demo'}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{es ? 'Empresa' : 'Company'}</h4>
          <ul>
            <li><Link href={`/${lang}/about`}>{es ? 'Acerca de NORA' : 'About NORA'}</Link></li>
            <li><Link href={`/${lang}/demo`}>{es ? 'Contacto' : 'Contact'}</Link></li>
            <li>
              <Link href={`/${altLang}`} lang={altLang} hrefLang={altLang}>
                {es ? 'English' : 'Español'}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{es ? 'Legal' : 'Legal'}</h4>
          <ul>
            <li><Link href={`/${lang}/privacy-policy`}>{es ? 'Política de privacidad' : 'Privacy policy'}</Link></li>
            <li><Link href={`/${lang}/terms-of-service`}>{es ? 'Términos de servicio' : 'Terms of service'}</Link></li>
            <li><Link href={`/${lang}/cookies`}>{es ? 'Cookies y almacenamiento' : 'Cookies & storage'}</Link></li>
            <li><Link href={`/${lang}/data-deletion`}>{es ? 'Eliminación de datos' : 'Data deletion'}</Link></li>
          </ul>
        </div>
      </div>
      <div className="foot-legal">
        <span>© 2026 NORA. {es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</span>
        <span>
          {es
            ? 'Los negocios y personas mostrados son ilustrativos. Las imágenes de este sitio son generadas por IA.'
            : 'The businesses and people shown are illustrative. Imagery on this site is AI-generated.'}
        </span>
      </div>
    </footer>
  )
}
