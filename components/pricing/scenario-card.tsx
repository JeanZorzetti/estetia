import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { resolveIcon } from './icon-resolver'
import { formatBRL } from '@/lib/pricing/calculator'
import { cn } from '@/lib/utils'

interface Props {
  icon: string
  title: string
  subtitle: string
  modules: string[]
  totalCents: number
  highlight?: boolean
}

export function ScenarioCard({ icon, title, subtitle, modules, totalCents, highlight }: Props) {
  const Icon = resolveIcon(icon)
  return (
    <Card className={cn(
      'relative overflow-hidden backdrop-blur-md transition-all duration-300 p-6 h-full flex flex-col justify-between gap-5 rounded-2xl border',
      highlight
        ? 'bg-white/80 dark:bg-slate-900/70 border-[#C5A059]/60 ring-2 ring-[#C5A059] shadow-xl shadow-[#C5A059]/5 md:scale-[1.03] z-10'
        : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-white/5 hover:border-[#489FB5]/30 hover:shadow-xl hover:-translate-y-1'
    )}>
      {/* Top soft gradient glow line for highlighted card */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-[2.5px] transition-opacity duration-300 rounded-t-2xl',
        highlight ? 'bg-gradient-to-r from-[#C5A059] to-[#9E7D3B]' : 'bg-gradient-to-r from-[#489FB5]/40 to-[#C5A059]/40 opacity-0 group-hover:opacity-100'
      )} />

      {highlight && (
        <span className="absolute top-4 right-4 text-[9px] font-extrabold text-white bg-gradient-to-r from-[#C5A059] to-[#9E7D3B] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          Recomendado
        </span>
      )}

      <div className="flex flex-col gap-4">
        <div className={cn(
          'w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300',
          highlight ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'bg-[#489FB5]/10 text-[#489FB5]'
        )}>
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-serif font-bold text-base text-[#0A1F3D] dark:text-white tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <ul className="flex flex-col gap-2 pt-2">
          {modules.map(m => (
            <li key={m} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-450 font-sans font-medium leading-relaxed">
              <Check className="w-4 h-4 mt-0.5 text-[#489FB5] flex-shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
        <span className="text-[9px] font-bold text-[#489FB5] uppercase tracking-wider block mb-1">
          Investimento sugerido
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold tracking-tight text-[#0A1F3D] dark:text-white font-sans tabular-nums">
            {formatBRL(totalCents)}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/mês</span>
        </div>
      </div>
    </Card>
  )
}

