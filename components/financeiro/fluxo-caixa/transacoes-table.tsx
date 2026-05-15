'use client'

import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '../guias-tiss/status-badge'

interface Guia {
  id: string
  numeroGuia: string | null
  tipo: string
  status: string
  valorTotal: number | null
  dataExecucao: string | null
  createdAt: string
  operadora: { id: string; nome: string }
  paciente: { id: string; nome: string }
}

interface Props {
  guias: Guia[]
}

const formatBRL = (v: number | null) =>
  v == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export function TransacoesTable({ guias }: Props) {
  const router = useRouter()

  if (guias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">Nenhuma transação no período.</p>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Data</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Paciente</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Operadora</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Valor</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guias.map(g => (
            <TableRow
              key={g.id}
              className="cursor-pointer hover:bg-muted/30"
              onClick={() => router.push(`/dashboard/financeiro/guias-tiss/${g.id}`)}
            >
              <TableCell className="text-xs text-muted-foreground">
                {g.dataExecucao
                  ? new Date(g.dataExecucao).toLocaleDateString('pt-BR')
                  : new Date(g.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-sm font-medium">{g.paciente.nome}</TableCell>
              <TableCell className="text-sm">{g.operadora.nome}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{g.tipo}</TableCell>
              <TableCell className="text-sm tabular-nums font-medium">{formatBRL(g.valorTotal)}</TableCell>
              <TableCell><StatusBadge status={g.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
