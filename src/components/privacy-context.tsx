'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

const contacts = {
  en: [
    { initials: 'D', name: 'Daniel Rodríguez', role: 'EMPLOYEE', sub: 'Maintenance', color: '#22c55e', dot: '#22c55e' },
    { initials: 'M', name: 'María López', role: 'EMPLOYEE', sub: 'Administration', color: '#22c55e', dot: '#22c55e' },
    { initials: 'FC', name: 'Ferretería Central', role: 'VENDOR', sub: null, color: '#3b82f6', dot: '#3b82f6' },
    { initials: 'C', name: 'Carlos', role: 'FAMILY / PERSONAL', sub: 'Private', color: '#f59e0b', dot: '#f59e0b' },
    { initials: '?', name: '+506 8XXX-XXXX', role: 'UNCLASSIFIED', sub: null, color: '#6b7280', dot: '#374151' },
  ],
  es: [
    { initials: 'D', name: 'Daniel Rodríguez', role: 'EMPLEADO', sub: 'Mantenimiento', color: '#22c55e', dot: '#22c55e' },
    { initials: 'M', name: 'María López', role: 'EMPLEADA', sub: 'Administración', color: '#22c55e', dot: '#22c55e' },
    { initials: 'FC', name: 'Ferretería Central', role: 'PROVEEDOR', sub: null, color: '#3b82f6', dot: '#3b82f6' },
    { initials: 'C', name: 'Carlos', role: 'FAMILIA / PERSONAL', sub: 'Privado', color: '#f59e0b', dot: '#f59e0b' },
    { initials: '?', name: '+506 8XXX-XXXX', role: 'SIN CLASIFICAR', sub: null, color: '#6b7280', dot: '#374151' },
  ],
}

const newContact = {
  en: {
    badge: 'NEW CONTACT DETECTED',
    name: '+506 6XXX-XXXX',
    prompt: 'How should this contact be treated?',
    options: ['Employee', 'Vendor', 'Customer', 'Family / Personal'],
  },
  es: {
    badge: 'NUEVO CONTACTO DETECTADO',
    name: '+506 6XXX-XXXX',
    prompt: '¿Cómo debe tratarse este contacto?',
    options: ['Empleado', 'Proveedor', 'Cliente', 'Familia / Personal'],
  },
}

const content = {
  en: {
    eyebrow: 'CONTEXT-AWARE',
    headline: 'NORA needs to know your business.\nNot your personal life.',
    sub: 'When you start with NORA, you define who belongs to your operation. NORA works within that context — keeping business relationships in the operational picture and everything else out of it.',
    panelTitle: 'BUSINESS CONTACTS',
    newNote: 'When a new contact appears that NORA doesn\'t recognize, she asks how to classify them — not assume.',
    principle: 'One person can be an employee here, a vendor there, and family somewhere else. You decide which relationships are operational.',
    privateNote: 'Marked Private — not visible to operational reports or team summaries.',
  },
  es: {
    eyebrow: 'CONCIENCIA DE CONTEXTO',
    headline: 'NORA necesita conocer su negocio.\nNo su vida personal.',
    sub: 'Cuando comienza con NORA, usted define quién pertenece a su operación. NORA trabaja dentro de ese contexto, manteniendo las relaciones de negocio en la imagen operativa y dejando todo lo demás fuera.',
    panelTitle: 'CONTACTOS DE NEGOCIO',
    newNote: 'Cuando aparece un contacto nuevo que NORA no reconoce, le pregunta cómo clasificarlo — no asume.',
    principle: 'Una misma persona puede ser empleada aquí, proveedor allá, y familia en otro contexto. Usted decide qué relaciones son operativas.',
    privateNote: 'Marcado como Privado — no aparece en reportes operativos ni en resúmenes del equipo.',
  },
}

