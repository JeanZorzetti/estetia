'use client'

import { motion, useReducedMotion } from 'framer-motion'

const WEEKDAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

// Compose 5 weeks × 7 days
const FILLED_DAYS = new Set([
  3, 5, 8, 10, 12,
  15, 17, 19, 22, 23,
  26, 28, 31,
])
const HIGHLIGHT_DAY = 17
const BOOKED_DAYS = new Set([3, 8, 17, 23, 31])

export function CalendarMockup() {
  const shouldReduce = useReducedMotion()

  return (
    <div
      role="img"
      aria-label="Mockup de agenda inteligente com slots ocupados"
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(4,8,15,0.6)',
        border: '1px solid rgba(197,160,89,0.15)',
        borderRadius: '6px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.4)', margin: 0 }}>
            Outubro
          </p>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '0.95rem', fontWeight: 400, fontStyle: 'italic', color: '#F0EDE8', margin: 0, marginTop: '2px', letterSpacing: '-0.01em' }}>
            32 agendamentos
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['<', '>'].map((c) => (
            <span key={c} style={{
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px',
              border: '1px solid rgba(240,237,232,0.1)',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.55rem',
              color: 'rgba(240,237,232,0.5)',
            }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Weekday labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {WEEKDAYS.map((d, i) => (
          <span key={i} style={{
            textAlign: 'center',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.5rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'rgba(240,237,232,0.3)',
          }}>
            {d}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', flex: 1, minHeight: 0 }}>
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 1 // start on Tue
          const valid = day >= 1 && day <= 31
          const filled = valid && FILLED_DAYS.has(day)
          const booked = valid && BOOKED_DAYS.has(day)
          const highlighted = day === HIGHLIGHT_DAY
          return (
            <motion.div
              key={i}
              initial={shouldReduce ? false : { opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.012, ease: [0.22, 1, 0.36, 1] }}
              style={{
                aspectRatio: '1',
                borderRadius: '3px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.55rem',
                fontWeight: highlighted ? 700 : 500,
                color: highlighted ? '#04080F' : valid ? (filled ? '#F0EDE8' : 'rgba(240,237,232,0.45)') : 'rgba(240,237,232,0.1)',
                background: highlighted
                  ? '#C5A059'
                  : booked
                  ? 'rgba(72,159,181,0.18)'
                  : filled
                  ? 'rgba(197,160,89,0.05)'
                  : 'transparent',
                border: highlighted
                  ? 'none'
                  : booked
                  ? '1px solid rgba(72,159,181,0.3)'
                  : '1px solid rgba(240,237,232,0.04)',
                position: 'relative',
              }}
            >
              {valid && day}
              {booked && !highlighted && (
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#489FB5', position: 'absolute', bottom: '3px' }} />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '4px', borderTop: '1px solid rgba(240,237,232,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C5A059' }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', color: 'rgba(240,237,232,0.4)' }}>
            Hoje
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#489FB5' }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', color: 'rgba(240,237,232,0.4)' }}>
            Agendado
          </span>
        </div>
      </div>
    </div>
  )
}
