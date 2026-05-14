import Image from 'next/image'
import { cn } from '@/lib/utils'

type LogoVariant = 'full' | 'icon' | 'wordmark'

interface LogoProps {
  variant?: LogoVariant
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

const VARIANT_CONFIG: Record<LogoVariant, { src: string; defaultWidth: number; defaultHeight: number }> = {
  full:     { src: '/logos/estetia-logo.png', defaultWidth: 160, defaultHeight: 160 },
  icon:     { src: '/logos/estetia-logo.png', defaultWidth: 40,  defaultHeight: 40 },
  wordmark: { src: '/logos/estetia-logo.png', defaultWidth: 48,  defaultHeight: 48 },
}

export function Logo({ variant = 'full', className, priority = false, width, height }: LogoProps) {
  const config = VARIANT_CONFIG[variant]
  const w = width ?? config.defaultWidth
  const h = height ?? config.defaultHeight

  return (
    <Image
      src={config.src}
      alt="Estetia CRM"
      width={w}
      height={h}
      className={cn('object-contain', className)}
      priority={priority}
    />
  )
}
