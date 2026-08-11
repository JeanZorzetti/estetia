'use client'

import { useEffect, useRef } from 'react'
import logger from '@/lib/logger'

interface PerfMonitorProps {
  pageLabel: string
  rowCount: number
}

/**
 * Mounts on the client and reports:
 * - Time from navigation start to mount (TTI proxy)
 * - Time the React tree took to commit
 * - Long Tasks (>50ms blocks on main thread) via PerformanceObserver
 * - Any layout shifts (CLS)
 *
 * Open DevTools → Console to see [PERF-CLIENT] entries.
 * Run window.__perfReport() in console for a summary.
 */
export function PerfMonitor({ pageLabel, rowCount }: PerfMonitorProps) {
  const mountStartRef = useRef<number>(performance.now())
  const longTasksRef = useRef<Array<{ duration: number; startTime: number; name: string }>>([])

  useEffect(() => {
    const mountedAt = performance.now()
    const mountDuration = mountedAt - mountStartRef.current

    // Get navigation timing
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const navTimings = nav
      ? {
          'TTFB (ms)': (nav.responseStart - nav.requestStart).toFixed(0),
          'DOM Interactive (ms)': nav.domInteractive.toFixed(0),
          'DOM Complete (ms)': nav.domComplete.toFixed(0),
          'Load Event (ms)': nav.loadEventEnd.toFixed(0),
        }
      : {}

    console.group(`%c[PERF-CLIENT] ${pageLabel} — ${rowCount} rows`, 'background: #4f46e5; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold')
    logger.info({ data1: mountDuration.toFixed(1), data2: 'ms' }, 'Mount duration (since module load):')
    console.table(navTimings)
    console.groupEnd()

    // Observe long tasks
    let observer: PerformanceObserver | undefined
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasksRef.current.push({
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          })
          if (entry.duration > 100) {
            logger.warn({ data1: 'color: #ef4444; font-weight: bold', data2: `at ${entry.startTime.toFixed(0)}ms (name: ${entry.name})` }, `%c[PERF-CLIENT] ⚠ Long Task ${entry.duration.toFixed(0)}ms`)
          }
        }
      })
      observer.observe({ type: 'longtask', buffered: true })
    } catch {
      // Browser doesn't support longtask
    }

    // INP-like: measure interaction latency
    let interactionObserver: PerformanceObserver | undefined
    try {
      interactionObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & { interactionId?: number; processingStart?: number; processingEnd?: number }
          if (e.duration > 50) {
            logger.warn({ data1: 'color: #f59e0b; font-weight: bold', data2: { name: e.name, duration: e.duration, processingDelay: (e.processingStart ?? 0) - e.startTime } }, `%c[PERF-CLIENT] ⚠ Slow Interaction ${e.duration.toFixed(0)}ms`)
          }
        }
      })
      interactionObserver.observe({ type: 'event', buffered: true, durationThreshold: 50 } as PerformanceObserverInit)
    } catch {
      // Older browsers
    }

    // Expose a window-level debug report
    if (typeof window !== 'undefined') {
      ;(window as any).__perfReport = () => {
        const tasks = longTasksRef.current.slice().sort((a, b) => b.duration - a.duration)
        console.group(`%c[PERF-REPORT] ${pageLabel}`, 'background: #16a34a; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold')
        logger.info({ length: tasks.length }, 'Total long tasks:')
        logger.info({ data1: tasks.reduce((s, t) => s + t.duration, 0).toFixed(0), data2: 'ms' }, 'Sum of long tasks:')
        logger.info('Top 10 longest tasks:')
        console.table(tasks.slice(0, 10).map(t => ({
          'duration(ms)': t.duration.toFixed(0),
          'startTime(ms)': t.startTime.toFixed(0),
          name: t.name,
        })))
        console.groupEnd()
        return tasks
      }
      logger.info({ data: 'color: #6366f1' }, '%c[PERF] Run window.__perfReport() to see long task breakdown')
    }

    return () => {
      observer?.disconnect()
      interactionObserver?.disconnect()
    }
  }, [pageLabel, rowCount])

  return null
}
