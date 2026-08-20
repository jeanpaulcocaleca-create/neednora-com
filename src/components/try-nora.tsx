'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowUp, LockKeyhole, RotateCcw, Sparkles } from 'lucide-react'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'

type Msg = { role: 'user' | 'assistant'; content: string }

export function TryNora({ lang }: { lang: Locale }) {
  const es = lang === 'es'
  const starter = es
    ? 'Hola, soy NORA. Antes de hablar de precios, quiero entender su negocio. ¿Qué tipo de negocio maneja y qué es lo que más le cuesta mantener bajo control hoy?'
    : 'Hi, I’m NORA. Before we talk about pricing, I want to understand your business. What kind of business do you run, and what is hardest to keep under control today?'
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: starter }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, busy])

  async function send(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const r = await fetch('/api/nora-demo/chat', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lang, messages: next }),
      })
      const d = await r.json()
      setMessages([...next, { role: 'assistant', content: String(d.message || '') }])
    } catch {
      setMessages([...next, { role: 'assistant', content: es ? 'No pude responder en este momento. Inténtelo otra vez.' : 'I couldn’t respond just now. Please try again.' }])
    } finally { setBusy(false) }
  }

  function reset() { setMessages([{ role: 'assistant', content: starter }]); setInput('') }

  return (
    <section id="try-nora" className="section try-nora-section">
      <div className="try-nora-glow" aria-hidden="true" />
      <div className="container try-nora-layout">
        <div className="try-nora-copy">
          <div className="eyebrow">{es ? 'NO LEA SOBRE NORA. HABLE CON ELLA.' : 'DON’T READ ABOUT NORA. TALK TO HER.'}</div>
          <h2>{es ? 'Cuéntele cómo funciona su negocio.' : 'Tell her how your business works.'}</h2>
          <p>{es ? 'NORA hará unas preguntas, entenderá dónde se está perdiendo tiempo o información y le mostrará qué podría empezar a manejar por usted. Después, si tiene sentido, le muestra las opciones de precio.' : 'NORA will ask a few questions, understand where time or information is slipping away, and show you what she could start managing for you. Then, if it makes sense, she can show you pricing options.'}</p>
          <div className="demo-boundaries">
            <div><LockKeyhole size={17} /><span><b>{es ? 'Demo aislada' : 'Isolated demo'}</b>{es ? 'No puede ver datos de clientes reales.' : 'Cannot see real customer data.'}</span></div>
            <div><Sparkles size={17} /><span><b>{es ? 'Conversación real' : 'Real conversation'}</b>{es ? 'Escriba libremente, no es un cuestionario.' : 'Type naturally — this is not a questionnaire.'}</span></div>
          </div>
        </div>

        <div className="demo-window">
          <div className="demo-window-top">
            <div className="demo-nora-identity"><Image src="/brand/nora-icon.png" alt="" width={34} height={34} /><div><b>NORA</b><span>{es ? 'Demo de negocio' : 'Business demo'}</span></div></div>
            <div className="demo-window-actions"><span><i /> {es ? 'EN LÍNEA' : 'ONLINE'}</span><button onClick={reset} aria-label="Reset conversation"><RotateCcw size={15} /></button></div>
          </div>
          <div className="demo-messages" ref={scrollRef}>
            <div className="demo-day-label">{es ? 'HOY' : 'TODAY'}</div>
            {messages.map((m, i) => (
              <div key={i} className={`demo-message ${m.role}`}>
                {m.role === 'assistant' && <span className="demo-message-name">NORA</span>}
                <div>{m.content}</div>
              </div>
            ))}
            {busy && <div className="demo-typing"><span /><span /><span /></div>}
          </div>
          <form onSubmit={send} className="demo-input-row">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={es ? 'Ej: Tengo 3 restaurantes y 42 empleados…' : 'Example: I have 3 restaurants and 42 employees…'} maxLength={800} aria-label="Message NORA" />
            <button aria-label="Send" disabled={busy || !input.trim()}><ArrowUp size={19} /></button>
          </form>
          <div className="demo-window-foot">{es ? 'NORA no ejecuta acciones reales desde esta demo.' : 'NORA cannot execute real operational actions from this demo.'}</div>
        </div>
      </div>
    </section>
  )
}
