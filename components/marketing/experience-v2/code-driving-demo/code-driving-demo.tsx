'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { KanbanMockup } from '../shared/kanban-mockup'
import { CalendarMockup } from '../shared/calendar-mockup'
import { PaymentMockup } from '../shared/payment-mockup'

const CYCLE_MS = 4500

interface DemoScenario {
  id: string
  label: string
  title: string
  action: string   // what the "action line" shows (typewriter)
  result: string   // result label shown below action
  mockup: 'kanban' | 'calendar' | 'payment'
}

const SCENARIOS: DemoScenario[] = [
  {
    id: 'patient',
    label: 'Novo paciente',
    title: 'Pipeline de pacientes',
    action: 'Maria Souza — Botox · Avaliação',
    result: '→ Card adicionado ao Kanban',
    mockup: 'kanban',
  },
  {
    id: 'schedule',
    label: 'Agendamento',
    title: 'Agenda inteligente',
    action: 'Retorno: Pedro Lima · Qui 14h',
    result: '→ Slot bloqueado na agenda',
    mockup: 'calendar',
  },
  {
    id: 'payment',
    label: 'Pagamento',
    title: 'Cobrança integrada',
    action: 'Cobrança enviada: R$ 850,00 · PIX',
    result: '→ Confirmação em tempo real',
    mockup: 'payment',
  },
]

function MockupPanel({ mockup, active }: { mockup: DemoScenario['mockup']; active: boolean }) {
  if (mockup === 'kanban') return <KanbanMockup animate={active} />
  if (mockup === 'calendar') return <CalendarMockup />
  return <PaymentMockup />
}

// Typewriter that types a string char by char
function Typewriter({ text, active, speed = 38 }: { text: string; active: boolean; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const shouldReduce = useReducedMotion()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) return
    setDisplayed('')
    if (shouldReduce) { setDisplayed(text); return }
    let i = 0
    const step = () => {
      i++
      setDisplayed(text.slice(0, i))
      if (i < text.length) timerRef.current = setTimeout(step, speed)
    }
    timerRef.current = setTimeout(step, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, text])

  return (
    <span>
      {displayed}
      {active && displayed.length < text.length && (
        <span style={{ animation: 'blink 0.8s ease infinite' }}>▌</span>
      )}
    </span>
  )
}

export function CodeDrivingDemo() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [typing, setTyping] = useState(true)
  const shouldReduce = useReducedMotion()

  // Reset typing state when scenario changes
  useEffect(() => {
    setTyping(true)
    const t = setTimeout(() => setTyping(false), SCENARIOS[activeIdx].action.length * 38 + 800)
    return () => clearTimeout(t)
  }, [activeIdx])

  // Auto-cycle
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % SCENARIOS.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  const scenario = SCENARIOS[activeIdx]

  return (
    <section
      id="demo"
      aria-label="Demo do produto Estetia"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"
      style={{ background: 'transparent' }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        07 — Demo
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12 max-w-xl">
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
          Veja o Estetia em ação
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
          Cada ação, uma tarefa a menos
        </h2>
      </div>

      {/* Tab selector */}
      <div className="relative z-10 flex gap-2 mb-8 flex-wrap justify-center">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIdx(i)}
            aria-pressed={i === activeIdx}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '0.4rem 1rem',
              borderRadius: '2px',
              border: `1px solid ${i === activeIdx ? '#C5A059' : 'rgba(240,237,232,0.1)'}`,
              background: i === activeIdx ? 'rgba(197,160,89,0.12)' : 'transparent',
              color: i === activeIdx ? '#C5A059' : 'rgba(240,237,232,0.4)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Split pane */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* LEFT — action panel (replaces code editor) */}
        <div
          style={{
            background: 'rgba(4,8,15,0.9)',
            border: '1px solid rgba(197,160,89,0.15)',
            borderRadius: '8px',
            padding: '1.5rem',
            backdropFilter: 'blur(20px)',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Window dots */}
          <div className="flex gap-2 mb-4">
            {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
          </div>

          {/* App bar */}
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'rgba(240,237,232,0.25)',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            estetia / {scenario.title.toLowerCase()}
          </div>

          {/* Action line — typewriter */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`action-${activeIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {/* Input field mockup */}
              <div
                style={{
                  background: 'rgba(10,31,61,0.6)',
                  border: '1px solid rgba(197,160,89,0.2)',
                  borderRadius: '4px',
                  padding: '0.65rem 0.85rem',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: '0.78rem',
                  color: '#F0EDE8',
                  minHeight: '46px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typewriter text={scenario.action} active={true} speed={36} key={`tw-${activeIdx}`} />
              </div>

              {/* Result badge — appears after typing */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={!typing ? { opacity: 1, x: 0 } : { opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  background: 'rgba(72,159,181,0.1)',
                  border: '1px solid rgba(72,159,181,0.25)',
                  borderRadius: '3px',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: '#489FB5',
                  letterSpacing: '0.05em',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12 L10 17 L19 7" stroke="#489FB5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {scenario.result}
              </motion.div>

              {/* Label hint */}
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.6rem',
                  color: 'rgba(240,237,232,0.2)',
                  letterSpacing: '0.12em',
                  marginTop: 'auto',
                }}
              >
                atualização em tempo real →
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — live product mockup */}
        <div
          style={{
            background: 'rgba(10,31,61,0.7)',
            border: '1px solid rgba(72,159,181,0.15)',
            borderRadius: '8px',
            padding: '1.5rem',
            backdropFilter: 'blur(16px)',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#489FB5',
              opacity: 0.7,
              marginBottom: '1rem',
            }}
          >
            {scenario.title} — ao vivo
          </p>

          <div style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`mockup-${activeIdx}`}
                className="w-full"
                style={{ minHeight: '140px' }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <MockupPanel mockup={scenario.mockup} active={!shouldReduce} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  )
}
