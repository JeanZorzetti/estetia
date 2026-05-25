'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useCallback, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AnamneseCard } from '@/components/pacientes/anamnese/anamnese-card'
import { EmptyState } from '@/components/pacientes/shared/empty-state'
import { ClipboardList, Filter, Plus, Search, X, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnamnesisEntry } from '@/lib/clinical/types'

interface CentralAnamnesisEntry extends AnamnesisEntry {
  paciente: { id: string; nome: string }
}

interface Filters {
  q: string
  profissionalId: string
  status: string
  from: string
  to: string
}

interface Props {
  initialData: CentralAnamnesisEntry[]
  professionals: { id: string; nome: string }[]
  initialFilters: Filters
  totalCount: number
  currentPage: number
  totalPages: number
}

const STATUS_TABS = [
  { value: 'all', label: 'Todas' },
  { value: 'assinadas', label: 'Assinadas' },
  { value: 'pendentes', label: 'Pendentes' },
] as const

export function CentralAnamnesesClient({
  initialData,
  professionals,
  initialFilters,
  totalCount,
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [searchInput, setSearchInput] = useState(initialFilters.q)
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientResults, setPatientResults] = useState<{ id: string; nome: string }[]>([])
  const [patientSearchLoading, setPatientSearchLoading] = useState(false)
  const [newAnamneseOpen, setNewAnamneseOpen] = useState(false)

  const hasActiveFilters =
    initialFilters.q ||
    initialFilters.profissionalId ||
    initialFilters.status !== 'all' ||
    initialFilters.from ||
    initialFilters.to

  const updateParams = useCallback(
    (updates: Partial<Filters & { page?: string }>) => {
      const params = new URLSearchParams()
      const merged = { ...initialFilters, page: String(currentPage), ...updates }
      if (merged.q) params.set('q', merged.q)
      if (merged.profissionalId) params.set('profissionalId', merged.profissionalId)
      if (merged.status && merged.status !== 'all') params.set('status', merged.status)
      if (merged.from) params.set('from', merged.from)
      if (merged.to) params.set('to', merged.to)
      if (merged.page && merged.page !== '1') params.set('page', merged.page)
      const qs = params.toString()
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname))
    },
    [initialFilters, currentPage, pathname, router]
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value)
      if (searchTimer) clearTimeout(searchTimer)
      const t = setTimeout(() => updateParams({ q: value, page: '1' }), 350)
      setSearchTimer(t)
    },
    [searchTimer, updateParams]
  )

  const searchPatients = useCallback(async (q: string) => {
    if (!q.trim()) { setPatientResults([]); return }
    setPatientSearchLoading(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=8`)
      if (res.ok) {
        const data = await res.json()
        setPatientResults(data.patients ?? [])
      }
    } finally {
      setPatientSearchLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* Filters bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-md p-4 shadow-sm">
        {/* Row 1 — search + profissional + action */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Buscar por nome do paciente..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm rounded-xl border-slate-200/70 bg-white/60 focus-visible:ring-1 focus-visible:ring-[#489FB5]/40"
            />
          </div>

          <Select
            value={initialFilters.profissionalId || '__all__'}
            onValueChange={(v) => updateParams({ profissionalId: v === '__all__' ? '' : v, page: '1' })}
          >
            <SelectTrigger className="h-9 text-sm rounded-xl border-slate-200/70 bg-white/60 w-full sm:w-48 focus:ring-1 focus:ring-[#489FB5]/40">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos os profissionais</SelectItem>
              {professionals.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Nova anamnese */}
          <Dialog open={newAnamneseOpen} onOpenChange={setNewAnamneseOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-9 rounded-xl bg-[#0A1F3D] hover:bg-[#0A1F3D]/85 text-white text-xs font-bold px-4 gap-1.5 flex-shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova anamnese
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold">Selecionar paciente</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 pt-1">
                <p className="text-xs text-muted-foreground">
                  Busque o paciente para abrir o formulário de nova anamnese.
                </p>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    placeholder="Nome do paciente..."
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value)
                      searchPatients(e.target.value)
                    }}
                    className="pl-9 h-9 text-sm rounded-xl"
                    autoFocus
                  />
                </div>
                {patientSearchLoading && (
                  <p className="text-xs text-muted-foreground px-1 animate-pulse">Buscando...</p>
                )}
                {patientResults.length > 0 && (
                  <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                    {patientResults.map((p) => (
                      <Link
                        key={p.id}
                        href={`/dashboard/pacientes/${p.id}/anamnese/nova`}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 border border-transparent hover:border-slate-200/70 transition-all duration-150"
                        onClick={() => setNewAnamneseOpen(false)}
                      >
                        <div className="w-7 h-7 rounded-full bg-[#489FB5]/10 border border-[#489FB5]/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-[#2d7a8e]" />
                        </div>
                        {p.nome}
                      </Link>
                    ))}
                  </div>
                )}
                {patientSearch && !patientSearchLoading && patientResults.length === 0 && (
                  <p className="text-xs text-muted-foreground px-1">Nenhum paciente encontrado.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Row 2 — status tabs + date range */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 h-9">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => updateParams({ status: tab.value, page: '1' })}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200',
                  initialFilters.status === tab.value || (tab.value === 'all' && !initialFilters.status)
                    ? 'bg-white text-[#0A1F3D] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="date"
              value={initialFilters.from}
              onChange={(e) => updateParams({ from: e.target.value, page: '1' })}
              className="h-9 rounded-xl border border-slate-200/70 bg-white/60 px-3 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#489FB5]/40 cursor-pointer"
              title="Data inicial"
            />
            <span className="text-slate-300 text-xs">–</span>
            <input
              type="date"
              value={initialFilters.to}
              onChange={(e) => updateParams({ to: e.target.value, page: '1' })}
              className="h-9 rounded-xl border border-slate-200/70 bg-white/60 px-3 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#489FB5]/40 cursor-pointer"
              title="Data final"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                updateParams({ q: '', profissionalId: '', status: 'all', from: '', to: '', page: '1' })
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors duration-150 ml-auto flex-shrink-0"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Loading overlay hint */}
      {isPending && (
        <div className="text-xs text-center text-slate-400 animate-pulse">Atualizando...</div>
      )}

      {/* List */}
      {initialData.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhuma anamnese encontrada"
            description="Tente ajustar os filtros para ver outros resultados"
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-bold h-8"
                onClick={() => {
                  setSearchInput('')
                  updateParams({ q: '', profissionalId: '', status: 'all', from: '', to: '', page: '1' })
                }}
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Nenhuma anamnese registrada ainda"
            description="As fichas de saúde dos pacientes aparecerão aqui"
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-bold h-8"
                asChild
              >
                <Link href="/dashboard/pacientes">Ver pacientes</Link>
              </Button>
            }
          />
        )
      ) : (
        <div className="space-y-3">
          {initialData.map((anamnese) => (
            <div key={anamnese.id} className="flex flex-col gap-1">
              {/* Patient name header */}
              <Link
                href={`/dashboard/pacientes/${anamnese.paciente.id}`}
                className="flex items-center gap-1.5 px-1 text-xs font-semibold text-slate-500 hover:text-[#2d7a8e] transition-colors duration-150 w-fit"
              >
                <User className="w-3 h-3" />
                {anamnese.paciente.nome}
              </Link>
              <AnamneseCard anamnese={anamnese} patientId={anamnese.paciente.id} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
          <p className="text-xs text-slate-400">
            Página <span className="font-semibold text-slate-600">{currentPage}</span> de{' '}
            <span className="font-semibold text-slate-600">{totalPages}</span>
            <span className="ml-2 text-slate-300">({totalCount} registros)</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateParams({ page: String(currentPage - 1) })}
              className="h-8 rounded-xl text-xs font-bold"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => updateParams({ page: String(currentPage + 1) })}
              className="h-8 rounded-xl text-xs font-bold"
            >
              Próxima
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
