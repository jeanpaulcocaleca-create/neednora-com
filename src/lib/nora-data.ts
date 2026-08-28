export interface ScenarioMsg {
  who: 'in' | 'out' | 'sys'
  text: string
  tr?: string
  meta?: string
}

export interface Scenario {
  id: string
  msgs: ScenarioMsg[]
}

export const NORA_DATA = {
  stream: [
    { from: 'General manager', text: 'We need approval for two replacement units.' },
    { from: 'Customer', text: "Customer moved tomorrow's appointment to 10." },
    { from: 'Vendor', text: 'Material delivery is running late.' },
    { from: 'Accounting', text: 'Invoice #1842 is still unpaid.' },
    { from: 'Field team', text: 'Maria called out today.' },
    { from: 'Sales', text: 'Customer approved the change.' },
    { from: 'Maintenance', text: 'Need $425 for replacement parts.' },
    { from: 'Field team', text: 'Team finished the north section.' },
    { from: 'Vendor', text: 'Vendor can deliver Friday.' },
    { from: 'Customer', text: 'The client asked for updated photos.' },
    { from: 'Operations', text: 'Job 204 needs another technician.' },
    { from: 'Scheduling', text: 'Schedule changed for tomorrow.' },
  ],
  chips: [
    'Supervisor notified ✓',
    'Rescheduled ✓',
    'Vendor confirmed ✓',
    'Reminder sent ✓',
    'Recorded ✓',
    'Follow-up set ✓',
  ],
  quiet: [
    'Where is the invoice?',
    'What time do we start?',
    'Send me the schedule',
    'Did the parts arrive?',
    'Remind the team',
    'Confirm with the vendor',
  ],
  cross: [
    'A $425 purchase approval',
    'A safety incident',
    'A customer about to walk away',
  ],
  scenarios: [
    {
      id: 'crew',
      msgs: [
        { who: 'in', text: 'Buenos días. Voy 20 minutos tarde. Disculpas.', tr: "Good morning. I'm running 20 minutes late. Sorry.", meta: 'José · 6:42 AM' },
        { who: 'out', text: 'Gracias, José. Le aviso a su supervisor. Avíseme cuando llegue para enviarle su lista de trabajo.', tr: "Thanks, José. I'll tell your supervisor. Let me know when you arrive and I'll send your work list.", meta: 'NORA · 6:42 AM' },
        { who: 'sys', text: 'Supervisor informado ✓' },
        { who: 'sys', text: 'Llegada pendiente · NORA dará seguimiento' },
      ],
    },
    {
      id: 'hotel',
      msgs: [
        { who: 'in', text: 'Is early check-in possible tomorrow? We land at 9am.', meta: 'Guest · 8:15 PM' },
        { who: 'out', text: 'Good news: your room can be ready by 10am. I have noted your early arrival and told housekeeping.', meta: 'NORA · 8:15 PM' },
        { who: 'sys', text: 'Housekeeping notified ✓' },
        { who: 'sys', text: 'Reservation updated ✓' },
      ],
    },
    {
      id: 'rest',
      msgs: [
        { who: 'in', text: 'We are short on salmon for tomorrow, can deliver Thursday.', meta: 'Supplier · 3:20 PM' },
        { who: 'out', text: 'Understood. I will let the kitchen know and adjust Wednesday\'s order. Please confirm Thursday by 5pm.', meta: 'NORA · 3:21 PM' },
        { who: 'sys', text: 'Kitchen notified ✓' },
        { who: 'sys', text: 'Order adjusted ✓' },
        { who: 'sys', text: 'Supplier follow-up set ✓' },
      ],
    },
  ] as Scenario[],
}
