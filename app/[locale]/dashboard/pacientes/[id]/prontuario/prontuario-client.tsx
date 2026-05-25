'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar, FileText, ClipboardList, Shield,
  AlertTriangle, Clock,
  ChevronRight, Loader2
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

const STATUS_LABELS: Record<string, string> = {
  AVALIACAO: 'Avaliação',
  ORCAMENTO_ENVIADO: 'Orçamento Enviado',
  AGENDADO: 'Agendado',
  EM_ANDAMENTO: 'Em Andamento',
  EM_TRATAMENTO: 'Em Tratamento',
  FINALIZADO: 'Finalizado',
  CONCLUIDO: 'Concluído',
  RETORNO: 'Retorno',
}

const SESSION_STATUS_LABELS: Record<string, string> = {
  REALIZADA: 'Realizada',
  NO_SHOW: 'Falta',
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
}

const STATUS_BADGE: Record<string, string> = {
  AVALIACAO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  ORCAMENTO_ENVIADO: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  AGENDADO: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  EM_ANDAMENTO: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  EM_TRATAMENTO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  FINALIZADO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  CONCLUIDO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
  RETORNO: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[10px] tracking-wide leading-tight',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProntuarioClient({ patient, records, anamneses, treatments, consentLogs, canEdit }: Props) {
  const [activeRecord, setActiveRecord] = useState<string | null>(null)
  const [recordContent, setRecordContent] = useState<Record<string, unknown> | null>(null)
  const [loadingRecord, setLoadingRecord] = useState(false)

  const loadRecord = async (id: string) => {
    if (activeRecord === id) {
      setActiveRecord(null)
      return
    }
    setLoadingRecord(true)
    setActiveRecord(id)
    try {
      const res = await fetch(`/api/clinica/prontuario/${id}`)
      const data = await res.json()
      setRecordContent(data.record)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingRecord(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 relative overflow-visible">
      {/* Premium multi-layered decorative gradient glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-teal-500/10 via-navy-500/3 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-gold-500/5 via-navy-500/2 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Alertas clínicos (Glassmorphism Warning Panel with Spacious layout) */}
      {(patient.medicacoesUso.length > 0 || patient.contraindicacoes.length > 0) && (
        <div className="relative z-10 bg-amber-500/[0.04] dark:bg-amber-500/[0.01] border border-amber-500/20 dark:border-amber-500/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start relative shadow-md backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-4 text-xs font-semibold leading-relaxed">
            {patient.medicacoesUso.length > 0 && (
              <div className="space-y-1">
                <span className="text-amber-600 dark:text-amber-400 font-black uppercase text-[10px] tracking-widest block">Medicamentos em uso</span>
                <p className="text-foreground/90 font-bold text-sm">{patient.medicacoesUso.join(', ')}</p>
              </div>
            )}
            {patient.contraindicacoes.length > 0 && (
              <div className="space-y-1">
                <span className="text-red-600 dark:text-red-400 font-black uppercase text-[10px] tracking-widest block">Contraindicações clínicas</span>
                <p className="text-red-600 dark:text-red-400 font-bold text-sm">{patient.contraindicacoes.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <Tabs defaultValue="historico" className="flex-1 flex flex-col relative z-10">
        <TabsList className="mb-6 bg-muted/20 dark:bg-zinc-900/40 p-1 rounded-2xl border border-border/40 flex flex-wrap gap-1 w-fit max-w-full shadow-inner backdrop-blur-md">
          <TabsTrigger 
            value="historico" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-navy data-[state=active]:text-white dark:data-[state=active]:bg-navy-500/20 dark:data-[state=active]:text-navy-200 border border-transparent data-[state=active]:border-navy-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-navy dark:hover:text-navy-200"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            Prontuário ({records.length})
          </TabsTrigger>
          <TabsTrigger 
            value="anamnese" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-navy data-[state=active]:text-white dark:data-[state=active]:bg-navy-500/20 dark:data-[state=active]:text-navy-200 border border-transparent data-[state=active]:border-navy-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-navy dark:hover:text-navy-200"
          >
            <ClipboardList className="h-3.5 w-3.5 shrink-0" />
            Anamneses ({anamneses.length})
          </TabsTrigger>
          <TabsTrigger 
            value="tratamentos" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-navy data-[state=active]:text-white dark:data-[state=active]:bg-navy-500/20 dark:data-[state=active]:text-navy-200 border border-transparent data-[state=active]:border-navy-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-navy dark:hover:text-navy-200"
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            Tratamentos ({treatments.length})
          </TabsTrigger>
          <TabsTrigger 
            value="consentimentos" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-navy data-[state=active]:text-white dark:data-[state=active]:bg-navy-500/20 dark:data-[state=active]:text-navy-200 border border-transparent data-[state=active]:border-navy-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-navy dark:hover:text-navy-200"
          >
            <Shield className="h-3.5 w-3.5 shrink-0" />
            Consentimentos ({consentLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* Prontuário tab */}
        <TabsContent value="historico" className="flex-1 outline-none">
          <div className="space-y-4 pb-8">
            {records.length === 0 && (
              <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-teal-500" />
                </div>
                <p className="text-sm font-bold text-foreground">Nenhum registro clínico ainda</p>
                <p className="text-xs text-muted-foreground mt-1">Registre o histórico de atendimentos do paciente</p>
              </div>
            )}
            {records.map(r => {
              const dateObj = new Date(r.dataAtendimento)
              const formattedDate = dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
              const weekday = dateObj.toLocaleDateString('pt-BR', {
                weekday: 'long',
              })

              return (
                <Card key={r.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/25 hover:shadow-md hover:shadow-teal-500/[0.01] rounded-2xl group relative pl-3">
                  {/* Left accent color bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-navy to-teal rounded-l-2xl" />
                  
                  <button
                    className="w-full text-left focus-visible:outline-none cursor-pointer"
                    onClick={() => loadRecord(r.id)}
                  >
                    <CardHeader className="pb-3.5 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1.5 min-w-0">
                          <CardTitle className="text-sm md:text-base font-extrabold text-foreground group-hover:text-teal dark:group-hover:text-teal transition-colors capitalize flex flex-wrap items-center gap-1.5 leading-tight">
                            <span>{formattedDate}</span>
                            <span className="text-[11px] md:text-xs font-semibold text-muted-foreground lowercase">({weekday})</span>
                          </CardTitle>
                          {r.profissional && (
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold flex items-center gap-1.5 leading-tight">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                              Profissional: {r.profissional.nome}
                            </p>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border/10 flex items-center justify-center shrink-0">
                          <ChevronRight className={cn(
                            'h-4 w-4 text-muted-foreground transition-transform duration-300',
                            activeRecord === r.id && 'rotate-90 text-teal'
                          )} />
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {activeRecord === r.id && (
                    <CardContent className="border-t border-border/10 bg-muted/10 dark:bg-zinc-900/10 p-5 text-xs space-y-4 font-medium leading-relaxed">
                      {loadingRecord ? (
                        <div className="flex items-center gap-2 text-muted-foreground justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-teal" />
                          <span>Carregando detalhes clínicos...</span>
                        </div>
                      ) : recordContent ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                          {(recordContent as { queixaPrincipal?: string }).queixaPrincipal && (
                            <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                              <span className="text-navy dark:text-teal font-extrabold uppercase text-[10px] tracking-wider block leading-normal">Queixa Principal</span>
                              <p className="text-foreground/90 font-semibold">{(recordContent as { queixaPrincipal: string }).queixaPrincipal}</p>
                            </div>
                          )}
                          {(recordContent as { hipoteseDiagnostica?: string }).hipoteseDiagnostica && (
                            <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                              <span className="text-gold-600 dark:text-gold-400 font-extrabold uppercase text-[10px] tracking-wider block leading-normal">Hipótese Diagnóstica</span>
                              <p className="text-foreground/90 font-semibold">{(recordContent as { hipoteseDiagnostica: string }).hipoteseDiagnostica}</p>
                            </div>
                          )}
                          {(recordContent as { planoTratamento?: string }).planoTratamento && (
                            <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                              <span className="text-teal-600 dark:text-teal-400 font-extrabold uppercase text-[10px] tracking-wider block leading-normal">Plano de Tratamento</span>
                              <p className="text-foreground/90 font-semibold">{(recordContent as { planoTratamento: string }).planoTratamento}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">{r.queixaPrincipal ?? 'Sem detalhes registrados.'}</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Anamneses tab */}
        <TabsContent value="anamnese" className="flex-1 outline-none">
          <div className="space-y-4 pb-8">
            {anamneses.length === 0 && (
              <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-teal-500" />
                </div>
                <p className="text-sm font-bold text-foreground">Nenhuma anamnese preenchida ainda</p>
                <p className="text-xs text-muted-foreground mt-1">Fichas e questionários de saúde do paciente</p>
              </div>
            )}
            {anamneses.map(a => (
              <Card key={a.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/25 hover:shadow-md hover:shadow-teal-500/[0.01] rounded-2xl group relative pl-3">
                {/* Left accent color bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal to-teal-600 rounded-l-2xl" />

                <CardContent className="p-5 text-xs space-y-3 font-semibold">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="font-extrabold text-sm text-foreground/90 flex items-center gap-1.5 leading-tight">
                      <Award className="w-4 h-4 text-teal-500" />
                      Ficha de Anamnese Clínico-Estética
                    </span>
                    {a.assinadoEm && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-bold shadow-sm relative overflow-hidden select-none leading-tight">
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
                        </span>
                        Assinada
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold text-[10px] md:text-xs flex items-center gap-1.5 flex-wrap leading-relaxed">
                    <span>Preenchida em: {new Date(a.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>·</span>
                    <span>Responsável: {a.preenchidoPor}</span>
                    {a.profissional && (
                      <>
                        <span>·</span>
                        <span>Profissional: {a.profissional.nome}</span>
                      </>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-xl border border-teal/20 bg-teal-500/5 hover:bg-teal hover:text-white transition-all duration-300 text-xs font-bold text-teal-600 dark:text-teal-400 shadow-sm hover:shadow-teal/10 cursor-pointer"
                      onClick={() => window.open(`/api/clinica/anamnese/${a.id}`, '_blank')}
                    >
                      Visualizar questionário completo →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tratamentos tab */}
        <TabsContent value="tratamentos" className="flex-1 outline-none">
          <div className="space-y-4 pb-8">
            {treatments.length === 0 && (
              <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-gold" />
                </div>
                <p className="text-sm font-bold text-foreground">Nenhum tratamento em andamento</p>
                <p className="text-xs text-muted-foreground mt-1">Planos e cronogramas de sessões estéticas del paciente</p>
              </div>
            )}
            {treatments.map(t => {
              const percent = Math.min(100, Math.round((t.sessoesRealizadas / t.sessoesPrevistas) * 100))
              return (
                <Card key={t.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/25 hover:shadow-md hover:shadow-gold-500/[0.01] rounded-2xl group relative pl-3">
                  {/* Left accent color bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-600 rounded-l-2xl" />
                  
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <span className="font-extrabold text-sm text-foreground/90 leading-tight">
                        {t.descricaoCustomizada ?? t.tipoTratamento}
                      </span>
                      <span className={cn('shrink-0 border', STATUS_BADGE[t.status] ?? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide leading-tight')}>
                        {STATUS_LABELS[t.status] ?? t.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-semibold flex-wrap">
                      <span className="flex items-center gap-1.5 bg-muted/60 dark:bg-zinc-900/60 border border-border/15 px-2.5 py-1 rounded-lg leading-tight">
                        <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
                        Sessões: {t.sessoesRealizadas}/{t.sessoesPrevistas} realizadas
                      </span>
                      <span className="flex items-center gap-1.5 bg-muted/60 dark:bg-zinc-900/60 border border-border/15 px-2.5 py-1 rounded-lg leading-tight">
                        <Calendar className="h-3.5 w-3.5 text-gold shrink-0" />
                        Início: {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {/* Visual progress bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground font-bold">
                        <span>Progresso do Tratamento</span>
                        <span className="font-extrabold text-foreground">{percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted/50 dark:bg-zinc-800/40 overflow-hidden border border-border/10">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-navy to-gold shadow-sm shadow-gold-500/20 transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {t.sessions.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-border/10">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Histórico de Sessões Recentes</p>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {t.sessions.map(s => {
                            const isRealized = s.status === 'REALIZADA'
                            const isNoShow = s.status === 'NO_SHOW'
                            return (
                              <Badge
                                key={s.id}
                                className={cn(
                                  'text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border select-none leading-tight',
                                  isRealized 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                    : isNoShow 
                                      ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
                                      : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-400'
                                )}
                              >
                                {new Date(s.dataAgendada).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                {' · '}
                                {SESSION_STATUS_LABELS[s.status] ?? s.status}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Consentimentos tab */}
        <TabsContent value="consentimentos" className="flex-1 outline-none">
          <div className="space-y-4 pb-8">
            {consentLogs.length === 0 && (
              <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-teal-500" />
                </div>
                <p className="text-sm font-bold text-foreground">Nenhum consentimento ativo</p>
                <p className="text-xs text-muted-foreground mt-1">Termos de privacidade LGPD e imagem do paciente</p>
              </div>
            )}
            {consentLogs.map(c => (
              <Card key={c.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/25 hover:shadow-md hover:shadow-teal-500/[0.01] rounded-2xl group relative pl-3">
                {/* Left accent color bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-navy to-teal rounded-l-2xl" />

                <CardContent className="p-5 flex items-center justify-between text-xs font-semibold gap-4 flex-wrap">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-extrabold text-sm text-foreground/90 leading-tight break-words">
                      {CONSENT_LABELS[c.tipo] ?? c.tipo}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
                      Aceito em: {new Date(c.aceitoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {c.revokedAt ? (
                    <Badge className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-sm select-none leading-tight">
                      Revogado
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full shrink-0 shadow-sm flex items-center gap-1.5 select-none leading-tight">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Concedido
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
