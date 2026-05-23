'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Pencil, Search, Loader2, User as UserIcon } from 'lucide-react'
import { CouncilBadge } from './council-badge'
import { cn } from '@/lib/utils'

interface Professional {
  id: string
  nome: string
  conselho: string | null
  numeroConselho: string | null
  ufConselho: string | null
  especialidades: string[]
  fotoSignedUrl: string | null
  procedimentosHabilitadosIds: string[]
  ativo: boolean
  user: { id: string; name: string | null; email: string } | null
}

interface Props {
  initialProfessionals: Professional[]
}

const COUNCILS = ['CRM', 'CRO', 'CRBM', 'CRF', 'COREN', 'CFBM', 'CREFITO', 'CRP']

export function ProfessionalsTable({ initialProfessionals }: Props) {
  const router = useRouter()
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals)
  const [query, setQuery] = useState('')
  const [conselho, setConselho] = useState('all')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => { setProfessionals(initialProfessionals) }, [initialProfessionals])

  const fetchData = useCallback(async (q: string, c: string, s: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ detailed: 'true' })
      if (q) params.set('q', q)
      if (c !== 'all') params.set('conselho', c)
      if (s !== 'all') params.set('ativo', s === 'active' ? 'true' : 'false')
      const res = await fetch(`/api/professionals?${params}`)
      const data = await res.json()
      // Note: signed URLs not regenerated client-side; use server data already loaded
      // For now just filter clientside on existing rows; for full refresh user can reload
      setProfessionals(prev => prev) // keep server data
      void data
    } finally {
      setLoading(false)
    }
  }, [])

  // Client-side filtering (faster + uses signed URLs already loaded server-side)
  const filtered = professionals.filter(p => {
    if (query && !p.nome.toLowerCase().includes(query.toLowerCase())) return false
    if (conselho !== 'all' && p.conselho !== conselho) return false
    if (status === 'active' && !p.ativo) return false
    if (status === 'inactive' && p.ativo) return false
    return true
  })

  const toggleAtivo = async (p: Professional) => {
    setToggling(p.id)
    try {
      const res = await fetch(`/api/professionals/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !p.ativo }),
      })
      if (res.ok) {
        setProfessionals(prev => prev.map(x => x.id === p.id ? { ...x, ativo: !x.ativo } : x))
        router.refresh()
      }
    } finally {
      setToggling(null)
    }
  }

  void fetchData

  if (professionals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl text-center">
        <UserIcon className="w-8 h-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Nenhum profissional cadastrado.</p>
        <Link href="/dashboard/settings/profissionais/novo">
          <Button size="sm" variant="outline">Cadastrar primeiro profissional</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Premium Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            className="pl-9 h-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/20 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
            placeholder="Buscar por nome..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
        </div>
        <Select value={conselho} onValueChange={setConselho}>
          <SelectTrigger className="w-40 h-10 rounded-xl border-border/60 bg-background/50 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <SelectValue placeholder="Conselho" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todos conselhos</SelectItem>
            {COUNCILS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-32 h-10 rounded-xl border-border/60 bg-background/50 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border/80 rounded-2xl bg-card/20 text-center">
          <p className="text-sm font-medium text-muted-foreground">Nenhum profissional corresponde aos filtros.</p>
        </div>
      ) : (
        <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/50">
                <TableHead className="font-bold text-xs uppercase tracking-wider w-14 py-4 text-muted-foreground"></TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Nome</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Conselho</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Especialidades</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Proced.</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Login</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider w-14 py-4 text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow
                  key={p.id}
                  className={cn(
                    'group/row cursor-pointer transition-all duration-200 border-b border-border/30 last:border-b-0',
                    'hover:bg-primary/[0.01] dark:hover:bg-primary/[0.03]',
                    !p.ativo && 'opacity-65 hover:opacity-90'
                  )}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('[data-no-row-click]')) return
                    router.push(`/dashboard/settings/profissionais/${p.id}/editar`)
                  }}
                >
                  <TableCell className="py-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300",
                      p.ativo 
                        ? "bg-gradient-to-br from-primary/10 to-primary/5 text-primary border-2 border-emerald-500/20 group-hover/row:border-emerald-500/40" 
                        : "bg-muted text-muted-foreground border-2 border-transparent"
                    )}>
                      {p.fotoSignedUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={p.fotoSignedUrl} 
                          alt={p.nome} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/row:scale-105" 
                        />
                      ) : (
                        <span className="font-semibold">{p.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-foreground py-3">{p.nome}</TableCell>
                  <TableCell className="py-3">
                    <CouncilBadge conselho={p.conselho} numero={p.numeroConselho} uf={p.ufConselho} />
                  </TableCell>
                  <TableCell className="py-3">
                    {p.especialidades.length === 0 ? (
                      <span className="text-muted-foreground/50 text-xs">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.especialidades.slice(0, 2).map(e => (
                          <Badge 
                            key={e} 
                            variant="secondary" 
                            className="text-xs bg-muted/60 text-muted-foreground border border-border/30 rounded-lg px-2"
                          >
                            {e}
                          </Badge>
                        ))}
                        {p.especialidades.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs rounded-lg px-1.5 border-dashed"
                          >
                            +{p.especialidades.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-semibold bg-primary/5 text-primary border border-primary/10 rounded-lg tabular-nums px-2"
                    >
                      {p.procedimentosHabilitadosIds.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-3 font-medium">
                    {p.user ? p.user.name ?? p.user.email : <span className="text-muted-foreground/35">—</span>}
                  </TableCell>
                  <TableCell data-no-row-click className="py-3">
                    <Switch
                      checked={p.ativo}
                      disabled={toggling === p.id}
                      onCheckedChange={() => toggleAtivo(p)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </TableCell>
                  <TableCell data-no-row-click className="py-3">
                    <Link href={`/dashboard/settings/profissionais/${p.id}/editar`}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3.5 h-3.5 transition-transform duration-200 group-hover/row:rotate-6" />
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
