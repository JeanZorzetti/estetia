'use client'

import { useEffect, useState } from 'react'
import type Lenis from 'lenis'
import { getLenis } from './lenis'

export function useLenis(): Lenis | null {
  const [lenis, setLenis] = useState<Lenis | null>(() => getLenis())

  useEffect(() => {
    if (lenis) return
    const id = window.requestAnimationFrame(() => setLenis(getLenis()))
    return () => window.cancelAnimationFrame(id)
  }, [lenis])

  return lenis
}
