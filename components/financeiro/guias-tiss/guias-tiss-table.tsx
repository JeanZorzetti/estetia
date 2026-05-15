'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from './status-badge'
import { Badge } from '@/components/ui/badge'
import { Eye, Search, Loader2 } from 'lucide-react'

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

interface Operadora { id: string; nome: string }

interface Props {
  initialGuias: Guia[]
  operadoras: Operadora[]
}

const TIPO_LABELS: Record<string, string> = {
  CONSULTA: 'Consulta', SADT: 'SADT', SP_SADT: 'SP-SADT', INTERNACAO: 'Internação', HONORARIOS: 'Honorários',
}

const formatBRL = (v: number | null) =>
  v == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export function GuiasTissTable({ initialGuias, operadoras }: Props) {
  const router = useRouter()
  const [guias, setGuias] = useState<Guia[]>(initialGuias)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [operadoraId, setOperadoraId] = useState('all')
  const [loading, setLoading] = useState(false)

  const fetchGuias = useCallback(async (q: string, st: string, op: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (st !== 'all') params.set('status', st)
      if (op !== 'all') params.set('operadoraId', op)
      const res = await fetch(`/api/guias-tiss?${params}`)
      const data = await res.json()
      setGuias(data.guias ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchGuias(query, status, operadoraId), 300)
    return () => clearTimeout(timer)
  }, [query, status, operadoraId, fetchGuias])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por número..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="RASCUNHO">Rascunho</SelectItem>
            <SelectItem value="ENVIADA">Enviada</SelectItem>
            <SelectItem value="AUTORIZADA">Autorizada</SelectItem>
            <SelectItem value="NEGADA">Negada</SelectItem>
            <SelectItem value="GLOSADA">Glosada</SelectItem>
            <SelectItem value="PAGA">Paga</SelectItem>
            <SelectItem value="CANCELADA">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={operadoraId} onValueChange={setOperadoraId}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Operadora" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas operadoras</SelectItem>
            {operadoras.map(op => <SelectItem key={op.id} value={op.id}>{op.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {guias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Nenhuma guia encontrada.</p>
          <Link href="/dashboard/financeiro/guias-tiss/nova">
            <Button size="sm" variant="outline">Criar primeira guia</Button>
          </Link>
        </div>
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Número</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Paciente</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Operadora</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Valor</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Execução</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guias.map(g => (
                <TableRow
                  key={g.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => router.push(`/dashboard/financeiro/guias-tiss/${g.id}`)}
                >
                  <TableCell className="font-mono text-xs">{g.numeroGuia ?? g.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-sm font-medium">{g.paciente.nome}</TableCell>
                  <TableCell className="text-sm">{g.operadora.nome}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{TIPO_LABELS[g.tipo] ?? g.tipo}</Badge></TableCell>
                  <TableCell className="text-sm tabular-nums font-medium">{formatBRL(g.valorTotal)}</TableCell>
                  <TableCell><StatusBadge status={g.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {g.dataExecucao ? new Date(g.dataExecucao).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
