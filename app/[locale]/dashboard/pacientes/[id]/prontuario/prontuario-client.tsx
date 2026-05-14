'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calendar, FileText, ClipboardList, Shield,
  Phone, Mail, AlertTriangle, CheckCircle, Clock,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Patient {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  dataNascimento: string | null
  alergias: string[]
  medicacoesUso: string[]
  contraindicacoes: string[]
  tags: string[]
  origem: string | null
  createdAt: string
}

interface MedicalRecord {
  id: string
  dataAtendimento: string
  queixaPrincipal: string | null
  hipoteseDiagnostica: string | null
  planoTratamento: string | null
  profissional: { nome: string } | null
  createdAt: string
}

interface Anamnesis {
  id: string
  treatmentId: string | null
  preenchidoPor: string
  assinadoEm: string | null
  createdAt: string
  profissional: { nome: string } | null
}

interface Treatment {
  id: string
  tipoTratamento: string
  descricaoCustomizada: string | null
  status: string
  sessoesRealizadas: number
  sessoesPrevistas: number
  createdAt: string
  sessions: Array<{
    id: string
    dataAgendada: string
    status: string
    noShowScore: number | null
  }>
}

interface ConsentLog {
  id: string
  tipo: string
  aceitoEm: string
  revokedAt: string | null
}

interface Props {
  patient: Patient
  records: MedicalRecord[]
  anamneses: Anamnesis[]
  treatments: Treatment[]
  consentLogs: ConsentLog[]
  canEdit: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONSENT_LABELS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'LGPD — Dados de Saúde',
  USO_FOTO: 'Uso de Imagem',
  AUTORIZACAO_PROCEDIMENTO: 'Autorização de Procedimento',
  TERMO_RISCO: 'Termo de Risco',
}

