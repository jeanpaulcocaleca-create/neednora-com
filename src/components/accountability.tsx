'use client'

import { motion } from 'motion/react'
import { Camera, FileText, UserCheck } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

export function Accountability({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  return (
    <section className="section accountability-section">
      <div className="container accountability-grid">
        <div className="accountability-copy">
          <div className="eyebrow">{es ? 'MEMORIA OPERATIVA' : 'OPERATIONAL MEMORY'}</div>
          <h2>{es ? 'NORA recuerda lo que la gerencia no puede recordar todo el tiempo.' : 'NORA remembers what management can’t remember all the time.'}</h2>
          <p>{es ? 'Cada incumplimiento, corrección, respaldo y buen desempeño puede quedar documentado como historia operacional — no como una opinión de IA.' : 'Each missed procedure, correction, piece of evidence, and positive performance event can become operational history — not an AI opinion.'}</p>
          <div className="accountability-principle"><UserCheck size={18} />{es ? 'Las decisiones de contratación, despido, promoción o aumento siguen siendo humanas.' : 'Hiring, firing, promotion, and raise decisions remain human.'}</div>
        </div>

        <motion.div className="case-card" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="case-card-header">
            <span>{es ? 'CASO DE PROCEDIMIENTO' : 'PROCEDURE CASE'}</span>
            <b>#REG-002</b>
          </div>
          <div className="case-person"><span>M</span><div><b>María</b><small>{es ? 'Cierre de caja · Segunda ocurrencia' : 'Register close · Second occurrence'}</small></div></div>
          <div className="case-message">
            {es
              ? 'María, no recibí la foto requerida del cierre de caja de ayer. Esta es la segunda vez que ocurre. Por favor envíela para completar el registro. Evitemos una tercera ocasión para prevenir que el caso sea escalado a gerencia.'
              : 'María, I did not receive yesterday’s required register-closing photo. This is the second occurrence. Please send it so I can complete the record. Let’s avoid a third occurrence so the case does not need to be escalated to management.'}
          </div>
          <div className="case-evidence"><Camera size={16} /><span>{es ? 'Evidencia requerida: foto del cierre' : 'Required evidence: closing photo'}</span><b>{es ? 'PENDIENTE' : 'PENDING'}</b></div>
          <div className="case-history"><FileText size={16} />{es ? 'Historial disponible para reportes de desempeño del empleado.' : 'History available for employee performance reporting.'}</div>
        </motion.div>
      </div>
    </section>
  )
}
