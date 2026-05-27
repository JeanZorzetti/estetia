'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import {
  LayoutGrid,
  Brain,
  BarChart3,
  Mail,
  Calendar,
  CreditCard,
  type LucideIcon,
} from 'lucide-react'
import { Spotlight } from '../shared/spotlight'
import { TiltCard } from '../shared/tilt-card'
import { KanbanMockup } from '../shared/kanban-mockup'
import { ChartMockup } from '../shared/chart-mockup'
import { InboxMockup } from '../shared/inbox-mockup'
import { CalendarMockup } from '../shared/calendar-mockup'
import { PaymentMockup } from '../shared/payment-mockup'
import { TriageMockup } from '../shared/triage-mockup'
import { BENTO_ITEMS, type MockupKind } from './bento-data'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  Brain,
  BarChart3,
  Mail,
  Calendar,
  CreditCard,
}

function MockupFor({ kind }: { kind: MockupKind }) {
  switch (kind) {
    case 'kanban': return <KanbanMockup animate={false} />
    case 'triage': return <TriageMockup />
    case 'chart': return <ChartMockup />
    case 'inbox': return <InboxMockup />
    case 'calendar': return <CalendarMockup />
    case 'payment': return <PaymentMockup />
  }
}

export function MagneticShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Horizontal travel: 0 → ~-72% (6 cards × 480px + gaps)
  const x = useTransform(scrollYProgress, [0.05, 0.95], ['2%', '-72%'])

  if (shouldReduce) {
    // Reduced motion: render as vertical grid
    return (
      <section
        id="features"
        aria-label="Funcionalidades Estetia"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"
        style={{ background: 'transparent' }}
      >
        <div
          className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
          style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
        >
          03 — Showcase
        </div>

        <div className="relative z-10 text-center mb-12 max-w-2xl">
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C5A059', opacity: 0.7, marginBottom: '0.75rem' }}>
            Tudo em um só lugar
          </p>
          <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 300, fontStyle: 'italic', color: '#F0EDE8', letterSpacing: '-0.02em' }}>
            Cada ferramenta que sua clínica precisa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {BENTO_ITEMS.map(item => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="features"
      ref={sectionRef}
      aria-label="Funcionalidades Estetia"
      style={{
        height: '420vh',
        position: 'relative',
        background: 'transparent',
      }}
    >
      <div
        className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden"
        style={{ background: 'transparent' }}
      >
        {/* Section number */}
        <div
          className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
          style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
        >
          03 — Showcase
        </div>

        {/* Header */}
        <div className="relative z-10 text-center mb-12 px-6 max-w-2xl mx-auto">
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C5A059', opacity: 0.7, marginBottom: '0.75rem' }}>
            Tudo em um só lugar
          </p>
          <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 300, fontStyle: 'italic', color: '#F0EDE8', letterSpacing: '-0.02em' }}>
            Cada ferramenta que sua clínica precisa
          </h2>
        </div>

        {/* Horizontal rail */}
        <motion.div
          style={{
            x,
            display: 'flex',
            gap: '32px',
            paddingLeft: '8vw',
            paddingRight: '8vw',
            width: 'max-content',
          }}
        >
          {BENTO_ITEMS.map(item => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.55rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.35)',
          }}
        >
          <span>Role para explorar</span>
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: '#C5A059' }}
          >
            →
          </motion.span>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ item }: { item: (typeof BENTO_ITEMS)[number] }) {
  const Icon = ICON_MAP[item.iconName] ?? LayoutGrid
  return (
    <div style={{ width: '460px', flexShrink: 0 }}>
      <TiltCard maxTilt={6}>
        <Spotlight color={`${item.accent}22`} size={300} style={{ height: '100%' }}>
          <article
            style={{
              height: '560px',
              padding: '24px',
              borderRadius: '10px',
              border: `1px solid ${item.accent}28`,
              background: 'rgba(10,31,61,0.65)',
              backdropFilter: 'blur(18px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow corner */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '70%',
                height: '40%',
                background: `radial-gradient(ellipse at 80% 0%, ${item.accent}22, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${item.accent}28, ${item.accent}10)`,
                  border: `1px solid ${item.accent}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={item.accent} strokeWidth={1.6} />
              </div>
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: item.accent,
                  background: `${item.accent}14`,
                  padding: '4px 8px',
                  borderRadius: '2px',
                  border: `1px solid ${item.accent}30`,
                }}
              >
                {item.tag}
              </span>
            </div>

            {/* Title + Description */}
            <div>
              <h3
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: '#F0EDE8',
                  letterSpacing: '-0.01em',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.78rem',
                  color: 'rgba(240,237,232,0.5)',
                  lineHeight: 1.55,
                }}
              >
                {item.description}
              </p>
            </div>

            {/* Mockup */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <MockupFor kind={item.mockup} />
            </div>

            {/* Bottom accent */}
            <div
              style={{
                height: '1px',
                background: `linear-gradient(90deg, ${item.accent}80, transparent)`,
                width: '40%',
              }}
            />
          </article>
        </Spotlight>
      </TiltCard>
    </div>
  )
}
