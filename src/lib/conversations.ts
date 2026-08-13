// V4 scenario system — 10 flat real-business situations, no category hierarchy
// NORA responds naturally; asks only when operationally needed

export type BilText = { en: string; es: string }

export interface FollowUpChoice {
  id: string
  label: BilText
  noraReply: BilText
}

export interface Scenario {
  id: string
  situation: BilText
  noraReply: BilText
  followUp?: { choices: FollowUpChoice[] }
}

export const NORA_INITIAL: BilText = {
  en: 'Select a situation to see how I\'d respond.',
  es: 'Seleccione una situación para ver cómo respondería.',
}

export const SITUATIONS_LABEL: BilText = {
  en: 'SELECT A SITUATION',
  es: 'SELECCIONE UNA SITUACIÓN',
}

export const TRY_ANOTHER: BilText = {
  en: 'Try another situation',
  es: 'Probar otra situación',
}

export const START_OVER: BilText = {
  en: 'Start over',
  es: 'Empezar de nuevo',
}

export const scenarios: Scenario[] = [
  {
    id: 'absent',
    situation: {
      en: 'Daniel didn\'t come to work today.',
      es: 'Daniel no vino a trabajar hoy.',
    },
    noraReply: {
      en: 'Got it. I\'ve recorded Daniel\'s absence for today. Would you like me to redistribute his open tasks among the available team?',
      es: 'Entendido. He registrado la ausencia de Daniel para hoy. ¿Quiere que redistribuya sus tareas abiertas entre el equipo disponible?',
    },
    followUp: {
      choices: [
        {
          id: 'yes-reassign',
          label: { en: 'Yes, redistribute them', es: 'Sí, distribúyelas' },
          noraReply: {
            en: 'Done. Daniel\'s 3 open tasks have been redistributed. I\'ll track them as usual and let you know if anything is at risk.',
            es: 'Listo. Las 3 tareas abiertas de Daniel han sido redistribuidas. Les doy seguimiento y le aviso si algo está en riesgo.',
          },
        },
        {
          id: 'just-record',
          label: { en: 'Just record the absence', es: 'Solo registrar la ausencia' },
          noraReply: {
            en: 'Noted. Absence is on record. Let me know if any of his tasks need to be covered.',
            es: 'Anotado. La ausencia está en registro. Avíseme si alguna de sus tareas necesita ser cubierta.',
          },
        },
      ],
    },
  },
  {
    id: 'out-of-rice',
    situation: {
      en: 'We ran out of rice.',
      es: 'Se nos acabó el arroz.',
    },
    noraReply: {
      en: 'Recorded. I\'ve added rice to the supply shortage list. How many bags should I include in the next order?',
      es: 'Registrado. Añadí el arroz a la lista de faltantes. ¿Cuántas bolsas incluyo en el próximo pedido?',
    },
    followUp: {
      choices: [
        {
          id: '5-bags',
          label: { en: '5 bags', es: '5 bolsas' },
          noraReply: {
            en: 'Added. 5 bags of rice are in the next supply order.',
            es: 'Anotado. 5 bolsas de arroz están en el próximo pedido.',
          },
        },
        {
          id: '10-bags',
          label: { en: '10 bags', es: '10 bolsas' },
          noraReply: {
            en: 'Added. 10 bags of rice are in the next supply order.',
            es: 'Anotado. 10 bolsas de arroz están en el próximo pedido.',
          },
        },
      ],
    },
  },
  {
    id: 'feed-delay',
    situation: {
      en: 'The chicken feed delivery is delayed until tomorrow.',
      es: 'La entrega del concentrado se retrasa hasta mañana.',
    },
    noraReply: {
      en: 'Understood. I\'ve updated the expected delivery to tomorrow and sent Daniel a heads-up so he can plan accordingly.',
      es: 'Entendido. Actualicé la entrega esperada para mañana y le avisé a Daniel para que se ajuste.',
    },
  },
  {
    id: 'missing-close',
    situation: {
      en: 'María still hasn\'t sent the register close.',
      es: 'María todavía no ha enviado el cierre de caja.',
    },
    noraReply: {
      en: 'I noticed too. I already sent her a reminder 14 minutes ago. If the closing photo doesn\'t arrive by 7:00 PM, I\'ll escalate it to you.',
      es: 'También lo noté. Ya le envié un recordatorio hace 14 minutos. Si la foto de cierre no llega antes de las 7:00 PM, se lo escalo.',
    },
  },
  {
    id: 'received-units',
    situation: {
      en: 'We received 24 units from the supplier.',
      es: 'Recibimos 24 unidades del proveedor.',
    },
    noraReply: {
      en: 'Inventory updated — 24 units added. Send me the supplier invoice when you have it and I\'ll attach it to the entry.',
      es: 'Inventario actualizado — 24 unidades añadidas. Envíeme la factura del proveedor cuando la tenga y la adjunto a la entrada.',
    },
    followUp: {
      choices: [
        {
          id: 'send-invoice',
          label: { en: 'Send the invoice', es: 'Enviar la factura' },
          noraReply: {
            en: 'Invoice attached. Entry complete.',
            es: 'Factura adjunta. Entrada completa.',
          },
        },
        {
          id: 'invoice-later',
          label: { en: 'Invoice coming later', es: 'La factura llega después' },
          noraReply: {
            en: 'No problem. Entry stays open. I\'ll remind you tomorrow if no invoice has arrived.',
            es: 'Sin problema. La entrada queda abierta. Le recuerdo mañana si no ha llegado la factura.',
          },
        },
      ],
    },
  },
  {
    id: 'ac-broken',
    situation: {
      en: 'The office A/C stopped working.',
      es: 'El aire acondicionado de la oficina dejó de funcionar.',
    },
    noraReply: {
      en: 'Maintenance task created. Who should I assign it to?',
      es: 'Tarea de mantenimiento creada. ¿A quién se la asigno?',
    },
    followUp: {
      choices: [
        {
          id: 'carlos',
          label: { en: 'Carlos', es: 'Carlos' },
          noraReply: {
            en: 'Assigned to Carlos. I\'ll notify him now and follow up in 2 hours if the task is still open.',
            es: 'Asignada a Carlos. Le notifico ahora y le doy seguimiento en 2 horas si la tarea sigue abierta.',
          },
        },
        {
          id: 'technician',
          label: { en: 'Hire a technician', es: 'Contratar un técnico' },
          noraReply: {
            en: 'Noted. Flagged for external technician. Let me know who to contact and I\'ll coordinate the visit.',
            es: 'Anotado. Marcada para técnico externo. Indíqueme a quién contactar y coordino la visita.',
          },
        },
      ],
    },
  },
  {
    id: 'job-no-photos',
    situation: {
      en: 'Daniel finished the job but didn\'t send photos.',
      es: 'Daniel terminó el trabajo pero no mandó las fotos.',
    },
    noraReply: {
      en: 'Recorded as reported complete — not yet verified.\n\nI\'ve already sent Daniel a request for the required photos. Status updates when they arrive.',
      es: 'Registrado como reportado completo — sin verificar todavía.\n\nYa le solicité las fotos a Daniel. El estado se actualiza cuando lleguen.',
    },
  },
  {
    id: 'paid-supplier',
    situation: {
      en: 'I paid the supplier $850 this morning.',
      es: 'Le pagué al proveedor $850 esta mañana.',
    },
    noraReply: {
      en: 'Recorded. $850 payment registered for today. Do you have a receipt or transfer confirmation to attach?',
      es: 'Registrado. Pago de $850 registrado para hoy. ¿Tiene un comprobante o confirmación de transferencia para adjuntar?',
    },
    followUp: {
      choices: [
        {
          id: 'send-receipt',
          label: { en: 'Send receipt', es: 'Enviar comprobante' },
          noraReply: {
            en: 'Receipt attached. Payment complete.',
            es: 'Comprobante adjunto. Pago completo.',
          },
        },
        {
          id: 'no-receipt',
          label: { en: 'No receipt available', es: 'Sin comprobante disponible' },
          noraReply: {
            en: 'Understood. Payment on record without documentation. I\'ve added a note for review.',
            es: 'Entendido. Pago registrado sin documentación. Añadí una nota para revisión.',
          },
        },
      ],
    },
  },
  {
    id: 'bathroom-leak',
    situation: {
      en: 'A customer reported a bathroom leak.',
      es: 'Un cliente reportó una fuga en el baño.',
    },
    noraReply: {
      en: 'Maintenance task created — urgent priority. Which bathroom, and who should respond?',
      es: 'Tarea de mantenimiento creada — prioridad urgente. ¿Qué baño es, y quién debe atender?',
    },
    followUp: {
      choices: [
        {
          id: 'room5-carlos',
          label: { en: 'Room 5 — Carlos', es: 'Habitación 5 — Carlos' },
          noraReply: {
            en: 'Assigned to Carlos — Room 5, urgent. I\'ll follow up in 30 minutes if the task is still open.',
            es: 'Asignado a Carlos — habitación 5, urgente. Le doy seguimiento en 30 minutos si la tarea sigue abierta.',
          },
        },
        {
          id: 'common-daniel',
          label: { en: 'Common area — Daniel', es: 'Área común — Daniel' },
          noraReply: {
            en: 'Assigned to Daniel — common area bathroom, urgent. I\'ll follow up shortly.',
            es: 'Asignado a Daniel — baño área común, urgente. Le doy seguimiento pronto.',
          },
        },
      ],
    },
  },
  {
    id: 'hours-review',
    situation: {
      en: 'María worked 68 hours this pay period.',
      es: 'María trabajó 68 horas en este período de pago.',
    },
    noraReply: {
      en: 'Logged. 68 hours — 28 above the standard 40. Should I flag this for payroll review?',
      es: 'Registrado. 68 horas — 28 por encima del estándar de 40. ¿Lo marco para revisión de nómina?',
    },
    followUp: {
      choices: [
        {
          id: 'flag-payroll',
          label: { en: 'Yes, flag for payroll', es: 'Sí, marcar para nómina' },
          noraReply: {
            en: 'Flagged. Note added to María\'s record for the payroll administrator.',
            es: 'Marcado. Nota añadida al registro de María para el administrador de nómina.',
          },
        },
        {
          id: 'approved-overtime',
          label: { en: 'It\'s approved overtime', es: 'Son horas extra aprobadas' },
          noraReply: {
            en: 'Noted as approved overtime in María\'s record.',
            es: 'Registrado como horas extra aprobadas en el historial de María.',
          },
        },
      ],
    },
  },
]
