'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  delta?: {
    deltaPct: number | null
    previousValue: number | null
  }
  icon?: React.ElementType
  colorClass?: string
  suffix?: string
}

export function KpiCard({ label, value, delta, icon: Icon, colorClass, suffix }: KpiCardProps) {
  const hasDelta = delta?.deltaPct !== null && delta?.deltaPct !== undefined
  const isPositive = hasDelta && (delta?.deltaPct ?? 0) > 0
  const isNegative = hasDelta && (delta?.deltaPct ?? 0) < 0

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight tabular-nums truncate">
              {value}
              {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
            </p>
            {hasDelta && (
              <div className={cn(
                'flex items-center gap-1 mt-1.5 text-xs font-medium',
                isPositive && 'text-emerald-600 dark:text-emerald-400',
                isNegative && 'text-red-500 dark:text-red-400',
                !isPositive && !isNegative && 'text-muted-foreground',
              )}>
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
                {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                <span>
                  {isPositive ? '+' : ''}{(delta?.deltaPct ?? 0).toFixed(1)}% vs período anterior
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              colorClass ?? 'bg-primary/10 text-primary',
            )}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
