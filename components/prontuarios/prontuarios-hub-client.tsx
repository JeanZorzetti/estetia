'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileText, ClipboardList, AlertCircle, Heart,
  User, ChevronRight, Plus, Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NovoProntuarioDialog } from './novo-prontuario-dialog'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicalRecord {
  id: string
  dataAtendimento: string
  queixaPrincipal: string | null
  hipoteseDiagnostica: string | null
  profissionalId: string | null
  profissional: { nome: string } | null
  createdAt: string
  patient: { id: string; nome: string }
}

interface PatientWithRecords {
  id: string
  nome: string
  alergias: string[]
  tags: string[]
  _count: { medicalRecords: number }
  medicalRecords: Array<{
    id: string
    dataAtendimento: string
  }>
}

interface KPIs {
  recordsCount: number
  pendingAnamneses: number
  uniquePatients: number
  topProfessional: { nome: string; count: number } | null
}

interface Props {
  records: MedicalRecord[]
  patients: PatientWithRecords[]
  kpis: KPIs
}

// ─── Helper Functions ──────────────────────────────────────────────────────────

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Mapeamento dinâmico de cores dos KPIs para vitrines de joias e glows sutis
const getKpiStyling = (label: string, hasPending: boolean) => {
  if (label.includes('pendentes')) {
    if (hasPending) {
      return {
        glow: 'group-hover:shadow-[0_20px_40px_rgba(224,90,78,0.06)] group-hover:border-[#E05A4E]/30',
        iconBg: 'bg-[#E05A4E]/10 border-[#E05A4E]/20 text-[#E05A4E]',
        valueClass: 'text-[#E05A4E]',
        avatarGrad: 'from-red-500/10 to-red-600/10',
      }
    }
    return {
      glow: 'group-hover:shadow-[0_20px_40px_rgba(100,116,139,0.06)] group-hover:border-slate-200/60',
      iconBg: 'bg-slate-100 border-white/80 text-slate-500',
      valueClass: 'text-slate-800',
      avatarGrad: 'from-slate-100 to-slate-200/60',
    }
  }
  if (label.includes('Prontuários')) {
    return {
      glow: 'group-hover:shadow-[0_20px_40px_rgba(72,159,181,0.06)] group-hover:border-[#489FB5]/30',
      iconBg: 'bg-[#489FB5]/10 border-[#489FB5]/20 text-[#489FB5]',
      valueClass: 'text-slate-800',
      avatarGrad: 'from-[#489FB5]/10 to-[#489FB5]/20',
    }
  }
  if (label.includes('Pacientes')) {
    return {
      glow: 'group-hover:shadow-[0_20px_40px_rgba(197,160,89,0.06)] group-hover:border-[#C5A059]/30',
      iconBg: 'bg-[#C5A059]/10 border-[#C5A059]/20 text-[#C5A059]',
      valueClass: 'text-slate-800',
      avatarGrad: 'from-[#C5A059]/10 to-[#C5A059]/20',
    }
  }
  // Top Profissional
  return {
    glow: 'group-hover:shadow-[0_20px_40px_rgba(10,31,61,0.06)] group-hover:border-[#0A1F3D]/20',
    iconBg: 'bg-slate-100 border-white/80 text-[#0A1F3D]',
    valueClass: 'text-slate-800',
    avatarGrad: 'from-[#0A1F3D]/10 to-[#0A1F3D]/20',
  }
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, icon: Icon, accent,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  accent?: boolean
}) {
  const styles = getKpiStyling(label, accent ?? false)

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/50 backdrop-blur-xl',
      'shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:bg-white/70 hover:-translate-y-1 transition-all duration-300 group',
      styles.glow
    )}>
      {/* Double border de seda */}
      <div className="absolute inset-0.5 border border-white/60 rounded-[14px] pointer-events-none" />

      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={cn(
              'text-2xl font-black tracking-tight truncate font-serif',
              styles.valueClass
            )}>
              {value}
            </p>
          </div>
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-transform duration-300 group-hover:scale-105',
            styles.iconBg
          )}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/50 bg-white/40 backdrop-blur-2xl p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center gap-6">
      <div className="absolute inset-0.5 border border-white/60 rounded-[2.1rem] pointer-events-none" />
      
      {/* Decorative Halo inside Empty State */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-[40px] pointer-events-none" />

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200/60 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
        <ClipboardList className="w-8 h-8 text-[#C5A059]" />
      </div>

      <div className="max-w-md relative z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-700 border border-amber-500/20 backdrop-blur-md mb-3">
          Estetia CRM Executive
        </span>
        <h3 className="text-xl font-extrabold text-slate-800 font-serif tracking-tight">
          Nenhum Registro Clínico Iniciado
        </h3>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Comece agora mesmo a documentar a evolução de seus pacientes de elite com nossa ficha de prontuários de alta fidelidade.
        </p>
      </div>

      <Button 
        onClick={onNew} 
        className="relative z-10 bg-gradient-to-r from-[#C5A059] to-[#E5C07B] hover:opacity-90 shadow-[0_4px_20px_rgba(197,160,89,0.25)] text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-medium px-6 py-2.5 rounded-full flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4 mr-1" />
        Criar Primeiro Prontuário
      </Button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProntuariosHubClient({ records, patients, kpis }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const hasData = records.length > 0 || patients.length > 0

  return (
    <>
      <NovoProntuarioDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <div className="relative flex flex-col gap-6 p-6 min-h-screen overflow-hidden">
        {/* Fundo com textura física de micro-grão */}
        <div className="bg-[radial-gradient(rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.15] pointer-events-none absolute inset-0 z-0" />

        {/* Halos estelares tridimensionais desfocados */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(72,159,181,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-[80px] pointer-events-none z-0" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-700 border border-amber-500/20 backdrop-blur-md mb-2">
              👑 HUB OPERACIONAL VIP · REGISTRO DE PRONTUÁRIOS
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 font-serif">
              Prontuários
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Evolução clínica dos seus pacientes</p>
          </div>
          <Button 
            onClick={() => setDialogOpen(true)} 
            className="flex-shrink-0 self-start sm:self-center bg-gradient-to-r from-[#C5A059] to-[#E5C07B] hover:opacity-90 shadow-[0_4px_20px_rgba(197,160,89,0.25)] text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-medium px-5 py-2.5 rounded-full flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Prontuário
          </Button>
        </div>

        {/* KPIs */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Prontuários (30d)"
            value={kpis.recordsCount}
            icon={FileText}
          />
          <KpiCard
            label="Anamneses pendentes"
            value={kpis.pendingAnamneses}
            icon={AlertCircle}
            accent={kpis.pendingAnamneses > 0}
          />
          <KpiCard
            label="Pacientes únicos (30d)"
            value={kpis.uniquePatients}
            icon={Heart}
          />
          <KpiCard
            label="Top profissional"
            value={kpis.topProfessional ? `${kpis.topProfessional.nome} (${kpis.topProfessional.count})` : '—'}
            icon={Trophy}
          />
        </div>

        {/* Tabs */}
        <div className="relative z-10 flex flex-col gap-4">
          {!hasData ? (
            <EmptyState onNew={() => setDialogOpen(true)} />
          ) : (
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="mb-6 inline-flex h-11 items-center justify-center rounded-full bg-slate-100/80 p-1 text-slate-500 border border-slate-200/40 backdrop-blur-md">
                <TabsTrigger 
                  value="timeline"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm data-[state=active]:border-white/50 border border-transparent"
                >
                  Timeline global
                </TabsTrigger>
                <TabsTrigger 
                  value="patients"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm data-[state=active]:border-white/50 border border-transparent"
                >
                  Por paciente
                </TabsTrigger>
              </TabsList>

              {/* Tab 1 — Timeline */}
              <TabsContent value="timeline" className="outline-none focus:outline-none">
                {records.length === 0 ? (
                  <EmptyState onNew={() => setDialogOpen(true)} />
                ) : (
                  <div className="relative rounded-[2.2rem] border border-slate-200/50 bg-white/40 backdrop-blur-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                    {/* Double-border interno perolado */}
                    <div className="absolute inset-0.5 border border-white/60 rounded-[2.1rem] pointer-events-none" />

                    <div className="relative z-10 flex flex-col gap-2">
                      {/* Header row */}
                      <div className="hidden md:grid grid-cols-[140px_1fr_200px_130px] gap-4 px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Data</span>
                        <span>Paciente / Queixa</span>
                        <span>Profissional</span>
                        <span className="text-right pr-4">Tipo</span>
                      </div>

                      {records.map(r => {
                        const patientInitials = getInitials(r.patient.nome)
                        return (
                          <Link
                            key={r.id}
                            href={`/dashboard/pacientes/${r.patient.id}/prontuario`}
                            className={cn(
                              'grid grid-cols-1 md:grid-cols-[140px_1fr_200px_130px] gap-4 items-center',
                              'px-5 py-4 rounded-2xl border border-transparent hover:border-slate-200/50',
                              'hover:bg-white/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.015)]',
                              'transition-all duration-300 group relative overflow-hidden',
                            )}
                          >
                            {/* Filete de status vertical hover */}
                            <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-[#C5A059] to-[#E5C07B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Data */}
                            <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 pb-2 md:pb-0 border-slate-100">
                              <p className="text-sm font-semibold text-slate-700 font-mono tracking-tight">
                                {format(new Date(r.dataAtendimento), 'dd/MM/yyyy', { locale: ptBR })}
                              </p>
                              <p className="text-xs font-medium text-slate-400">
                                {format(new Date(r.dataAtendimento), 'HH:mm')}h
                              </p>
                            </div>

                            {/* Paciente e Queixa */}
                            <div className="min-w-0 flex items-center gap-3">
                              {/* Avatar com iniciais em gradiente metálico */}
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200/60 border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-center text-xs font-bold text-slate-500 font-serif flex-shrink-0">
                                {patientInitials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#489FB5] transition-colors duration-300">
                                  {r.patient.nome}
                                </p>
                                {r.queixaPrincipal ? (
                                  <p className="text-xs text-slate-500 truncate font-medium mt-0.5">
                                    {r.queixaPrincipal}
                                  </p>
                                ) : (
                                  <p className="text-xs text-slate-400 italic font-medium mt-0.5">
                                    Sem queixa principal
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Profissional */}
                            <div className="min-w-0">
                              {r.profissional ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100/80 border border-white flex items-center justify-center flex-shrink-0">
                                    <User className="w-3.5 h-3.5 text-[#0A1F3D]" />
                                  </div>
                                  <span className="text-sm font-semibold text-slate-600 truncate">
                                    {r.profissional.nome}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-medium text-slate-400 italic">Profissional não informado</span>
                              )}
                            </div>

                            {/* Tipo e Link */}
                            <div className="flex items-center justify-between md:justify-end gap-3 mt-2 md:mt-0">
                              {r.hipoteseDiagnostica ? (
                                <Badge className="bg-red-500/10 text-red-600 border border-red-500/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md hover:bg-red-500/15">
                                  Diagnóstico
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md hover:bg-emerald-500/15">
                                  Atendimento
                                </Badge>
                              )}
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#489FB5] transition-colors duration-300 flex-shrink-0" />
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2 — By patient */}
              <TabsContent value="patients" className="outline-none focus:outline-none">
                {patients.length === 0 ? (
                  <EmptyState onNew={() => setDialogOpen(true)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {patients.map(p => {
                      const lastVisit = p.medicalRecords[0]?.dataAtendimento
                      const patientInitials = getInitials(p.nome)
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            'relative overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white/40 backdrop-blur-2xl p-6',
                            'shadow-[0_12px_40px_rgba(0,0,0,0.015)] hover:bg-white/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.035)]',
                            'hover:-translate-y-1 transition-all duration-300 group flex flex-col gap-4',
                          )}
                        >
                          {/* Double border de seda para cartões */}
                          <div className="absolute inset-0.5 border border-white/60 rounded-[1.9rem] pointer-events-none" />

                          {/* Patient name & avatar */}
                          <div className="flex items-start gap-3 relative z-10">
                            {/* Avatar com iniciais em gradiente dourado metálico */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A059]/10 to-[#E5C07B]/20 border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-center text-sm font-bold text-[#C5A059] font-serif flex-shrink-0">
                              {patientInitials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#489FB5] transition-colors duration-300">
                                {p.nome}
                              </p>
                              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                                {p._count.medicalRecords} prontuário{p._count.medicalRecords !== 1 ? 's' : ''}
                                {lastVisit && (
                                  <> · Última visita {format(new Date(lastVisit), 'dd/MM/yy', { locale: ptBR })}</>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Clinical tags / Alergias */}
                          {(p.alergias.length > 0 || p.tags.length > 0) && (
                            <div className="flex flex-wrap gap-1.5 relative z-10">
                              {p.alergias.slice(0, 2).map(a => (
                                <Badge key={a} className="bg-red-500/10 text-red-600 border border-red-500/20 backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-md hover:bg-red-500/15">
                                  ⚠ {a}
                                </Badge>
                              ))}
                              {p.tags.slice(0, 3).map(t => (
                                <Badge key={t} className="bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-md hover:bg-[#C5A059]/15 uppercase tracking-wider">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Divider */}
                          <div className="w-full h-px bg-slate-100 relative z-10" />

                          {/* Link */}
                          <div className="flex justify-end relative z-10 mt-1">
                            <Link
                              href={`/dashboard/pacientes/${p.id}/prontuario`}
                              className={cn(
                                'flex items-center gap-1 text-[11px] font-bold text-[#C5A059] hover:text-[#E5C07B] transition-colors uppercase tracking-wider',
                              )}
                            >
                              Ver prontuário completo
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  )
}
