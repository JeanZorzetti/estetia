'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useReducedMotion, animate } from 'framer-motion'

interface NumberCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function NumberCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.8,
  className,
  style,
}: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (!inView) return

    if (shouldReduce) {
      if (ref.current) ref.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`
      return
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`
        }
      },
    })

    return () => controls.stop()
  }, [inView, value, duration, prefix, suffix, decimals, motionValue, shouldReduce])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}0{suffix}
    </span>
  )
}
