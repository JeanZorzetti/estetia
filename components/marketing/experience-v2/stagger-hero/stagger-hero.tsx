'use client'

import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { ParticlesSvg } from './particles-svg'
import { GoldenParticle } from '../shared/golden-particle'
import { ScrambleText } from '../shared/scramble-text'
import { Magnetic } from '../shared/magnetic'

const HEADLINE = 'Gestão clínica que encanta'
const WORDS = HEADLINE.split(' ')

const SUBWORDS = [
  { text: 'Menos papel.', color: '#C5A059' },
  { text: 'Mais presença.', color: '#489FB5' },
  { text: 'Resultados que ficam.', color: 'rgba(240,237,232,0.5)' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '0.7em' },
  visible: {
    opacity: 1,
    y: '0em',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as any },
  },
}

const subVariants: Variants = {
  hidden: { opacity: 0, y: '0.8em' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visible: ((i: number) => ({
    opacity: 1,
    y: '0em',
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] as any, delay: 0.45 + i * 0.12 },
  })) as any,
}

export function StaggerHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const particleOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0])
  const particleY = useTransform(scrollYProgress, [0.7, 1], [0, 60])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, #04080F 95%)' }}
      />

      <ParticlesSvg />

      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        01 — Stagger
      </div>

      {/* Golden particle — fades out on scroll */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{ opacity: particleOpacity, y: particleY, left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
      >
        <GoldenParticle phase="hero-enter" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Gold divider */}
        <div
          className="mx-auto mb-8 h-px w-16 opacity-60"
          style={{ background: 'linear-gradient(90deg, transparent, #C5A059, transparent)' }}
        />

        {/* Scramble caption */}
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#C5A059',
            opacity: 0.7,
            marginBottom: '1.5rem',
          }}
        >
          <ScrambleText text="ESTETIA CRM" duration={900} delay={200} />
        </p>

        {/* Headline — word stagger */}
        <h1
          className="mb-6 leading-tight"
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(2.2rem, 7vw, 6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#F0EDE8',
            letterSpacing: '-0.02em',
          }}
          aria-label={HEADLINE}
        >
          <motion.span
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em' }}
            variants={containerVariants}
            initial={shouldReduce ? false : 'hidden'}
            animate="visible"
          >
            {WORDS.map((word, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* Sub-words */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {SUBWORDS.map(({ text, color }, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={subVariants}
              initial={shouldReduce ? false : 'hidden'}
              animate="visible"
              style={{
                display: 'inline-block',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color,
              }}
            >
              {text}
            </motion.span>
          ))}
        </div>

        {/* CTA scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-40">
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C5A059',
            }}
          >
            Role para explorar
          </p>
          <Magnetic strength={0.3}>
            <div className="flex flex-col items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-px rounded-full"
                  style={{
                    height: '6px',
                    background: '#C5A059',
                    animation: `fade-pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </Magnetic>
        </div>
      </div>

      <style>{`
        @keyframes fade-pulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  )
}
