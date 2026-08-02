export const es = {
  locale: 'es' as const,

  meta: {
    titleTemplate: '%s — NORA by Project NEED',
    defaultTitle: 'NORA — Sistema Operativo Empresarial con IA',
    description:
      'NORA transforma las conversaciones de WhatsApp en operaciones empresariales organizadas. Conecta tu cuenta de WhatsApp Business y deja que NORA gestione el resto.',
  },

  nav: {
    howItWorks: 'Cómo funciona',
    forBusiness: 'Para empresas',
    contact: 'Contacto',
    earlyAccess: 'Acceso Anticipado',
  },

  hero: {
    eyebrow: 'Sistema Operativo Empresarial con IA',
    headline: 'Las conversaciones dirigen tu operación.',
    subhead:
      'NORA transforma las conversaciones de WhatsApp en operaciones estructuradas — enrutadas, rastreadas y visibles — sin cambiar la forma en que trabaja tu equipo.',
    ctaPrimary: 'Solicitar Acceso Anticipado',
    ctaSecondary: 'Ver cómo funciona ↓',
    canvas: {
      title: 'NORA',
      subtitle: 'Monitor de Operaciones',
      live: 'En vivo',
      threads: [
        {
          id: 'OT-0142',
          category: 'Mantenimiento',
          title: 'Fuga en lavamanos — Propiedad Rivera',
          detail: 'Asignado a Marcos · Baño principal',
          statusLabel: 'Abierta',
          statusColor: '#F59E0B',
          accentColor: '#F59E0B',
          accentBg: 'rgba(245,158,11,0.08)',
        },
        {
          id: 'GAS-091',
          category: 'Finanzas',
          title: 'Gasto pendiente — Repuesto $85',
          detail: 'Enviado por Marcos · OT-0142',
          statusLabel: 'Pendiente',
          statusColor: '#3B82F6',
          accentColor: '#3B82F6',
          accentBg: 'rgba(59,130,246,0.06)',
        },
        {
          id: 'INF',
          category: 'Informe al Propietario',
          title: 'Informe matutino listo — 07:00 AM',
          detail: '2 elementos requieren tu atención',
          statusLabel: 'Listo',
          statusColor: '#10B981',
          accentColor: '#10B981',
          accentBg: 'rgba(16,185,129,0.06)',
        },
      ],
      footer: '9 operaciones monitoreadas',
      updated: 'Actualizado ahora',
    },
  },

  productStory: {
    eyebrow: 'NORA en Acción',
    headline: 'Una conversación. Todas las operaciones que siguen.',
    subhead:
      'Un técnico envía un mensaje de WhatsApp. NORA lo entiende, crea la orden de trabajo, captura la solicitud de gasto y presenta todo lo que el propietario necesita saber.',
    waRole: 'Técnico de Campo',
    waMessages: [
      {
        text: 'Acabo de llegar a la propiedad Rivera. Hay una fuga en el lavamanos del baño principal — hay agua acumulándose debajo del mueble. Necesito resolver esto hoy.',
        sent: false,
        time: '7:15 AM',
      },
      {
        text: 'Recibido. Orden de trabajo OT-0142 abierta — Rivera, baño principal, prioridad alta. Equipo notificado.',
        sent: true,
        time: '7:15 AM',
        sender: 'NORA',
      },
      {
        text: 'La línea de suministro está reparada pero el cartucho de la llave está dañado. Necesito un repuesto — unos $85. ¿Puedo pedirlo?',
        sent: false,
        time: '7:38 AM',
      },
    ],
    nora: {
      headerLabel: 'Análisis NORA',
      headerMeta: '1 intención · 0 ambigüedades',
      rows: [
        { key: 'De', value: 'Marcos · Equipo de Campo' },
        { key: 'Cliente', value: 'Propiedad Rivera' },
        { key: 'Ubicación', value: 'Baño principal — debajo del lavamanos' },
        { key: 'Intención', value: 'Mantenimiento + solicitud de gasto' },
        { key: 'Prioridad', value: 'Alta — mismo día' },
      ],
      subCards: [
        {
          label: 'Orden de Trabajo',
          id: 'OT-0142',
          statusLabel: 'Abierta',
          statusColor: '#D97706',
          borderColor: '#F59E0B',
          items: ['Asignado: Marcos (en sitio)', 'Equipo notificado 7:16 AM'],
        },
        {
          label: 'Aprobación de Gasto',
          id: 'GAS-091',
          statusLabel: 'Pendiente',
          statusColor: '#2563EB',
          borderColor: '#3B82F6',
          items: ['$85 · cartucho de llave', 'Requiere aprobación del propietario'],
        },
      ],
      briefingNote: 'Agregado al informe del propietario — gasto + resumen OT',
    },
    briefing: {
      title: 'Informe Matutino',
      time: 'Martes · 07:00 AM',
      ownerNote: 'El propietario recibe un informe estructurado — no un hilo de mensajes.',
      cols: [
        {
          label: 'Operaciones',
          borderColor: '#059669',
          items: [
            { text: '6 trabajos completados ayer', ok: true },
            { text: '3 órdenes de trabajo abiertas · 1 prioridad alta', warn: true },
          ],
        },
        {
          label: 'Requiere Atención',
          borderColor: '#D97706',
          items: [
            { text: 'Gasto $85 · OT-0142 → Aprobar o Rechazar', warn: true },
            { text: 'OT-0138 vencida · Fuentes — AC · 2 días', danger: true },
            { text: 'Consulta de Rivera sin respuesta', warn: true },
          ],
        },
        {
          label: 'Ingresos',
          borderColor: '#2563EB',
          items: [
            { text: '$4,200 facturado esta semana' },
            { text: '$340 pendiente · saldo Rivera' },
          ],
        },
      ],
    },
  },

  signal: {
    eyebrow: 'La idea detrás de NORA',
    headline: 'Tu negocio ya opera',
    headlineAccent: 'a través de conversaciones.',
    body: 'La información ya está ahí — en los hilos de WhatsApp entre empleados, gerentes y clientes. NORA lee esas conversaciones y las convierte en operaciones estructuradas, registros y decisiones. Sin nuevas herramientas. Sin cambios de comportamiento. Sin ingreso manual de datos.',
    pillars: [
      {
        title: 'Lee cada conversación',
        body: 'NORA entiende la intención de la manera en que tu equipo ya se comunica. Sin comandos, sin formatos requeridos — solo mensajes naturales de WhatsApp.',
      },
      {
        title: 'Crea operaciones estructuradas',
        body: 'Órdenes de trabajo, solicitudes de gasto, seguimientos, escalaciones — extraídas del texto y monitoreadas hasta su cierre, sin que nadie llene un formulario.',
      },
      {
        title: 'Presenta lo que importa',
        body: 'Los propietarios reciben un informe diario. Sin sobrecarga de notificaciones, sin hilos que gestionar — solo la imagen operativa que realmente requiere su atención.',
      },
    ],
  },

  domainExplorer: {
    eyebrow: 'Lo que NORA gestiona',
    headline: 'Una plataforma. Cada operación.',
    subhead:
      'Selecciona cualquier área operativa para ver cómo NORA la gestiona — desde el mensaje de WhatsApp hasta el resultado estructurado.',
    domains: [
      {
        id: 'maintenance',
        label: 'Mantenimiento y Órdenes de Trabajo',
        description:
          'Un mensaje sobre una puerta rota, una tubería con fuga o un equipo defectuoso se convierte en una orden de trabajo rastreada — asignada, con seguimiento y cerrada.',
        message: {
          sender: 'Carlos · Técnico',
          initials: 'CT',
          text: 'La puerta del garaje en Pine Street no cierra. Sigue revirtiendo antes de cerrarse. No podemos asegurar la propiedad esta noche.',
          time: '3:47 PM',
        },
        rows: [
          { key: 'Cliente', value: 'Propiedad Pine Street' },
          { key: 'Problema', value: 'Falla en puerta de garaje — no cierra' },
          { key: 'Prioridad', value: 'Alta — problema de seguridad', isWarn: true },
          { key: 'Acción', value: 'OT-0201 creada · Carlos asignado', isOk: true },
        ],
      },
      {
        id: 'expenses',
        label: 'Gestión de Gastos',
        description:
          'Las solicitudes de compra y gastos fluyen por WhatsApp. NORA los captura, los vincula a órdenes de trabajo y los pone en cola para aprobación.',
        message: {
          sender: 'Carmen · Operaciones',
          initials: 'CO',
          text: 'Necesito reponer artículos de limpieza — escobillas, detergente, guantes. Serán unos $120 de la ferretería de la esquina.',
          time: '9:14 AM',
        },
        rows: [
          { key: 'Tipo', value: 'Solicitud de compra de suministros' },
          { key: 'Monto', value: '~$120' },
          { key: 'Enviado por', value: 'Carmen · Operaciones' },
          { key: 'Acción', value: 'Aprobación solicitada · propietario notificado', isBlue: true },
        ],
      },
      {
        id: 'coordination',
        label: 'Coordinación de Equipo',
        description:
          'Los cambios de horario, solicitudes de cobertura y traspasos se registran automáticamente. NORA notifica a las personas correctas y registra cada cambio.',
        message: {
          sender: 'David · Equipo de Campo',
          initials: 'DM',
          text: 'Tengo que salir temprano hoy — a las 3pm en lugar de las 5pm. Asunto familiar. ¿Hay alguien que pueda cubrir las últimas dos horas en Fuentes?',
          time: '11:32 AM',
        },
        rows: [
          { key: 'Tipo', value: 'Solicitud de ajuste de turno' },
          { key: 'Empleado', value: 'David · Equipo de Campo' },
          { key: 'Ubicación', value: 'Propiedad Fuentes · 3–5 PM' },
          { key: 'Acción', value: 'Solicitud de cobertura enviada al equipo', isBlue: true },
        ],
      },
      {
        id: 'customers',
        label: 'Comunicación con Clientes',
        description:
          'Los mensajes de clientes enrutados a través de tu equipo son rastreados y con seguimiento. NORA señala las consultas sin respuesta antes de que se conviertan en problemas.',
        message: {
          sender: 'Cuenta Rivera',
          initials: 'RA',
          text: 'Hola, enviamos una consulta el lunes sobre el horario de servicio y todavía no hemos recibido respuesta. Estamos tratando de planificar la semana.',
          time: '10:05 AM',
        },
        rows: [
          { key: 'Cliente', value: 'Cuenta Rivera' },
          { key: 'Tipo', value: 'Seguimiento requerido' },
          { key: 'Estado', value: 'Sin respuesta — 2 días abierto', isWarn: true },
          { key: 'Acción', value: 'Escalado al gerente de cuenta', isWarn: true },
        ],
      },
      {
        id: 'reporting',
        label: 'Informes al Propietario',
        description:
          'Cada día, el propietario recibe un informe estructurado. Lo que se completó, lo que necesita aprobación, lo que está en riesgo. Nada más.',
        message: {
          sender: 'NORA · Informe Diario',
          initials: 'NR',
          text: 'Buenos días. Resumen del martes: 7 trabajos cerrados, 2 órdenes de trabajo abiertas (1 prioridad alta), 1 gasto pendiente de aprobación, 1 tarea vencida.',
          time: '07:00 AM',
          isNora: true,
        },
        rows: [
          { key: 'Completado', value: '7 trabajos cerrados ayer', isOk: true },
          { key: 'OTs abiertas', value: '2 total · 1 prioridad alta', isWarn: true },
          { key: 'Gasto', value: '$85 pendiente de tu aprobación' },
          { key: 'Vencido', value: '1 tarea · 2 días de retraso', isWarn: true },
        ],
      },
    ],
  },

  trust: {
    eyebrow: 'Datos y Privacidad',
    headline: 'Tus datos son tuyos.',
    subhead:
      'NORA está construido para empresas que toman en serio los datos operativos. Esto es lo que significa en la práctica.',
    points: [
      {
        title: 'Tú autorizas. Tú controlas.',
        body: 'NORA se conecta a tu cuenta de WhatsApp Business únicamente después de que la autorices explícitamente a través del proceso seguro de Meta. Tú decides a qué puede acceder NORA, y puedes desconectarlo en cualquier momento.',
      },
      {
        title: 'Aislamiento completo de datos.',
        body: 'Los datos de tu negocio nunca se comparten con, son visibles para, ni son accesibles por ningún otro negocio en la plataforma. Aislamiento completo en cada capa — base de datos, contexto de IA y memoria empresarial.',
      },
      {
        title: 'Historial de auditoría completo.',
        body: 'Cada operación, decisión y comunicación queda registrada de forma permanente. Nada se elimina. Tu historial operativo completo siempre está accesible.',
      },
    ],
    legalLabel: 'Documentos legales:',
    legalLinks: [
      { href: '/privacy-policy', label: 'Política de Privacidad' },
      { href: '/terms-of-service', label: 'Términos de Servicio' },
      { href: '/data-deletion', label: 'Eliminación de Datos' },
    ],
  },

  earlyAccess: {
    eyebrow: 'Acceso Anticipado',
    headline: 'Obtén NORA para tu negocio.',
    subhead:
      'Estamos incorporando un número limitado de empresas en nuestra fase piloto. Te contactaremos en un plazo de 48 horas.',
    fields: {
      name: { label: 'Tu nombre', placeholder: 'Andrés García' },
      business: { label: 'Nombre del negocio', placeholder: 'Basecamp Monteverde' },
      whatsapp: { label: 'Número de WhatsApp', placeholder: '+506 8888 0000' },
      industry: {
        label: 'Industria',
        placeholder: 'Selecciona tu industria',
        options: [
          'Hospitalidad y Alojamiento',
          'Administración de Propiedades',
          'Servicios de Campo',
          'Restaurantes y Servicios de Alimentos',
          'Construcción',
          'Otro',
        ],
      },
      message: {
        label: 'Cuéntanos sobre tu operación',
        optional: '(opcional)',
        placeholder:
          '¿Cuántas personas trabajan en tu negocio? ¿Cuál es el principal desafío que te gustaría que NORA resolviera?',
      },
    },
    submit: 'Solicitar Acceso Anticipado',
    submitting: 'Enviando…',
    errorMsg:
      'Algo salió mal. Por favor, escríbenos directamente a jeanpaulcocaleca@gmail.com',
    successTitle: 'Solicitud recibida.',
    successBody:
      'Gracias. Revisaremos tu información y nos comunicaremos contigo dentro de las 48 horas para discutir cómo NORA puede funcionar para tu negocio.',
    nextStepsTitle: 'Qué pasa a continuación',
    nextSteps: [
      {
        step: '01',
        title: 'Revisamos tu solicitud',
        body: 'En 48 horas, revisaremos lo que has compartido y nos comunicaremos contigo directamente.',
      },
      {
        step: '02',
        title: 'Una breve conversación',
        body: 'Aprenderemos sobre tu operación para asegurarnos de que NORA sea la solución correcta — y la configuraremos para tu industria.',
      },
      {
        step: '03',
        title: 'Empiezas a usar NORA',
        body: 'Conecta tu cuenta de WhatsApp Business. Tu equipo sigue trabajando como siempre. NORA empieza a escuchar.',
      },
    ],
  },

  footer: {
    tagline: 'Sistema Operativo Empresarial con IA · Project NEED',
    links: [
      { href: '/#product-story', label: 'Cómo funciona' },
      { href: '/privacy-policy', label: 'Política de Privacidad' },
      { href: '/terms-of-service', label: 'Términos de Servicio' },
      { href: '/data-deletion', label: 'Eliminación de Datos' },
      { href: '/contact', label: 'Contacto' },
    ],
    copyright: '© 2026 Project NEED. Todos los derechos reservados.',
  },

  contact: {
    title: 'Contacto',
    metaTitle: 'Contacto',
    headline: 'Contáctanos',
    subhead: 'Escríbenos directamente o usa el formulario a continuación.',
    directLabel: 'Contacto directo',
    directNote:
      'Para preguntas sobre acceso anticipado, privacidad de datos o soporte técnico, envíanos un correo:',
    formHeadline: 'Envíanos un mensaje',
    fields: {
      name: { label: 'Tu nombre', placeholder: 'Andrés García' },
      email: { label: 'Correo electrónico', placeholder: 'andres@tuempresa.com' },
      subject: {
        label: 'Asunto',
        placeholder: 'Selecciona un asunto',
        options: [
          'Solicitud de Acceso Anticipado',
          'Pregunta sobre privacidad de datos',
          'Consulta técnica',
          'Otro',
        ],
      },
      message: { label: 'Mensaje', placeholder: '¿En qué podemos ayudarte?' },
    },
    submit: 'Enviar mensaje',
    submitting: 'Enviando…',
    successTitle: '¡Mensaje enviado!',
    successBody: 'Gracias por contactarnos. Te responderemos pronto.',
    errorMsg: 'Algo salió mal. Por favor, envíanos un correo directamente.',
  },
}
