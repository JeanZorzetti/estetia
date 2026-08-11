'use client'

import { useEffect } from 'react'
import logger from '@/lib/logger'

export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          logger.info({ registration }, '[PWA] Service Worker registered:')
        })
        .catch((error) => {
          logger.error({ error }, '[PWA] Service Worker registration failed:')
        })
    }
  }, [])

  return null
}
