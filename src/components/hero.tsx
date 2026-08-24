'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/i18n'

const WHATSAPP_URL = process.env.NEXT_PUBLIC_NORA_WHATSAPP_URL ?? ''

function useActiveIndustry(): string {
  const [industry, setIndustry] = useState('hospitality')
  useEffect(() => {
    setIndustry(document.documentElement.dataset.industry ?? 'hospitality')
    const obs = new MutationObserver(() =>
      setIndustry(document.documentElement.dataset.industry ?? 'hospitality')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-industry'] })
    return () => obs.disconnect()
  }, [])
  return industry
}

function setIndustry(id: string) {
  document.documentElement.dataset.industry = id
}

/* Portrait sizes create visual hierarchy: key people are faces, not dots */
const ROLE_RADIUS = { primary: 32, secondary: 22, tertiary: 15 } as const
type NodeSize = keyof typeof ROLE_RADIUS

type RoleNode = {
  x: number; y: number; label: string
  size: NodeSize
  img?: string; letter?: string
}
type HubConfig = { hub: { x: number; y: number }; roles: RoleNode[] }

/*
  NORA sits at (380, 250) — right-side of the 560×520 viewBox.
  This places it inside the phone frame's horizontal span when the SVG
  renders at column width. Industry role nodes occupy the left zone (x < 300).
  Reading direction: people → NORA → WhatsApp conversation.

  Industries are arranged in distinct spatial zones:
  - Hospitality: upper arc fan (airy, resort feel)
  - Painting: vertical left spine (structured, field operations)
  - Restaurant: lower-left cluster (tight, kitchen intensity)
*/
const INDUSTRY_CONFIG: Record<string, HubConfig> = {
  hospitality: {
    hub: { x: 248, y: 118 },
    roles: [
      { x: 65,  y: 48,  label: 'Housekeeping', size: 'primary',   img: '/assets/portraits/hospitality/h-01-miguel.webp' },
      { x: 178, y: 22,  label: 'Maintenance',  size: 'secondary', img: '/assets/portraits/hospitality/h-03-carlos.webp' },
      { x: 308, y: 22,  label: 'Front Desk',   size: 'secondary', img: '/assets/portraits/hospitality/h-02-frontdesk.webp' },
      { x: 128, y: 178, label: 'Grounds',      size: 'tertiary',  img: '/assets/portraits/hospitality/h-04-groundskeeper.webp' },
      { x: 390, y: 82,  label: 'Manager',      size: 'tertiary',  img: '/assets/portraits/hospitality/h-05-manager.webp' },
    ],
  },
  painting: {
    hub: { x: 188, y: 268 },
    roles: [
      { x: 40,  y: 128, label: 'Crew Leader', size: 'primary',   img: '/assets/portraits/painting/p-01-jake.webp' },
      { x: 40,  y: 282, label: 'Project Mgr', size: 'secondary', img: '/assets/portraits/painting/p-04-pm.webp' },
      { x: 40,  y: 418, label: 'Estimator',   size: 'secondary', img: '/assets/portraits/painting/p-03-estimator.webp' },
      { x: 122, y: 450, label: 'Supervisor',  size: 'tertiary',  letter: 'S' },
      { x: 228, y: 458, label: 'Inspector',   size: 'tertiary',  letter: 'I' },
    ],
  },
  restaurant: {
    hub: { x: 158, y: 388 },
    roles: [
      { x: 36,  y: 268, label: 'Chef',         size: 'primary',   img: '/assets/portraits/restaurant/r-01-marcus.webp' },
      { x: 36,  y: 392, label: 'Floor Mgr',    size: 'secondary', img: '/assets/portraits/restaurant/r-04-sofia.webp' },
      { x: 36,  y: 492, label: 'Kitchen Lead', size: 'secondary', img: '/assets/portraits/restaurant/r-03-luis.webp' },
      { x: 158, y: 498, label: 'Host',         size: 'tertiary',  letter: 'H' },
      { x: 262, y: 485, label: 'Prep Cook',    size: 'tertiary',  letter: 'P' },
    ],
  },
  property:     { hub: { x: 272, y: 448 }, roles: [] },
  construction: { hub: { x: 92,  y: 202 }, roles: [] },
}

const ALL_INDUSTRIES = ['hospitality', 'painting', 'restaurant', 'property', 'construction'] as const

/* NORA center coordinates in SVG space */
const NORA_X = 380
const NORA_Y = 250

/* Quadratic Bézier with variable curvature — organic connection curves */
function qBez(x1: number, y1: number, x2: number, y2: number, curve = 20): string {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const cpx = mx + (-dy / len) * curve
  const cpy = my + (dx / len) * curve
  return `M ${x1} ${y1} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${x2} ${y2}`
}

type Message = { from: 'nora' | 'user'; name?: string; text: string; time: string; ticks?: boolean }

const CONVERSATIONS: Record<string, Message[]> = {
  hospitality: [
    { from: 'nora', text: 'Good morning Miguel. Priority today: units 7, 9, and 12 (checkouts), then 3 and 5. Guest in unit 7 checks out at 11 AM. Start there.', time: '7:14' },
    { from: 'user', name: 'Miguel', text: 'Got it.', time: '7:15', ticks: true },
    { from: 'user', name: 'Miguel', text: 'Unit 7 ready for inspection.', time: '8:32', ticks: true },
    { from: 'nora', text: 'Logged. Inspection request sent to front desk. Can you move to unit 9 now?', time: '8:33' },
  ],
  painting: [
    { from: 'user', name: 'Jake', text: "We're on site at the Johnson job.", time: '7:48', ticks: true },
    { from: 'nora', text: "Got it. Crew on-site at 7:48 AM. Exterior prep, north and west faces. Color: SW 7036. Any supply issues?", time: '7:48' },
    { from: 'user', name: 'Jake', text: 'Running low on caulk.', time: '7:51', ticks: true },
    { from: 'nora', text: "Added to supply list. I'll check if Marco can bring it on the afternoon run. Will confirm by 1 PM.", time: '7:51' },
  ],
  restaurant: [
    { from: 'user', name: 'Chef Marcus', text: "Tonight's specials: pan-seared halibut, mushroom risotto. 86 if we run out.", time: '17:02', ticks: true },
    { from: 'nora', text: "Got it. Both added to tonight's menu. Servers flagged to check before selling. I'll alert you when either runs low.", time: '17:02' },
    { from: 'user', name: 'Chef Marcus', text: 'Halibut is down to 3 portions.', time: '19:47', ticks: true },
    { from: 'nora', text: 'Alert sent to floor: 3 portions left. Should I 86 it now?', time: '19:47' },
  ],
}

const CONVERSATIONS_ES: Record<string, Message[]> = {
  hospitality: [
    { from: 'nora', text: 'Buenos días Miguel. Prioridad hoy: unidades 7, 9 y 12 (salidas), luego 3 y 5. El huésped de la unidad 7 sale a las 11 AM. Empieza por ahí.', time: '7:14' },
    { from: 'user', name: 'Miguel', text: 'Entendido.', time: '7:15', ticks: true },
    { from: 'user', name: 'Miguel', text: 'Unidad 7 lista para inspección.', time: '8:32', ticks: true },
    { from: 'nora', text: 'Registrado. Solicitud de inspección enviada a recepción. ¿Puedes pasar a la unidad 9 ahora?', time: '8:33' },
  ],
  painting: [
    { from: 'user', name: 'Jake', text: 'Estamos en el trabajo de los Johnson.', time: '7:48', ticks: true },
    { from: 'nora', text: 'Recibido. Equipo en sitio a las 7:48 AM. Preparación exterior, fachadas norte y oeste. Color: SW 7036. ¿Algún problema con los materiales?', time: '7:48' },
    { from: 'user', name: 'Jake', text: 'Nos queda poco sellador.', time: '7:51', ticks: true },
    { from: 'nora', text: 'Agregado a la lista de materiales. Verifico si Marco puede traerlo en el recorrido de la tarde. Confirmo antes de la 1 PM.', time: '7:51' },
  ],
  restaurant: [
    { from: 'user', name: 'Chef Marcus', text: 'Especiales de esta noche: halibut al sartén, risotto de champiñones. Los retiran si se acaban.', time: '17:02', ticks: true },
    { from: 'nora', text: 'Anotado. Ambos agregados al menú de esta noche. Meseros notificados para revisar antes de ofrecer. Te aviso si queda poco de alguno.', time: '17:02' },
    { from: 'user', name: 'Chef Marcus', text: 'Quedan solo 3 porciones de halibut.', time: '19:47', ticks: true },
    { from: 'nora', text: 'Alerta enviada al salón: 3 porciones. ¿Lo retiro del menú ahora?', time: '19:47' },
  ],
}

const INDUSTRY_LABELS: Record<string, { en: string; es: string }> = {
  hospitality:  { en: 'Hospitality',  es: 'Hotelería' },
  painting:     { en: 'Painting',     es: 'Pintura' },
  restaurant:   { en: 'Restaurant',   es: 'Restaurante' },
  property:     { en: 'Property',     es: 'Inmobiliaria' },
  construction: { en: 'Construction', es: 'Construcción' },
}

function NetworkViz({ active }: { active: string }) {
  const activeConfig = INDUSTRY_CONFIG[active] ?? INDUSTRY_CONFIG.hospitality

  return (
    <svg
      viewBox="0 0 560 520"
      className="hero-network-svg"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Portrait clipPaths sized by hierarchy — pre-defined for all industries */}
        {ALL_INDUSTRIES.map(ind =>
          INDUSTRY_CONFIG[ind].roles.map((role, i) => {
            const r = ROLE_RADIUS[role.size]
            return (
              <clipPath key={`${ind}-${i}`} id={`nora-clip-${ind}-${i}`}>
                <circle cx={role.x} cy={role.y} r={r} />
              </clipPath>
            )
          })
        )}
      </defs>

      {/* Inactive industry spokes — faint web in background */}
      {ALL_INDUSTRIES.filter(ind => ind !== active).map(ind => {
        const hub = INDUSTRY_CONFIG[ind].hub
        return (
          <line
            key={ind}
            x1={NORA_X} y1={NORA_Y}
            x2={hub.x} y2={hub.y}
            stroke="var(--neutral-3)"
            strokeWidth="1"
            strokeOpacity="0.28"
          />
        )
      })}

      {/* Active industry: NORA → hub connector */}
      <line
        x1={NORA_X} y1={NORA_Y}
        x2={activeConfig.hub.x} y2={activeConfig.hub.y}
        stroke="var(--ind-primary)"
        strokeWidth="1.5"
        strokeOpacity="0.28"
        style={{ transition: 'stroke 350ms ease' }}
      />

      {/* Active industry: hub → role connection curves */}
      <AnimatePresence mode="wait">
        <motion.g
          key={active}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {activeConfig.roles.map((role, i) => {
            const curvature = role.size === 'primary' ? 28 : role.size === 'secondary' ? 18 : 12
            return (
              <path
                key={i}
                d={qBez(activeConfig.hub.x, activeConfig.hub.y, role.x, role.y, curvature)}
                stroke="var(--neutral-4)"
                strokeWidth={role.size === 'primary' ? 1.5 : 1.2}
                fill="none"
                strokeOpacity={role.size === 'primary' ? 0.85 : 0.5}
              />
            )
          })}
        </motion.g>
      </AnimatePresence>

      {/* NORA heartbeat glow */}
      <circle
        cx={NORA_X} cy={NORA_Y} r="44"
        fill="var(--ind-primary)"
        className="nora-glow-ring"
        style={{ transition: 'fill 350ms ease' }}
      />

      {/* NORA center node */}
      <circle cx={NORA_X} cy={NORA_Y} r="30" fill="var(--neutral-10)" />
      <circle cx={NORA_X} cy={NORA_Y} r="26" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
      <text
        x={NORA_X} y={NORA_Y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="10.5" fontWeight="700" fill="white" letterSpacing="0.07em"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        NORA
      </text>

      {/* Hub nodes — active is larger and accent-colored */}
      {ALL_INDUSTRIES.map(ind => {
        const hub = INDUSTRY_CONFIG[ind].hub
        const isActive = ind === active
        return (
          <g key={ind}>
            <circle
              cx={hub.x} cy={hub.y} r={isActive ? 14 : 10}
              fill={isActive ? 'var(--ind-primary)' : 'var(--neutral-4)'}
              opacity={isActive ? 1 : 0.32}
              style={{ transition: 'fill 350ms ease, opacity 350ms ease' }}
            />
            {isActive && (
              <circle
                cx={hub.x} cy={hub.y} r="20"
                fill="none"
                stroke="var(--ind-primary)"
                strokeWidth="1"
                strokeOpacity="0.20"
                style={{ transition: 'stroke 350ms ease' }}
              />
            )}
          </g>
        )
      })}

      {/* Role nodes for active industry — portrait sizes follow hierarchy */}
      <AnimatePresence mode="wait">
        <motion.g
          key={active}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {activeConfig.roles.map((role, i) => {
            const r = ROLE_RADIUS[role.size]
            const labelOffset = r + 13
            const labelSize = role.size === 'primary' ? 9.5 : role.size === 'secondary' ? 8.5 : 7.5
            const labelWeight = role.size === 'primary' ? '600' : '400'
            const labelColor = role.size === 'primary' ? 'var(--neutral-8)' : 'var(--neutral-6)'
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {role.img ? (
                  <>
                    <circle cx={role.x} cy={role.y} r={r} fill="var(--neutral-2)" />
                    <image
                      href={role.img}
                      x={role.x - r} y={role.y - r}
                      width={r * 2} height={r * 2}
                      clipPath={`url(#nora-clip-${active}-${i})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </>
                ) : (
                  <>
                    <circle cx={role.x} cy={role.y} r={r} fill="var(--ind-surface)" style={{ transition: 'fill 350ms ease' }} />
                    <text
                      x={role.x} y={role.y}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={role.size === 'secondary' ? 11 : 9}
                      fontWeight="700"
                      fill="var(--ind-primary)"
                      style={{ fontFamily: 'var(--font-body)', transition: 'fill 350ms ease' }}
                    >
                      {role.letter}
                    </text>
                  </>
                )}

                {/* White border ring */}
                <circle
                  cx={role.x} cy={role.y} r={r}
                  fill="none"
                  stroke="var(--neutral-0)"
                  strokeWidth={role.size === 'primary' ? 3 : 2}
                />

                {/* Accent halo on primary character only */}
                {role.size === 'primary' && (
                  <circle
                    cx={role.x} cy={role.y} r={r + 5}
                    fill="none"
                    stroke="var(--ind-primary)"
                    strokeWidth="1.5"
                    strokeOpacity="0.30"
                    style={{ transition: 'stroke 350ms ease' }}
                  />
                )}

                {/* Role label */}
                <text
                  x={role.x} y={role.y + labelOffset}
                  textAnchor="middle"
                  fontSize={labelSize}
                  fontWeight={labelWeight}
                  fill={labelColor}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {role.label}
                </text>
              </motion.g>
            )
          })}
        </motion.g>
      </AnimatePresence>
    </svg>
  )
}

function PhoneFrame({ active, lang }: { active: string; lang: Locale }) {
  const convMap = lang === 'es' ? CONVERSATIONS_ES : CONVERSATIONS
  const messages = convMap[active] ?? convMap.hospitality

  return (
    <div className="phone-device">
      <div className="phone-bezel">
        <div className="phone-island" aria-hidden="true" />
        <div className="phone-wa-header">
          <span className="phone-wa-back" aria-hidden="true">&#8249;</span>
          <div className="phone-wa-avatar" aria-hidden="true">N</div>
          <div className="phone-wa-info">
            <div className="phone-wa-name">NORA Operations</div>
            <div className="phone-wa-status">
              <span className="phone-wa-status-dot" aria-hidden="true" />
              {lang === 'es' ? 'Activo' : 'Active'}
            </div>
          </div>
          <span className="phone-wa-dots" aria-hidden="true">&#8943;</span>
        </div>
        <div className="phone-wa-body" aria-label="WhatsApp conversation">
          <div className="phone-wa-wallpaper" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '3px', position: 'relative', zIndex: 1 }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`phone-bubble-wrap phone-bubble-wrap--${msg.from}`}>
                  <div className={`phone-bubble phone-bubble--${msg.from}`}>
                    {msg.from === 'user' && msg.name && (
                      <span className="phone-bubble-name">{msg.name}</span>
                    )}
                    <span style={{ display: 'block' }}>{msg.text}</span>
                    <div className="phone-bubble-footer">
                      <span className="phone-bubble-time">{msg.time}</span>
                      {msg.ticks && <span className="phone-bubble-ticks" aria-hidden="true">&#10003;&#10003;</span>}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="phone-wa-input-bar" aria-hidden="true">
          <div className="phone-wa-input-pill">{lang === 'es' ? 'Mensaje' : 'Message'}</div>
          <div className="phone-wa-send-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Mobile: portrait strip — the human network remains visible, not abstracted away */
function MobileTeamStrip({ active }: { active: string }) {
  const config = INDUSTRY_CONFIG[active] ?? INDUSTRY_CONFIG.hospitality
  const featured = config.roles.filter(r => r.size !== 'tertiary').slice(0, 3)

  return (
    <div className="hero-team-strip hero-network-mobile" aria-hidden="true">
      {featured.map((role, i) => (
        <div
          key={i}
          className="hero-team-avatar"
          style={role.img ? { backgroundImage: `url(${role.img})` } : undefined}
          data-primary={role.size === 'primary' ? 'true' : undefined}
        >
          {!role.img && <span>{role.letter ?? role.label[0]}</span>}
        </div>
      ))}
      <div className="hero-team-nora">NORA</div>
    </div>
  )
}

export function Hero({ lang }: { lang: Locale }) {
  const active = useActiveIndustry()
  const es = lang === 'es'
  const whatsappReady = Boolean(WHATSAPP_URL)
  const industryName = INDUSTRY_LABELS[active]?.[es ? 'es' : 'en'] ?? 'Hospitality'

  const copy = {
    eyebrow: es ? `Plataforma de operaciones · ${industryName}` : `Operations platform · ${industryName}`,
    headline: es ? 'Tu Negocio.\nOrganizado.' : 'Business.\nOrganized.',
    subhead: es
      ? 'NORA convierte las conversaciones de WhatsApp de tu equipo en tareas, aprobaciones y registros, y da seguimiento hasta que el trabajo se completa.'
      : 'NORA turns your team’s WhatsApp conversations into tasks, approvals, and records — and follows up to get the job done.',
    ctaPrimary:  es ? 'Habla con NORA por WhatsApp'  : 'Talk to NORA on WhatsApp',
    ctaSoon:     es ? 'Disponible pronto'              : 'Coming soon',
    ctaDemo:     es ? 'Solicitar una demo'             : 'Request a demo',
    trustLine:   es ? 'Tu equipo sigue usando WhatsApp. Sin nuevas apps.' : 'Your team keeps using WhatsApp. No new app to learn.',
  }

  const ACTIVE_PILLS = ['hospitality', 'painting', 'restaurant'] as const
  const ALL_PILLS    = ['hospitality', 'painting', 'restaurant', 'property', 'construction'] as const

  return (
    <section id="hero" className="hero-section" aria-label={es ? 'Introducción a NORA' : 'NORA introduction'}>
      <div className="hero-inner">

        {/* Left column */}
        <div className="hero-left">

          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ height: '20px', margin: 0 }}
            >
              {copy.eyebrow}
            </motion.p>
          </AnimatePresence>

          {/* LCP headline: no opacity:0 initial state */}
          <h1 className="hero-headline">
            {copy.headline.split('\n').map((line, i) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
          </h1>

          <p className="hero-subhead">{copy.subhead}</p>

          {/* Mobile: industry pill switcher */}
          <div className="hero-network-mobile hero-pills-mobile">
            {ALL_PILLS.map(id => {
              const label = INDUSTRY_LABELS[id]?.[es ? 'es' : 'en'] ?? id
              const isActive = id === active
              const isAvail  = ACTIVE_PILLS.includes(id as typeof ACTIVE_PILLS[number])
              return (
                <button
                  key={id}
                  type="button"
                  className="industry-pill"
                  data-active={isActive ? 'true' : 'false'}
                  data-coming-soon={!isAvail ? 'true' : 'false'}
                  onClick={() => isAvail && setIndustry(id)}
                  aria-pressed={isActive}
                  style={{ flexShrink: 0 }}
                >
                  {label}
                  {!isAvail && <span className="nora-nav__soon-badge" aria-hidden="true">soon</span>}
                </button>
              )
            })}
          </div>

          {/* CTAs: available action is always the visual primary */}
          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {whatsappReady ? (
              <>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary hero-cta-primary"
                >
                  {copy.ctaPrimary}
                </a>
                <a href={`/${lang}/demo`} className="btn btn-ghost hero-cta-ghost">
                  {copy.ctaDemo}
                </a>
              </>
            ) : (
              <>
                <a href={`/${lang}/demo`} className="btn btn-primary hero-cta-primary">
                  {copy.ctaDemo}
                </a>
                <button
                  type="button"
                  className="btn btn-ghost hero-cta-ghost hero-cta-soon"
                  aria-disabled="true"
                  title={copy.ctaSoon}
                  onClick={e => e.preventDefault()}
                >
                  {copy.ctaPrimary}
                </button>
              </>
            )}
          </motion.div>

          <motion.p
            className="hero-trustline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {copy.trustLine}
          </motion.p>
        </div>

        {/* Right column: network + phone */}
        <div className="hero-right">
          <div className="hero-visual-inner">

            {/* Desktop: full network SVG — z-index 4, above phone, so NORA floats over phone header */}
            <div className="hero-network-desktop">
              <NetworkViz active={active} />
            </div>

            {/* Mobile: portrait strip — industry stays human even without the full network */}
            <MobileTeamStrip active={active} />

            {/* Phone frame */}
            <div className="hero-phone-wrap">
              <PhoneFrame active={active} lang={lang} />
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
