'use client'

import { motion, useReducedMotion } from 'framer-motion'

const ITEMS = [
  { icon: '★', label: '4.9', sub: '200+ clínicas' },
  { icon: '🔒', label: 'LGPD', sub: 'compliant' },
  { icon: '📍', label: 'SP ao RS', sub: 'presença nacional' },
]

export function TrustStack() {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition={{ duration: 0.5, delay: 0.85, ease: [0.22, 1, 0.36, 1] as any }}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem 1.5rem',
        marginTop: '1.5rem',
        marginBottom: '0.5rem',
      }}
    >
      {ITEMS.map(({ icon, label, sub }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 500,
            color: 'rgba(240,237,232,0.65)',
          }}
        >
          <span style={{ fontSize: '0.7rem' }}>{icon}</span>
          <span style={{ color: '#C5A059', fontWeight: 700 }}>{label}</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>{sub}</span>
        </div>
      ))}
    </motion.div>
  )
}
