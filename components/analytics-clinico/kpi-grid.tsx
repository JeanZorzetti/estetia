'use client'

import { KpiCard } from './kpi-card'
import type { KpiDelta } from '@/lib/analytics-clinico/types'

interface KpiGridItem {
  label: string
  value: string
  delta?: KpiDelta
  icon?: React.ElementType
  colorClass?: string
  suffix?: string
}

interface KpiGridProps {
  items: KpiGridItem[]
}

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <KpiCard
          key={item.label}
          label={item.label}
          value={item.value}
          delta={item.delta ? { deltaPct: item.delta.deltaPct, previousValue: item.delta.previousValue } : undefined}
          icon={item.icon}
          colorClass={item.colorClass}
          suffix={item.suffix}
        />
      ))}
    </div>
  )
}
