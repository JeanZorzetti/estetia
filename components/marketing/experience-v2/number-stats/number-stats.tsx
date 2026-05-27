'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { NumberCounter } from '../shared/number-counter'
import { Spotlight } from '../shared/spotlight'

const STATS = [
  {
    value: 340,
    prefix: '+',
    suffix: '%',
    label: 'em agendamentos',
    description: 'Clínicas que adotam o Estetia crescem 3× mais rápido que a média do setor.',
    accent: '#C5A059',
  },
  {
    value: 67,
    prefix: '-',
    suffix: '%',
    label: 'em no-shows',
    description: 'Confirmações automáticas e lembretes inteligentes eliminam as faltas.',
    accent: '#489FB5',
  },
  {
    value: 2.4,
    prefix: '',
    suffix: 'h',
    decimals: 1,
    label: 'economizadas por dia',
    description: 'Menos burocracia, mais tempo com quem realmente importa: seus pacientes.',
    accent: '#C5A059',
  },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visible: ((i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as any, delay: i * 0.12 },
  })) as any,
}

export function NumberStats() {
  const shouldReduce = useReducedMotion()

  return (
    <section
      aria-label="Resultados Estetia"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"
      style={{ background: 'transparent' }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        04 — Métricas
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 max-w-xl">
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
          Resultados reais
        </p>
        <h2
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#F0EDE8',
            letterSpacing: '-0.02em',
          }}
        >
          Números que falam por si
        </h2>
      </div>

      {/* Stats grid */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={cardVariants}
            initial={shouldReduce ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Spotlight color={`${stat.accent}20`} size={220}>
              <div
                style={{
                  padding: '2.5rem 2rem',
                  borderRadius: '8px',
                  border: `1px solid ${stat.accent}28`,
                  background: 'rgba(10,31,61,0.7)',
                  backdropFilter: 'blur(16px)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${stat.accent}80, transparent)`,
                  }}
                />

                {/* Number */}
                <div
                  style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: 'clamp(3rem, 7vw, 4.5rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: stat.accent,
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.03em',
                  }}
                >
                  <NumberCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                    duration={2}
                  />
                </div>

                {/* Label */}
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#F0EDE8',
                    opacity: 0.8,
                    marginBottom: '1rem',
                  }}
                >
                  {stat.label}
                </p>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${stat.accent}40, transparent)`,
                    marginBottom: '1rem',
                  }}
                />

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.75rem',
                    color: 'rgba(240,237,232,0.4)',
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  {stat.description}
                </p>
              </div>
            </Spotlight>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
