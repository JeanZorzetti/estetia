'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Shield, CheckCircle, XCircle, Download, Search, AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConsentEntry {
  id: string
  pacienteId: string
  tipo: string
  versaoDocumento: string
  aceitoEm: string
  revokedAt: string | null
  ipAddress: string | null
}

const CONSENT_LABELS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'LGPD — Dados de Saúde',
  USO_FOTO: 'Uso de Imagem',
  AUTORIZACAO_PROCEDIMENTO: 'Autorização de Procedimento',
  TERMO_RISCO: 'Termo de Risco',
}

const CONSENT_DESCRIPTIONS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'Autorização para coleta e processamento de dados sensíveis de saúde (LGPD Art. 11)',
  USO_FOTO: 'Autorização para uso de fotos antes/depois para fins clínicos e/ou marketing',
  AUTORIZACAO_PROCEDIMENTO: 'Autorização informada para realização do procedimento estético',
  TERMO_RISCO: 'Ciência dos riscos e contraindicações do procedimento',
}

export default function ConsentimentosPage() {
  const [consents, setConsents] = useState<ConsentEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [pacienteId, setPacienteId] = useState('')

  const fetchConsents = async (pid: string) => {
    if (!pid) return
    setLoading(true)
    try {
      const res = await fetch(`/api/lgpd/consent-history?pacienteId=${pid}`)
      const data = await res.json()
      setConsents(data.consents ?? [])
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async (consentId: string) => {
    if (!confirm('Revogar este consentimento? Esta ação é registrada no audit log.')) return
    const res = await fetch(`/api/lgpd/consent-history?consentId=${consentId}`, { method: 'PATCH' })
    if (res.ok) {
      setConsents((prev: ConsentEntry[]) =>
        prev.map((c: ConsentEntry) => c.id === consentId ? { ...c, revokedAt: new Date().toISOString() } : c)
      )
    }
  }

  const handleExportLGPD = async () => {
    if (!pacienteId) return
    window.open(`/api/lgpd/export?pacienteId=${pacienteId}`, '_blank')
  }

  const filtered = consents.filter((c: ConsentEntry) => {
    if (filterTipo !== 'all' && c.tipo !== filterTipo) return false
    if (filterStatus === 'ativo' && c.revokedAt) return false
    if (filterStatus === 'revogado' && !c.revokedAt) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-rose-500" />
            Consentimentos & LGPD
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestão de termos de consentimento e conformidade com a LGPD
          </p>
        </div>
      </div>

      {/* LGPD summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(CONSENT_DESCRIPTIONS).map(([tipo, desc]) => (
          <Card key={tipo} className="border-rose-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-rose-700">
                {CONSENT_LABELS[tipo]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient lookup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Consultar por Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="ID do paciente (UUID)"
              value={pacienteId}
              onChange={(e: { target: { value: string } }) => setPacienteId(e.target.value)}
              className="font-mono text-sm"
            />
            <Button onClick={() => fetchConsents(pacienteId)} disabled={!pacienteId || loading}>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            {pacienteId && (
              <Button variant="outline" onClick={handleExportLGPD}>
                <Download className="mr-2 h-4 w-4" />
                Export LGPD
              </Button>
            )}
          </div>

          {consents.length > 0 && (
            <div className="space-y-3">
              {/* Filters */}
              <div className="flex gap-3">
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo de termo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {Object.entries(CONSENT_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="revogado">Revogados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Consent table */}
              <div className="divide-y rounded-lg border">
                {filtered.map((c: ConsentEntry) => (
                  <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{CONSENT_LABELS[c.tipo] ?? c.tipo}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Aceito em {new Date(c.aceitoEm).toLocaleString('pt-BR')}
                        {c.ipAddress && ` · IP: ${c.ipAddress}`}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        Doc hash: {c.versaoDocumento.slice(0, 16)}…
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {c.revokedAt ? (
                        <Badge className="bg-red-100 text-red-700 text-xs gap-1">
                          <XCircle className="h-3 w-3" />
                          Revogado {new Date(c.revokedAt).toLocaleDateString('pt-BR')}
                        </Badge>
                      ) : (
                        <>
                          <Badge className="bg-green-100 text-green-700 text-xs gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Ativo
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                            onClick={() => handleRevoke(c.id)}
                          >
                            Revogar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum consentimento encontrado para os filtros selecionados.
                  </div>
                )}
              </div>

              {/* LGPD warning */}
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <p>
                  A revogação de consentimento LGPD implica na necessidade de parar o processamento dos
                  dados do paciente. Use o Export LGPD + Anonimizar para exercer o direito ao esquecimento
                  (Art. 18, VI).
                </p>
              </div>
            </div>
          )}

          {loading && (
            <p className="text-center text-sm text-muted-foreground py-4">Carregando...</p>
          )}

          {!loading && pacienteId && consents.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Nenhum consentimento registrado para este paciente.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
