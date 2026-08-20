'use client'

import { motion } from 'motion/react'
import { CheckCircle2, FileCheck2, MessageSquareText, ShieldAlert } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import type { LucideIcon } from 'lucide-react'

export function PeaceOfMind({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const items: [string, string, LucideIcon][] = es ? [
    ['Pregunta antes de que usted tenga que preguntar', 'NORA sabe qué debía pasar y solicita el reporte, la foto, el cierre o la actualización a tiempo.', MessageSquareText],
    ['No acepta “ya lo hice” sin respaldo', 'Cuando un proceso requiere evidencia, NORA mantiene el asunto abierto hasta recibirla y verificarla.', FileCheck2],
    ['Da seguimiento sin cansarse', 'Un pendiente no desaparece en un chat. NORA recuerda, vuelve a preguntar y documenta lo que ocurrió.', CheckCircle2],
    ['Escala con contexto, no con ruido', 'Usted recibe la excepción, el historial y la decisión necesaria — no treinta mensajes que tuvo que leer primero.', ShieldAlert],
  ] : [
    ['Asks before you have to ask', 'NORA knows what should have happened and requests the report, photo, closeout, or update on time.', MessageSquareText],
    ['Doesn’t accept “done” without proof', 'When a process requires evidence, NORA keeps it open until the evidence is received and verified.', FileCheck2],
    ['Follows up without getting tired', 'An open item doesn’t disappear in a chat. NORA remembers, asks again, and documents what happened.', CheckCircle2],
    ['Escalates context, not noise', 'You receive the exception, the history, and the decision needed — not thirty messages you had to read first.', ShieldAlert],
  ]

  return (
    <section id="how-nora-works" className="section peace-section">
      <div className="container">
        <div className="peace-header">
          <div>
            <div className="eyebrow-light">{es ? 'PAZ MENTAL OPERATIVA' : 'OPERATIONAL PEACE OF MIND'}</div>
            <h2>{es ? 'NORA trabaja en el espacio entre “debería pasar” y “sí pasó”.' : 'NORA works in the space between “should happen” and “did happen.”'}</h2>
          </div>
          <p>{es ? 'La mayoría de los problemas operativos no empiezan como emergencias. Empiezan como algo que nadie confirmó, nadie documentó o nadie volvió a preguntar.' : 'Most operational problems don’t start as emergencies. They start as something nobody confirmed, documented, or remembered to ask about again.'}</p>
        </div>

        <div className="peace-grid">
          {items.map(([title, body, Icon], i) => (
            <motion.article
              className="peace-card"
              key={String(title)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div className="peace-icon"><Icon size={21} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
