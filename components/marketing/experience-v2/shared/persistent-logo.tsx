'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function PersistentLogo() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      const viewportH = window.innerHeight
      const totalH = document.documentElement.scrollHeight - viewportH
      const progress = totalH > 0 ? y / totalH : 0
      setVisible(y > viewportH * 0.6 && progress < 0.95)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        zIndex: 9991,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Link
        href="/"
        data-cursor="link"
        data-cursor-label="Início"
        aria-label="Estetia CRM — Início"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px',
          background: 'rgba(4,8,15,0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(197,160,89,0.18)',
          borderRadius: '2px',
          textDecoration: 'none',
        }}
      >
        <Image
          src="/logos/estetia-logo-nav.png"
          alt=""
          width={24}
          height={24}
          style={{ display: 'block', objectFit: 'contain' }}
        />
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C5A059',
          }}
        >
          Estetia
        </span>
      </Link>
    </motion.div>
  )
}
