import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BrandIcon {
  type: 'brand'
  /** Inline SVG path data from simple-icons (e.g. siMailchimp.path) */
  path: string
  /** Brand hex color (e.g. "#FFE01B"). Used as background tint. */
  hex: string
  /** Brand name for accessibility */
  title: string
}

export interface LucideIconRef {
  type: 'lucide'
  Component: LucideIcon
  /** Tailwind classes for icon color (e.g. "text-emerald-500") */
  colorClass: string
  /** Tailwind classes for bg tint (e.g. "bg-emerald-500/10") */
  bgClass: string
}

export type IntegrationIconDef = BrandIcon | LucideIconRef

interface Props {
  icon: IntegrationIconDef
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** When true, renders icon white over a solid brand color background */
  inverted?: boolean
  className?: string
}

const SIZES = {
  sm: { box: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { box: 'h-10 w-10', icon: 'h-5 w-5' },
  lg: { box: 'h-12 w-12', icon: 'h-6 w-6' },
  xl: { box: 'h-20 w-20', icon: 'h-12 w-12' },
} as const

/** Returns true if a hex color is perceptually light (luminance > 0.5) */
function isLightColor(hex: string): boolean {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum > 0.55
}

export function IntegrationIcon({ icon, size = 'md', inverted = false, className }: Props) {
  const s = SIZES[size]

  if (icon.type === 'brand') {
    if (inverted) {
      // Solid brand background + white icon
      const fillColor = isLightColor(icon.hex) ? '#000000' : '#ffffff'
      return (
        <div
          className={cn('flex shrink-0 items-center justify-center', s.box, className)}
          aria-label={`Logo ${icon.title}`}
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={s.icon}
            style={{ fill: fillColor }}
            role="img"
          >
            <title>{icon.title}</title>
            <path d={icon.path} />
          </svg>
        </div>
      )
    }

    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40',
          s.box,
          className
        )}
        style={{ backgroundColor: `${icon.hex}1A` }}
        aria-label={`Logo ${icon.title}`}
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={s.icon}
          style={{ fill: icon.hex }}
          role="img"
        >
          <title>{icon.title}</title>
          <path d={icon.path} />
        </svg>
      </div>
    )
  }

  const { Component } = icon

  if (inverted) {
    return (
      <div className={cn('flex shrink-0 items-center justify-center', s.box, className)}>
        <Component className={cn(s.icon, 'text-white')} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40',
        s.box,
        icon.bgClass,
        icon.colorClass,
        className
      )}
    >
      <Component className={s.icon} />
    </div>
  )
}
