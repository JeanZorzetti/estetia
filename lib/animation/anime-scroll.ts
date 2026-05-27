import { onScroll } from 'animejs'
import type { ScrollObserver } from 'animejs'

export interface ScrollWatcher {
  destroy: () => void
}

/**
 * Watches a section element and calls onProgress(0–1) as the user scrolls through it.
 * Uses Anime.js v4 onScroll — no ScrollTrigger, no Lenis needed.
 */
export function watchSection(
  el: HTMLElement,
  onProgress: (progress: number) => void,
): ScrollWatcher {
  const watcher = onScroll({
    target: el,
    enter: 'top bottom',
    leave: 'bottom top',
    onUpdate: (self: ScrollObserver) => onProgress(self.progress),
  })
  return {
    destroy: () => watcher.revert(),
  }
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
