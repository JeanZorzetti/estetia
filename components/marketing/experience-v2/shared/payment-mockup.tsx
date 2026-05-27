'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { NumberCounter } from './number-counter'

export function PaymentMockup() {
  const shouldReduce = useReducedMotion()

  return (
    <div
      role="img"
      aria-label="Mockup de pagamento integrado com cartão e confirmação"
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(4,8,15,0.6)',
        border: '1px solid rgba(72,159,181,0.15)',
        borderRadius: '6px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backdropFilter: 'blur(8px)',
        justifyContent: 'space-between',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: '0.55rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(240,237,232,0.4)',
        }}>
          Cobrança gerada
        </span>
        <motion.span
          initial={shouldReduce ? false : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 1.2, type: 'spring', stiffness: 200, damping: 18 }}
          style={{
            background: 'rgba(72,159,181,0.18)',
            color: '#489FB5',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.55rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '2px',
            letterSpacing: '0.15em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <motion.svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            initial={shouldReduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.path
              d="M5 12 L10 17 L19 7"
              stroke="#489FB5"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldReduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.svg>
          PAGO
        </motion.span>
      </div>

      {/* Card mockup */}
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 16, rotateX: -15 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(135deg, #C5A059 0%, #8a6f3e 100%)',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          aspectRatio: '1.586',
          position: 'relative',
          overflow: 'hidden',
          transformPerspective: '600px',
        }}
      >
        {/* Diagonal shimmer */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Chip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              width: 26,
              height: 18,
              borderRadius: '3px',
              background: 'linear-gradient(135deg, #f4d484, #c4a55a)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              padding: '2px',
              gap: '1px',
            }}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ background: 'rgba(10,31,61,0.25)', borderRadius: '0.5px' }} />
            ))}
          </div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.15em', color: '#04080F' }}>
            ESTETIA PAY
          </span>
        </div>

        {/* Number */}
        <div style={{ display: 'flex', gap: '8px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, color: '#04080F', letterSpacing: '0.05em' }}>
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span>4 8 7 2</span>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.45rem', fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(10,31,61,0.55)' }}>
              TITULAR
            </span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: '#04080F', letterSpacing: '0.05em' }}>
              PEDRO L. SILVA
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.45rem', fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(10,31,61,0.55)' }}>
              VÁLIDO
            </span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: '#04080F', letterSpacing: '0.05em' }}>
              12/29
            </span>
          </div>
        </div>
      </motion.div>

      {/* Amount + counter */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.4)' }}>
            Valor recebido
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#F0EDE8' }}>R$</span>
            <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '1.2rem', fontWeight: 300, fontStyle: 'italic', color: '#C5A059', letterSpacing: '-0.02em' }}>
              <NumberCounter value={850} duration={1.6} />
            </span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', color: 'rgba(240,237,232,0.45)' }}>,00</span>
          </div>
        </div>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', fontWeight: 600, color: 'rgba(240,237,232,0.4)', letterSpacing: '0.1em' }}>
          via Pix
        </span>
      </div>
    </div>
  )
}
