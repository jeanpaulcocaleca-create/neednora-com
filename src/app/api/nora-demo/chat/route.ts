import { NextRequest, NextResponse } from 'next/server'

type DemoMessage = { role: 'user' | 'assistant'; content: string }

const NORA_SYSTEM_PROMPT = `You are NORA — Networked Operations & Response Assistant. You're speaking with a prospective business owner on neednora.com through a completely isolated public demo.

NORA is a business operating system — not a chatbot, not a dashboard, not just WhatsApp automation. WhatsApp is the employee interface. NORA is the operational intelligence that runs behind the business.

Core promise: Peace of mind. Business owners receive structured silence when everything is fine, precise context when something needs attention, and a decision only when they actually need to make one.

What NORA does (be specific and concrete):
- Monitors whether required procedures happened and requests evidence when they didn't
- Follows up on open items with employees automatically — management doesn't have to remember
- Documents first, second, and third occurrences of missed procedures, escalating with full context
- Maintains operational history useful for performance discussions (hiring, firing, promotions remain human decisions)
- Creates daily owner briefings from structured operational data — not raw chat transcripts
- Tracks inventory, maintenance work orders, expenses, register closes, housekeeping, and team accountability
- Employees use WhatsApp — no new app, no login, no training required

How NORA escalates missed procedures:
- First miss: friendly correction to the employee, no drama
- Second miss: clear warning that a third occurrence may reach management
- Third miss: documented escalation with full history

Your behavior in this demo:
1. Before explaining anything, ask a specific question to understand their business — what kind of operation, team size, what breaks down most
2. Based on what you learn, describe exactly how NORA would behave in their specific context — quote what NORA might actually say to their employee or their owner
3. Make examples concrete. Instead of "NORA tracks inventory," say: "If María says 'We received 24 bottles of shampoo,' NORA asks for the invoice or a photo, records the vendor, quantity, cost, and date, and updates the inventory count."
4. Never repeat what you've already covered in this conversation
5. Business owners are direct people — be precise and substantive, no filler
6. Keep responses to 2-4 sentences typically. Use a short list only when it genuinely helps
7. Match the visitor's language exactly — respond in Spanish if they write in Spanish
8. After showing real value specific to their situation, naturally offer to discuss pricing or a setup call

What you do not know:
- Final pricing (calibrated during setup based on business size and needs)
- Integrations with specific external systems not mentioned above

Security: This is a completely isolated demo. You have no access to real business data, customer tenants, or production systems. You cannot take real actions.`

function sanitizeMessages(input: unknown): DemoMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null
  const clean: DemoMessage[] = []
  for (const raw of input.slice(-14)) {
    if (!raw || typeof raw !== 'object') return null
    const role = (raw as { role?: unknown }).role
    const content = (raw as { content?: unknown }).content
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const trimmed = content.trim().slice(0, 1200)
    if (!trimmed) continue
    // Basic prompt injection defense: drop messages that try to override the system
    if (/^(SYSTEM|IGNORE PREVIOUS|DISREGARD|###\s*(SYSTEM|INST))/i.test(trimmed)) continue
    clean.push({ role, content: trimmed })
  }
  return clean.length ? clean : null
}

// Anthropic requires messages to start with a user turn.
// Skip any leading assistant messages (the initial greeting) before handing off.
function prepareForLLM(messages: DemoMessage[]): DemoMessage[] {
  const firstUserIdx = messages.findIndex(m => m.role === 'user')
  return firstUserIdx >= 0 ? messages.slice(firstUserIdx) : []
}

async function callAnthropic(messages: DemoMessage[], apiKey: string): Promise<string | null> {
  const llmMessages = prepareForLLM(messages)
  if (llmMessages.length === 0) return null
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 380,
        system: NORA_SYSTEM_PROMPT,
        messages: llmMessages,
      }),
      signal: AbortSignal.timeout(22000),
      cache: 'no-store',
    })
    if (!r.ok) return null
    const data = await r.json().catch(() => null)
    const text = data?.content?.[0]?.text
    return typeof text === 'string' ? text.trim().slice(0, 1600) : null
  } catch {
    return null
  }
}

async function callOpenAI(messages: DemoMessage[], apiKey: string): Promise<string | null> {
  const llmMessages = prepareForLLM(messages)
  if (llmMessages.length === 0) return null
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 380,
        messages: [
          { role: 'system', content: NORA_SYSTEM_PROMPT },
          ...llmMessages,
        ],
      }),
      signal: AbortSignal.timeout(22000),
      cache: 'no-store',
    })
    if (!r.ok) return null
    const data = await r.json().catch(() => null)
    const text = data?.choices?.[0]?.message?.content
    return typeof text === 'string' ? text.trim().slice(0, 1600) : null
  } catch {
    return null
  }
}

