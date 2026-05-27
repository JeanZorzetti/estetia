'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  MotionValue,
} from 'framer-motion'
import { JOURNEY_STEPS, buildPath } from '@/components/marketing/experience/svg-journey/journey-data'

const VIEWPORTS_TALL = 3
const VW = 800
const VH = 360
const PATH_D = buildPath(JOURNEY_STEPS)

// Extracted as a sub-component so hooks are called at component top-level (not inside a loop)
function JourneyDot({
  step,
  index,
  total,
  smoothProgress,
  shouldReduce,
}: {
  step: (typeof JOURNEY_STEPS)[0]
  index: number
  total: number
  smoothProgress: MotionValue<number>
  shouldReduce: boolean | null
}) {
  const threshold = 0.15 + (index / (total - 1)) * 0.6
  const isAbove = step.y < VH / 2

  const dotScale = useTransform(smoothProgress, [threshold - 0.02, threshold + 0.05], [0, 1])
  const dotOpacity = useTransform(smoothProgress, [threshold - 0.02, threshold + 0.05], [0, 1])
  const labelOpacity = useTransform(smoothProgress, [threshold, threshold + 0.06], [0, 1])

  return (
    <g>
      <motion.circle
        cx={step.x}
        cy={step.y}
        r="5"
        fill={index === 0 || index === total - 1 ? '#C5A059' : '#489FB5'}
        style={
          shouldReduce
            ? { scale: 1, opacity: 1 }
            : {
                scale: dotScale,
                opacity: dotOpacity,
                transformOrigin: `${step.x}px ${step.y}px`,
              }
        }
      />
      <motion.foreignObject
        x={step.x - 60}
        y={isAbove ? step.y - 52 : step.y + 16}
        width="120"
        height="50"
        style={{
          overflow: 'visible',
          opacity: shouldReduce ? 1 : labelOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          <div style={{ color: '#C5A059', textTransform: 'uppercase', marginBottom: '2px' }}>
            {step.label}
          </div>
          <div style={{ color: 'rgba(240,237,232,0.4)', fontSize: '8px' }}>
            {step.description}
          </div>
        </div>
      </motion.foreignObject>
    </g>
  )
}

export function TimelineJourney() {
  const wrapperRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const pathLength = useTransform(smoothProgress, [0, 0.6], [0, 1])

  return (
    <section
      ref={wrapperRef}
      aria-label="Jornada do paciente"
      style={{ height: `${VIEWPORTS_TALL * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'transparent' }}
      >
        {/* Section number */}
        <div
          className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
          style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
        >
          05 — Jornada
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-8 px-6">
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#C5A059',
              opacity: 0.7,
              marginBottom: '0.75rem',
            }}
          >
            Do lead ao embaixador
          </p>
          <h2
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#F0EDE8',
              letterSpacing: '-0.02em',
            }}
          >
            A jornada completa do paciente
          </h2>
        </div>

        {/* SVG Journey */}
        <div className="relative z-10 w-full max-w-3xl px-4">
          <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="lineGradV2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#489FB5" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <motion.path
              d={PATH_D}
              fill="none"
              stroke="url(#lineGradV2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={shouldReduce ? { pathLength: 1 } : { pathLength }}
            />

            {JOURNEY_STEPS.map((step, i) => (
              <JourneyDot
                key={step.id}
                step={step}
                index={i}
                total={JOURNEY_STEPS.length}
                smoothProgress={smoothProgress}
                shouldReduce={shouldReduce}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
