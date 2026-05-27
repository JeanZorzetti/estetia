'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { animate, stagger } from 'animejs'
import { SNIPPETS } from './snippets-data'

const CYCLE_MS = 4200

// Syntax-highlight the code string
function highlight(code: string) {
  return code
    .replace(/\/\/.*/g, (m) => `<span style="color:rgba(240,237,232,0.3)">${m}</span>`)
    .replace(/\b(animate|stagger|morphTo|Math\.round)\b/g, '<span style="color:#489FB5">$1</span>')
    .replace(/\b(duration|ease|delay|opacity|scale|innerHTML|modifier|from|d)\b/g, '<span style="color:#C5A059">$1</span>')
    .replace(/'([^']+)'/g, '<span style="color:#a8d8b2">\'$1\'</span>')
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span style="color:#f4a76f">$1</span>')
}

function DemoMorph() {
  const pathRef = useRef<SVGPathElement>(null)
  const frameRef = useRef<number>(0)
  const tRef = useRef(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    function tick() {
      tRef.current += 0.012
      const t = tRef.current
      const r = 28 + Math.sin(t * 1.7) * 10
      const pts: [number, number][] = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        const rr = r + Math.sin(t * 2.3 + i * 1.2) * 8
        return [50 + Math.cos(a) * rr, 50 + Math.sin(a) * rr]
      })
      const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
      if (pathRef.current) pathRef.current.setAttribute('d', d)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [shouldReduce])

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="morphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#489FB5" />
        </linearGradient>
      </defs>
      <path ref={pathRef} fill="none" stroke="url(#morphGrad)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function DemoStagger() {
  const cellsRef = useRef<(HTMLDivElement | null)[]>([])
  const didAnimate = useRef(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (didAnimate.current || shouldReduce) return
    didAnimate.current = true
    const cells = cellsRef.current.filter(Boolean) as HTMLDivElement[]
    cells.forEach(c => { c.style.opacity = '0'; c.style.transform = 'scale(0)' })
    setTimeout(() => {
      animate(cells, {
        scale: [0, 1],
        opacity: [0, 1],
        delay: stagger(55, { from: 'center' }),
        duration: 450,
        ease: 'outBack(1.4)',
      })
    }, 300)
  }, [shouldReduce])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px',
        width: '100%',
        height: '100%',
        placeContent: 'center',
        padding: '8px',
      }}
    >
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          ref={(el) => { cellsRef.current[i] = el }}
          style={{
            aspectRatio: '1',
            borderRadius: '4px',
            background: i % 3 === 0
              ? 'rgba(197,160,89,0.6)'
              : i % 3 === 1
              ? 'rgba(72,159,181,0.5)'
              : 'rgba(240,237,232,0.15)',
          }}
        />
      ))}
    </div>
  )
}

function DemoCounter({ active }: { active: boolean }) {
  const elRef = useRef<HTMLDivElement>(null)
  const didAnimate = useRef(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (!active || didAnimate.current) return
    didAnimate.current = true
    if (shouldReduce) {
      if (elRef.current) elRef.current.textContent = '+340%'
      return
    }
    const obj = { val: 0 }
    animate(obj, {
      val: [0, 340],
      duration: 1800,
      ease: 'outExpo',
      onUpdate: () => { if (elRef.current) elRef.current.textContent = `+${Math.round(obj.val)}%` },
    })
  }, [active, shouldReduce])

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        ref={elRef}
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#C5A059',
          letterSpacing: '-0.03em',
        }}
      >
        +0%
      </div>
    </div>
  )
}

function LiveDemo({ type, active }: { type: 'morph' | 'stagger' | 'counter'; active: boolean }) {
  if (type === 'morph') return <DemoMorph />
  if (type === 'stagger') return <DemoStagger />
  return <DemoCounter active={active} />
}

export function CodeDrivingDemo() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [typewritten, setTypewritten] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReduce = useReducedMotion()

  function typeCode(code: string) {
    setTypewritten('')
    setIsTyping(true)
    let i = 0
    function step() {
      i++
      setTypewritten(code.slice(0, i))
      if (i < code.length) typeRef.current = setTimeout(step, shouldReduce ? 0 : 18)
      else setIsTyping(false)
    }
    typeRef.current = setTimeout(step, 100)
  }

  useEffect(() => {
    typeCode(SNIPPETS[activeIdx].code)
    return () => { if (typeRef.current) clearTimeout(typeRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx])

  // Auto-cycle
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % SNIPPETS.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  const snippet = SNIPPETS[activeIdx]

  return (
    <section
      aria-label="Demo de código ao vivo"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"
      style={{ background: 'transparent' }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 z-10 text-[10px] tracking-[0.4em] uppercase opacity-30"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#C5A059' }}
      >
        06 — Demo
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
          Animações que encantam
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
          Código que ganha vida
        </h2>
      </div>

      {/* Tab selector */}
      <div className="relative z-10 flex gap-2 mb-8">
        {SNIPPETS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIdx(i)}
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
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
        {/* Code panel */}
        <div
          style={{
            background: 'rgba(4,8,15,0.9)',
            border: '1px solid rgba(197,160,89,0.15)',
            borderRadius: '8px',
            padding: '1.5rem',
            backdropFilter: 'blur(20px)',
            minHeight: '220px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Window dots */}
          <div className="flex gap-2 mb-4">
            {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
          </div>

          <pre
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '0.72rem',
              lineHeight: 1.7,
              color: '#F0EDE8',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
            dangerouslySetInnerHTML={{ __html: highlight(typewritten) + (isTyping ? '<span style="animation:blink 0.8s ease infinite">▌</span>' : '') }}
          />
        </div>

        {/* Live demo panel */}
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
            {snippet.title} — ao vivo
          </p>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                className="w-full h-full"
                style={{ minHeight: '140px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <LiveDemo type={snippet.demo} active={!isTyping} />
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
