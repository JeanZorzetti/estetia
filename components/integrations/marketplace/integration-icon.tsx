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
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: { box: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { box: 'h-10 w-10', icon: 'h-5 w-5' },
  lg: { box: 'h-12 w-12', icon: 'h-6 w-6' },
} as const

export function IntegrationIcon({ icon, size = 'md', className }: Props) {
  const s = SIZES[size]

  if (icon.type === 'brand') {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40',
          s.box,
          className
        )}
        style={{ backgroundColor: `${icon.hex}1A` }} // 10% opacity hex suffix
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
