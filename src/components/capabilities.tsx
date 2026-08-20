'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { MessageSquare, GitMerge, BookOpen, BarChart2 } from 'lucide-react'

const CAPS = [
  {
    icon: MessageSquare,
    title: 'Conversation Intelligence',
    body: 'Every WhatsApp message is captured, classified, and turned into structured operational data. Nothing lives only in a chat thread.',
  },
  {
    icon: GitMerge,
    title: 'Intelligent Routing',
    body: 'NORA knows who handles what. Tasks reach the right person automatically — with automatic follow-up if they do not respond.',
  },
  {
    icon: BookOpen,
    title: 'Business Memory',
    body: 'Patterns, preferences, recurring issues — NORA builds the institutional knowledge your operation runs on, without anyone having to write it down.',
  },
  {
    icon: BarChart2,
    title: 'Owner Intelligence',
    body: 'Daily briefings, approval queues, expense summaries. You see only what needs your decision. Nothing else reaches you.',
  },
]

function CapCard({ cap, delay }: { cap: (typeof CAPS)[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const Icon = cap.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--rim)',
        borderRadius: 'var(--r-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--r)',
          background: 'var(--accent-10)',
          border: '1px solid var(--accent-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <Icon size={18} color="var(--accent)" strokeWidth={1.75} />
      </div>

      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '-0.015em',
            color: 'var(--fg)',
            marginBottom: '0.45rem',
          }}
        >
          {cap.title}
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--muted)',
            lineHeight: 1.65,
            margin: 0,
            maxWidth: '38ch',
          }}
        >
          {cap.body}
        </p>
      </div>
    </motion.div>
  )
}

export function Capabilities() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--rim)' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>
            What NORA Does
          </div>
          <h2 className="section-headline" style={{ marginBottom: '0.6rem' }}>
            One platform. Every operation.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: 0, maxWidth: '50ch' }}>
            NORA handles the operational infrastructure so your team can focus
            on the work that actually matters.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {CAPS.map((cap, i) => (
            <CapCard key={cap.title} cap={cap} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
