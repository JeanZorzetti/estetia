'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { KanbanMockup } from '../shared/kanban-mockup'
import { TiltCard } from '../shared/tilt-card'

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const deviceRotate = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [18, 0, 0, -10])
  const deviceY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -40])

  return (
    <section
      id="product"
      ref={sectionRef}
      aria-label="Produto Estetia ao vivo"
      className="relative min-h-screen flex items-center overflow-hidden py-24 px-6"
      style={{ background: 'transparent' }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        02 — Produto
      </div>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 75% 50%, rgba(197,160,89,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        {/* Left — copy */}
        <div className="md:col-span-5">
          <motion.p
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#C5A059',
              opacity: 0.7,
              marginBottom: '1rem',
            }}
          >
            O produto, ao vivo
          </motion.p>

          <motion.h2
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#F0EDE8',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
            }}
          >
            Cada paciente, <br />
            <span style={{ color: '#C5A059' }}>uma jornada visível.</span>
          </motion.h2>

          <motion.p
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 400,
              color: 'rgba(240,237,232,0.55)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              maxWidth: '420px',
            }}
          >
            O Kanban clínico do Estetia transforma a rotina da sua clínica numa
            narrativa visual. Cada card é um paciente; cada coluna, um momento do
            cuidado. Arraste, priorize, jamais perca um follow-up.
          </motion.p>

          <motion.a
            href="/cadastro"
            data-cursor="cta"
            data-cursor-label="Conhecer"
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={shouldReduce ? undefined : { x: 6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C5A059',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid rgba(197,160,89,0.3)',
            }}
          >
            Ver o Kanban completo
            <ArrowRight size={14} strokeWidth={2} />
          </motion.a>
        </div>

        {/* Right — device frame with Kanban */}
        <div className="md:col-span-7">
          <motion.div
            style={{
              rotateY: shouldReduce ? 0 : deviceRotate,
              y: shouldReduce ? 0 : deviceY,
              transformPerspective: 1400,
              transformStyle: 'preserve-3d',
            }}
          >
            <TiltCard maxTilt={5}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  padding: '14px',
                  background:
                    'linear-gradient(135deg, rgba(197,160,89,0.16) 0%, rgba(72,159,181,0.16) 100%)',
                  border: '1px solid rgba(197,160,89,0.22)',
                  boxShadow:
                    '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(197,160,89,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 10',
                    minHeight: '320px',
                  }}
                >
                  <KanbanMockup animate={!shouldReduce} />
                </div>

                {/* Glow under */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '15%',
                    right: '15%',
                    height: '60px',
                    background:
                      'radial-gradient(ellipse at center, rgba(197,160,89,0.3) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                    zIndex: -1,
                  }}
                />
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
