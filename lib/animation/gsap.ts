import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

let registered = false

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function connectScrollTriggerToLenis(lenis: Lenis): void {
  registerGsap()

  lenis.on('scroll', ScrollTrigger.update)

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
    pinType: 'transform',
  })

  ScrollTrigger.defaults({ scroller: document.documentElement })

  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

export { gsap, ScrollTrigger }