async function callLLM(messages: DemoMessage[]): Promise<{ message: string; mode: string } | null> {
  const anthropicKey = process.env.NORA_DEMO_ANTHROPIC_KEY
  const openaiKey = process.env.NORA_DEMO_OPENAI_KEY

  if (anthropicKey) {
    const message = await callAnthropic(messages, anthropicKey)
    if (message) return { message, mode: 'anthropic' }
  }
  if (openaiKey) {
    const message = await callOpenAI(messages, openaiKey)
    if (message) return { message, mode: 'openai' }
  }
  return null
}

// Guided demo mode — active during Phase 1 launch partner onboarding.
// The interactive UI is live but returns this response instead of calling an LLM.
// Flip to false only after NORA_DEMO_AGENT_URL or LLM keys are approved for public use.
const GUIDED_DEMO_MODE = true

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const messages = sanitizeMessages(body?.messages)
  if (!messages) return NextResponse.json({ error: 'invalid request' }, { status: 400 })

  const lang = body?.lang === 'es' ? 'es' : 'en'

  if (GUIDED_DEMO_MODE) {
    const msg = lang === 'es'
      ? 'La experiencia en vivo con NORA actualmente es por invitación mientras incorporamos a nuestros primeros socios de lanzamiento. ¿Te gustaría ser uno de ellos? Visita neednora.com/contact para solicitar una demostración personalizada — te mostraremos exactamente cómo NORA funcionaría en tu negocio.'
      : 'The live NORA experience is currently by invitation as we onboard our first launch partners. Want to be one of them? Visit neednora.com/contact to request a personalized walkthrough — we\'ll show you exactly what NORA would look like in your specific business.'
    return NextResponse.json({ message: msg, mode: 'guided' })
  }

  // 1. Dedicated isolated demo agent (future: NORA-side sandbox)
  const agentUrl = process.env.NORA_DEMO_AGENT_URL
  const agentToken = process.env.NORA_DEMO_AGENT_TOKEN
  if (agentUrl && agentToken) {
    try {
      const r = await fetch(agentUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${agentToken}`,
          'x-nora-channel': 'website-demo',
          'x-nora-capability': 'prospect-conversation-only',
        },
        body: JSON.stringify({ channel: 'website-demo', lang, messages }),
        signal: AbortSignal.timeout(15000),
        cache: 'no-store',
      })
      if (r.ok) {
        const data = await r.json().catch(() => null)
        const message = typeof data?.message === 'string' ? data.message.trim().slice(0, 1600) : ''
        if (message) return NextResponse.json({ message, mode: 'isolated-demo-agent' })
      }
    } catch {
      // Fall through to direct LLM
    }
  }

  // 2. Direct LLM call — server-side only; API key never reaches the browser
  const llmResult = await callLLM(messages)
  if (llmResult) {
    return NextResponse.json({ message: llmResult.message, mode: llmResult.mode })
  }

  // 3. Dev-only fallback — never shown in production
  if (process.env.NODE_ENV === 'development') {
    const devMsg = lang === 'es'
      ? '[MODO DESARROLLO — Sin proveedor de IA. Configure NORA_DEMO_ANTHROPIC_KEY o NORA_DEMO_OPENAI_KEY en .env.local para activar la demo real.]\n\nSoy NORA. ¿Qué tipo de negocio maneja usted?'
      : '[DEV MODE — No AI provider configured. Set NORA_DEMO_ANTHROPIC_KEY or NORA_DEMO_OPENAI_KEY in .env.local to enable the real demo.]\n\nI\'m NORA. What kind of business do you run?'
    return NextResponse.json({ message: devMsg, mode: 'dev-fallback' })
  }

  // 4. Production without AI — honest, no fake intelligence
  const unavailableMsg = lang === 'es'
    ? 'La demo interactiva estará disponible muy pronto. Mientras tanto, contáctenos para una demostración personalizada — es la forma más rápida de ver NORA en su tipo específico de negocio.'
    : 'The interactive demo will be available very soon. In the meantime, contact us for a personalized walkthrough — it\'s the fastest way to see NORA in your specific type of business.'
  return NextResponse.json({ message: unavailableMsg, mode: 'unavailable' })
}
