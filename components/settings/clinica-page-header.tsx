import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, type LucideIcon, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function ClinicaPageHeader({ title, description, icon: Icon, iconBg, iconColor }: Props) {
  // Obter a gema tridimensional brilhante correspondente ao acento da página
  const getThreeDimensionalGemma = (colorClass: string) => {
    if (colorClass.includes('teal')) {
      return 'bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 text-white border-teal-300/40 shadow-[0_4px_12px_rgba(20,184,166,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_12px_rgba(20,184,166,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)]'
    }
    if (colorClass.includes('emerald')) {
      return 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 text-white border-emerald-300/40 shadow-[0_4px_12px_rgba(16,185,129,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)]'
    }
    if (colorClass.includes('blue')) {
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white border-blue-300/40 shadow-[0_4px_12px_rgba(59,130,246,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)]'
    }
    if (colorClass.includes('amber')) {
      return 'bg-gradient-to-br from-amber-400 via-amber-500 to-[#9A7D42] text-white border-[#C5A059]/40 shadow-[0_4px_12px_rgba(245,158,11,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)]'
    }
    return 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-700 text-white border-slate-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] shadow-md'
  }

  const gemmaClass = getThreeDimensionalGemma(iconColor)

  return (
    <div className="space-y-4 pb-4.5 border-b border-slate-200/40 dark:border-slate-800/40">
      {/* Botão voltar glassmorphic */}
      <div>
        <Link href="/dashboard/settings">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 -ml-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-slate-800/40 hover:bg-[#C5A059]/10 hover:border-[#C5A059]/25 hover:text-[#9A7D42] dark:hover:text-[#E2C799] shadow-sm backdrop-blur-xl transition-all duration-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="font-semibold text-xs tracking-wide">Configurações</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-start gap-4">
        {/* Gema 3D */}
        <div
          className={cn(
            'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border overflow-hidden transition-all duration-500 hover:scale-105 shadow-md',
            gemmaClass
          )}
        >
          {/* Reflexo luminoso da gema */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          <Icon className="h-5.5 w-5.5 drop-shadow-[0_1px_2.5px_rgba(0,0,0,0.15)]" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl md:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              {title}
            </h1>
            <Crown className="h-3.5 w-3.5 text-[#C5A059] opacity-75 shrink-0" />
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
