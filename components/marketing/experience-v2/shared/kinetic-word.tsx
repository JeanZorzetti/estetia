'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface KineticWordProps {
  words: string[]
  intervalMs?: number
  color?: string
}

export function KineticWord({ words, intervalMs = 2500, color = '#C5A059' }: KineticWordProps) {
  const [idx, setIdx] = useState(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const id = setInterval(() => setIdx((i) => (i + 1) % words.length), intervalMs)
    return () => clearInterval(id)
  }, [words.length, intervalMs, shouldReduce])

  if (shouldReduce) {
    return <span style={{ color }}>{words[0]}</span>
  }

  return (
    <span
      style={{
        display: 'inline-block',
        position: 'relative',
        color,
        overflow: 'hidden',
        verticalAlign: 'bottom',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          style={{ display: 'inline-block' }}
          initial={{ y: '0.6em', opacity: 0 }}
          animate={{ y: '0em', opacity: 1 }}
          exit={{ y: '-0.6em', opacity: 0 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as any }}
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
