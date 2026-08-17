import type { Metadata } from 'next'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'es' ? 'Política de Cookies' : 'Cookie Policy',
    description:
      lang === 'es'
        ? 'Cómo neednora.com usa el almacenamiento de sesión y por qué este sitio no utiliza cookies de seguimiento.'
        : 'How neednora.com uses session storage and why this site does not use tracking cookies.',
  }
}

const EFFECTIVE_DATE_ES = '17 de agosto de 2026'
const EFFECTIVE_DATE_EN = 'August 17, 2026'
const CONTACT_EMAIL = 'jeanpaulcocaleca@gmail.com'

export default async function CookiePolicy({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const es = lang === 'es'

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="container">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 0 6rem' }}>
          <div style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--rim)' }}>
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Legal</div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.75rem' }}>
              {es ? 'Política de Cookies' : 'Cookie Policy'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: 0 }}>
              {es
                ? `Vigente desde: ${EFFECTIVE_DATE_ES} · Última actualización: ${EFFECTIVE_DATE_ES}`
                : `Effective: ${EFFECTIVE_DATE_EN} · Last updated: ${EFFECTIVE_DATE_EN}`}
            </p>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '2.5rem' }}>
            {es
              ? 'Esta política explica qué tecnologías de almacenamiento usa neednora.com y por qué. La respuesta corta: este sitio no utiliza cookies de seguimiento de ningún tipo.'
              : 'This policy explains what storage technologies neednora.com uses and why. The short answer: this site does not use tracking cookies of any kind.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            <Section title={es ? '1. Qué es una Cookie' : '1. What Is a Cookie'}>
              <p>
                {es
                  ? 'Una cookie es un pequeño archivo de texto que un sitio web almacena en su navegador. Las cookies pueden persistir entre sesiones (cookies permanentes) o eliminarse cuando cierra el navegador (cookies de sesión). Las cookies de seguimiento se utilizan para identificarle en múltiples sitios web y sesiones.'
                  : 'A cookie is a small text file that a website stores in your browser. Cookies can persist across sessions (persistent cookies) or be deleted when you close the browser (session cookies). Tracking cookies are used to identify you across multiple websites and sessions.'}
              </p>
            </Section>

            <Section title={es ? '2. Las Cookies que Usa Este Sitio' : '2. Cookies This Site Uses'}>
              <p>
                {es
                  ? 'Este sitio no establece ninguna cookie. No hay cookies de seguimiento, analíticas, de marketing ni funcionales que requieran consentimiento.'
                  : 'This site sets no cookies. There are no tracking cookies, analytics cookies, marketing cookies, or functional cookies requiring consent.'}
              </p>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--rim)',
                borderRadius: 'var(--r)',
                padding: '1.25rem',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: 'var(--muted)',
              }}>
                <strong style={{ color: 'var(--fg)' }}>
                  {es ? 'Total de cookies establecidas: 0' : 'Total cookies set: 0'}
                </strong>
              </div>
            </Section>

            <Section title={es ? '3. Almacenamiento de Sesión (sessionStorage)' : '3. Session Storage (sessionStorage)'}>
              <p>
                {es
                  ? 'Este sitio utiliza sessionStorage del navegador para una única función: recordar si la animación de demostración interactiva ya se ha reproducido durante su visita actual. Esto evita que la animación se repita cada vez que regresa a la sección de demostración.'
                  : 'This site uses browser sessionStorage for one purpose: remembering whether the interactive demo animation has already played during your current visit. This prevents the animation from replaying every time you scroll back to the demo section.'}
              </p>
              <SubSection title={es ? '¿Qué es sessionStorage?' : 'What is sessionStorage?'}>
                {es
                  ? 'sessionStorage es una tecnología de almacenamiento del navegador distinta de las cookies. Los datos almacenados en sessionStorage se eliminan automáticamente cuando cierra la pestaña o el navegador; nunca se envían a un servidor; no pueden ser leídos por otros sitios web; y no persisten entre sesiones.'
                  : 'sessionStorage is a browser storage technology distinct from cookies. Data stored in sessionStorage is automatically erased when you close the tab or browser window; is never sent to a server; cannot be read by other websites; and does not persist between sessions.'}
              </SubSection>
              <p>
                {es
                  ? 'sessionStorage no puede utilizarse para rastrearle entre sesiones ni entre sitios web. No requiere su consentimiento bajo el RGPD ni bajo la legislación de privacidad de Costa Rica (Ley 8968).'
                  : 'sessionStorage cannot be used to track you across sessions or across websites. It does not require your consent under GDPR or Costa Rican privacy law (Law 8968).'}
              </p>
            </Section>

            <Section title={es ? '4. Análisis Web' : '4. Web Analytics'}>
              <p>
                {es
                  ? 'Este sitio no utiliza actualmente ningún servicio de análisis web. No hay Google Analytics, Plausible, Fathom ni ninguna otra herramienta de seguimiento cargada por este sitio.'
                  : 'This site does not currently use any web analytics service. There is no Google Analytics, Plausible, Fathom, or any other tracking tool loaded by this site.'}
              </p>
              <p>
                {es
                  ? 'Si en el futuro se añaden servicios de análisis, esta página se actualizará antes de que sean activados. Cualquier análisis que se añada seguirá un modelo de privacidad primero y no utilizará cookies.'
                  : 'If analytics services are added in the future, this page will be updated before they are activated. Any analytics added will follow a privacy-first model and will not use cookies.'}
              </p>
            </Section>

            <Section title={es ? '5. Scripts de Terceros' : '5. Third-Party Scripts'}>
              <p>
                {es
                  ? 'Este sitio no carga scripts de seguimiento de terceros, scripts publicitarios ni widgets de redes sociales. No hay píxeles de Meta, etiquetas de Google ni ningún otro script de terceros que establezca cookies.'
                  : 'This site does not load any third-party tracking scripts, advertising scripts, or social media widgets. There are no Meta pixels, Google tags, or any other third-party scripts that set cookies.'}
              </p>
            </Section>

            <Section title={es ? '6. Sus Opciones' : '6. Your Choices'}>
              <p>
                {es
                  ? 'Como este sitio no establece cookies, no hay nada a lo que dar consentimiento ni de lo que optar por no participar. Puede borrar el sessionStorage en cualquier momento cerrando la pestaña del navegador.'
                  : 'Because this site sets no cookies, there is nothing to consent to or opt out of. You can clear sessionStorage at any time by closing the browser tab.'}
              </p>
              <p>
                {es
                  ? 'Si en el futuro se añaden cookies, implementaremos un mecanismo de consentimiento adecuado y actualizaremos esta política antes de activarlas.'
                  : 'If cookies are added in the future, we will implement an appropriate consent mechanism and update this policy before activating them.'}
              </p>
            </Section>

            <Section title={es ? '7. Cambios a Esta Política' : '7. Changes to This Policy'}>
              <p>
                {es
                  ? 'Si el uso de tecnologías de almacenamiento de este sitio cambia, esta política se actualizará antes de que los cambios entren en vigor. La fecha de vigencia en la parte superior de esta página refleja la fecha de la última actualización.'
                  : "If this site's use of storage technologies changes, this policy will be updated before those changes take effect. The effective date at the top of this page reflects when it was last updated."}
              </p>
            </Section>

            <Section title={es ? '8. Contacto' : '8. Contact'}>
              <p>
                {es
                  ? <>Si tiene preguntas sobre esta política, contáctenos en{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.{' '}
                    Para información completa sobre cómo tratamos sus datos, consulte nuestra{' '}
                    <Link href={`/${lang}/privacy-policy`} style={{ color: 'var(--accent)' }}>Política de Privacidad</Link>.</>
                  : <>If you have questions about this policy, contact us at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.{' '}
                    For full details on how we handle your data, see our{' '}
                    <Link href={`/${lang}/privacy-policy`} style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.</>}
              </p>
            </Section>

          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rim)' }}>
            <Link href={`/${lang}`} style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
              ← {es ? 'Volver a neednora.com' : 'Back to neednora.com'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.015em', marginBottom: '0.9rem', color: 'var(--fg)' }}>
        {title}
      </h2>
      <div style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {children}
      </div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--fg)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ margin: 0, color: 'var(--muted)' }}>{children}</p>
    </div>
  )
}
