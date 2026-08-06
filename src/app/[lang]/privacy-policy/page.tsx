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
    title: lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy',
    description:
      lang === 'es'
        ? 'Cómo Project NEED recopila, usa y protege su información cuando usa el Sistema Operativo Empresarial NORA.'
        : 'How Project NEED collects, uses, and protects your information when you use the NORA AI Business Operating System.',
  }
}

const EFFECTIVE_DATE_ES = '25 de julio de 2026'
const EFFECTIVE_DATE_EN = 'July 25, 2026'
const CONTACT_EMAIL = 'jeanpaulcocaleca@gmail.com'

export default async function PrivacyPolicy({
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
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>{es ? 'Legal' : 'Legal'}</div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.75rem' }}>
              {es ? 'Política de Privacidad' : 'Privacy Policy'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: 0 }}>
              {es
                ? `Vigente desde: ${EFFECTIVE_DATE_ES} · Última actualización: ${EFFECTIVE_DATE_ES}`
                : `Effective: ${EFFECTIVE_DATE_EN} · Last updated: ${EFFECTIVE_DATE_EN}`}
            </p>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '2.5rem' }}>
            {es
              ? 'Project NEED opera el Sistema Operativo Empresarial con IA NORA ("NORA", el "Servicio"). Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos la información sobre las empresas y personas que usan nuestro Servicio. Al usar NORA, usted acepta las prácticas descritas en esta política.'
              : 'Project NEED operates the NORA AI Business Operating System ("NORA", the "Service"). This Privacy Policy explains how we collect, use, disclose, and protect information about businesses and individuals who use our Service. By using NORA, you agree to the practices described in this policy.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            <Section title={es ? '1. Información que Recopilamos' : '1. Information We Collect'}>
              <SubSection title={es ? '1.1 Información de Cuenta y Empresa' : '1.1 Account and Business Information'}>
                {es
                  ? 'Cuando registra una empresa en NORA, recopilamos: nombre de la empresa, nombre de contacto, dirección de correo electrónico, detalles de la cuenta de WhatsApp Business y tipo de industria. Esta información se usa para crear y gestionar su cuenta.'
                  : 'When you register a business with NORA, we collect: business name, contact name, email address, WhatsApp Business account details, and industry type. This information is used to create and manage your account.'}
              </SubSection>
              <SubSection title={es ? '1.2 Datos de WhatsApp Business' : '1.2 WhatsApp Business Data'}>
                {es
                  ? 'Cuando conecta su cuenta de WhatsApp Business a NORA, accedemos al contenido de los mensajes, información del remitente y metadatos (marcas de tiempo, IDs de mensaje) de los mensajes enviados a través de su número de WhatsApp Business. Accedemos a estos datos únicamente con su autorización explícita a través de la API oficial de WhatsApp Business de Meta.'
                  : 'When you connect your WhatsApp Business account to NORA, we access message content, sender information, and metadata (timestamps, message IDs) for messages sent through your business WhatsApp number. We access this data only with your explicit authorization through Meta\'s official WhatsApp Business API.'}
              </SubSection>
              <SubSection title={es ? '1.3 Datos Operativos' : '1.3 Operational Data'}>
                {es
                  ? 'NORA procesa y almacena datos estructurados derivados de sus operaciones comerciales, incluidos: registros de tareas y órdenes de trabajo, solicitudes de gastos, registros de interacción con clientes, registros de comunicación del personal, información de propiedades e inventario, y decisiones y aprobaciones comerciales.'
                  : 'NORA processes and stores structured data derived from your business operations, including: task and work order records, expense submissions, guest or customer interaction records, staff communication records, property and inventory information, and business decisions and approvals.'}
              </SubSection>
              <SubSection title={es ? '1.4 Datos Técnicos y de Uso' : '1.4 Usage and Technical Data'}>
                {es
                  ? 'Recopilamos información técnica sobre cómo se usa el Servicio, incluidos: registros de solicitudes de API, registros de errores, métricas de salud del servicio e información de sesión. Estos datos se usan para la operación, seguridad y mejora del servicio.'
                  : 'We collect technical information about how the Service is used, including: API request logs, error logs, service health metrics, and session information. This data is used for service operation, security, and improvement.'}
              </SubSection>
            </Section>

            <Section title={es ? '2. Cómo Usamos su Información' : '2. How We Use Your Information'}>
              <p>{es ? 'Usamos la información que recopilamos para:' : 'We use the information we collect to:'}</p>
              <ul>
                {es ? <>
                  <li>Proveer, operar y mantener el Servicio NORA</li>
                  <li>Procesar sus mensajes de WhatsApp y extraer datos operativos estructurados</li>
                  <li>Enrutar tareas y notificaciones a los miembros del equipo correspondientes</li>
                  <li>Generar informes, resúmenes y estadísticas para propietarios de empresas</li>
                  <li>Mantener el historial operativo e institucional de su empresa</li>
                  <li>Responder a sus solicitudes y brindar soporte al cliente</li>
                  <li>Detectar y prevenir fraudes, problemas de seguridad y abuso del servicio</li>
                  <li>Cumplir con las obligaciones legales aplicables</li>
                </> : <>
                  <li>Provide, operate, and maintain the NORA Service</li>
                  <li>Process your WhatsApp messages and extract structured operational data</li>
                  <li>Route tasks and notifications to the appropriate team members</li>
                  <li>Generate reports, briefings, and summaries for business owners</li>
                  <li>Maintain your business&apos;s operational history and institutional knowledge</li>
                  <li>Respond to your requests and provide customer support</li>
                  <li>Detect and prevent fraud, security issues, and service abuse</li>
                  <li>Comply with applicable legal obligations</li>
                </>}
              </ul>
              <p>
                {es
                  ? <>No <strong>vendemos</strong> sus datos personales o comerciales a terceros. No usamos sus datos operativos con fines publicitarios. No usamos sus datos para entrenar modelos de IA para otras empresas.</>
                  : <>We do <strong>not</strong> sell your personal or business data to third parties. We do not use your operational data for advertising purposes. We do not use your data to train AI models for other businesses.</>}
              </p>
            </Section>

            <Section title={es ? '3. Cumplimiento de la API de WhatsApp Business' : '3. WhatsApp Business API Compliance'}>
              <p>
                {es
                  ? 'NORA utiliza la API de WhatsApp Business proporcionada por Meta Platforms, Inc. Nuestro uso de la API de WhatsApp Business está sujeto a los Términos de Servicio de la API de WhatsApp Business y a la Política de Comercio de WhatsApp de Meta. Procesamos datos de WhatsApp únicamente para los fines descritos en esta política y según lo permitido por las políticas de Meta.'
                  : "NORA uses the WhatsApp Business API provided by Meta Platforms, Inc. Our use of the WhatsApp Business API is subject to Meta's WhatsApp Business API Terms of Service and WhatsApp Commerce Policy. We process WhatsApp data only for the purposes described in this policy and as permitted by Meta's policies."}
              </p>
              <p>
                {es
                  ? 'Al conectar su número de WhatsApp Business a NORA, nos autoriza a: recibir y procesar mensajes enviados a y desde su número de WhatsApp Business, enviar mensajes automatizados en nombre de su empresa y acceder al historial de mensajes según lo permitido por Meta.'
                  : 'When you connect your WhatsApp Business number to NORA, you authorize us to: receive and process messages sent to and from your WhatsApp Business number, send automated messages on your behalf, and access message history as permitted by Meta.'}
              </p>
              <p>
                {es
                  ? 'Puede desconectar su cuenta de WhatsApp Business de NORA en cualquier momento. La desconexión detendrá todo procesamiento futuro de mensajes.'
                  : 'You may disconnect your WhatsApp Business account from NORA at any time through your account settings. Disconnecting will stop all future message processing.'}
              </p>
              <SubSection title={es ? '3.1 Permisos de la Plataforma Meta Utilizados' : '3.1 Meta Platform Permissions Used'}>
                {es
                  ? 'Para prestar el Servicio NORA, Project NEED solicita los siguientes permisos de la plataforma Meta en nombre de su empresa:'
                  : 'To provide the NORA Service, Project NEED requests the following Meta platform permissions on your behalf:'}
              </SubSection>
              <ul>
                {es ? <>
                  <li><strong>whatsapp_business_messaging</strong> — Permite a NORA enviar y recibir mensajes de WhatsApp a través de su número de WhatsApp Business. Se usa exclusivamente para procesar los mensajes entrantes de su equipo y entregar respuestas operativas automatizadas.</li>
                  <li><strong>whatsapp_business_management</strong> — Permite a NORA gestionar la configuración de su Cuenta de WhatsApp Business (WABA), incluidos el registro del número de teléfono y la configuración de webhooks durante la configuración inicial de la cuenta.</li>
                  <li><strong>business_management</strong> — Permite a NORA verificar la asociación de su cartera empresarial y conectar su Cuenta de WhatsApp Business a la plataforma NORA a través del proceso de Registro Integrado de Meta.</li>
                  <li><strong>public_profile</strong> — Permite autenticar a su cuenta durante el proceso de Registro Integrado de Meta. NORA no utiliza los datos del perfil público para ningún otro fin.</li>
                </> : <>
                  <li><strong>whatsapp_business_messaging</strong> — Enables NORA to send and receive WhatsApp messages through your WhatsApp Business number. Used exclusively to process incoming staff messages and deliver automated operational responses.</li>
                  <li><strong>whatsapp_business_management</strong> — Enables NORA to manage your WhatsApp Business Account (WABA) configuration, including phone number registration and webhook setup during initial account configuration.</li>
                  <li><strong>business_management</strong> — Enables NORA to verify your business portfolio membership and connect your WhatsApp Business Account to the NORA platform through Meta&apos;s Embedded Signup process.</li>
                  <li><strong>public_profile</strong> — Used to authenticate your account during the Meta Embedded Signup process. NORA does not use public profile data for any other purpose.</li>
                </>}
              </ul>
              <p>
                {es
                  ? 'Estos permisos se solicitan únicamente con su autorización explícita y se utilizan exclusivamente para los fines descritos. Los datos de Meta accedidos bajo estos permisos no se comparten con terceros para fines independientes.'
                  : 'These permissions are requested only with your explicit authorization and used solely for the stated purposes. Meta data accessed under these permissions is not shared with third parties for independent purposes.'}
              </p>
            </Section>

            <Section title={es ? '4. Compartir y Divulgar Datos' : '4. Data Sharing and Disclosure'}>
              <SubSection title={es ? '4.1 Sin Intercambio entre Empresas' : '4.1 No Cross-Business Sharing'}>
                {es
                  ? 'Los datos de su empresa están completamente aislados. Ningún dato de su cuenta empresarial se comparte con, es visible para o es accesible por ninguna otra empresa que use la plataforma NORA.'
                  : 'Your business data is completely isolated. No data from your business account is ever shared with, visible to, or accessible by any other business using the NORA platform.'}
              </SubSection>
              <SubSection title={es ? '4.2 Proveedores de Servicios' : '4.2 Service Providers'}>
                {es
                  ? 'Compartimos datos con proveedores de servicios de terceros de confianza que nos ayudan a operar el Servicio, incluidos: proveedores de infraestructura en la nube (para almacenamiento y procesamiento de datos), servicios de procesamiento de IA (Anthropic PBC para servicios de modelos de IA) y proveedores de bases de datos. Estos proveedores están contractualmente obligados a proteger sus datos y usarlos únicamente para prestarnos servicios.'
                  : 'We share data with trusted third-party service providers that help us operate the Service, including: cloud infrastructure providers (for data storage and processing), AI processing services (specifically Anthropic PBC for AI model services), and database providers. These providers are contractually required to protect your data and use it only to provide services to us.'}
              </SubSection>
              <SubSection title={es ? '4.3 Requisitos Legales' : '4.3 Legal Requirements'}>
                {es
                  ? 'Podemos divulgar información si así lo exige la ley, una orden judicial o una autoridad gubernamental, o si creemos que la divulgación es necesaria para proteger los derechos, la propiedad o la seguridad de Project NEED, nuestros usuarios u otras personas.'
                  : 'We may disclose information if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect the rights, property, or safety of Project NEED, our users, or others.'}
              </SubSection>
            </Section>

            <Section title={es ? '5. Retención de Datos' : '5. Data Retention'}>
              <p>
                {es
                  ? 'Conservamos sus datos operativos mientras su cuenta esté activa y durante un período razonable posterior para permitirle recuperar sus datos. Cuando solicite la eliminación de su cuenta, eliminaremos o anonimizaremos sus datos personales y comerciales en un plazo de 30 días, excepto cuando la retención sea requerida por ley.'
                  : 'We retain your operational data for as long as your account is active and for a reasonable period afterward to allow you to retrieve your data. When you request account deletion, we will delete or anonymize your personal and business data within 30 days, except where retention is required by law.'}
              </p>
              <p>
                {es
                  ? 'NORA utiliza un modelo de datos de solo adición: los registros operativos se conservan en lugar de sobrescribirse, proporcionando un historial de auditoría completo. Puede solicitar una exportación completa de sus datos en cualquier momento.'
                  : 'NORA uses an append-first data model — operational records are preserved rather than overwritten, providing a complete audit trail. You may request a full export of your data at any time.'}
              </p>
            </Section>

            <Section title={es ? '6. Seguridad de los Datos' : '6. Data Security'}>
              <p>
                {es
                  ? 'Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Esto incluye cifrado en reposo y en tránsito, controles de acceso y monitoreo de seguridad regular.'
                  : 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. This includes encryption at rest and in transit, access controls, and regular security monitoring.'}
              </p>
              <p>
                {es
                  ? <>Ningún método de transmisión o almacenamiento es 100% seguro. Si cree que sus datos han sido comprometidos, contáctenos de inmediato en{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.</>
                  : <>No method of transmission or storage is 100% secure. If you believe your data has been compromised, please contact us immediately at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.</>}
              </p>
            </Section>

            <Section title={es ? '7. Sus Derechos' : '7. Your Rights'}>
              <p>{es ? 'Según su jurisdicción, puede tener derecho a:' : 'Depending on your jurisdiction, you may have the right to:'}</p>
              <ul>
                {es ? <>
                  <li>Acceder a los datos personales y comerciales que tenemos sobre usted</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de sus datos</li>
                  <li>Exportar sus datos en un formato portátil</li>
                  <li>Retirar el consentimiento para el procesamiento de datos</li>
                  <li>Presentar una queja ante una autoridad supervisora</li>
                </> : <>
                  <li>Access the personal and business data we hold about you</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </>}
              </ul>
              <p>
                {es
                  ? <>Para ejercer cualquiera de estos derechos, contáctenos en{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>{' '}
                    o use nuestra página de{' '}
                    <Link href={`/${lang}/data-deletion`} style={{ color: 'var(--accent)' }}>Solicitud de Eliminación de Datos</Link>.</>
                  : <>To exercise any of these rights, contact us at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>{' '}
                    or use our{' '}
                    <Link href={`/${lang}/data-deletion`} style={{ color: 'var(--accent)' }}>Data Deletion Request</Link>{' '}page.</>}
              </p>
            </Section>

            <Section title={es ? "8. Privacidad de Menores" : "8. Children's Privacy"}>
              <p>
                {es
                  ? <>NORA es un servicio empresa a empresa y no está dirigido a personas menores de 18 años. Si cree que un menor ha proporcionado información personal, contáctenos en{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.</>
                  : <>NORA is a business-to-business service and is not directed at individuals under 18 years of age. If you believe a child has provided personal information to us, please contact us at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.</>}
              </p>
            </Section>

            <Section title={es ? '9. Cambios a Esta Política' : '9. Changes to This Policy'}>
              <p>
                {es
                  ? 'Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos los cambios materiales actualizando la fecha de vigencia en la parte superior de esta página y, cuando corresponda, contactándole directamente. El uso continuado del Servicio después de que los cambios entren en vigor constituye su aceptación de la política actualizada.'
                  : 'We may update this Privacy Policy from time to time. We will notify you of material changes by updating the effective date at the top of this page and, where appropriate, by contacting you directly. Continued use of the Service after changes take effect constitutes your acceptance of the updated policy.'}
              </p>
            </Section>

            <Section title={es ? '10. Contacto' : '10. Contact'}>
              <p>{es ? 'Si tiene preguntas sobre esta Política de Privacidad o nuestras prácticas de datos, contáctenos:' : 'If you have questions about this Privacy Policy or our data practices, please contact us:'}</p>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--rim)',
                borderRadius: 'var(--r)', padding: '1.25rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--muted)',
              }}>
                <div><strong style={{ color: 'var(--fg)' }}>Project NEED</strong></div>
                <div>NORA {es ? 'Sistema Operativo Empresarial con IA' : 'AI Business Operating System'}</div>
                <div>Email: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a></div>
                <div>Website: neednora.com</div>
              </div>
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
