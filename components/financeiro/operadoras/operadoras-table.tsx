'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import { TipoBadge } from './tipo-badge'
import { cn } from '@/lib/utils'

interface Operadora {
  id: string
  nome: string
  codigoAns: string | null
  cnpj: string | null
  tipo: string
  prazoRepasseDias: number | null
  ativo: boolean
  _count: { convenios: number; guias: number }
}

interface Props {
  initialOperadoras: Operadora[]
}

export function OperadorasTable({ initialOperadoras }: Props) {
  const router = useRouter()
  const [operadoras, setOperadoras] = useState<Operadora[]>(initialOperadoras)
  const [toggling, setToggling] = useState<string | null>(null)

  const toggleAtivo = async (op: Operadora) => {
    setToggling(op.id)
    try {
      const res = await fetch(`/api/operadoras/${op.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !op.ativo }),
      })
      if (res.ok) {
        setOperadoras(prev => prev.map(o => o.id === op.id ? { ...o, ativo: !o.ativo } : o))
        router.refresh()
      }
    } finally {
      setToggling(null)
    }
  }

  if (operadoras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">Nenhuma operadora cadastrada.</p>
        <Link href="/dashboard/financeiro/operadoras/nova">
          <Button size="sm" variant="outline">Criar primeira operadora</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Nome</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Código ANS</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Prazo</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Convênios</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Guias</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operadoras.map(op => (
            <TableRow
              key={op.id}
              className={cn('hover:bg-muted/30 transition-colors cursor-pointer', !op.ativo && 'opacity-60')}
              onClick={e => {
                if ((e.target as HTMLElement).closest('[data-no-row-click]')) return
                router.push(`/dashboard/financeiro/operadoras/${op.id}/editar`)
              }}
            >
              <TableCell className="font-medium text-sm">{op.nome}</TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">{op.codigoAns ?? '—'}</TableCell>
              <TableCell><TipoBadge tipo={op.tipo} /></TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {op.prazoRepasseDias ? `${op.prazoRepasseDias}d` : '—'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">{op._count.convenios}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">{op._count.guias}</Badge>
              </TableCell>
              <TableCell data-no-row-click>
                <Switch
                  checked={op.ativo}
                  disabled={toggling === op.id}
                  onCheckedChange={() => toggleAtivo(op)}
                />
              </TableCell>
              <TableCell data-no-row-click>
                <Link href={`/dashboard/financeiro/operadoras/${op.id}/editar`}>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
