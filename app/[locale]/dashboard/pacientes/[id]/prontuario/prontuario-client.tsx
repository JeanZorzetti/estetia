'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calendar, FileText, ClipboardList, Shield,
  Phone, Mail, AlertTriangle, Clock,
  ChevronRight, Loader2, ChevronLeft, Award, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
  AVALIACAO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
  ORCAMENTO_ENVIADO: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
  AGENDADO: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
  EM_ANDAMENTO: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
  EM_TRATAMENTO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
  FINALIZADO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
  CONCLUIDO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
  RETORNO: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 font-bold px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide leading-none',
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

  const age = patient.dataNascimento
    ? Math.floor((Date.now() - new Date(patient.dataNascimento).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  const initials = patient.nome.trim().split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase()

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-6 relative overflow-hidden min-h-screen">
      {/* Premium multi-layered decorative gradient glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-indigo-500/10 via-violet-500/3 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-cyan-500/5 via-blue-500/2 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Breadcrumb Navigation */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/dashboard/pacientes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Pacientes
        </Link>
        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/15 px-2.5 py-1 rounded-full shadow-inner select-none">
          <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
          Painel Clínico
        </span>
      </div>

      {/* Patient header card (Glassmorphism Premium Redesigned) */}
      <div className="relative z-10 bg-card/60 dark:bg-zinc-950/60 backdrop-blur-lg border border-border/50 rounded-3xl p-6 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden group">
        
        {/* Glow effects inside the card */}
        <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-gradient-to-bl from-indigo-500/[0.08] via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[100px] bg-gradient-to-tr from-violet-500/[0.05] via-transparent to-transparent rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row gap-5.5 items-start w-full lg:w-auto flex-1">
          {/* Avatar Area */}
          <div className="relative shrink-0 select-none group-hover:scale-[1.03] transition-transform duration-300">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 text-white font-black text-2xl flex items-center justify-center shadow-lg border border-white/10">
              {initials || patient.nome.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Name & Badges Area */}
          <div className="space-y-2.5 min-w-0 flex-1">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black tracking-tight text-foreground">{patient.nome}</h1>
                <Badge variant="outline" className="bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 select-none">
                  Paciente
                </Badge>
              </div>
              {patient.origem && (
                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                  Origem: <span className="text-foreground/80">{patient.origem}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {patient.alergias.map(a => (
                <Badge key={a} className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 select-none">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  {a}
                </Badge>
              ))}
              {patient.tags.map(t => (
                <Badge key={t} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                  {t}
                </Badge>
              ))}
              {patient.alergias.length === 0 && patient.tags.length === 0 && (
                <Badge variant="secondary" className="text-[9px] font-bold text-muted-foreground/80 bg-muted/30 border border-border/10 py-0.5 px-2 rounded-full select-none">
                  Sem alergias ou observações
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Cards Grid (Middle Column) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto shrink-0 z-10">
          {/* Age Card */}
          {age && (
            <div className="bg-muted/30 dark:bg-zinc-900/40 border border-border/40 rounded-2xl p-2.5 pr-4 flex items-center gap-2.5 min-w-[120px] transition-all hover:bg-muted/50 dark:hover:bg-zinc-900/60 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-wider leading-none">Idade</span>
                <span className="text-[11px] font-black text-foreground tabular-nums mt-0.5 whitespace-nowrap">{age} anos</span>
              </div>
            </div>
          )}

          {/* Phone Card */}
          {patient.telefone && (
            <div className="bg-muted/30 dark:bg-zinc-900/40 border border-border/40 rounded-2xl p-2.5 pr-4 flex items-center gap-2.5 min-w-[150px] transition-all hover:bg-muted/50 dark:hover:bg-zinc-900/60 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-wider leading-none">Telefone</span>
                <span className="text-[11px] font-black text-foreground tabular-nums mt-0.5 whitespace-nowrap">{patient.telefone}</span>
              </div>
            </div>
          )}

          {/* Email Card */}
          {patient.email && (
            <div className="bg-muted/30 dark:bg-zinc-900/40 border border-border/40 rounded-2xl p-2.5 pr-4 flex items-center gap-2.5 max-w-[210px] sm:max-w-none transition-all hover:bg-muted/50 dark:hover:bg-zinc-900/60 shadow-sm" title={patient.email}>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-wider leading-none">E-mail</span>
                <span className="text-[11px] font-black text-foreground truncate mt-0.5">{patient.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button (Right Area) */}
        {canEdit && (
          <div className="w-full lg:w-auto shrink-0 flex justify-end z-10">
            <Button size="sm" className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 px-6 py-4.5 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 w-full lg:w-auto flex items-center justify-center gap-2 border border-indigo-400/20 cursor-pointer text-xs uppercase tracking-wider">
              + Novo Registro
            </Button>
          </div>
        )}
      </div>

      {/* Alertas clínicos (Glassmorphism Warning Panel) */}
      {(patient.medicacoesUso.length > 0 || patient.contraindicacoes.length > 0) && (
        <div className="relative z-10 bg-amber-500/[0.03] dark:bg-amber-500/[0.01] border border-amber-500/20 dark:border-amber-500/10 rounded-2xl p-4 flex gap-4 items-start overflow-hidden shadow-sm backdrop-blur-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 space-y-2.5 text-xs">
            {patient.medicacoesUso.length > 0 && (
              <p className="text-foreground/80 leading-relaxed font-semibold">
                <strong className="text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[9px] tracking-wider block mb-0.5">Medicamentos em uso</strong> 
                {patient.medicacoesUso.join(', ')}
              </p>
            )}
            {patient.contraindicacoes.length > 0 && (
              <p className="text-red-600 dark:text-red-400 leading-relaxed font-semibold">
                <strong className="text-red-600 dark:text-red-400 font-extrabold uppercase text-[9px] tracking-wider block mb-0.5">Contraindicações clínicas</strong> 
                {patient.contraindicacoes.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <Tabs defaultValue="historico" className="flex-1 flex flex-col relative z-10">
        <TabsList className="mb-6 bg-muted/20 dark:bg-zinc-900/40 p-1 rounded-2xl border border-border/40 flex flex-wrap gap-1 w-fit max-w-full shadow-inner backdrop-blur-md">
          <TabsTrigger 
            value="historico" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-500/20 dark:data-[state=active]:text-indigo-400 border border-transparent data-[state=active]:border-indigo-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            Prontuário ({records.length})
          </TabsTrigger>
          <TabsTrigger 
            value="anamnese" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-500/20 dark:data-[state=active]:text-indigo-400 border border-transparent data-[state=active]:border-indigo-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <ClipboardList className="h-3.5 w-3.5 shrink-0" />
            Anamneses ({anamneses.length})
          </TabsTrigger>
          <TabsTrigger 
            value="tratamentos" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-500/20 dark:data-[state=active]:text-indigo-400 border border-transparent data-[state=active]:border-indigo-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            Tratamentos ({treatments.length})
          </TabsTrigger>
          <TabsTrigger 
            value="consentimentos" 
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-500/20 dark:data-[state=active]:text-indigo-400 border border-transparent data-[state=active]:border-indigo-500/20 shadow-sm flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Shield className="h-3.5 w-3.5 shrink-0" />
            Consentimentos ({consentLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* Prontuário tab */}
        <TabsContent value="historico" className="flex-1 outline-none">
          <ScrollArea className="h-[calc(100vh-23rem)]">
            <div className="space-y-4 pr-4 pb-8">
              {records.length === 0 && (
                <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-indigo-500" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Nenhum registro clínico ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">Registre o histórico de atendimentos do paciente</p>
                </div>
              )}
              {records.map(r => (
                <Card key={r.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/25 hover:shadow-md hover:shadow-indigo-500/[0.01] rounded-2xl group relative pl-3">
                  {/* Left accent color bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-l-2xl" />
                  
                  <button
                    className="w-full text-left focus-visible:outline-none cursor-pointer"
                    onClick={() => loadRecord(r.id)}
                  >
                    <CardHeader className="pb-3.5 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-sm font-extrabold text-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors truncate capitalize">
                            {new Date(r.dataAtendimento).toLocaleDateString('pt-BR', {
                              weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                            })}
                          </CardTitle>
                          {r.profissional && (
                            <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              Profissional: {r.profissional.nome}
                            </p>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border/10 flex items-center justify-center shrink-0">
                          <ChevronRight className={cn(
                            'h-4 w-4 text-muted-foreground transition-transform duration-300',
                            activeRecord === r.id && 'rotate-90 text-indigo-500'
                          )} />
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {activeRecord === r.id && (
                    <CardContent className="border-t border-border/10 bg-muted/10 dark:bg-zinc-900/10 p-5 text-xs space-y-4 font-medium leading-relaxed">
                      {loadingRecord ? (
                        <div className="flex items-center gap-2 text-muted-foreground justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                          <span>Carregando detalhes clínicos...</span>
                        </div>
                      ) : recordContent ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                          {(recordContent as { queixaPrincipal?: string }).queixaPrincipal && (
                            <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[9px] tracking-wider block">Queixa Principal</span>
                              <p className="text-foreground/90 font-semibold">{(recordContent as { queixaPrincipal: string }).queixaPrincipal}</p>
                            </div>
                          )}
                          {(recordContent as { hipoteseDiagnostica?: string }).hipoteseDiagnostica && (
                            <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                              <span className="text-violet-600 dark:text-violet-400 font-extrabold uppercase text-[9px] tracking-wider block">Hipótese Diagnóstica</span>
                              <p className="text-foreground/90 font-semibold">{(recordContent as { hipoteseDiagnostica: string }).hipoteseDiagnostica}</p>
                            </div>
                          )}
                          {(recordContent as { planoTratamento?: string }).planoTratamento && (
                            <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold uppercase text-[9px] tracking-wider block">Plano de Tratamento</span>
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
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Anamneses tab */}
        <TabsContent value="anamnese" className="flex-1 outline-none">
          <ScrollArea className="h-[calc(100vh-23rem)]">
            <div className="space-y-4 pr-4 pb-8">
              {anamneses.length === 0 && (
                <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <ClipboardList className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Nenhuma anamnese preenchida ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">Fichas e questionários de saúde do paciente</p>
                </div>
              )}
              {anamneses.map(a => (
                <Card key={a.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/25 hover:shadow-md hover:shadow-emerald-500/[0.01] rounded-2xl group relative pl-3">
                  {/* Left accent color bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-l-2xl" />

                  <CardContent className="p-5 text-xs space-y-3 font-semibold">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="font-extrabold text-sm text-foreground/90 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-500" />
                        Ficha de Anamnese Clínico-Estética
                      </span>
                      {a.assinadoEm && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shadow-sm relative overflow-hidden select-none">
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          Assinada
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground font-semibold text-[10px] flex items-center gap-1.5 flex-wrap">
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
                        className="h-8 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white transition-all duration-300 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm hover:shadow-indigo-500/10 cursor-pointer"
                        onClick={() => window.open(`/api/clinica/anamnese/${a.id}`, '_blank')}
                      >
                        Visualizar questionário completo →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tratamentos tab */}
        <TabsContent value="tratamentos" className="flex-1 outline-none">
          <ScrollArea className="h-[calc(100vh-23rem)]">
            <div className="space-y-4 pr-4 pb-8">
              {treatments.length === 0 && (
                <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-rose-500" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Nenhum tratamento em andamento</p>
                  <p className="text-xs text-muted-foreground mt-1">Planos e cronogramas de sessões estéticas del paciente</p>
                </div>
              )}
              {treatments.map(t => {
                const percent = Math.min(100, Math.round((t.sessoesRealizadas / t.sessoesPrevistas) * 100))
                return (
                  <Card key={t.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-rose-500/25 hover:shadow-md hover:shadow-rose-500/[0.01] rounded-2xl group relative pl-3">
                    {/* Left accent color bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-pink-600 rounded-l-2xl" />
                    
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <span className="font-extrabold text-sm text-foreground/90 leading-tight">
                          {t.descricaoCustomizada ?? t.tipoTratamento}
                        </span>
                        <span className={cn('shrink-0 border', STATUS_BADGE[t.status] ?? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 font-bold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wide')}>
                          {t.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold flex-wrap">
                        <span className="flex items-center gap-1.5 bg-muted/60 dark:bg-zinc-900/60 border border-border/15 px-2.5 py-1 rounded-lg">
                          <Clock className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          Sessões: {t.sessoesRealizadas}/{t.sessoesPrevistas} realizadas
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted/60 dark:bg-zinc-900/60 border border-border/15 px-2.5 py-1 rounded-lg">
                          <Calendar className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          Início: {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold">
                          <span>Progresso do Tratamento</span>
                          <span className="font-extrabold text-foreground">{percent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted/50 dark:bg-zinc-800/40 overflow-hidden border border-border/10">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-sm shadow-rose-500/20 transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {t.sessions.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-border/10">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Histórico de Sessões Recentes</p>
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {t.sessions.map(s => {
                              const isRealized = s.status === 'REALIZADA'
                              const isNoShow = s.status === 'NO_SHOW'
                              return (
                                <Badge
                                  key={s.id}
                                  className={cn(
                                    'text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border select-none',
                                    isRealized 
                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                      : isNoShow 
                                        ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
                                        : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-400'
                                  )}
                                >
                                  {new Date(s.dataAgendada).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                  {' · '}
                                  {s.status}
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
          </ScrollArea>
        </TabsContent>

        {/* Consentimentos tab */}
        <TabsContent value="consentimentos" className="flex-1 outline-none">
          <ScrollArea className="h-[calc(100vh-23rem)]">
            <div className="space-y-4 pr-4 pb-8">
              {consentLogs.length === 0 && (
                <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-indigo-500" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Nenhum consentimento ativo</p>
                  <p className="text-xs text-muted-foreground mt-1">Termos de privacidade LGPD e imagem do paciente</p>
                </div>
              )}
              {consentLogs.map(c => (
                <Card key={c.id} className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/25 hover:shadow-md hover:shadow-violet-500/[0.01] rounded-2xl group relative pl-3">
                  {/* Left accent color bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-l-2xl" />

                  <CardContent className="p-5 flex items-center justify-between text-xs font-semibold gap-4 flex-wrap">
                    <div className="space-y-1 min-w-0">
                      <p className="font-extrabold text-sm text-foreground/90 truncate">
                        {CONSENT_LABELS[c.tipo] ?? c.tipo}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Aceito em: {new Date(c.aceitoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {c.revokedAt ? (
                      <Badge className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-sm select-none">
                        Revogado
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full shrink-0 shadow-sm flex items-center gap-1.5 select-none">
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
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
