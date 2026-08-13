'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { Locale } from '@/lib/i18n'

const content = {
  en: {
    eyebrow: 'EVIDENCE → RECORDS',
    headline: 'Take a photo.\nSend it to NORA.\nShe does the rest.',
    sub: 'NORA saves the receipt, records the expense, identifies the vendor, and updates inventory when applicable.',
    convLabel: 'WhatsApp · Today · 10:14 AM',
    results: [
      { icon: '📷', label: 'Receipt saved', check: true },
      { icon: '💰', label: '$84.50 recorded', check: true },
      { icon: '🏪', label: 'Ferretería Central', check: true },
      { icon: '📦', label: '5 filters remaining', check: true },
    ],
    messages: [
      { from: 'employee', sender: 'Marcos', text: 'Bought the AC filters for room 3. Here\'s the receipt.' },
      { from: 'receipt' },
      { from: 'nora', text: 'Got it, Marcos. Stored.\n→ $84.50 · Maintenance / AC · Ferretería Central\n\nDid you install any?' },
      { from: 'employee', sender: 'Marcos', text: 'Yes. Installed one. 5 remaining.' },
      { from: 'nora', text: 'Inventory updated. 5 AC filters in stock.' },
    ],
    records: [
      {
        label: 'EXPENSE',
        rows: [
          { k: 'Amount', v: '$84.50' },
          { k: 'Category', v: 'Maintenance / AC' },
          { k: 'Submitted by', v: 'Marcos' },
          { k: 'Receipt', v: 'Photo on file ✓' },
        ],
      },
      {
        label: 'VENDOR',
        rows: [
          { k: 'Name', v: 'Ferretería Central' },
          { k: 'Item', v: 'AC filters · x6' },
          { k: 'Amount', v: '$84.50' },
        ],
      },
      {
        label: 'INVENTORY',
        rows: [
          { k: 'Item', v: 'AC filters' },
          { k: 'Added', v: '+6 units' },
          { k: 'Installed', v: '1 unit' },
          { k: 'In stock', v: '5 units ✓' },
        ],
      },
    ],
    outcomeNote: 'One photo. Three records. NORA asked one question to complete the picture.',
  },
  es: {
    eyebrow: 'EVIDENCIA → REGISTROS',
    headline: 'Tome una foto.\nEnvíesela a NORA.\nElla se encarga del resto.',
    sub: 'NORA guarda el comprobante, registra el gasto, identifica al proveedor y actualiza el inventario cuando corresponde.',
    convLabel: 'WhatsApp · Hoy · 10:14 AM',
    results: [
      { icon: '📷', label: 'Recibo guardado', check: true },
      { icon: '💰', label: '$84.50 registrado', check: true },
      { icon: '🏪', label: 'Ferretería Central', check: true },
      { icon: '📦', label: '5 filtros restantes', check: true },
    ],
    messages: [
      { from: 'employee', sender: 'Marcos', text: 'Compré los filtros del A/C de la habitación 3. Aquí está el recibo.' },
      { from: 'receipt' },
      { from: 'nora', text: 'Recibido, Marcos. Guardado.\n→ $84.50 · Mantenimiento / A/C · Ferretería Central\n\n¿Instalaste alguno?' },
      { from: 'employee', sender: 'Marcos', text: 'Sí. Instalé uno. Quedan 5.' },
      { from: 'nora', text: 'Inventario actualizado. 5 filtros A/C en stock.' },
    ],
    records: [
      {
        label: 'GASTO',
        rows: [
          { k: 'Monto', v: '$84.50' },
          { k: 'Categoría', v: 'Mantenimiento / A/C' },
          { k: 'Registrado por', v: 'Marcos' },
          { k: 'Recibo', v: 'Foto archivada ✓' },
        ],
      },
      {
        label: 'PROVEEDOR',
        rows: [
          { k: 'Nombre', v: 'Ferretería Central' },
          { k: 'Artículo', v: 'Filtros A/C · x6' },
          { k: 'Monto', v: '$84.50' },
        ],
      },
      {
        label: 'INVENTARIO',
        rows: [
          { k: 'Artículo', v: 'Filtros A/C' },
          { k: 'Añadido', v: '+6 unidades' },
          { k: 'Instalado', v: '1 unidad' },
          { k: 'En stock', v: '5 unidades ✓' },
        ],
      },
    ],
    outcomeNote: 'Una foto. Tres registros. NORA hizo una sola pregunta para completar el cuadro.',
  },
}

