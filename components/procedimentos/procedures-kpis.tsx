'use client'

import { Sparkles, Smile, PersonStanding, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPIs {
  totalAtivos: number
  faciais: number
  corporais: number
  capilares: number
  outros: number
}

// Mapeamento dinâmico de cores dos KPIs para vitrines de joias e glows sutis
const getKpiStyling = (label: string) => {
  const lbl = label.toLowerCase()
  if (lbl.includes('faciais')) {
    return {
      glow: 'hover:shadow-[0_20px_40px_rgba(236,72,153,0.06)] hover:border-pink-300/30',
      iconBg: 'bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400',
      valueClass: 'text-pink-700 dark:text-pink-400',
    }
  }
  if (lbl.includes('corporais')) {
    return {
      glow: 'hover:shadow-[0_20px_40px_rgba(59,130,246,0.06)] hover:border-blue-300/30',
      iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
      valueClass: 'text-blue-700 dark:text-blue-400',
    }
  }
  if (lbl.includes('capilares')) {
    return {
      glow: 'hover:shadow-[0_20px_40px_rgba(245,158,11,0.06)] hover:border-amber-300/30',
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      valueClass: 'text-amber-700 dark:text-amber-400',
    }
  }
  // Total ativos
  return {
    glow: 'hover:shadow-[0_20px_40px_rgba(197,160,89,0.06)] hover:border-[#C5A059]/30',
    iconBg: 'bg-[#C5A059]/10 border-[#C5A059]/20 text-[#C5A059]',
    valueClass: 'text-slate-800 dark:text-slate-200',
  }
}

function KpiCard({
  label, value, icon: Icon,
}: {
  label: string
  value: number
  icon: React.ElementType
}) {
  const styles = getKpiStyling(label)

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl',
      'shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:bg-white/70 dark:hover:bg-slate-900/60 hover:-translate-y-1 transition-all duration-300 group',
      styles.glow
    )}>
      {/* Double border de seda */}
      <div className="absolute inset-0.5 border border-white/60 dark:border-white/10 rounded-[14px] pointer-events-none" />

      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <p className={cn(
              'text-3xl font-black tracking-tight truncate font-serif',
              styles.valueClass
            )}>
              {value}
            </p>
          </div>
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-transform duration-300 group-hover:scale-105',
            styles.iconBg
          )}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProceduresKpis({ kpis }: { kpis: KPIs }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total ativos"
        value={kpis.totalAtivos}
        icon={Sparkles}
      />
      <KpiCard
        label="Faciais"
        value={kpis.faciais}
        icon={Smile}
      />
      <KpiCard
        label="Corporais"
        value={kpis.corporais}
        icon={PersonStanding}
      />
      <KpiCard
        label="Capilares / Outros"
        value={kpis.capilares + kpis.outros}
        icon={Scissors}
      />
    </div>
  )
}
