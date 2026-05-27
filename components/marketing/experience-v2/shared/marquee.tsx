'use client'

import { useRef, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface MarqueeProps {
  children: ReactNode
  speed?: number
  direction?: 'left' | 'right'
  className?: string
}

export function Marquee({ children, speed = 40, direction = 'left', className }: MarqueeProps) {
  const shouldReduce = useReducedMotion()
  const contentRef = useRef<HTMLDivElement>(null)

  const from = direction === 'left' ? '0%' : '-50%'
  const to = direction === 'left' ? '-50%' : '0%'

  if (shouldReduce) {
    return (
      <div className={className} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '3rem' }}>{children}</div>
      </div>
    )
  }

  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        ref={contentRef}
        style={{ display: 'flex', gap: '3rem', width: 'max-content' }}
        animate={{ x: [from, to] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}