export function ReceiptStory({ lang }: { lang: Locale }) {
  const c = content[lang]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const rightRef = useRef<HTMLDivElement>(null)
  const rightInView = useInView(rightRef, { once: true, margin: '-60px 0px' })

  return (
    <section style={{
      background: 'linear-gradient(170deg, #eef5fc 0%, #e6f0fa 100%)',
      padding: '7rem 0',
    }}>
      <div className="container" ref={ref}>

        {/* Headline — full width above the split */}
        <motion.div
          style={{ maxWidth: 620, marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow-light" style={{ marginBottom: '0.85rem' }}>{c.eyebrow}</div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            color: '#0a1428',
            margin: '0 0 0.85rem',
            whiteSpace: 'pre-line',
          }}>
            {c.headline}
          </h2>
          <p style={{ color: '#4a6278', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            {c.sub}
          </p>
        </motion.div>

        {/* Quick result summary — scan-friendly */}
        <motion.div
          className="rs-results-bar"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginBottom: '3rem' }}
        >
          {c.results.map((r, i) => (
            <div key={i} className="rs-result-item">
              <span className="rs-result-icon">{r.icon}</span>
              <span className="rs-result-label">{r.label}</span>
              <span className="rs-result-check">✓</span>
            </div>
          ))}
        </motion.div>

        {/* Split: conversation left, records right */}
        <div className="rs-grid">

          {/* Left: WhatsApp conversation */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rs-conv">
              <div className="rs-conv-header">
                <span className="rs-conv-dot" aria-hidden="true" />
                <span className="rs-conv-label">{c.convLabel}</span>
              </div>
              <div className="rs-messages">
                {c.messages.map((msg, i) => {
                  if (msg.from === 'receipt') {
                    return (
                      <motion.div
                        key={i}
                        className="rs-receipt-thumb"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                      >
                        <div className="rs-receipt-inner" aria-label="Receipt photo">
                          <div className="rs-receipt-logo">FERRETERÍA CENTRAL</div>
                          <div className="rs-receipt-divider" />
                          <div className="rs-receipt-item">Filtros A/C Premium · 6 uds</div>
                          <div className="rs-receipt-price">$84.50</div>
                          <div className="rs-receipt-divider" />
                          <div className="rs-receipt-meta">TOTAL: $84.50</div>
                        </div>
                        <div className="rs-photo-label">{lang === 'es' ? '📎 foto_recibo.jpg' : '📎 receipt_photo.jpg'}</div>
                      </motion.div>
                    )
                  }
                  return (
                    <motion.div
                      key={i}
                      className={`rs-msg rs-msg-${msg.from}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.16 + i * 0.1 }}
                    >
                      {msg.from === 'employee' && msg.sender && (
                        <div className="rs-sender">{msg.sender}</div>
                      )}
                      <div className="rs-bubble">{msg.text}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: structured records */}
          <div ref={rightRef}>
            <div className="rs-records">
              {c.records.map((rec, i) => (
                <motion.div
                  key={i}
                  className="rs-record"
                  initial={{ opacity: 0, x: 14 }}
                  animate={rightInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.42, delay: 0.08 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="rs-record-header">
                    <span className="rs-record-label">{rec.label}</span>
                    <span className="rs-record-created">{lang === 'es' ? '✓ creado' : '✓ created'}</span>
                  </div>
                  <div className="rs-record-rows">
                    {rec.rows.map((row, j) => (
                      <div key={j} className="rs-row">
                        <span className="rs-row-k">{row.k}</span>
                        <span className="rs-row-v">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              <motion.p
                className="rs-note"
                initial={{ opacity: 0 }}
                animate={rightInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.55 }}
              >
                {c.outcomeNote}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rs-results-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .rs-result-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          background: #fff;
          border: 1px solid #d0ddef;
          box-shadow: 0 1px 4px rgba(0,30,80,.06);
        }
        .rs-result-icon { font-size: 0.88rem; }
        .rs-result-label {
          font-size: 0.82rem;
          font-weight: 500;
          color: #1a3050;
        }
        .rs-result-check {
          color: #22c55e;
          font-weight: 700;
          font-size: 0.78rem;
        }

        .rs-grid {
          display: grid;
          gap: 2.5rem;
          align-items: start;
        }
        @media (min-width: 900px) {
          .rs-grid { grid-template-columns: 1fr 1fr; }
        }

        /* WhatsApp conversation panel — stays dark like a device */
        .rs-conv {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(30,60,100,.15);
          background: #0a1929;
          box-shadow: 0 12px 40px rgba(0,20,60,.15);
        }
        .rs-conv-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,.06);
          background: #1f2c34;
        }
        .rs-conv-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 7px rgba(34,197,94,.6);
          flex-shrink: 0;
        }
        .rs-conv-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: #5a7a8a;
          letter-spacing: 0.06em;
        }
        .rs-messages {
          padding: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .rs-msg { display: flex; flex-direction: column; max-width: 88%; }
        .rs-msg-employee { align-self: flex-end; }
        .rs-msg-nora { align-self: flex-start; }
        .rs-sender {
          font-size: 0.54rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          color: #5bd4f3;
          margin: 0 0 0.14rem 0.1rem;
        }
        .rs-bubble {
          padding: 0.6rem 0.85rem;
          border-radius: 12px;
          font-size: 0.8rem;
          line-height: 1.52;
          white-space: pre-wrap;
        }
        .rs-msg-employee .rs-bubble {
          background: #005c4b;
          color: #d9dde0;
          border-radius: 12px 12px 2px 12px;
        }
        .rs-msg-nora .rs-bubble {
          background: #202c33;
          color: #d0dce8;
          border-radius: 12px 12px 12px 2px;
        }

        /* Receipt thumbnail */
        .rs-receipt-thumb {
          align-self: flex-end;
          max-width: 185px;
        }
        .rs-receipt-inner {
          background: #faf7f0;
          border-radius: 5px;
          padding: 0.75rem;
          font-family: 'Courier New', monospace;
          font-size: 0.66rem;
          color: #1a1a1a;
          line-height: 1.5;
          box-shadow: 0 3px 12px rgba(0,0,0,.22);
        }
        .rs-receipt-logo {
          font-weight: 700;
          font-size: 0.6rem;
          letter-spacing: 0.04em;
          text-align: center;
          margin-bottom: 0.35rem;
        }
        .rs-receipt-divider {
          border-top: 1px dashed #ccc;
          margin: 0.3rem 0;
        }
        .rs-receipt-item { color: #333; font-size: 0.62rem; }
        .rs-receipt-price {
          font-weight: 700;
          font-size: 0.8rem;
          color: #1a1a1a;
          text-align: right;
        }
        .rs-receipt-meta { font-size: 0.58rem; color: #555; }
        .rs-photo-label {
          font-size: 0.56rem;
          color: #5a7a8a;
          margin-top: 0.25rem;
          padding: 0 0.1rem;
          font-family: var(--font-mono);
        }

        /* Records (light card style) */
        .rs-records {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .rs-record {
          border: 1px solid #d0ddef;
          border-radius: var(--r);
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 6px rgba(0,30,80,.05);
        }
        .rs-record-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.55rem;
          padding: 0.55rem 0.9rem;
          border-bottom: 1px solid #e8eef8;
          background: #f5f8fd;
        }
        .rs-record-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #0094b3;
        }
        .rs-record-created {
          font-size: 0.57rem;
          font-weight: 600;
          color: #16a34a;
          letter-spacing: 0.04em;
        }
        .rs-record-rows { padding: 0.5rem 0.9rem; }
        .rs-row {
          display: flex;
          gap: 0.75rem;
          padding: 0.2rem 0;
          border-bottom: 1px solid #eef2f8;
        }
        .rs-row:last-child { border-bottom: none; }
        .rs-row-k {
          color: #6a8aaa;
          font-size: 0.69rem;
          min-width: 78px;
          flex-shrink: 0;
        }
        .rs-row-v {
          color: #1a3050;
          font-size: 0.78rem;
          font-weight: 500;
        }
        .rs-note {
          font-size: 0.78rem;
          color: #6a8aaa;
          line-height: 1.55;
          margin: 0.15rem 0 0;
        }

        @media (max-width: 640px) {
          .rs-bubble { font-size: 0.76rem; }
          .rs-result-label { font-size: 0.78rem; }
        }
      `}</style>
    </section>
  )
}
