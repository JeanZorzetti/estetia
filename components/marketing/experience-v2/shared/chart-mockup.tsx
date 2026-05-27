'use client'

import { motion, useReducedMotion } from 'framer-motion'

const POINTS = [
  { x: 0, y: 75 },
  { x: 1, y: 68 },
  { x: 2, y: 70 },
  { x: 3, y: 55 },
  { x: 4, y: 48 },
  { x: 5, y: 52 },
  { x: 6, y: 38 },
  { x: 7, y: 32 },
  { x: 8, y: 28 },
  { x: 9, y: 22 },
  { x: 10, y: 18 },
  { x: 11, y: 14 },
]

const PAD_X = 24
const PAD_Y = 22
const VW = 280
const VH = 140

function pointToCoord(i: number, y: number) {
  const px = PAD_X + (i / (POINTS.length - 1)) * (VW - PAD_X * 2)
  const py = PAD_Y + (y / 100) * (VH - PAD_Y * 2)
  return [px, py] as const
}

function buildPath() {
  let d = ''
  POINTS.forEach((p, i) => {
    const [x, y] = pointToCoord(i, p.y)
    if (i === 0) {
      d += `M ${x} ${y}`
    } else {
      const prev = POINTS[i - 1]
      const [px, py] = pointToCoord(i - 1, prev.y)
      const cx1 = px + (x - px) / 2
      const cx2 = x - (x - px) / 2
      d += ` C ${cx1} ${py}, ${cx2} ${y}, ${x} ${y}`
    }
  })
  return d
}

function buildAreaPath() {
  const line = buildPath()
  const [lastX] = pointToCoord(POINTS.length - 1, POINTS[POINTS.length - 1].y)
  const [firstX] = pointToCoord(0, POINTS[0].y)
  return `${line} L ${lastX} ${VH - PAD_Y} L ${firstX} ${VH - PAD_Y} Z`
}

export function ChartMockup() {
  const shouldReduce = useReducedMotion()
  const linePath = buildPath()
  const areaPath = buildAreaPath()

  return (
    <div
      role="img"
      aria-label="Gráfico de redução de no-shows ao longo do tempo"
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(4,8,15,0.6)',
        border: '1px solid rgba(72,159,181,0.15)',
        borderRadius: '6px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.4)', margin: 0 }}>
            No-Shows / mês
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '1.4rem', fontWeight: 300, fontStyle: 'italic', color: '#F0EDE8', letterSpacing: '-0.02em' }}>
              -67%
            </span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.55rem', color: '#489FB5', fontWeight: 600 }}>
              ↓ 12 meses
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['7D', '30D', '12M'].map((p, i) => (
            <span key={p} style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.5rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              padding: '2px 6px',
              borderRadius: '2px',
              background: i === 2 ? 'rgba(197,160,89,0.18)' : 'transparent',
              color: i === 2 ? '#C5A059' : 'rgba(240,237,232,0.3)',
            }}>
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" preserveAspectRatio="none" style={{ display: 'block', flex: 1, minHeight: 0 }}>
        <defs>
          <linearGradient id="chartArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#489FB5" />
            <stop offset="100%" stopColor="#C5A059" />
          </linearGradient>
        </defs>

        {/* Horizontal guides */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={PAD_X}
            x2={VW - PAD_X}
            y1={PAD_Y + p * (VH - PAD_Y * 2)}
            y2={PAD_Y + p * (VH - PAD_Y * 2)}
            stroke="rgba(240,237,232,0.06)"
            strokeWidth="0.5"
            strokeDasharray="2 4"
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#chartArea)"
          initial={shouldReduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#chartStroke)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Last point */}
        {(() => {
          const last = POINTS[POINTS.length - 1]
          const [px, py] = pointToCoord(POINTS.length - 1, last.y)
          return (
            <motion.g
              initial={shouldReduce ? false : { opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${px}px ${py}px` }}
            >
              <circle cx={px} cy={py} r="6" fill="#C5A059" opacity="0.25" />
              <circle cx={px} cy={py} r="3" fill="#C5A059" />
            </motion.g>
          )
        })()}
      </svg>

      {/* Footer labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Manrope', sans-serif", fontSize: '0.5rem', color: 'rgba(240,237,232,0.3)', letterSpacing: '0.1em' }}>
        <span>Jan</span><span>Abr</span><span>Jul</span><span>Out</span><span>Dez</span>
      </div>
    </div>
  )
}
