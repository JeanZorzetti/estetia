'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, ArrowUpRight } from 'lucide-react'

interface Props {
  totalGasto: number
  mes: string
}

export function AdsSnapshot({ totalGasto, mes }: Props) {
  return (
    <Link href="/dashboard/marketing/campaigns" className="group block">
      <Card className="border-border/60 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gasto em Ads · {mes}</p>
              <p className="font-semibold text-sm">
                {totalGasto > 0
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGasto)
                  : 'Nenhum gasto registrado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            <span>Ver Ads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
