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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nome..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={conselho} onValueChange={setConselho}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Conselho" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos conselhos</SelectItem>
            {COUNCILS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Nenhum profissional corresponde aos filtros.</p>
        </div>
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold text-xs uppercase tracking-wider w-12"></TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Nome</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Conselho</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Especialidades</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Proced.</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Login</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow
                  key={p.id}
                  className={cn('cursor-pointer hover:bg-muted/30 transition-colors', !p.ativo && 'opacity-60')}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('[data-no-row-click]')) return
                    router.push(`/dashboard/settings/profissionais/${p.id}/editar`)
                  }}
                >
                  <TableCell>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center text-xs font-semibold border border-border/40">
                      {p.fotoSignedUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.fotoSignedUrl} alt={p.nome} className="w-full h-full object-cover" />
                      ) : (
                        <span>{p.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{p.nome}</TableCell>
                  <TableCell>
                    <CouncilBadge conselho={p.conselho} numero={p.numeroConselho} uf={p.ufConselho} />
                  </TableCell>
                  <TableCell>
                    {p.especialidades.length === 0 ? (
                      <span className="text-muted-foreground text-sm">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.especialidades.slice(0, 2).map(e => (
                          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                        ))}
                        {p.especialidades.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{p.especialidades.length - 2}</Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs tabular-nums">{p.procedimentosHabilitadosIds.length}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.user ? p.user.name ?? p.user.email : '—'}
                  </TableCell>
                  <TableCell data-no-row-click>
                    <Switch
                      checked={p.ativo}
                      disabled={toggling === p.id}
                      onCheckedChange={() => toggleAtivo(p)}
                    />
                  </TableCell>
                  <TableCell data-no-row-click>
                    <Link href={`/dashboard/settings/profissionais/${p.id}/editar`}>
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
