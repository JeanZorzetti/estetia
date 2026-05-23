'use client'

import { useState, useEffect } from 'react'
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
import { Pencil, Search, DoorOpen } from 'lucide-react'
import { RoomTypeBadge } from './room-type-badge'
import { cn } from '@/lib/utils'

interface Sala {
  id: string
  nome: string
  tipo: string
  equipamentos: string[]
  cor: string | null
  capacidade: number | null
  ativo: boolean
}

interface Props {
  initialSalas: Sala[]
}

const ROOM_TYPES = ['CONSULTA', 'PROCEDIMENTO', 'LASER', 'PEELING', 'RECUPERACAO']

export function SalasTable({ initialSalas }: Props) {
  const router = useRouter()
  const [salas, setSalas] = useState<Sala[]>(initialSalas)
  const [query, setQuery] = useState('')
  const [tipo, setTipo] = useState('all')
  const [status, setStatus] = useState('all')
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => { setSalas(initialSalas) }, [initialSalas])

  const filtered = salas.filter(s => {
    if (query && !s.nome.toLowerCase().includes(query.toLowerCase())) return false
    if (tipo !== 'all' && s.tipo !== tipo) return false
    if (status === 'active' && !s.ativo) return false
    if (status === 'inactive' && s.ativo) return false
    return true
  })

  const toggleAtivo = async (s: Sala) => {
    setToggling(s.id)
    try {
      const res = await fetch(`/api/salas/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !s.ativo }),
      })
      if (res.ok) {
        setSalas(prev => prev.map(x => x.id === s.id ? { ...x, ativo: !x.ativo } : x))
        router.refresh()
      }
    } finally {
      setToggling(null)
    }
  }

  if (salas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl text-center">
        <DoorOpen className="w-8 h-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Nenhuma sala cadastrada.</p>
        <Link href="/dashboard/settings/salas/novo">
          <Button size="sm" variant="outline">Cadastrar primeira sala</Button>
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
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-44 h-10 rounded-xl border-border/60 bg-background/50 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todos os tipos</SelectItem>
            {ROOM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border/80 rounded-2xl bg-card/20 text-center">
          <p className="text-sm font-medium text-muted-foreground">Nenhuma sala corresponde aos filtros.</p>
        </div>
      ) : (
        <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/50">
                <TableHead className="font-bold text-xs uppercase tracking-wider w-14 py-4 text-muted-foreground"></TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Nome</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Tipo</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Capacidade</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Equipamentos</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-muted-foreground">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider w-14 py-4 text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow
                  key={s.id}
                  className={cn(
                    'group/row cursor-pointer transition-all duration-200 border-b border-border/30 last:border-b-0',
                    'hover:bg-primary/[0.01] dark:hover:bg-primary/[0.03]',
                    !s.ativo && 'opacity-65 hover:opacity-90'
                  )}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('[data-no-row-click]')) return
                    router.push(`/dashboard/settings/salas/${s.id}/editar`)
                  }}
                >
                  <TableCell className="py-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center border border-black/10 dark:border-white/10 relative overflow-hidden transition-all duration-300 group-hover/row:scale-110 shadow-sm"
                      )}
                      style={{ 
                        backgroundColor: s.cor ?? 'transparent',
                        boxShadow: s.cor ? `inset 0 2px 4px rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.15), 0 3px 6px ${s.cor}25` : undefined
                      }}
                    >
                      {!s.cor && <DoorOpen className="w-4 h-4 text-muted-foreground" />}
                      {s.cor && (
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-foreground py-3">{s.nome}</TableCell>
                  <TableCell className="py-3"><RoomTypeBadge tipo={s.tipo} /></TableCell>
                  <TableCell className="text-sm font-semibold text-foreground py-3 tabular-nums">
                    {s.capacidade ? `${s.capacidade} pessoa${s.capacidade > 1 ? 's' : ''}` : <span className="text-muted-foreground/35 font-normal text-xs">—</span>}
                  </TableCell>
                  <TableCell className="py-3">
                    {s.equipamentos.length === 0 ? (
                      <span className="text-muted-foreground/35 text-xs">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {s.equipamentos.slice(0, 2).map(e => (
                          <Badge 
                            key={e} 
                            variant="secondary" 
                            className="text-xs bg-muted/60 text-muted-foreground border border-border/30 rounded-lg px-2"
                          >
                            {e}
                          </Badge>
                        ))}
                        {s.equipamentos.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs rounded-lg px-1.5 border-dashed"
                          >
                            +{s.equipamentos.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell data-no-row-click className="py-3">
                    <Switch
                      checked={s.ativo}
                      disabled={toggling === s.id}
                      onCheckedChange={() => toggleAtivo(s)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </TableCell>
                  <TableCell data-no-row-click className="py-3">
                    <Link href={`/dashboard/settings/salas/${s.id}/editar`}>
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
