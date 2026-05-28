'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ScrambleText } from '../shared/scramble-text'
import { Magnetic } from '../shared/magnetic'
import { KineticWord } from '../shared/kinetic-word'
import { TrustStack } from '../shared/trust-stack'
import { TiltCard } from '../shared/tilt-card'
import { KanbanMockup } from '../shared/kanban-mockup'

const ShaderHero = dynamic(
  () => import('../shared/shader-hero').then(m => m.ShaderHero),
  { ssr: false },
)

// Kinetic words — concrete clinic outcomes, not abstract adjectives
const KINETIC_WORDS = ['organizada', 'lucrativa', 'na frente']

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '0.8em' },
  visible: {
    opacity: 1,
    y: '0em',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
}

const rightColVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any, delay: 0.3 },
  },
}

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any, delay: 0.65 },
  },
}

export function StaggerHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Estetia CRM — gestão clínica inteligente"
      className="relative min-h-screen flex items-center overflow-hidden py-20 px-6"
      style={{ background: 'transparent' }}
    >
      {/* Shader as pure ambient atmosphere (not blended over photo) */}
      <ShaderHero />

      {/* Subtle radial spotlight behind the copy */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(197,160,89,0.07) 0%, transparent 55%)',
        }}
      />

      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        01 — Hero
      </div>

      {/* Split layout: copy left | product right */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">

        {/* LEFT — copy + CTA */}
        <div className="md:col-span-5 flex flex-col items-start text-left">

          {/* Caption */}
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

          {/* Gold divider */}
          <div
            className="mb-6 h-px w-12 opacity-50"
            style={{ background: 'linear-gradient(90deg, #C5A059, transparent)' }}
          />

          {/* Headline — word stagger + kinetic last word */}
          <h1
            className="mb-5"
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#F0EDE8',
              letterSpacing: '-0.02em',
              lineHeight: 1.12,
            }}
            aria-label="Sua clínica sempre organizada"
          >
            <motion.span
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.05em' }}
              variants={containerVariants}
              initial={shouldReduce ? false : 'hidden'}
              animate="visible"
            >
              <motion.span variants={wordVariants} style={{ display: 'block' }}>
                Sua clínica
              </motion.span>
              <motion.span variants={wordVariants} style={{ display: 'block' }}>
                sempre{' '}
                <KineticWord words={KINETIC_WORDS} intervalMs={2400} color="#C5A059" />
              </motion.span>
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={shouldReduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 400,
              color: 'rgba(240,237,232,0.55)',
              lineHeight: 1.7,
              marginBottom: '0.5rem',
              maxWidth: '380px',
            }}
          >
            Pipeline de pacientes, agenda, prontuários e cobranças — num único lugar. Focado em clínicas de estética e dermatologia.
          </motion.p>

          {/* Trust stack */}
          <div style={{ marginBottom: '1.75rem', width: '100%' }}>
            <TrustStack />
          </div>

          {/* Dual CTA */}
          <motion.div
            variants={ctaVariants}
            initial={shouldReduce ? false : 'hidden'}
            animate="visible"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}
          >
            <Magnetic strength={0.25}>
              <motion.a
                href="/cadastro"
                data-cursor="cta"
                data-cursor-label="Começar"
                whileHover={shouldReduce ? undefined : {
                  scale: 1.04,
                  boxShadow: '0 0 20px rgba(197,160,89,0.4), 0 6px 24px rgba(197,160,89,0.15)',
                }}
                whileTap={shouldReduce ? undefined : { scale: 0.97 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                transition={{ type: 'spring', stiffness: 320, damping: 22 } as any}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 2rem',
                  background: '#C5A059',
                  color: '#0A1F3D',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  whiteSpace: 'nowrap',
                }}
                className="focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2"
              >
                Começar grátis
                <ArrowRight size={13} strokeWidth={2.5} />
              </motion.a>
            </Magnetic>

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
                gap: '0.4rem',
                padding: '0.85rem 1.5rem',
                border: '1px solid rgba(197,160,89,0.3)',
                color: 'rgba(240,237,232,0.7)',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                background: 'transparent',
                whiteSpace: 'nowrap',
              }}
              className="focus-visible:ring-2 focus-visible:ring-[#489FB5] focus-visible:ring-offset-2"
            >
              Ver o produto
            </motion.a>
          </motion.div>
        </div>

        {/* RIGHT — product live (KanbanMockup in device frame) */}
        <motion.div
          className="md:col-span-7"
          variants={rightColVariants}
          initial={shouldReduce ? false : 'hidden'}
          animate="visible"
        >
          <TiltCard maxTilt={5}>
            <div
              style={{
                position: 'relative',
                borderRadius: '14px',
                padding: '14px',
                background: 'linear-gradient(135deg, rgba(197,160,89,0.14) 0%, rgba(72,159,181,0.14) 100%)',
                border: '1px solid rgba(197,160,89,0.2)',
                boxShadow: '0 32px 90px rgba(0,0,0,0.55), 0 0 70px rgba(197,160,89,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '16 / 10', minHeight: '300px' }}>
                <KanbanMockup animate={!shouldReduce} />
              </div>

              {/* Ambient glow below */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '-44px',
                  left: '12%',
                  right: '12%',
                  height: '56px',
                  background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.28) 0%, transparent 70%)',
                  filter: 'blur(22px)',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 z-10">
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.55rem',
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
              style={{
                width: '1px',
                height: '6px',
                background: '#C5A059',
                borderRadius: '1px',
                animation: `fade-pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
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
