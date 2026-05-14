'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Transaction {
  id: string
  pontos: number
  tipo: 'GANHO' | 'RESGATE' | 'EXPIRACAO'
  descricao: string | null
  createdAt: string
  patient: { id: string; nome: string; telefone: string | null }
}

const TIPO_LABELS: Record<string, string> = { GANHO: 'Ganho', RESGATE: 'Resgate', EXPIRACAO: 'Expiração' }
const TIPO_COLORS: Record<string, string> = {
  GANHO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  RESGATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  EXPIRACAO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

interface Props {
  initialTransactions: Transaction[]
}

export function LoyaltyTransactionsTable({ initialTransactions }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [loading, setLoading] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/loyalty/transactions')
      const data = await res.json()
      setTransactions(data.transactions ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { setTransactions(initialTransactions) }, [initialTransactions])

  if (transactions.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">Nenhuma transação registrada.</p>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      {loading && (
        <div className="flex justify-center p-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Paciente</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Pontos</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Descrição</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-sm">{t.patient.nome}</TableCell>
              <TableCell>
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', TIPO_COLORS[t.tipo])}>
                  {TIPO_LABELS[t.tipo]}
                </span>
              </TableCell>
              <TableCell className={cn('tabular-nums font-semibold text-sm', t.pontos > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                {t.pontos > 0 ? '+' : ''}{t.pontos.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{t.descricao ?? '—'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(t.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
