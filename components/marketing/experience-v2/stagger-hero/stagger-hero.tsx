'use client'

import { useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { GoldenParticle } from '../shared/golden-particle'
import { ScrambleText } from '../shared/scramble-text'
import { Magnetic } from '../shared/magnetic'
import { KineticWord } from '../shared/kinetic-word'
import { TrustStack } from '../shared/trust-stack'

const ShaderHero = dynamic(
  () => import('../shared/shader-hero').then(m => m.ShaderHero),
  { ssr: false },
)

// Words that cycle in the headline kinetic slot
const KINETIC_WORDS = ['encanta', 'fideliza', 'faz crescer']

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

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any, delay: 0.7 },
  },
}

export function StaggerHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const particleOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0])
  const particleY = useTransform(scrollYProgress, [0.7, 1], [0, 60])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Human photo background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        {/* Navy overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,31,61,0.82) 0%, rgba(4,8,15,0.92) 100%)',
          }}
        />
      </div>

      {/* WebGL shader blended over photo */}
      {!shouldReduce && (
        <div
          className="absolute inset-0 z-[1]"
          style={{ mixBlendMode: 'screen', opacity: 0.5, pointerEvents: 'none' }}
        >
          <ShaderHero />
        </div>
      )}

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

        {/* Headline — word stagger + kinetic last word */}
        <h1
          className="mb-2 leading-tight"
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(2.2rem, 7vw, 6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#F0EDE8',
            letterSpacing: '-0.02em',
          }}
        >
          <motion.span
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em' }}
            variants={containerVariants}
            initial={shouldReduce ? false : 'hidden'}
            animate="visible"
          >
            {['Gestão', 'clínica', 'que'].map((word, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
              variants={wordVariants}
            >
              <KineticWord words={KINETIC_WORDS} intervalMs={2500} color="#C5A059" />
            </motion.span>
          </motion.span>
        </h1>

        {/* Trust stack — rating + LGPD + social */}
        <TrustStack />

        {/* Dual CTA — primary + secondary */}
        <motion.div
          variants={ctaVariants}
          initial={shouldReduce ? false : 'hidden'}
          animate="visible"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          {/* Primary CTA */}
          <Magnetic strength={0.25}>
            <motion.a
              href="/cadastro"
              data-cursor="cta"
              data-cursor-label="Começar"
              whileHover={shouldReduce ? undefined : {
                scale: 1.04,
                boxShadow: '0 0 24px rgba(197,160,89,0.45), 0 8px 28px rgba(197,160,89,0.18)',
              }}
              whileTap={shouldReduce ? undefined : { scale: 0.97 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              transition={{ type: 'spring', stiffness: 320, damping: 22 } as any}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 2.2rem',
                background: '#C5A059',
                color: '#0A1F3D',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
              }}
              className="focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2"
            >
              Começar grátis
              <ArrowRight size={14} strokeWidth={2.5} />
            </motion.a>
          </Magnetic>

          {/* Secondary CTA */}
          <motion.a
            href="#product"
            data-cursor="link"
            data-cursor-label="Ver produto"
            whileHover={shouldReduce ? undefined : { x: 4 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transition={{ duration: 0.2 } as any}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2rem',
              border: '1px solid rgba(197,160,89,0.35)',
              color: 'rgba(240,237,232,0.8)',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '2px',
              background: 'transparent',
            }}
            className="focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2"
          >
            Ver o produto
          </motion.a>
        </motion.div>

        {/* Scroll hint — smaller, below CTAs */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C5A059',
            }}
          >
            Role para explorar
          </p>
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
