'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ParticleBurstProps {
  triggered: boolean
  count?: number
}

interface Particle {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  color: string
  size: number
  delay: number
}

const COLORS = ['#C5A059', '#489FB5', '#E8917A', '#9CAF88', 'rgba(197,160,89,0.6)']

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
    const dist = 60 + Math.random() * 120
    return {
      id: i,
      x: Math.cos(angle) * (10 + Math.random() * 20),
      y: Math.sin(angle) * (10 + Math.random() * 20),
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      color: COLORS[i % COLORS.length],
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.3,
    }
  })
}

export function ParticleBurst({ triggered, count = 32 }: ParticleBurstProps) {
  const shouldReduce = useReducedMotion()
  const particlesRef = useRef<Particle[]>(generateParticles(count))

  if (shouldReduce || !triggered) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}
    >
      {particlesRef.current.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{
            x: p.tx,
            y: p.ty,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 0.9 + Math.random() * 0.4,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}
