'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Pencil, Search, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Procedure {
  id: string
  nome: string
  categoria: string | null
  duracaoMinutos: number
  valorPadrao: number | null
  profissionaisHabilitadosIds: string[]
  ativo: boolean
}

interface Props {
  initialProcedures: Procedure[]
  initialQuery: string
  initialCategoria: string
}

const CATEGORIA_LABELS: Record<string, string> = {
  facial: 'Facial',
  corporal: 'Corporal',
  capilar: 'Capilar',
  outros: 'Outros',
}

const CATEGORIA_COLORS: Record<string, string> = {
  facial: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  corporal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  capilar: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  outros: 'bg-muted text-muted-foreground',
}

function formatCurrency(value: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}min` : `${h}h`
}

export function ProceduresTable({ initialProcedures, initialQuery, initialCategoria }: Props) {
  const router = useRouter()
  const [procedures, setProcedures] = useState<Procedure[]>(initialProcedures)
  const [query, setQuery] = useState(initialQuery)
  const [categoria, setCategoria] = useState(initialCategoria)
  const [loading, setLoading] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchProcedures = useCallback(async (q: string, cat: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (cat && cat !== 'all') params.set('categoria', cat)
      const res = await fetch(`/api/procedures?${params}`)
      const data = await res.json()
      setProcedures(data.procedures ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProcedures(query, categoria)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, categoria, fetchProcedures])

  const toggleAtivo = async (p: Procedure) => {
    setTogglingId(p.id)
    try {
      await fetch(`/api/procedures/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !p.ativo }),
      })
      setProcedures(prev => prev.map(proc =>
        proc.id === p.id ? { ...proc, ativo: !proc.ativo } : proc
      ))
      router.refresh()
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select
          value={categoria || 'all'}
          onValueChange={v => setCategoria(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="facial">Facial</SelectItem>
            <SelectItem value="corporal">Corporal</SelectItem>
            <SelectItem value="capilar">Capilar</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Table */}
      {procedures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            {query || categoria ? 'Nenhum procedimento encontrado com esses filtros.' : 'Nenhum procedimento cadastrado ainda.'}
          </p>
          {!query && !categoria && (
            <Link href="/dashboard/procedimentos/novo">
              <Button size="sm" variant="outline">Criar primeiro procedimento</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Nome</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Categoria</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Duração</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Valor</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Profissionais</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procedures.map(p => (
                <TableRow
                  key={p.id}
                  className={cn(
                    'cursor-pointer hover:bg-muted/30 transition-colors',
                    !p.ativo && 'opacity-60',
                  )}
                  onClick={e => {
                    const target = e.target as HTMLElement
                    if (target.closest('[data-no-row-click]')) return
                    router.push(`/dashboard/procedimentos/${p.id}/editar`)
                  }}
                >
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell>
                    {p.categoria ? (
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        CATEGORIA_COLORS[p.categoria] ?? CATEGORIA_COLORS.outros,
                      )}>
                        {CATEGORIA_LABELS[p.categoria] ?? p.categoria}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatDuration(p.duracaoMinutos)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {formatCurrency(p.valorPadrao)}
                  </TableCell>
                  <TableCell>
                    {p.profissionaisHabilitadosIds.length > 0 ? (
                      <Badge variant="secondary" className="text-xs">
                        {p.profissionaisHabilitadosIds.length} hab.
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell data-no-row-click>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={p.ativo}
                        disabled={togglingId === p.id}
                        onCheckedChange={() => toggleAtivo(p)}
                      />
                      <span className={cn('text-xs', p.ativo ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground')}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell data-no-row-click>
                    <Link href={`/dashboard/procedimentos/${p.id}/editar`}>
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
      )}
    </div>
  )
}
