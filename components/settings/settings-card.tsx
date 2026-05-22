import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props {
  href?: string
  onClick?: () => void
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  description?: string
  badge?: ReactNode
  external?: boolean
}

export function SettingsCard({
  href,
  onClick,
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  badge,
  external,
}: Props) {
  // Extrair o acento semântico para gerar o glow tátil
  const getSemanticGlow = (colorClass: string) => {
    if (colorClass.includes('teal')) return 'group-hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(20,184,166,0.1)] group-hover:border-teal-500/30'
    if (colorClass.includes('emerald')) return 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/30'
    if (colorClass.includes('blue')) return 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] group-hover:border-blue-500/30'
    if (colorClass.includes('amber')) return 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] group-hover:border-amber-500/30'
    if (colorClass.includes('red')) return 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(239,68,68,0.1)] group-hover:border-red-500/30'
    if (colorClass.includes('purple')) return 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(168,85,247,0.1)] group-hover:border-purple-500/30'
    return 'group-hover:shadow-[0_0_25px_rgba(197,160,89,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(197,160,89,0.1)] group-hover:border-[#C5A059]/30'
  }

  const getSemanticColorGlowBg = (colorClass: string) => {
    if (colorClass.includes('teal')) return 'bg-teal-500/5'
    if (colorClass.includes('emerald')) return 'bg-emerald-500/5'
    if (colorClass.includes('blue')) return 'bg-blue-500/5'
    if (colorClass.includes('amber')) return 'bg-amber-500/5'
    if (colorClass.includes('red')) return 'bg-red-500/5'
    if (colorClass.includes('purple')) return 'bg-purple-500/5'
    return 'bg-[#C5A059]/5'
  }

  const semanticGlow = getSemanticGlow(iconColor)
  const semanticGlowBg = getSemanticColorGlowBg(iconColor)

  const inner = (
    <div
      className={cn(
        'group relative flex items-center gap-4 rounded-2xl border border-white/50 dark:border-white/[0.04] bg-white/40 dark:bg-slate-900/40 p-4.5 h-full w-full',
        'transition-all duration-300 ease-out',
        'hover:bg-white/75 dark:hover:bg-slate-900/65 hover:-translate-y-1 backdrop-blur-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/40 focus-visible:ring-offset-2',
        semanticGlow
      )}
    >
      {/* Moldura interna branca brilhante cristalina (Double Border) */}
      <div className="absolute inset-[1px] rounded-[15px] border border-white/40 dark:border-white/[0.02] pointer-events-none" />

      {/* Glow de fundo reativo */}
      <div className={cn(
        "absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10 pointer-events-none",
        semanticGlowBg
      )} />

      {/* Vitrine de ícone metalizada */}
      <div
        className={cn(
          'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/30 dark:ring-white/[0.02] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] overflow-hidden transition-all duration-300 group-hover:scale-105',
          iconBg,
          iconColor
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <Icon className="h-5 w-5 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.05)]" />
      </div>

      {/* Conteúdo textual */}
      <div className="min-w-0 flex-1 relative z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200 truncate">
            {title}
          </h3>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200 leading-snug line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Pílula circular de Seta Flutuante */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/20 text-slate-400 dark:text-slate-500 group-hover:text-[#9A7D42] dark:group-hover:text-[#E2C799] group-hover:bg-[#C5A059]/15 group-hover:border-[#C5A059]/30 group-hover:translate-x-1 transition-all duration-300 shadow-sm">
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="text-left w-full h-full block focus-visible:outline-none">
        {inner}
      </button>
    )
  }

  if (!href) return inner

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block h-full w-full focus-visible:outline-none">
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className="block h-full w-full focus-visible:outline-none">
      {inner}
    </Link>
  )
}
