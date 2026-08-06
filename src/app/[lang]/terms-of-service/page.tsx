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
    title: lang === 'es' ? 'Términos de Servicio' : 'Terms of Service',
    description:
      lang === 'es'
        ? 'Términos que regulan el uso del Sistema Operativo Empresarial NORA de Project NEED.'
        : 'Terms governing the use of NORA AI Business Operating System by Project NEED.',
  }
}

const EFFECTIVE_DATE_ES = '25 de julio de 2026'
const EFFECTIVE_DATE_EN = 'July 25, 2026'
const CONTACT_EMAIL = 'jeanpaulcocaleca@gmail.com'

export default async function TermsOfService({
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
              {es ? 'Términos de Servicio' : 'Terms of Service'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: 0 }}>
              {es
                ? `Vigente desde: ${EFFECTIVE_DATE_ES} · Última actualización: ${EFFECTIVE_DATE_ES}`
                : `Effective: ${EFFECTIVE_DATE_EN} · Last updated: ${EFFECTIVE_DATE_EN}`}
            </p>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '2.5rem' }}>
            {es
              ? 'Estos Términos de Servicio ("Términos") rigen su acceso y uso de NORA, el Sistema Operativo Empresarial con IA proporcionado por Project NEED ("nosotros", "nos" o "Project NEED"). Al acceder o usar NORA, usted acepta estos Términos. Si no los acepta, no use el Servicio.'
              : 'These Terms of Service ("Terms") govern your access to and use of NORA, the AI Business Operating System provided by Project NEED ("we," "us," or "Project NEED"). By accessing or using NORA, you agree to these Terms. If you do not agree, do not use the Service.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            <Section title={es ? '1. Descripción del Servicio' : '1. Description of Service'}>
              <p>
                {es
                  ? 'NORA es un sistema operativo empresarial con IA que se conecta a su cuenta de WhatsApp Business para ayudar a las empresas a gestionar operaciones, enrutar tareas, capturar conocimiento organizacional y proporcionar inteligencia operativa a los propietarios de empresas. El Servicio se proporciona a las empresas ("Clientes") en modalidad de suscripción.'
                  : 'NORA is an AI-powered business operating system that connects to your WhatsApp Business account to help businesses manage operations, route tasks, capture organizational knowledge, and provide operational intelligence to business owners. The Service is provided to businesses ("Customers") on a subscription basis.'}
              </p>
              <p>
                {es
                  ? 'NORA no es una aplicación de mensajería independiente. Opera como una capa sobre su cuenta de WhatsApp Business existente, procesando mensajes y generando inteligencia operativa en su nombre.'
                  : 'NORA is not a standalone messaging application. It operates as an overlay on your existing WhatsApp Business account, processing messages and generating operational intelligence on your behalf.'}
              </p>
            </Section>

            <Section title={es ? '2. Registro y Elegibilidad' : '2. Account Registration and Eligibility'}>
              <p>
                {es
                  ? 'Para usar NORA, debe: (a) tener al menos 18 años; (b) tener autoridad para obligar a su empresa con estos Términos; (c) proporcionar información de registro precisa y completa; y (d) tener una cuenta de WhatsApp Business válida.'
                  : 'To use NORA, you must: (a) be at least 18 years old; (b) have authority to bind your business to these Terms; (c) provide accurate and complete registration information; and (d) have a valid WhatsApp Business account.'}
              </p>
              <p>
                {es
                  ? <>Es responsable de mantener la seguridad de las credenciales de su cuenta y de toda la actividad que ocurra bajo su cuenta. Notifíquenos de inmediato en{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>{' '}si cree que su cuenta ha sido comprometida.</>
                  : <>You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. Notify us immediately at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>{' '}if you believe your account has been compromised.</>}
              </p>
            </Section>

            <Section title={es ? '3. Conexión de Cuenta de WhatsApp Business' : '3. WhatsApp Business Account Connection'}>
              <p>
                {es
                  ? 'Conectar su cuenta de WhatsApp Business a NORA requiere autorización a través de la API de WhatsApp Business de Meta. Al conectar su cuenta, autoriza a Project NEED a: acceder a los mensajes enviados a y desde su número de WhatsApp Business, enviar mensajes automatizados en su nombre y conservar el historial de mensajes según se describe en nuestra Política de Privacidad.'
                  : "Connecting your WhatsApp Business account to NORA requires authorization through Meta's WhatsApp Business API. By connecting your account, you authorize Project NEED to: access messages sent to and from your WhatsApp Business number, send automated messages on your behalf, and retain message history as described in our Privacy Policy."}
              </p>
              <p>
                {es
                  ? 'Reconoce que su uso de WhatsApp Business a través de NORA también está sujeto a los Términos de Servicio de WhatsApp Business, la Política de Comercio de WhatsApp y la Política de Mensajería de WhatsApp Business de Meta. Es responsable de asegurarse de que el uso empresarial de WhatsApp cumpla con estas políticas de Meta.'
                  : "You acknowledge that your use of WhatsApp Business through NORA is also subject to Meta's WhatsApp Business Terms of Service, WhatsApp Commerce Policy, and WhatsApp Business Messaging Policy. You are responsible for ensuring your business use of WhatsApp complies with these Meta policies."}
              </p>
              <p>
                {es
                  ? 'Puede desconectar su cuenta de WhatsApp Business de NORA en cualquier momento. La desconexión detendrá todo procesamiento futuro de mensajes, pero no eliminará los datos operativos históricos almacenados en NORA.'
                  : 'You may disconnect your WhatsApp Business account from NORA at any time. Disconnecting will stop all future message processing but will not delete historical operational data stored in NORA.'}
              </p>
            </Section>

            <Section title={es ? '4. Uso Aceptable' : '4. Acceptable Use'}>
              <p>{es ? 'Usted acepta no usar NORA para:' : 'You agree not to use NORA to:'}</p>
              <ul>
                {es ? <>
                  <li>Enviar spam, mensajes comerciales no solicitados o mensajes que infrinjan las políticas de WhatsApp</li>
                  <li>Participar en actividades fraudulentas, engañosas o ilegales</li>
                  <li>Violar la privacidad o los derechos de cualquier persona</li>
                  <li>Interferir con o interrumpir el Servicio o su infraestructura subyacente</li>
                  <li>Intentar realizar ingeniería inversa, descompilar o extraer el código fuente del Servicio</li>
                  <li>Compartir el acceso a su cuenta con terceros no autorizados</li>
                  <li>Usar el Servicio de cualquier manera que pueda dañar nuestra reputación o la de Meta</li>
                </> : <>
                  <li>Send spam, unsolicited commercial messages, or messages that violate WhatsApp&apos;s policies</li>
                  <li>Engage in fraudulent, deceptive, or illegal activities</li>
                  <li>Violate the privacy or rights of any individual</li>
                  <li>Interfere with or disrupt the Service or its underlying infrastructure</li>
                  <li>Attempt to reverse engineer, decompile, or extract the source code of the Service</li>
                  <li>Share your account access with unauthorized third parties</li>
                  <li>Use the Service in any way that could damage our reputation or the reputation of Meta</li>
                </>}
              </ul>
              <p>
                {es
                  ? 'Nos reservamos el derecho de suspender o cancelar su cuenta si viola estas restricciones.'
                  : 'We reserve the right to suspend or terminate your account if you violate these restrictions.'}
              </p>
            </Section>

            <Section title={es ? '5. Sus Datos y Contenido' : '5. Your Data and Content'}>
              <p>
                {es
                  ? <>Usted conserva la propiedad de todos los datos y contenidos que proporciona a NORA. Al usar el Servicio, otorga a Project NEED una licencia limitada para procesar, almacenar y usar sus datos únicamente para prestarle el Servicio según se describe en nuestra{' '}
                    <Link href={`/${lang}/privacy-policy`} style={{ color: 'var(--accent)' }}>Política de Privacidad</Link>.</>
                  : <>You retain ownership of all data and content you provide to NORA. By using the Service, you grant Project NEED a limited license to process, store, and use your data solely to provide the Service to you as described in our{' '}
                    <Link href={`/${lang}/privacy-policy`} style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.</>}
              </p>
              <p>
                {es
                  ? 'Es responsable de asegurarse de tener los derechos y permisos necesarios para conectar su cuenta de WhatsApp Business y procesar los mensajes y datos que proporciona a NORA, incluidos los datos personales pertenecientes a sus clientes o empleados.'
                  : 'You are responsible for ensuring you have the rights and permissions necessary to connect your WhatsApp Business account and process the messages and data you provide to NORA, including any personal data belonging to your customers or employees.'}
              </p>
            </Section>

            <Section title={es ? '6. Salidas Generadas por IA y Flujos de Trabajo Automatizados' : '6. AI-Generated Outputs and Automated Workflows'}>
              <p>
                {es
                  ? 'NORA utiliza inteligencia artificial para interpretar mensajes, generar respuestas automatizadas, crear registros operativos y producir informes y resúmenes. Las salidas generadas por IA se proporcionan para asistencia operativa y son informativas por naturaleza — no constituyen asesoramiento profesional, legal, financiero ni de ningún otro tipo.'
                  : 'NORA uses artificial intelligence to interpret messages, generate automated responses, create operational records, and produce reports and summaries. AI-generated outputs are provided for operational assistance and are informational in nature — they do not constitute professional, legal, financial, or any other form of advice.'}
              </p>
              <p>
                {es
                  ? 'Los flujos de trabajo automatizados (creación de tareas, enrutamiento de gastos, escalaciones y notificaciones) son activados por la interpretación de mensajes por parte de la IA. Usted es responsable de revisar y tomar las acciones apropiadas sobre los registros y recomendaciones generados por NORA. Project NEED no garantiza la exactitud o idoneidad de ninguna salida de IA para ningún propósito específico.'
                  : 'Automated workflows (task creation, expense routing, escalations, and notifications) are triggered by AI interpretation of messages. You are responsible for reviewing and taking appropriate action on records and recommendations generated by NORA. Project NEED does not warrant the accuracy or suitability of any AI output for any specific purpose.'}
              </p>
            </Section>

            <Section title={es ? '7. Tarifas y Suscripciones' : '7. Fees and Subscriptions'}>
              <p>
                {es
                  ? 'Si el Servicio se proporciona en modalidad de suscripción, las tarifas aplicables se establecerán en un formulario de pedido, acuerdo o notificación por separado antes de que incurra en cualquier cargo. No se cobra ninguna tarifa a menos que haya sido acordada explícitamente por escrito.'
                  : 'If the Service is provided on a subscription basis, applicable fees will be set forth in a separate order form, agreement, or notification before you incur any charges. No fees are charged unless explicitly agreed to in writing.'}
              </p>
              <p>
                {es
                  ? 'Nos reservamos el derecho de modificar los precios con un aviso previo razonable. El uso continuado del Servicio después de un cambio de precio constituye su aceptación de las nuevas tarifas.'
                  : 'We reserve the right to modify pricing with reasonable advance notice. Continued use of the Service after a pricing change constitutes your acceptance of the new fees.'}
              </p>
            </Section>

            <Section title={es ? '8. Propiedad Intelectual' : '8. Intellectual Property'}>
              <p>
                {es
                  ? 'El Servicio NORA, incluyendo su software, modelos de IA, diseños y documentación, es propiedad de Project NEED y está protegido por las leyes de propiedad intelectual. Estos Términos no le otorgan ningún derecho, título o interés en el Servicio más allá del derecho limitado a usarlo según se describe aquí.'
                  : 'The NORA Service, including its software, AI models, designs, and documentation, is owned by Project NEED and protected by intellectual property laws. These Terms do not grant you any right, title, or interest in the Service beyond the limited right to use it as described herein.'}
              </p>
              <p>
                {es
                  ? 'Cualquier comentario, sugerencia o idea que proporcione sobre el Servicio puede ser utilizada por Project NEED sin obligación ni compensación hacia usted.'
                  : 'Any feedback, suggestions, or ideas you provide about the Service may be used by Project NEED without obligation or compensation to you.'}
              </p>
            </Section>

            <Section title={es ? '9. Disponibilidad y Modificaciones del Servicio' : '9. Service Availability and Modifications'}>
              <p>
                {es
                  ? 'Nos esforzamos por mantener la disponibilidad del Servicio, pero no garantizamos un funcionamiento ininterrumpido o libre de errores. Podemos modificar, suspender o interrumpir el Servicio (o cualquier parte del mismo) en cualquier momento, con un aviso previo razonable cuando sea factible.'
                  : "We strive to maintain the Service's availability but do not guarantee uninterrupted or error-free operation. We may modify, suspend, or discontinue the Service (or any part thereof) at any time, with reasonable advance notice where practical."}
              </p>
              <p>
                {es
                  ? 'Podemos actualizar estos Términos periódicamente. Le notificaremos los cambios materiales con al menos 14 días de anticipación. El uso continuado del Servicio después de que los cambios entren en vigor constituye su aceptación de los Términos actualizados.'
                  : 'We may update these Terms from time to time. We will notify you of material changes at least 14 days in advance. Continued use of the Service after changes take effect constitutes your acceptance of the updated Terms.'}
              </p>
            </Section>

            <Section title={es ? '10. Renuncia de Garantías' : '10. Disclaimer of Warranties'}>
              <p>
                {es
                  ? 'EL SERVICIO SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, INCLUIDAS LAS GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN PARTICULAR O NO INFRACCIÓN. PROJECT NEED NO GARANTIZA QUE EL SERVICIO SATISFAGA SUS REQUISITOS O QUE OPERE SIN ERRORES NI INTERRUPCIONES.'
                  : 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. PROJECT NEED DOES NOT WARRANT THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR THAT IT WILL OPERATE WITHOUT ERROR OR INTERRUPTION.'}
              </p>
            </Section>

            <Section title={es ? '11. Limitación de Responsabilidad' : '11. Limitation of Liability'}>
              <p>
                {es
                  ? 'EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, PROJECT NEED NO SERÁ RESPONSABLE DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS, INCLUIDA LA PÉRDIDA DE BENEFICIOS, DATOS U OPORTUNIDADES DE NEGOCIO, QUE SURJAN DE O ESTÉN RELACIONADOS CON SU USO DEL SERVICIO.'
                  : 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROJECT NEED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITY, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.'}
              </p>
              <p>
                {es
                  ? 'NUESTRA RESPONSABILIDAD TOTAL HACIA USTED POR TODAS LAS RECLAMACIONES QUE SURJAN DE O ESTÉN RELACIONADAS CON EL SERVICIO NO SUPERARÁ EL IMPORTE PAGADO POR USTED A PROJECT NEED EN LOS 12 MESES ANTERIORES A LA RECLAMACIÓN.'
                  : 'OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO PROJECT NEED IN THE 12 MONTHS PRECEDING THE CLAIM.'}
              </p>
            </Section>

            <Section title={es ? '12. Indemnización' : '12. Indemnification'}>
              <p>
                {es
                  ? 'Usted acepta indemnizar, defender y eximir de responsabilidad a Project NEED y a sus afiliados, directivos, directores, empleados y agentes de y contra cualquier reclamación, responsabilidad, daño, pérdida y gasto (incluidos los honorarios legales razonables) que surjan de: (a) su uso del Servicio; (b) su incumplimiento de estos Términos; (c) su violación de cualquier ley aplicable o derecho de terceros; o (d) cualquier contenido o dato que procese a través del Servicio.'
                  : 'You agree to indemnify, defend, and hold harmless Project NEED and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any applicable law or third-party right; or (d) any content or data you process through the Service.'}
              </p>
            </Section>

            <Section title={es ? '13. Terminación' : '13. Termination'}>
              <p>
                {es
                  ? 'Cualquiera de las partes puede rescindir la relación de servicio en cualquier momento. Tras la rescisión, su derecho de acceso al Servicio cesa. Conservaremos sus datos durante 30 días después de la rescisión para permitirle exportarlos, tras lo cual podrán ser eliminados. Puede solicitar la eliminación inmediata comunicándose con nosotros.'
                  : 'Either party may terminate the service relationship at any time. Upon termination, your right to access the Service ceases. We will retain your data for 30 days after termination to allow you to export it, after which it may be deleted. You may request immediate deletion by contacting us.'}
              </p>
            </Section>

            <Section title={es ? '14. Ley Aplicable' : '14. Governing Law'}>
              <p>
                {es
                  ? 'Estos Términos se rigen por las leyes de Costa Rica. Cualquier disputa que surja de estos Términos o del Servicio se resolverá mediante negociación de buena fe. Si la negociación fracasa, las disputas se someterán a arbitraje vinculante en San José, Costa Rica.'
                  : 'These Terms are governed by the laws of Costa Rica, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to binding arbitration in San José, Costa Rica.'}
              </p>
            </Section>

            <Section title={es ? '15. Contacto' : '15. Contact'}>
              <p>{es ? 'Para preguntas sobre estos Términos, contáctenos en:' : 'For questions about these Terms, contact us at:'}</p>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--rim)',
                borderRadius: 'var(--r)', padding: '1.25rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--muted)',
              }}>
                <div><strong style={{ color: 'var(--fg)' }}>Project NEED</strong></div>
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
