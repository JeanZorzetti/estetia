'use client'

import { useRef, ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

interface SpotlightProps {
  children: ReactNode
  color?: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function Spotlight({
  children,
  color = 'rgba(197,160,89,0.12)',
  size = 280,
  className,
  style,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    containerRef.current.style.setProperty('--sx', `${x}px`)
    containerRef.current.style.setProperty('--sy', `${y}px`)
  }

  function handleMouseLeave() {
    if (!containerRef.current) return
    containerRef.current.style.setProperty('--sx', '-999px')
    containerRef.current.style.setProperty('--sy', '-999px')
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        '--sx': '-999px',
        '--sy': '-999px',
        ...style,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          borderRadius: 'inherit',
          background: `radial-gradient(${size}px circle at var(--sx) var(--sy), ${color}, transparent 70%)`,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  )
}
