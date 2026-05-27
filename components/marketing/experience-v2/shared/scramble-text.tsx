'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useInView } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'

interface ScrambleTextProps {
  text: string
  duration?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
  trigger?: boolean
}

export function ScrambleText({
  text,
  duration = 800,
  delay = 0,
  className,
  style,
  trigger,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const shouldReduce = useReducedMotion()
  const hasRun = useRef(false)

  const shouldTrigger = trigger !== undefined ? trigger : inView

  useEffect(() => {
    if (!shouldTrigger || hasRun.current || shouldReduce) return
    hasRun.current = true

    const startTime = performance.now() + delay
    let frame: number

    function step(now: number) {
      const elapsed = Math.max(0, now - startTime)
      const progress = Math.min(elapsed / duration, 1)
      const revealedCount = Math.floor(progress * text.length)

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < revealedCount) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      if (progress < 1) frame = requestAnimationFrame(step)
      else setDisplay(text)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [shouldTrigger, shouldReduce, text, duration, delay])

  return (
    <span ref={ref} className={className} style={style} aria-label={text}>
      {display}
    </span>
  )
}