export function PrivacyContext({ lang }: { lang: Locale }) {
  const c = content[lang]
  const ctacts = contacts[lang]
  const nc = newContact[lang]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const panelRef = useRef<HTMLDivElement>(null)
  const panelInView = useInView(panelRef, { once: true, margin: '-60px 0px' })

  return (
    <section style={{
      background: 'linear-gradient(175deg, #0b1825 0%, #0e1e30 100%)',
      padding: '7rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle geometric background element */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: -80, left: -80,
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,.05), transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="container" ref={ref}>
        <div className="pc-grid">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="eyebrow" style={{ marginBottom: '0.9rem' }}>{c.eyebrow}</div>
            <h2 style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.8rem)',
              fontWeight: 660,
              letterSpacing: '-0.032em',
              lineHeight: 1.15,
              color: '#f0f5ff',
              margin: '0 0 1rem',
              whiteSpace: 'pre-line',
            }}>
              {c.headline}
            </h2>
            <p style={{ color: '#7a90aa', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 2rem', maxWidth: '50ch' }}>
              {c.sub}
            </p>

            <motion.div
              className="pc-new-note"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <div className="pc-new-note-icon">→</div>
              <p>{c.newNote}</p>
            </motion.div>

            <motion.p
              style={{ fontSize: '0.82rem', color: '#3a5270', lineHeight: 1.65, margin: '1.5rem 0 0', maxWidth: '48ch' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.55 }}
            >
              {c.principle}
            </motion.p>
          </motion.div>

          {/* Right: contact panel */}
          <div ref={panelRef}>
            <motion.div
              className="pc-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={panelInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pc-panel-header">
                <span className="pc-panel-title">{c.panelTitle}</span>
              </div>

              <div className="pc-contacts">
                {ctacts.map((ct, i) => (
                  <motion.div
                    key={i}
                    className="pc-contact"
                    initial={{ opacity: 0, x: 8 }}
                    animate={panelInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.12 + i * 0.08 }}
                  >
                    <div className="pc-avatar" style={{ background: `${ct.dot}18`, borderColor: `${ct.dot}30` }}>
                      <span style={{ color: ct.color }}>{ct.initials}</span>
                    </div>
                    <div className="pc-contact-info">
                      <div className="pc-contact-name">
                        {ct.name}
                        {ct.role === (lang === 'es' ? 'FAMILIA / PERSONAL' : 'FAMILY / PERSONAL') && (
                          <span className="pc-lock" aria-label="Private">🔒</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="pc-role" style={{ color: ct.color, borderColor: `${ct.color}28`, background: `${ct.color}0d` }}>
                          {ct.role}
                        </span>
                        {ct.sub && (
                          <span className="pc-sub">{ct.sub}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Private note */}
              <div className="pc-private-note">
                <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>🔒</span>
                <span>{c.privateNote}</span>
              </div>
            </motion.div>

            {/* New contact detected card */}
            <motion.div
              className="pc-new-contact"
              initial={{ opacity: 0, y: 12 }}
              animate={panelInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pc-new-badge">{nc.badge}</div>
              <div className="pc-new-number">{nc.name}</div>
              <div className="pc-new-prompt">{nc.prompt}</div>
              <div className="pc-new-options">
                {nc.options.map((opt, i) => (
                  <div key={i} className="pc-new-option">{opt}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .pc-grid {
          display: grid;
          gap: 4rem;
          align-items: start;
        }
        @media (min-width: 960px) {
          .pc-grid { grid-template-columns: 1fr 1fr; }
        }

        .pc-new-note {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: rgba(59,130,246,.05);
          border: 1px solid rgba(59,130,246,.15);
          border-radius: var(--r);
          padding: 0.9rem 1rem;
        }
        .pc-new-note-icon {
          color: rgba(59,130,246,.6);
          font-size: 1rem;
          line-height: 1.5;
          flex-shrink: 0;
        }
        .pc-new-note p {
          font-size: 0.85rem;
          color: #7a90aa;
          line-height: 1.6;
          margin: 0;
        }

        /* Contact panel */
        .pc-panel {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(130,158,201,.14);
          background: #08101e;
          box-shadow: 0 24px 60px rgba(0,0,0,.24);
          margin-bottom: 1rem;
        }
        .pc-panel-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(130,158,201,.1);
          background: rgba(255,255,255,.015);
        }
        .pc-panel-title {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #3a5270;
          text-transform: uppercase;
        }
        .pc-contacts {
          padding: 0.5rem 0;
        }
        .pc-contact {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.55rem 1rem;
          border-bottom: 1px solid rgba(130,158,201,.06);
          transition: background 0.14s;
        }
        .pc-contact:last-child { border-bottom: none; }
        .pc-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1px solid;
          display: grid;
          place-items: center;
          font-size: 0.68rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .pc-contact-info { flex: 1; min-width: 0; }
        .pc-contact-name {
          font-size: 0.82rem;
          color: #c4d5e8;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.18rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .pc-lock { font-size: 0.72rem; }
        .pc-role {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.12rem 0.4rem;
          border-radius: 4px;
          border: 1px solid;
          white-space: nowrap;
        }
        .pc-sub {
          font-size: 0.66rem;
          color: #3a5270;
        }
        .pc-private-note {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.65rem 1rem;
          border-top: 1px solid rgba(130,158,201,.08);
          background: rgba(0,0,0,.12);
          font-size: 0.68rem;
          color: #4a6278;
          font-style: italic;
          line-height: 1.5;
        }

        /* New contact card */
        .pc-new-contact {
          border-radius: 12px;
          border: 1px solid rgba(14,165,233,.2);
          background: rgba(14,165,233,.04);
          padding: 1rem 1.1rem;
        }
        .pc-new-badge {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #14b8e6;
          margin-bottom: 0.55rem;
        }
        .pc-new-number {
          font-size: 0.9rem;
          font-weight: 600;
          color: #c4d5e8;
          margin-bottom: 0.35rem;
          font-family: var(--font-mono);
        }
        .pc-new-prompt {
          font-size: 0.78rem;
          color: #6a8aaa;
          margin-bottom: 0.7rem;
        }
        .pc-new-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .pc-new-option {
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          border: 1px solid rgba(130,158,201,.2);
          background: rgba(255,255,255,.03);
          font-size: 0.73rem;
          color: #7a90aa;
          cursor: default;
        }

        @media (max-width: 640px) {
          .pc-contact-name { font-size: 0.78rem; }
          .pc-new-prompt { font-size: 0.75rem; }
        }
      `}</style>
    </section>
  )
}
