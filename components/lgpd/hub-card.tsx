import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface KpiItem {
  label: string
  value: string | number
}

interface HubCardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  kpis: KpiItem[]
  colorClass: string
}

export function HubCard({ icon: Icon, title, description, href, kpis, colorClass }: HubCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-border/60">
        <CardContent className="p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', colorClass)}>
              <Icon className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200 mt-1 flex-shrink-0" />
          </div>

          <div>
            <h3 className="font-semibold text-base tracking-tight">{title}</h3>
            <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 border-t border-border/50">
            {kpis.map(kpi => (
              <div key={kpi.label}>
                <p className="text-xs text-muted-foreground leading-tight">{kpi.label}</p>
                <p className="text-base font-bold tracking-tight mt-0.5 truncate">{kpi.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
