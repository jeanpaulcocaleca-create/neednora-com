'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import { getTranslations, type Locale } from '@/lib/i18n'

// Stage sequence:
// 0 → empty window (establishes the interface)
// 1 → employee message arrives
// 2 → NORA typing indicator
// 3 → NORA response (typing exits)
// 4 → operational confirmation chip
// → rest, then reset to 0

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export function SimpleMessage({ lang }: { lang: Locale }) {
  const sm = getTranslations(lang).simpleMessage
  const [stage, setStage] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: false, margin: '-60px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setStage(4)
      return
    }
    if (!inView) {
      setStage(0)
      return
    }

    const ids: ReturnType<typeof setTimeout>[] = []
    let loopId: ReturnType<typeof setTimeout>

    const run = () => {
      ids.push(setTimeout(() => setStage(1), 1200))
      ids.push(setTimeout(() => setStage(2), 2100))
      ids.push(setTimeout(() => setStage(3), 3700))
      ids.push(setTimeout(() => setStage(4), 6400))
      ids.push(
        setTimeout(() => {
          setStage(0)
          loopId = setTimeout(run, 400)
        }, 9000),
      )
    }

    run()

    return () => {
      ids.forEach(clearTimeout)
      clearTimeout(loopId)
    }
  }, [inView, reduced])

  const showEmpMsg = stage >= 1
  const showNoraTyping = stage === 2
  const showNoraMsg = stage >= 3
  const showChip = stage >= 4

  return (
    <section ref={sectionRef} className="section simplemsg-section">
      <div className="simplemsg-glow" aria-hidden="true" />

      <div className="container simplemsg-inner">
        {/* Framing copy — intentionally minimal */}
        <div className="simplemsg-copy">
          <div className="eyebrow-light">{sm.eyebrow}</div>
          <p className="simplemsg-headline">{sm.headline}</p>
        </div>

        {/* Chat stage */}
        <div
          className="simplemsg-stage"
          aria-label={sm.headline}
          aria-live="polite"
          aria-atomic="false"
        >
          <div className="simplemsg-window">
            {/* Top bar — establishes the conversation context */}
            <div className="simplemsg-bar">
              <div className="simplemsg-avatar" aria-hidden="true">
                {sm.employeeName.charAt(0)}
              </div>
              <div className="simplemsg-bar-info">
                <b>{sm.employeeName}</b>
                <span>{sm.employeeRole}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="simplemsg-body">
              <AnimatePresence>
                {showEmpMsg && (
                  <motion.div
                    key="emp"
                    className="simplemsg-bubble employee"
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                  >
                    {sm.employeeMessage}
                    <span className="simplemsg-time" aria-hidden="true">
                      {sm.time}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showNoraTyping && (
                  <motion.div
                    key="nora-typing"
                    className="simplemsg-typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  >
                    <span /><span /><span />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showNoraMsg && (
                  <motion.div
                    key="nora-msg"
                    className="simplemsg-bubble nora"
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  >
                    <span className="simplemsg-sender" aria-hidden="true">
                      {sm.noraLabel}
                    </span>
                    {sm.noraResponse}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showChip && (
                  <motion.div
                    key="chip"
                    className="simplemsg-chip"
                    initial={{ opacity: 0, y: 5, scale: 0.93 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.14 } }}
                    transition={{ duration: 0.28, delay: 0.1, ease: EASE_OUT }}
                  >
                    {sm.confirmation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
