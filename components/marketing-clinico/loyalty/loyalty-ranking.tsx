'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RankingEntry {
  rank: number
  patient: { id: string; nome: string; telefone: string | null; fotoPerfil: string | null }
  totalPontos: number
}

interface Props {
  ranking: RankingEntry[]
}

const MEDAL_COLORS = [
  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
]

export function LoyaltyRanking({ ranking }: Props) {
  if (ranking.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 border border-dashed border-border rounded-xl text-center">
        <Trophy className="w-8 h-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Nenhuma transação registrada ainda.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {ranking.map(entry => (
        <Card key={entry.patient.id} className="border-border/60">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
              entry.rank <= 3 ? MEDAL_COLORS[entry.rank - 1] : 'bg-muted text-muted-foreground',
            )}>
              {entry.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{entry.patient.nome}</p>
              {entry.patient.telefone && (
                <p className="text-xs text-muted-foreground">{entry.patient.telefone}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold tabular-nums">{entry.totalPontos.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-muted-foreground">pts</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
