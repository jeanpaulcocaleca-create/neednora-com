import Link from 'next/link'
import { NoraBrand } from '@/components/brand'
import type { Locale } from '@/lib/i18n'

export function Footer({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  return (
    <footer className="footer-premium" role="contentinfo">
      <div className="container">
        <div className="footer-premium-top">
          <div>
            <NoraBrand compact />
            <p>{es ? 'Networked Operations & Response Assistant. Menos persecución. Más control. Más paz mental.' : 'Networked Operations & Response Assistant. Less chasing. More control. More peace of mind.'}</p>
          </div>
          <nav aria-label="Footer">
            <Link href={`/${lang}/#how-nora-works`}>{es ? 'Cómo trabaja' : 'How NORA works'}</Link>
            <Link href={`/${lang}/#try-nora`}>{es ? 'Prueba NORA' : 'Try NORA'}</Link>
            <Link href={`/${lang}/privacy-policy`}>{es ? 'Privacidad' : 'Privacy'}</Link>
            <Link href={`/${lang}/terms-of-service`}>{es ? 'Términos' : 'Terms'}</Link>
            <Link href={`/${lang}/data-deletion`}>{es ? 'Eliminación de datos' : 'Data deletion'}</Link>
            <Link href={`/${lang}/contact`}>{es ? 'Contacto' : 'Contact'}</Link>
          </nav>
        </div>
        <div className="footer-premium-bottom">
          <span>© 2026 NORA. {es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</span>
          <span>neednora.com</span>
        </div>
      </div>
    </footer>
  )
}
