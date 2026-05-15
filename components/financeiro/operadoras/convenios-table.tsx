'use client'

import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

interface Convenio {
  id: string
  codigoTuss: string | null
  descricaoTuss: string | null
  valorNegociado: number | null
  porcentagemCo: number | null
  vigenciaInicio: string | null
  vigenciaFim: string | null
  ativo: boolean
  operadora: { id: string; nome: string }
}

interface Props {
  initialConvenios: Convenio[]
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export function ConveniosTable({ initialConvenios }: Props) {
  const router = useRouter()

  if (initialConvenios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">Nenhum convênio cadastrado.</p>
      </div>
    )
  }

  // Group by operadora
  const grouped = initialConvenios.reduce<Record<string, { operadoraNome: string; convenios: Convenio[] }>>((acc, c) => {
    const key = c.operadora.id
    if (!acc[key]) acc[key] = { operadoraNome: c.operadora.nome, convenios: [] }
    acc[key].convenios.push(c)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([opId, group]) => (
        <div key={opId} className="border border-border/60 rounded-xl overflow-hidden">
          <div className="bg-muted/30 px-4 py-2.5 border-b border-border/60 flex items-center justify-between">
            <p className="font-semibold text-sm">{group.operadoraNome}</p>
            <span className="text-xs text-muted-foreground">{group.convenios.length} convênio{group.convenios.length !== 1 ? 's' : ''}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-xs uppercase tracking-wider">TUSS</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Descrição</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Valor</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">% Co</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Vigência</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.convenios.map(c => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => router.push(`/dashboard/financeiro/convenios/${c.id}/editar`)}
                >
                  <TableCell className="font-mono text-xs tabular-nums">{c.codigoTuss ?? '—'}</TableCell>
                  <TableCell className="text-sm">{c.descricaoTuss ?? '—'}</TableCell>
                  <TableCell className="text-sm tabular-nums font-medium">
                    {c.valorNegociado != null ? formatBRL(c.valorNegociado) : '—'}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {c.porcentagemCo != null ? `${c.porcentagemCo}%` : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.vigenciaInicio
                      ? `${new Date(c.vigenciaInicio).toLocaleDateString('pt-BR')}${c.vigenciaFim ? ` → ${new Date(c.vigenciaFim).toLocaleDateString('pt-BR')}` : ''}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
