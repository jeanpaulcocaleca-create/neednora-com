export const en = {
  locale: 'en' as const,

  meta: {
    titleTemplate: '%s — NORA by Project NEED',
    defaultTitle: 'NORA — AI Business Operating System',
    description:
      'NORA turns WhatsApp conversations into organized business operations. Connect your WhatsApp Business account and let NORA handle the rest.',
  },

  nav: {
    howItWorks: 'How it works',
    forBusiness: 'For Business',
    contact: 'Contact',
    earlyAccess: 'Get Early Access',
  },

  hero: {
    eyebrow: 'AI Business Operating System',
    headline: 'Conversations run your operation.',
    subhead:
      'NORA turns WhatsApp conversations into structured operations — routed, tracked, and visible — without changing how your team works.',
    ctaPrimary: 'Get Early Access',
    ctaSecondary: 'See how it works ↓',
    canvas: {
      title: 'NORA',
      subtitle: 'Operations Monitor',
      live: 'Live',
      threads: [
        {
          id: 'WO-0142',
          category: 'Maintenance',
          title: 'Leaking sink — Rivera property',
          detail: 'Assigned to Marcos · Main bathroom',
          statusLabel: 'Open',
          statusColor: '#F59E0B',
          accentColor: '#F59E0B',
          accentBg: 'rgba(245,158,11,0.08)',
        },
        {
          id: 'EXP-091',
          category: 'Finance',
          title: 'Expense pending — $85 faucet part',
          detail: 'Submitted by Marcos · WO-0142',
          statusLabel: 'Pending',
          statusColor: '#3B82F6',
          accentColor: '#3B82F6',
          accentBg: 'rgba(59,130,246,0.06)',
        },
        {
          id: 'BRIEF',
          category: 'Owner Report',
          title: 'Morning briefing ready — 07:00 AM',
          detail: '2 items require your attention',
          statusLabel: 'Ready',
          statusColor: '#10B981',
          accentColor: '#10B981',
          accentBg: 'rgba(16,185,129,0.06)',
        },
      ],
      footer: '9 operations monitored',
      updated: 'Updated just now',
    },
  },

  productStory: {
    eyebrow: 'See NORA in Action',
    headline: 'One conversation. Every operation that follows.',
    subhead:
      'A field tech sends a WhatsApp message. NORA understands it, creates the work order, captures the expense request, and surfaces everything the owner needs to know.',
    waRole: 'Field Technician',
    waMessages: [
      {
        text: "Just got to the Rivera property. There's a leaking sink in the main bathroom — water pooling under the cabinet. Going to need to deal with this today.",
        sent: false,
        time: '7:15 AM',
      },
      {
        text: 'Got it. Work order WO-0142 opened — Rivera, main bathroom, high priority. Team notified.',
        sent: true,
        time: '7:15 AM',
        sender: 'NORA',
      },
      {
        text: "Supply line is fixed but the faucet cartridge is shot. I'll need a replacement — about $85. Can I go ahead?",
        sent: false,
        time: '7:38 AM',
      },
    ],
    nora: {
      headerLabel: 'NORA Analysis',
      headerMeta: '1 intent · 0 ambiguities',
      rows: [
        { key: 'From', value: 'Marcos · Field Team' },
        { key: 'Account', value: 'Rivera property' },
        { key: 'Location', value: 'Main bathroom — under sink' },
        { key: 'Intent', value: 'Maintenance + expense request' },
        { key: 'Priority', value: 'High — same-day' },
      ],
      subCards: [
        {
          label: 'Work Order',
          id: 'WO-0142',
          statusLabel: 'Open',
          statusColor: '#D97706',
          borderColor: '#F59E0B',
          items: ['Assigned: Marcos (on-site)', 'Team notified 7:16 AM'],
        },
        {
          label: 'Expense Gate',
          id: 'EXP-091',
          statusLabel: 'Pending',
          statusColor: '#2563EB',
          borderColor: '#3B82F6',
          items: ['$85 · faucet cartridge', 'Owner approval required'],
        },
      ],
      briefingNote: 'Added to owner briefing — expense + WO summary',
    },
    briefing: {
      title: 'Morning Briefing',
      time: 'Tuesday · 07:00 AM',
      ownerNote: 'Owner receives one structured briefing — not a message thread.',
      cols: [
        {
          label: 'Operations',
          borderColor: '#059669',
          items: [
            { text: '6 jobs completed yesterday', ok: true },
            { text: '3 work orders open · 1 high priority', warn: true },
          ],
        },
        {
          label: 'Requires Attention',
          borderColor: '#D97706',
          items: [
            { text: 'Expense $85 · WO-0142 → Approve or Decline', warn: true },
            { text: 'WO-0138 overdue · Fuentes AC unit · 2 days', danger: true },
            { text: 'Rivera inquiry unanswered', warn: true },
          ],
        },
        {
          label: 'Revenue',
          borderColor: '#2563EB',
          items: [
            { text: '$4,200 invoiced this week' },
            { text: '$340 outstanding · Rivera balance' },
          ],
        },
      ],
    },
  },

  signal: {
    eyebrow: 'The idea behind NORA',
    headline: 'Your business already runs',
    headlineAccent: 'through conversations.',
    body: 'The information is already there — in WhatsApp threads between employees, managers, and customers. NORA reads those conversations and turns them into structured operations, records, and decisions. No new tools. No behavior change. No data entry.',
    pillars: [
      {
        title: 'Reads every conversation',
        body: 'NORA understands intent from the way your team already communicates. No commands, no forms required — just natural WhatsApp messages.',
      },
      {
        title: 'Creates structured operations',
        body: 'Work orders, expense requests, follow-ups, escalations — extracted from text and tracked to resolution without anyone filling out a form.',
      },
      {
        title: 'Surfaces what matters',
        body: "Owners receive one daily briefing. No notification overload, no chat threads to manage — just the operational picture that actually needs their attention.",
      },
    ],
  },

  domainExplorer: {
    eyebrow: 'What NORA Handles',
    headline: 'One platform. Every operation.',
    subhead:
      'Select any operational area to see how NORA handles it — from the WhatsApp message to the structured output.',
    domains: [
      {
        id: 'maintenance',
        label: 'Maintenance & Work Orders',
        description:
          "A message about a broken door, leaking pipe, or failing equipment becomes a tracked work order — assigned, followed up, and closed.",
        message: {
          sender: 'Carlos · Technician',
          initials: 'CT',
          text: "The garage door at Pine Street won't close. It keeps reversing before it shuts. Can't secure the property tonight.",
          time: '3:47 PM',
        },
        rows: [
          { key: 'Account', value: 'Pine Street property' },
          { key: 'Issue', value: "Garage door malfunction — won't close" },
          { key: 'Priority', value: 'High — security issue', isWarn: true },
          { key: 'Action', value: 'WO-0201 created · Carlos assigned', isOk: true },
        ],
      },
      {
        id: 'expenses',
        label: 'Expense Management',
        description:
          'Purchase requests and expense submissions flow through WhatsApp. NORA captures them, links them to work orders, and queues them for approval.',
        message: {
          sender: 'Carmen · Operations',
          initials: 'CO',
          text: "Need to restock cleaning supplies — mop heads, detergent, gloves. Probably around $120 from the hardware store on the corner.",
          time: '9:14 AM',
        },
        rows: [
          { key: 'Type', value: 'Supply purchase request' },
          { key: 'Amount', value: '~$120' },
          { key: 'Submitted by', value: 'Carmen · Operations' },
          { key: 'Action', value: 'Approval requested · owner notified', isBlue: true },
        ],
      },
      {
        id: 'coordination',
        label: 'Team Coordination',
        description:
          'Schedule changes, coverage requests, and handoffs are captured automatically. NORA notifies the right people and logs every change.',
        message: {
          sender: 'David · Field Team',
          initials: 'DM',
          text: "I have to leave early today — 3pm instead of 5pm. Family situation. Is there someone who can cover the last two hours at Fuentes?",
          time: '11:32 AM',
        },
        rows: [
          { key: 'Type', value: 'Shift adjustment request' },
          { key: 'Employee', value: 'David · Field Team' },
          { key: 'Location', value: 'Fuentes property · 3–5 PM' },
          { key: 'Action', value: 'Coverage request sent to team', isBlue: true },
        ],
      },
      {
        id: 'customers',
        label: 'Customer Communication',
        description:
          "Customer messages routed through your team are tracked and followed up. NORA flags unanswered inquiries before they become problems.",
        message: {
          sender: 'Rivera Account',
          initials: 'RA',
          text: "Hi, we submitted a question on Monday about the service schedule and haven't heard back yet. We're trying to plan the week.",
          time: '10:05 AM',
        },
        rows: [
          { key: 'Customer', value: 'Rivera account' },
          { key: 'Type', value: 'Follow-up required' },
          { key: 'Status', value: 'No response — 2 days open', isWarn: true },
          { key: 'Action', value: 'Escalated to account manager', isWarn: true },
        ],
      },
      {
        id: 'reporting',
        label: 'Owner Reporting',
        description:
          'Every day, the owner receives one structured briefing. What was completed, what needs approval, what is at risk. Nothing else.',
        message: {
          sender: 'NORA · Daily Briefing',
          initials: 'NR',
          text: "Good morning. Tuesday operations summary: 7 jobs closed, 2 open work orders (1 high priority), 1 expense pending approval, 1 overdue task.",
          time: '07:00 AM',
          isNora: true,
        },
        rows: [
          { key: 'Completed', value: '7 jobs closed yesterday', isOk: true },
          { key: 'Open WOs', value: '2 total · 1 high priority', isWarn: true },
          { key: 'Expense', value: '$85 awaiting your approval' },
          { key: 'Overdue', value: '1 task · 2 days late', isWarn: true },
        ],
      },
    ],
  },

  trust: {
    eyebrow: 'Data & Privacy',
    headline: 'Your data stays yours.',
    subhead:
      'NORA is built for businesses that take operational data seriously. Here is what that means in practice.',
    points: [
      {
        title: 'You authorize. You control.',
        body: "NORA connects to your WhatsApp Business account only after you explicitly authorize it through Meta's secure process. You decide what NORA can access, and you can disconnect at any time.",
      },
      {
        title: 'Complete data isolation.',
        body: 'Your business data is never shared with, visible to, or accessible from any other business on the platform. Complete isolation at every layer — database, AI context, and business memory.',
      },
      {
        title: 'Full audit trail.',
        body: 'Every operation, decision, and communication is permanently recorded. Nothing is deleted. Your complete operational history is always accessible.',
      },
    ],
    legalLabel: 'Legal documents:',
    legalLinks: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' },
      { href: '/data-deletion', label: 'Data Deletion' },
    ],
  },

  earlyAccess: {
    eyebrow: 'Early Access',
    headline: 'Get NORA for your business.',
    subhead:
      "We're onboarding a limited number of businesses in our pilot phase. We'll be in touch within 48 hours.",
    fields: {
      name: { label: 'Your name', placeholder: 'Andrés García' },
      business: { label: 'Business name', placeholder: 'Basecamp Monteverde' },
      whatsapp: { label: 'WhatsApp number', placeholder: '+506 8888 0000' },
      industry: {
        label: 'Industry',
        placeholder: 'Select your industry',
        options: [
          'Hospitality & Lodges',
          'Property Management',
          'Field Services',
          'Restaurants & Food Service',
          'Construction',
          'Other',
        ],
      },
      message: {
        label: 'Tell us about your operation',
        optional: '(optional)',
        placeholder:
          "How many people work in your business? What's the main challenge you'd like NORA to help with?",
      },
    },
    submit: 'Request Early Access',
    submitting: 'Sending…',
    errorMsg: 'Something went wrong. Please email us directly at jeanpaulcocaleca@gmail.com',
    successTitle: 'Request received.',
    successBody:
      "Thank you. We'll review your details and be in touch within 48 hours to discuss how NORA can work for your business.",
    nextStepsTitle: 'What happens next',
    nextSteps: [
      {
        step: '01',
        title: 'We review your request',
        body: "Within 48 hours, we'll review what you've shared and reach out directly.",
      },
      {
        step: '02',
        title: 'A short conversation',
        body: "We'll learn about your operation to make sure NORA is the right fit — and configure it for your industry.",
      },
      {
        step: '03',
        title: 'You go live',
        body: 'Connect your WhatsApp Business account. Your team keeps working as usual. NORA starts listening.',
      },
    ],
  },

  footer: {
    tagline: 'AI Business Operating System by Project NEED',
    links: [
      { href: '/#product-story', label: 'How it works' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' },
      { href: '/data-deletion', label: 'Data Deletion' },
      { href: '/contact', label: 'Contact' },
    ],
    copyright: '© 2026 Project NEED. All rights reserved.',
  },

  contact: {
    title: 'Contact',
    metaTitle: 'Contact',
    headline: 'Contact us',
    subhead: 'Write to us directly or use the form below.',
    directLabel: 'Direct contact',
    directNote:
      'For questions about early access, data privacy, or technical support, email us:',
    formHeadline: 'Send us a message',
    fields: {
      name: { label: 'Your name', placeholder: 'Andrés García' },
      email: { label: 'Email address', placeholder: 'andres@yourbusiness.com' },
      subject: {
        label: 'Subject',
        placeholder: 'Select a subject',
        options: [
          'Early Access Request',
          'Data privacy question',
          'Technical inquiry',
          'Other',
        ],
      },
      message: { label: 'Message', placeholder: 'How can we help?' },
    },
    submit: 'Send message',
    submitting: 'Sending…',
    successTitle: 'Message sent!',
    successBody: "Thank you for reaching out. We'll get back to you soon.",
    errorMsg: 'Something went wrong. Please email us directly.',
  },
}
