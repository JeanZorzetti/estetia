'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ActionBadge } from './action-badge'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface AuditLog {
  id: string
  userId: string | null
  recordType: string
  recordId: string
  action: string
  ipAddress: string | null
  createdAt: string
  user: { id: string; name: string | null; email: string } | null
  paciente: { id: string; nome: string } | null
}

interface Props {
  initialLogs: AuditLog[]
  initialTotal: number
  initialPage: number
  pageSize: number
}

export function AuditTable({ initialLogs, initialTotal, initialPage, pageSize }: Props) {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(initialPage)
  const [action, setAction] = useState('all')
  const [recordType, setRecordType] = useState('all')
  const [loading, setLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('pageSize', String(pageSize))
      if (action !== 'all') params.set('action', action)
      if (recordType !== 'all') params.set('recordType', recordType)
      const res = await fetch(`/api/lgpd/audit-log?${params}`)
      const data = await res.json()
      setLogs(data.logs ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [page, action, recordType, pageSize])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={action} onValueChange={v => { setAction(v); setPage(1) }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Ação" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            <SelectItem value="VIEW">Visualização</SelectItem>
            <SelectItem value="CREATE">Criação</SelectItem>
            <SelectItem value="UPDATE">Edição</SelectItem>
            <SelectItem value="EXPORT">Exportação</SelectItem>
            <SelectItem value="DELETE">Exclusão</SelectItem>
            <SelectItem value="ANONYMIZE">Anonimização</SelectItem>
          </SelectContent>
        </Select>
        <Select value={recordType} onValueChange={v => { setRecordType(v); setPage(1) }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Tipo de registro" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="MedicalRecord">Prontuário</SelectItem>
            <SelectItem value="Anamnesis">Anamnese</SelectItem>
            <SelectItem value="ConsentLog">Consentimento</SelectItem>
            <SelectItem value="Patient">Paciente</SelectItem>
          </SelectContent>
        </Select>
        <Link href="/api/lgpd/audit-log/export" target="_blank">
          <Button variant="outline" size="sm">Exportar CSV</Button>
        </Link>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Nenhum registro de acesso encontrado.</p>
        </div>
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Data/Hora</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Usuário</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Paciente</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Ação</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(l => (
                <TableRow key={l.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-sm">{l.user?.name ?? <span className="text-muted-foreground italic">Sistema</span>}</TableCell>
                  <TableCell className="text-sm">
                    {l.paciente ? (
                      <Link
                        href={`/dashboard/lgpd/audit-log/paciente/${l.paciente.id}`}
                        className="font-medium hover:underline"
                      >
                        {l.paciente.nome}
                      </Link>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.recordType}</TableCell>
                  <TableCell><ActionBadge action={l.action} /></TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{l.ipAddress ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Página {page} de {totalPages} · {total.toLocaleString('pt-BR')} registros
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
