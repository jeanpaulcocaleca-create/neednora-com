import { NextRequest, NextResponse } from 'next/server'

type DemoMessage = { role: 'user' | 'assistant'; content: string }

function sanitizeMessages(input: unknown): DemoMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null
  const clean: DemoMessage[] = []
  for (const raw of input.slice(-12)) {
    if (!raw || typeof raw !== 'object') return null
    const role = (raw as { role?: unknown }).role
    const content = (raw as { content?: unknown }).content
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const trimmed = content.trim().slice(0, 1200)
    if (!trimmed) continue
    clean.push({ role, content: trimmed })
  }
  return clean.length ? clean : null
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const messages = sanitizeMessages(body?.messages)
  if (!messages) return NextResponse.json({ error: 'invalid request' }, { status: 400 })

  const lang = body?.lang === 'es' ? 'es' : 'en'
  const agentUrl = process.env.NORA_DEMO_AGENT_URL
  const agentToken = process.env.NORA_DEMO_AGENT_TOKEN

  // Security boundary: this route may call ONLY the isolated public demo agent.
  // The downstream demo agent must have no production tenant credentials or action tools.
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
        const message = typeof data?.message === 'string' ? data.message.trim().slice(0, 4000) : ''
        if (message) return NextResponse.json({ message, mode: 'isolated-demo-agent' })
      }
    } catch {
      // Fall through to the safe guided demo if the sandbox agent is unavailable.
    }
  }

  const message = lang === 'es'
    ? 'Entiendo. Si yo estuviera ayudando a operar un negocio como el que describe, empezaría por identificar qué tareas se repiten, qué evidencia debe quedar registrada y qué cosas hoy dependen de que alguien se acuerde. Puedo dar seguimiento a pendientes, pedir fotos o comprobantes, detectar reportes faltantes y preparar un resumen para el dueño. ¿Qué es lo que más tiempo o estrés le causa hoy en su negocio?'
    : 'I understand. If I were helping operate a business like the one you described, I’d start by identifying what repeats, what evidence should be recorded, and what currently depends on someone remembering. I can follow up on open items, request photos or proof, catch missing reports, and prepare an owner briefing. What causes you the most time or stress in the business today?'

  return NextResponse.json({ message, mode: 'guided-fallback' })
}
