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
  facial: 'bg-pink-500/10 text-pink-600 border border-pink-500/20 dark:text-pink-400 dark:border-pink-500/30 backdrop-blur-md',
  corporal: 'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 backdrop-blur-md',
  capilar: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 backdrop-blur-md',
  outros: 'bg-slate-500/10 text-slate-600 border border-slate-500/20 dark:text-slate-400 dark:border-slate-500/30 backdrop-blur-md',
}

const CATEGORIA_HOVER_STYLES: Record<string, { filete: string; glow: string; textHover: string }> = {
  facial: {
    filete: 'from-pink-500 to-pink-400',
    glow: 'hover:shadow-[0_8px_30px_rgba(236,72,153,0.03)] hover:border-pink-200/50',
    textHover: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
  },
  corporal: {
    filete: 'from-blue-500 to-blue-400',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.03)] hover:border-blue-200/50',
    textHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
  },
  capilar: {
    filete: 'from-amber-500 to-amber-400',
    glow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.03)] hover:border-amber-200/50',
    textHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
  },
  outros: {
    filete: 'from-slate-500 to-slate-400',
    glow: 'hover:shadow-[0_8px_30px_rgba(100,116,139,0.03)] hover:border-slate-200/50',
    textHover: 'group-hover:text-slate-600 dark:group-hover:text-slate-400',
  },
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
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#C5A059] transition-colors" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/60 dark:border-slate-800/60 rounded-full focus-visible:ring-[#C5A059]/20 focus-visible:border-[#C5A059] transition-all"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select
          value={categoria || 'all'}
          onValueChange={v => setCategoria(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-48 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/60 dark:border-slate-800/60 rounded-full focus:ring-[#C5A059]/20 focus:border-[#C5A059] transition-all">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
            <SelectItem value="all" className="rounded-xl">Todas as categorias</SelectItem>
            <SelectItem value="facial" className="rounded-xl">Facial</SelectItem>
            <SelectItem value="corporal" className="rounded-xl">Corporal</SelectItem>
            <SelectItem value="capilar" className="rounded-xl">Capilar</SelectItem>
            <SelectItem value="outros" className="rounded-xl">Outros</SelectItem>
          </SelectContent>
        </Select>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />}
      </div>

      {/* Table */}
      {procedures.length === 0 ? (
        <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/20 backdrop-blur-2xl p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center gap-6">
          <div className="absolute inset-0.5 border border-white/60 dark:border-white/5 rounded-[2.1rem] pointer-events-none" />
          
          {/* Halo Decorativo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-[40px] pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200/60 dark:from-slate-800 dark:to-slate-900/60 border border-white dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-center relative">
            <Search className="w-8 h-8 text-[#C5A059]" />
          </div>

          <div className="max-w-md relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-700 border border-amber-500/20 backdrop-blur-md mb-3">
              Estetia CRM Catalog
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-serif tracking-tight">
              {query || categoria ? 'Nenhum procedimento encontrado' : 'Nenhum procedimento cadastrado'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {query || categoria 
                ? 'Tente ajustar os filtros ou o termo de busca para encontrar o procedimento desejado.' 
                : 'Adicione seus procedimentos de elite para iniciar o agendamento de consultas.'}
            </p>
          </div>

          {!query && !categoria && (
            <Link href="/dashboard/procedimentos/novo" className="relative z-10">
              <Button className="bg-gradient-to-r from-[#C5A059] to-[#E5C07B] hover:opacity-90 shadow-[0_4px_20px_rgba(197,160,89,0.25)] text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-medium px-6 py-2.5 rounded-full flex items-center gap-1.5">
                Criar Primeiro Procedimento
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="relative rounded-[2.2rem] border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/20 backdrop-blur-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Double-border interno perolado */}
          <div className="absolute inset-0.5 border border-white/60 dark:border-white/5 rounded-[2.1rem] pointer-events-none" />

          <div className="relative z-10 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-transparent hover:bg-transparent">
                  <TableHead className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest h-10">Nome</TableHead>
                  <TableHead className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest h-10">Categoria</TableHead>
                  <TableHead className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest h-10">Duração</TableHead>
                  <TableHead className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest h-10">Valor</TableHead>
                  <TableHead className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest h-10">Profissionais</TableHead>
                  <TableHead className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest h-10">Status</TableHead>
                  <TableHead className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest h-10 w-16 text-right pr-4">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedures.map(p => {
                  const cat = p.categoria || 'outros'
                  const hoverStyles = CATEGORIA_HOVER_STYLES[cat] ?? CATEGORIA_HOVER_STYLES.outros
                  return (
                    <TableRow
                      key={p.id}
                      className={cn(
                        'cursor-pointer border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-white/60 dark:hover:bg-slate-900/40 transition-all duration-300 group relative',
                        !p.ativo && 'opacity-60 hover:opacity-100',
                        hoverStyles.glow
                      )}
                      onClick={e => {
                        const target = e.target as HTMLElement
                        if (target.closest('[data-no-row-click]')) return
                        router.push(`/dashboard/procedimentos/${p.id}/editar`)
                      }}
                    >
                      {/* Filete de status vertical hover reativo ao tipo */}
                      <td className={cn(
                        'absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                        hoverStyles.filete
                      )} />

                      <TableCell className={cn('font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 pl-4 py-4', hoverStyles.textHover)}>
                        {p.nome}
                      </TableCell>
                      
                      <TableCell className="py-4">
                        {p.categoria ? (
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
                            CATEGORIA_COLORS[p.categoria] ?? CATEGORIA_COLORS.outros,
                          )}>
                            {CATEGORIA_LABELS[p.categoria] ?? p.categoria}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs italic">Não definido</span>
                        )}
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mr-0.5">
                            <Clock className="w-3 h-3" />
                          </span>
                          {formatDuration(p.duracaoMinutos)}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm font-bold font-serif text-slate-700 dark:text-slate-300 tabular-nums py-4">
                        {formatCurrency(p.valorPadrao)}
                      </TableCell>

                      <TableCell className="py-4">
                        {p.profissionaisHabilitadosIds.length > 0 ? (
                          <Badge className="bg-[#489FB5]/10 text-[#489FB5] border border-[#489FB5]/20 dark:bg-[#489FB5]/20 dark:text-[#489FB5] backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                            {p.profissionaisHabilitadosIds.length} hab.
                          </Badge>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs italic">Nenhum</span>
                        )}
                      </TableCell>

                      <TableCell data-no-row-click className="py-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={p.ativo}
                            disabled={togglingId === p.id}
                            onCheckedChange={() => toggleAtivo(p)}
                            className="data-[state=checked]:bg-[#C5A059]"
                          />
                          <span className={cn('text-xs font-semibold tracking-wide', p.ativo ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500')}>
                            {p.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell data-no-row-click className="text-right pr-4 py-4">
                        <Link href={`/dashboard/procedimentos/${p.id}/editar`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
