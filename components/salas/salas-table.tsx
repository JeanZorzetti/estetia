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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nome..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {ROOM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Nenhuma sala corresponde aos filtros.</p>
        </div>
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold text-xs uppercase tracking-wider w-12"></TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Nome</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Capacidade</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Equipamentos</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow
                  key={s.id}
                  className={cn('cursor-pointer hover:bg-muted/30 transition-colors', !s.ativo && 'opacity-60')}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('[data-no-row-click]')) return
                    router.push(`/dashboard/settings/salas/${s.id}/editar`)
                  }}
                >
                  <TableCell>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center border border-border/40"
                      style={{ backgroundColor: s.cor ?? 'transparent' }}
                    >
                      {!s.cor && <DoorOpen className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{s.nome}</TableCell>
                  <TableCell><RoomTypeBadge tipo={s.tipo} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">
                    {s.capacidade ? `${s.capacidade} pessoa${s.capacidade > 1 ? 's' : ''}` : '—'}
                  </TableCell>
                  <TableCell>
                    {s.equipamentos.length === 0 ? (
                      <span className="text-muted-foreground text-sm">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {s.equipamentos.slice(0, 2).map(e => (
                          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                        ))}
                        {s.equipamentos.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{s.equipamentos.length - 2}</Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell data-no-row-click>
                    <Switch
                      checked={s.ativo}
                      disabled={toggling === s.id}
                      onCheckedChange={() => toggleAtivo(s)}
                    />
                  </TableCell>
                  <TableCell data-no-row-click>
                    <Link href={`/dashboard/settings/salas/${s.id}/editar`}>
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
