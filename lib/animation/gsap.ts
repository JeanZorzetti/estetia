import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

let registered = false
let tickerCallback: ((time: number) => void) | null = null

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function connectScrollTriggerToLenis(lenis: Lenis): void {
  registerGsap()

  lenis.on('scroll', ScrollTrigger.update)

  tickerCallback = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)
}

export function disconnectScrollTriggerFromLenis(): void {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback)
    tickerCallback = null
  }
}

export { gsap, ScrollTrigger }
