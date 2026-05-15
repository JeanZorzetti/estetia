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
import { Search, Ban, Loader2, FileText } from 'lucide-react'
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
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar paciente..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="LGPD_DADOS_SAUDE">Dados de Saúde</SelectItem>
            <SelectItem value="USO_FOTO_MARKETING">Foto/Marketing</SelectItem>
            <SelectItem value="AUTORIZACAO_PROCEDIMENTO">Procedimento</SelectItem>
            <SelectItem value="TERMO_RISCO">Termo de Risco</SelectItem>
            <SelectItem value="TERMO_MENOR_IDADE">Menor de Idade</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="revoked">Revogados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl text-center">
          <FileText className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Nenhum consentimento encontrado.</p>
        </div>
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Paciente</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Versão</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Aceito em</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">IP</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className={cn('hover:bg-muted/30', c.revokedAt && 'opacity-60')}>
                  <TableCell className="font-medium text-sm">{c.paciente.nome}</TableCell>
                  <TableCell><ConsentTypeBadge tipo={c.tipo} /></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.versaoDocumento.slice(0, 12)}…</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(c.aceitoEm).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{c.ipAddress ?? '—'}</TableCell>
                  <TableCell>
                    {c.revokedAt ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                        Revogado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Ativo
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!c.revokedAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive hover:text-destructive"
                        disabled={revoking === c.id}
                        onClick={() => revogar(c.id)}
                      >
                        {revoking === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                      </Button>
                    )}
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
