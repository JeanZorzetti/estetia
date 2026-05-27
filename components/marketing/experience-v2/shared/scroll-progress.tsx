'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Section {
  id: string
  label: string
}

const SECTIONS: Section[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'product', label: 'Produto' },
  { id: 'features', label: 'Funcionalidades' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'stats', label: 'Métricas' },
  { id: 'journey', label: 'Jornada' },
  { id: 'demo', label: 'Demo' },
  { id: 'closing', label: 'Começar' },
]

const GOLD = '#C5A059'

export function ScrollProgress() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 768px)').matches) return

    setVisible(true)

    let raf = 0

    function update() {
      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const totalH = document.documentElement.scrollHeight - viewportH
      const progress = scrollY / Math.max(totalH, 1)
      const idx = Math.min(Math.floor(progress * SECTIONS.length), SECTIONS.length - 1)
      setActiveIdx(idx)
    }

    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  function scrollToSection(idx: number) {
    const totalH = document.documentElement.scrollHeight - window.innerHeight
    const targetY = (idx / SECTIONS.length) * totalH + 10
    window.scrollTo({ top: targetY, behavior: shouldReduce ? 'auto' : 'smooth' })
  }

  if (!visible) return null

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      aria-label="Navegação por seção"
      style={{
        position: 'fixed',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9990,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
      }}
    >
      {SECTIONS.map((section, i) => {
        const isActive = i === activeIdx
        const isHovered = i === hoveredIdx
        const showLabel = isActive || isHovered

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(i)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            data-cursor="link"
            data-cursor-label={section.label}
            aria-label={`Ir para seção ${section.label}`}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <motion.span
              animate={{
                opacity: showLabel ? 1 : 0,
                x: showLabel ? 0 : 8,
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: GOLD,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {section.label}
            </motion.span>
            <motion.span
              animate={{
                scale: isActive ? 1.1 : 1,
                width: isActive ? 24 : 6,
                background: isActive ? GOLD : 'rgba(240,237,232,0.25)',
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'block',
                height: 2,
                borderRadius: 2,
                pointerEvents: 'none',
              }}
            />
          </button>
        )
      })}
    </motion.nav>
  )
}
