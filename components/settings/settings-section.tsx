import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  description?: string
  children: ReactNode
}

export function SettingsSection({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  description,
  children,
}: Props) {
  // Obter um gradiente metálico tridimensional brilhante de acordo com o acento da seção
  const getThreeDimensionalGemma = (colorClass: string) => {
    if (colorClass.includes('teal')) {
      return 'bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 text-white border-teal-300/40 shadow-[0_4px_12px_rgba(20,184,166,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_12px_rgba(20,184,166,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)]'
    }
    if (colorClass.includes('emerald')) {
      return 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 text-white border-emerald-300/40 shadow-[0_4px_12px_rgba(16,185,129,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)]'
    }
    if (colorClass.includes('blue')) {
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white border-blue-300/40 shadow-[0_4px_12px_rgba(59,130,246,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_12px_rgba(59,130,246,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)]'
    }
    if (colorClass.includes('amber')) {
      return 'bg-gradient-to-br from-amber-400 via-amber-500 to-[#9A7D42] text-white border-[#C5A059]/40 shadow-[0_4px_12px_rgba(245,158,11,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_12px_rgba(245,158,11,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)]'
    }
    if (colorClass.includes('red')) {
      return 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 text-white border-red-300/40 shadow-[0_4px_12px_rgba(239,68,68,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_12px_rgba(239,68,68,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)]'
    }
    if (colorClass.includes('purple')) {
      return 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 text-white border-purple-300/40 shadow-[0_4px_12px_rgba(168,85,247,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_12px_rgba(168,85,247,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)]'
    }
    return 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-700 text-white border-slate-300/40 shadow-[0_4px_12px_rgba(100,116,139,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)]'
  }

  const gemmaClass = getThreeDimensionalGemma(iconColor)

  return (
    <section className="space-y-4 group">
      {/* Cabeçalho da Seção com Gemas Tridimensionais e Serif Clássico */}
      <div className="flex items-center gap-3 pb-1">
        <div
          className={cn(
            'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 group-hover:scale-110 overflow-hidden',
            gemmaClass
          )}
        >
          {/* Brilho reflexivo diagonal na gema */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          <Icon className="h-4 w-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-sm font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase transition-colors duration-200">
            {label}
          </h2>
          {description && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 tracking-wide leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  )
}
