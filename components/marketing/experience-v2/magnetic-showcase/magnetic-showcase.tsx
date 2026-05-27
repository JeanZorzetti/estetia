'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { TiltCard } from '../shared/tilt-card'
import { Spotlight } from '../shared/spotlight'
import { BENTO_ITEMS } from './bento-data'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
}

export function MagneticShowcase() {
  const shouldReduce = useReducedMotion()

  return (
    <section
      aria-label="Funcionalidades Estetia"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"
      style={{ background: 'transparent' }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        02 — Showcase
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 max-w-2xl">
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
          Tudo em um só lugar
        </p>
        <h2
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#F0EDE8',
            letterSpacing: '-0.02em',
          }}
        >
          Cada ferramenta que sua clínica precisa
        </h2>
      </div>

      {/* Bento Grid */}
      <motion.div
        className="relative z-10 w-full max-w-5xl grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, auto)',
        }}
        variants={containerVariants}
        initial={shouldReduce ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {BENTO_ITEMS.map((item, i) => {
          const isLarge = item.size === 'large'
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              style={{
                gridColumn: isLarge ? 'span 1' : 'span 1',
                gridRow: isLarge ? 'span 2' : 'span 1',
              }}
            >
              <TiltCard
                maxTilt={isLarge ? 8 : 12}
                style={{ height: '100%' }}
              >
                <Spotlight
                  color={`${item.accent}22`}
                  size={240}
                  style={{ height: '100%' }}
                >
                  <article
                    style={{
                      height: '100%',
                      minHeight: isLarge ? '320px' : '140px',
                      padding: isLarge ? '2rem' : '1.25rem',
                      borderRadius: '8px',
                      border: `1px solid ${item.accent}28`,
                      background: isLarge
                        ? `linear-gradient(135deg, rgba(10,31,61,0.95) 0%, rgba(4,8,15,0.98) 100%)`
                        : 'rgba(10,31,61,0.6)',
                      backdropFilter: 'blur(20px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 300ms ease',
                    }}
                  >
                    {/* Accent glow top-right */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '60%',
                        height: '40%',
                        background: `radial-gradient(ellipse at 80% 0%, ${item.accent}18, transparent 70%)`,
                        pointerEvents: 'none',
                      }}
                    />

                    <div>
                      {/* Tag */}
                      <span
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          color: item.accent,
                          opacity: 0.8,
                          display: 'block',
                          marginBottom: isLarge ? '1.5rem' : '0.75rem',
                        }}
                      >
                        {item.tag}
                      </span>

                      {/* Icon */}
                      <div
                        style={{
                          fontSize: isLarge ? '1.8rem' : '1.2rem',
                          color: item.accent,
                          marginBottom: isLarge ? '1.25rem' : '0.75rem',
                          lineHeight: 1,
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily: "'Newsreader', Georgia, serif",
                          fontSize: isLarge ? 'clamp(1.3rem, 2.5vw, 1.9rem)' : '1rem',
                          fontWeight: 400,
                          fontStyle: 'italic',
                          color: '#F0EDE8',
                          letterSpacing: '-0.01em',
                          marginBottom: '0.75rem',
                          lineHeight: 1.25,
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: isLarge ? '0.85rem' : '0.75rem',
                          color: 'rgba(240,237,232,0.45)',
                          lineHeight: 1.6,
                          fontWeight: 400,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom line accent */}
                    <div
                      style={{
                        marginTop: '1.5rem',
                        height: '1px',
                        background: `linear-gradient(90deg, ${item.accent}50, transparent)`,
                        width: isLarge ? '60%' : '40%',
                      }}
                    />
                  </article>
                </Spotlight>
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
