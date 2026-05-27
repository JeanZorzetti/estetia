export interface ScrollWatcher {
  destroy: () => void
}

/**
 * Watches a section element and calls onProgress(0–1) as the user scrolls through it.
 *
 * Progress mapping (section height = H, viewport = VH):
 *   - 0   when top of section enters bottom of viewport
 *   - 1   when bottom of section leaves top of viewport
 *
 * Uses native scroll listener (passive) — simpler than Anime.js v4 onScroll and
 * actually fires updates reliably during scroll on Next.js production builds.
 */
export function watchSection(
  el: HTMLElement,
  onProgress: (progress: number) => void,
): ScrollWatcher {
  let rafId = 0
  let pending = false

  function update() {
    pending = false
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    // Total scroll distance during which the section is in view
    const total = rect.height + vh
    // How far we've progressed: 0 when top=vh, 1 when bottom=0
    const traveled = vh - rect.top
    const progress = Math.max(0, Math.min(1, traveled / total))
    onProgress(progress)
  }

  function onScroll() {
    if (pending) return
    pending = true
    rafId = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  // Initial calculation
  update()

  return {
    destroy: () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafId)
    },
  }
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