const STATUS_BADGE: Record<string, string> = {
  AVALIACAO: 'bg-blue-100 text-blue-700',
  ORCAMENTO_ENVIADO: 'bg-yellow-100 text-yellow-700',
  AGENDADO: 'bg-purple-100 text-purple-700',
  EM_ANDAMENTO: 'bg-rose-100 text-rose-700',
  FINALIZADO: 'bg-green-100 text-green-700',
  RETORNO: 'bg-cyan-100 text-cyan-700',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProntuarioClient({ patient, records, anamneses, treatments, consentLogs, canEdit }: Props) {
  const [activeRecord, setActiveRecord] = useState<string | null>(null)
  const [recordContent, setRecordContent] = useState<Record<string, unknown> | null>(null)
  const [loadingRecord, setLoadingRecord] = useState(false)

  const loadRecord = async (id: string) => {
    if (activeRecord === id) { setActiveRecord(null); return }
    setLoadingRecord(true)
    setActiveRecord(id)
    try {
      const res = await fetch(`/api/clinica/prontuario/${id}`)
      const data = await res.json()
      setRecordContent(data.record)
    } finally {
      setLoadingRecord(false)
    }
  }

  const age = patient.dataNascimento
    ? Math.floor((Date.now() - new Date(patient.dataNascimento).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-6">
      {/* Patient header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{patient.nome}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {age && <span>{age} anos</span>}
            {patient.telefone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />{patient.telefone}
              </span>
            )}
            {patient.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />{patient.email}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.alergias.map(a => (
              <Badge key={a} className="bg-red-100 text-red-700 text-xs">
                <AlertTriangle className="mr-1 h-2.5 w-2.5" />{a}
              </Badge>
            ))}
            {patient.tags.map(t => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
        {canEdit && (
          <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
            + Novo Registro
          </Button>
        )}
      </div>

      {/* Alertas clínicos */}
      {(patient.medicacoesUso.length > 0 || patient.contraindicacoes.length > 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4 text-sm space-y-1">
            {patient.medicacoesUso.length > 0 && (
              <p><strong>Medicamentos:</strong> {patient.medicacoesUso.join(', ')}</p>
            )}
            {patient.contraindicacoes.length > 0 && (
              <p className="text-red-700"><strong>Contraindicações:</strong> {patient.contraindicacoes.join(', ')}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="historico" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="historico">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Prontuário ({records.length})
          </TabsTrigger>
          <TabsTrigger value="anamnese">
            <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
            Anamneses ({anamneses.length})
          </TabsTrigger>
          <TabsTrigger value="tratamentos">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            Tratamentos ({treatments.length})
          </TabsTrigger>
          <TabsTrigger value="consentimentos">
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Consentimentos
          </TabsTrigger>
        </TabsList>

        {/* Prontuário tab */}
        <TabsContent value="historico">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="space-y-3 pr-4">
              {records.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Nenhum registro clínico ainda.
                </p>
              )}
              {records.map(r => (
                <Card key={r.id} className="overflow-hidden">
                  <button
                    className="w-full text-left"
                    onClick={() => loadRecord(r.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {new Date(r.dataAtendimento).toLocaleDateString('pt-BR', {
                            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                          })}
                        </CardTitle>
                        <ChevronRight className={cn(
                          'h-4 w-4 text-muted-foreground transition-transform',
                          activeRecord === r.id && 'rotate-90'
                        )} />
                      </div>
                      {r.profissional && (
                        <p className="text-xs text-muted-foreground">{r.profissional.nome}</p>
                      )}
                    </CardHeader>
                  </button>

                  {activeRecord === r.id && (
                    <CardContent className="border-t bg-gray-50 pt-3 text-sm space-y-2">
                      {loadingRecord ? (
                        <p className="text-muted-foreground">Carregando...</p>
                      ) : recordContent ? (
                        <>
                          {(recordContent as { queixaPrincipal?: string }).queixaPrincipal && (
                            <div><strong>Queixa:</strong> {(recordContent as { queixaPrincipal: string }).queixaPrincipal}</div>
                          )}
                          {(recordContent as { hipoteseDiagnostica?: string }).hipoteseDiagnostica && (
                            <div><strong>Hipótese:</strong> {(recordContent as { hipoteseDiagnostica: string }).hipoteseDiagnostica}</div>
                          )}
                          {(recordContent as { planoTratamento?: string }).planoTratamento && (
                            <div><strong>Plano:</strong> {(recordContent as { planoTratamento: string }).planoTratamento}</div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">{r.queixaPrincipal ?? 'Sem detalhes registrados.'}</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Anamneses tab */}
        <TabsContent value="anamnese">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="space-y-3 pr-4">
              {anamneses.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Nenhuma anamnese preenchida ainda.
                </p>
              )}
              {anamneses.map(a => (
                <Card key={a.id}>
                  <CardContent className="pt-4 text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {new Date(a.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      {a.assinadoEm && (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          Assinada
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Preenchida por: {a.preenchidoPor}
                      {a.profissional && ` · ${a.profissional.nome}`}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => window.open(`/api/clinica/anamnese/${a.id}`, '_blank')}
                    >
                      Ver respostas →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tratamentos tab */}
        <TabsContent value="tratamentos">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="space-y-3 pr-4">
              {treatments.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Nenhum tratamento registrado.
                </p>
              )}
              {treatments.map(t => (
                <Card key={t.id}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {t.descricaoCustomizada ?? t.tipoTratamento}
                      </span>
                      <Badge className={cn('text-xs', STATUS_BADGE[t.status] ?? 'bg-gray-100 text-gray-600')}>
                        {t.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t.sessoesRealizadas}/{t.sessoesPrevistas} sessões
                      </span>
                      <span>{new Date(t.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {t.sessions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {t.sessions.map(s => (
                          <Badge
                            key={s.id}
                            className={cn(
                              'text-xs',
                              s.status === 'REALIZADA' ? 'bg-green-100 text-green-700' :
                              s.status === 'NO_SHOW' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'
                            )}
                          >
                            {new Date(s.dataAgendada).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            {' · '}{s.status}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Consentimentos tab */}
        <TabsContent value="consentimentos">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="space-y-3 pr-4">
              {consentLogs.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Nenhum consentimento registrado.
                </p>
              )}
              {consentLogs.map(c => (
                <Card key={c.id}>
                  <CardContent className="pt-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{CONSENT_LABELS[c.tipo] ?? c.tipo}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(c.aceitoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {c.revokedAt ? (
                      <Badge className="bg-red-100 text-red-700 text-xs">Revogado</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 text-xs flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />Ativo
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
