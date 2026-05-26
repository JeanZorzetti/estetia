'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ConsentTypeBadge } from './consent-type-badge'
import { Search, Ban, Loader2, FileText, CheckCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Consent {
  id: string
  tipo: string
  versaoDocumento: string
  aceitoEm: string
  revokedAt: string | null
  ipAddress: string | null
  evidencia: Record<string, unknown> | null
  paciente: { id: string; nome: string }
}

interface Props {
  initialConsents: Consent[]
}

export function ConsentimentosTable({ initialConsents }: Props) {
  const router = useRouter()
  const [consents, setConsents] = useState<Consent[]>(initialConsents)
  const [query, setQuery] = useState('')
  const [tipo, setTipo] = useState('all')
  const [status, setStatus] = useState('all')
  const [revoking, setRevoking] = useState<string | null>(null)

  const filtered = consents.filter(c => {
    if (tipo !== 'all' && c.tipo !== tipo) return false
    if (status === 'active' && c.revokedAt) return false
    if (status === 'revoked' && !c.revokedAt) return false
    if (query && !c.paciente.nome.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const revogar = async (id: string) => {
    if (!confirm('Confirmar revogação deste consentimento?')) return
    setRevoking(id)
    try {
      const res = await fetch(`/api/lgpd/consent-history?consentId=${id}`, { method: 'PATCH' })
      if (res.ok) {
        const data = await res.json()
        setConsents(prev => prev.map(c => c.id === id ? { ...c, revokedAt: data.consent.revokedAt } : c))
        router.refresh()
      }
    } finally {
      setRevoking(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 transition-colors group-focus-within:text-teal" />
          <Input
            className="pl-10 h-11 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
            placeholder="Buscar paciente..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-52 h-11 rounded-xl bg-card/60 border-border/40 focus:ring-teal-500/10 font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/40">
            <SelectItem value="all" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Todos os tipos</SelectItem>
            <SelectItem value="LGPD_DADOS_SAUDE" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Dados de Saúde</SelectItem>
            <SelectItem value="USO_FOTO_MARKETING" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Foto/Marketing</SelectItem>
            <SelectItem value="AUTORIZACAO_PROCEDIMENTO" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Procedimento</SelectItem>
            <SelectItem value="TERMO_RISCO" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Termo de Risco</SelectItem>
            <SelectItem value="TERMO_MENOR_IDADE" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Menor de Idade</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 h-11 rounded-xl bg-card/60 border-border/40 focus:ring-teal-500/10 font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/40">
            <SelectItem value="all" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Todos os status</SelectItem>
            <SelectItem value="active" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Ativos</SelectItem>
            <SelectItem value="revoked" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Revogados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border/60 rounded-2xl text-center bg-muted/5 dark:bg-zinc-900/5">
          <FileText className="w-10 h-10 text-muted-foreground/30 animate-pulse" />
          <div>
            <p className="text-sm font-extrabold text-foreground">Nenhum consentimento encontrado</p>
            <p className="text-xs text-muted-foreground font-semibold mt-1">Refine seus filtros de busca ou cadastre um novo registro.</p>
          </div>
        </div>
      ) : (
        <div className="border border-border/40 rounded-2xl overflow-hidden shadow-xs bg-card/20 backdrop-blur-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/40">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Paciente</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Tipo</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Documento / Versão</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Aceito em</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">IP Coleta</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Status</TableHead>
                <TableHead className="w-16 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => {
                const isRevoked = !!c.revokedAt
                return (
                  <TableRow
                    key={c.id}
                    className={cn(
                      'hover:bg-muted/10 transition-colors border-b border-border/10',
                      isRevoked && 'opacity-60 dark:bg-zinc-950/10'
                    )}
                  >
                    <TableCell className="font-extrabold text-sm text-foreground py-4.5">{c.paciente.nome}</TableCell>
                    <TableCell className="py-4.5">
                      <ConsentTypeBadge tipo={c.tipo} />
                    </TableCell>
                    <TableCell className="py-4.5">
                      <span className="font-mono text-[10px] bg-muted/40 border border-border/10 px-2 py-0.5 rounded-md text-muted-foreground tracking-tight select-all">
                        {c.versaoDocumento.length > 12 ? `${c.versaoDocumento.slice(0, 12)}…` : c.versaoDocumento}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-semibold py-4.5">
                      {new Date(c.aceitoEm).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="py-4.5">
                      <span className="text-xs font-mono text-muted-foreground/80 bg-zinc-500/5 border border-border/5 px-2 py-0.5 rounded-md">
                        {c.ipAddress ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4.5">
                      {isRevoked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-zinc-500/10 border border-zinc-500/20 text-zinc-600 dark:text-zinc-400 shadow-xs select-none">
                          <Clock className="w-3 h-3" />
                          Revogado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-xs select-none">
                          <CheckCircle className="w-3 h-3" />
                          Ativo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4.5">
                      {!isRevoked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all cursor-pointer"
                          disabled={revoking === c.id}
                          onClick={() => revogar(c.id)}
                          title="Revogar Consentimento"
                        >
                          {revoking === c.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

