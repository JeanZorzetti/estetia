import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { resolveIcon } from './icon-resolver'
import { formatBRL } from '@/lib/pricing/calculator'

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
    <Card className={`border-border/60 p-6 h-full flex flex-col gap-4 ${highlight ? 'ring-2 ring-primary shadow-lg' : ''}`}>
      <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-base tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
      </div>
      <ul className="flex flex-col gap-1.5 flex-1">
        {modules.map(m => (
          <li key={m} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <Check className="w-3 h-3 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{m}</span>
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t border-border/40">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tighter tabular-nums">{formatBRL(totalCents)}</span>
          <span className="text-xs text-muted-foreground">/mês</span>
        </div>
      </div>
    </Card>
  )
}
