'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const GOLD = '#C5A059'
const TEAL = '#489FB5'

type CursorMode = 'default' | 'link' | 'cta' | 'text'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')
  const [label, setLabel] = useState<string>('')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const ringX = useSpring(x, { stiffness: 380, damping: 28, mass: 0.4 })
  const ringY = useSpring(y, { stiffness: 380, damping: 28, mass: 0.4 })
  const trail1X = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 })
  const trail1Y = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 })
  const trail2X = useSpring(x, { stiffness: 140, damping: 24, mass: 0.6 })
  const trail2Y = useSpring(y, { stiffness: 140, damping: 24, mass: 0.6 })

  const magneticTargetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (reduced || !hasHover) return

    setEnabled(true)
    document.documentElement.style.cursor = 'none'

    let raf = 0
    let lastX = 0
    let lastY = 0

    function handleMove(e: MouseEvent) {
      lastX = e.clientX
      lastY = e.clientY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(applyPosition)
      if (!visible) setVisible(true)
    }

    function applyPosition() {
      const target = magneticTargetRef.current
      if (target) {
        const rect = target.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = lastX - cx
        const dy = lastY - cy
        const dist = Math.hypot(dx, dy)
        const range = Math.max(rect.width, rect.height)
        if (dist < range * 0.8) {
          x.set(cx + dx * 0.35)
          y.set(cy + dy * 0.35)
          return
        }
      }
      x.set(lastX)
      y.set(lastY)
    }

    function findCursorTarget(el: HTMLElement | null): HTMLElement | null {
      let cursor: HTMLElement | null = el
      while (cursor && cursor !== document.body) {
        if (cursor.dataset?.cursor) return cursor
        cursor = cursor.parentElement
      }
      return null
    }

    function handleOver(e: MouseEvent) {
      const target = findCursorTarget(e.target as HTMLElement)
      if (!target) {
        magneticTargetRef.current = null
        setMode('default')
        setLabel('')
        return
      }
      const cursorKind = target.dataset.cursor as CursorMode
      const cursorLabel = target.dataset.cursorLabel ?? ''
      setMode(cursorKind || 'default')
      setLabel(cursorLabel)
      magneticTargetRef.current = cursorKind === 'cta' ? target : null
    }

    function handleLeave() {
      setVisible(false)
      magneticTargetRef.current = null
    }

    function handleEnter() {
      setVisible(true)
    }

    document.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleLeave)
    document.documentElement.addEventListener('mouseenter', handleEnter)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      document.documentElement.removeEventListener('mouseenter', handleEnter)
      document.documentElement.style.cursor = ''
      cancelAnimationFrame(raf)
    }
  }, [x, y, visible])

  if (!enabled) return null

  const isLink = mode === 'link' || mode === 'cta'
  const ringSize = isLink ? 56 : 28

  return (
    <>
      {/* Trail 2 — slowest */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: trail2X,
          y: trail2Y,
          translateX: '-50%',
          translateY: '-50%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: GOLD,
          opacity: visible ? 0.35 : 0,
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'screen',
        }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Trail 1 — medium */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: trail1X,
          y: trail1Y,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: GOLD,
          opacity: visible ? 0.55 : 0,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
        }}
        transition={{ opacity: { duration: 0.2 } }}
      />

      {/* Ring — outer */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1px solid ${isLink ? GOLD : 'rgba(197,160,89,0.45)'}`,
          background: isLink ? 'rgba(197,160,89,0.08)' : 'transparent',
          opacity: visible ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 10000,
          transition: 'width 220ms cubic-bezier(0.22,1,0.36,1), height 220ms cubic-bezier(0.22,1,0.36,1), border-color 200ms ease, background 200ms ease',
          mixBlendMode: 'screen',
        }}
      />

      {/* Core dot */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: GOLD,
          boxShadow: `0 0 12px ${GOLD}, 0 0 24px rgba(197,160,89,0.4)`,
          opacity: visible ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 10001,
          transition: 'opacity 200ms ease',
        }}
      />

      {/* Label */}
      {label && isLink && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            x: ringX,
            y: ringY,
            translateX: '32px',
            translateY: '-50%',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: GOLD,
            background: 'rgba(4,8,15,0.85)',
            padding: '6px 12px',
            borderRadius: '2px',
            border: `1px solid ${GOLD}55`,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            zIndex: 10000,
            whiteSpace: 'nowrap',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.div>
      )}
    </>
  )
}
