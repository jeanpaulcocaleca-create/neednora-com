import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const es = lang === 'es'
  return {
    title: es ? 'Cookies y almacenamiento · NORA' : 'Cookies & storage · NORA',
    description: es ? 'Qué guarda este sitio en tu navegador, y por qué.' : 'What this website stores in your browser, and why.',
    alternates: { canonical: `/${lang}/cookies`, languages: { es: '/es/cookies', en: '/en/cookies' } },
  }
}

export default async function CookiesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <div className="light" data-nav="light">
      <section className="page-hero">
        <div className="sec-inner">
          <span className="kicker mono">Legal</span>
          <h1>{es ? 'Cookies y almacenamiento' : 'Cookies and storage'}</h1>
          <span className="hrule" aria-hidden="true" />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="sec-inner">
          {es ? (
            <div className="prose">
              <p>Última actualización: 24 de agosto de 2026. Este sitio es deliberadamente ligero en rastreo.</p>
              <h2>Qué guarda este sitio</h2>
              <p>El sitio en sí guarda casi nada. Tu idioma se refleja en la dirección (las rutas /en/ y /es/), no en una cookie. Si una versión futura recuerda preferencias, vivirán en el almacenamiento local de tu navegador y se quedarán en tu dispositivo.</p>
              <h2>Qué no hace este sitio</h2>
              <p>Sin rastreadores publicitarios. Sin venta de datos de navegación. Sin analíticas de terceros que te sigan por internet.</p>
              <h2>Servicios incrustados</h2>
              <p>Las fuentes se cargan desde Google Fonts, lo que significa que tu navegador pide esos archivos a los servidores de Google. La conversación de demo corre en este sitio; cuando continúas a WhatsApp, aplican los términos de WhatsApp.</p>
              <h2>Administrar el almacenamiento</h2>
              <p>Puedes borrar el almacenamiento de este sitio en la configuración de tu navegador en cualquier momento, sin afectar el funcionamiento del sitio.</p>
            </div>
          ) : (
            <div className="prose">
              <p>Last updated: August 24, 2026. This site is intentionally light on tracking.</p>
              <h2>What this site stores</h2>
              <p>The website itself stores almost nothing. Your language choice is reflected in the address (the /en/ and /es/ paths), not in a cookie. If a future version remembers preferences, they will live in your browser&apos;s local storage and stay on your device.</p>
              <h2>What this site does not do</h2>
              <p>No advertising trackers. No selling of browsing data. No third-party analytics that follow you across the internet.</p>
              <h2>Embedded services</h2>
              <p>Fonts are loaded from Google Fonts, which means your browser requests those files from Google&apos;s servers. The demo conversation runs on this site; when you continue to WhatsApp, WhatsApp&apos;s own terms apply.</p>
              <h2>Managing storage</h2>
              <p>You can clear your browser&apos;s storage for this site at any time in your browser settings, with no effect on how the site works.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
