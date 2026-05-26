import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function createLenis(): Lenis {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.2,
  })

  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    ;(window as unknown as { __lenis: Lenis }).__lenis = lenisInstance
  }

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}
