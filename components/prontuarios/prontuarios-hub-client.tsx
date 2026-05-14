'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
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

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, icon: Icon, accent,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  accent?: boolean
}) {
  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
      accent && 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20',
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className={cn(
              'text-2xl font-bold tracking-tight truncate',
              accent && 'text-amber-600 dark:text-amber-400',
            )}>
              {value}
            </p>
          </div>
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            accent ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-muted',
          )}>
            <Icon className={cn('w-5 h-5', accent ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground')} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <ClipboardList className="w-8 h-8 text-muted-foreground/60" />
      </div>
      <div>
        <p className="text-base font-medium text-foreground">Nenhum prontuário ainda</p>
        <p className="text-sm text-muted-foreground mt-1">
          Crie o primeiro registro clínico da organização
        </p>
      </div>
      <Button onClick={onNew} size="sm" className="mt-2">
        <Plus className="w-4 h-4 mr-1.5" />
        Criar primeiro prontuário
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

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Prontuários</h1>
            <p className="text-muted-foreground text-sm mt-1">Evolução clínica dos seus pacientes</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="flex-shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Prontuário
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        {!hasData ? (
          <EmptyState onNew={() => setDialogOpen(true)} />
        ) : (
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Timeline global</TabsTrigger>
              <TabsTrigger value="patients">Por paciente</TabsTrigger>
            </TabsList>

            {/* Tab 1 — Timeline */}
            <TabsContent value="timeline">
              {records.length === 0 ? (
                <EmptyState onNew={() => setDialogOpen(true)} />
              ) : (
                <div className="flex flex-col gap-1">
                  {/* Header row */}
                  <div className="grid grid-cols-[140px_1fr_160px_120px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span>Data</span>
                    <span>Paciente / Queixa</span>
                    <span>Profissional</span>
                    <span>Tipo</span>
                  </div>

                  {records.map(r => (
                    <Link
                      key={r.id}
                      href={`/dashboard/pacientes/${r.patient.id}/prontuario`}
                      className={cn(
                        'grid grid-cols-[140px_1fr_160px_120px] gap-4 items-center',
                        'px-4 py-3 rounded-xl border border-border/50',
                        'hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm',
                        'transition-all duration-150 group',
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium tabular-nums">
                          {format(new Date(r.dataAtendimento), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(r.dataAtendimento), 'HH:mm')}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {r.patient.nome}
                        </p>
                        {r.queixaPrincipal && (
                          <p className="text-xs text-muted-foreground truncate">
                            {r.queixaPrincipal}
                          </p>
                        )}
                      </div>

                      <div className="min-w-0">
                        {r.profissional ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <User className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <span className="text-sm truncate">{r.profissional.nome}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {r.hipoteseDiagnostica ? (
                          <Badge variant="secondary" className="text-xs truncate max-w-[90px]">
                            Diagnóstico
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Atendimento
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab 2 — By patient */}
            <TabsContent value="patients">
              {patients.length === 0 ? (
                <EmptyState onNew={() => setDialogOpen(true)} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {patients.map(p => {
                    const lastVisit = p.medicalRecords[0]?.dataAtendimento
                    return (
                      <Card
                        key={p.id}
                        className="border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <CardContent className="p-5 flex flex-col gap-3">
                          {/* Patient name */}
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate">{p.nome}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {p._count.medicalRecords} prontuário{p._count.medicalRecords !== 1 ? 's' : ''}
                                {lastVisit && (
                                  <> · Última visita {format(new Date(lastVisit), 'dd/MM/yy', { locale: ptBR })}</>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Clinical tags */}
                          {(p.alergias.length > 0 || p.tags.length > 0) && (
                            <div className="flex flex-wrap gap-1.5">
                              {p.alergias.slice(0, 2).map(a => (
                                <Badge key={a} variant="destructive" className="text-xs px-1.5 py-0">
                                  ⚠ {a}
                                </Badge>
                              ))}
                              {p.tags.slice(0, 3).map(t => (
                                <Badge key={t} variant="secondary" className="text-xs px-1.5 py-0">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Link */}
                          <Link
                            href={`/dashboard/pacientes/${p.id}/prontuario`}
                            className={cn(
                              'flex items-center justify-between mt-1',
                              'text-xs font-medium text-primary hover:text-primary/80 transition-colors',
                            )}
                          >
                            Ver prontuário completo
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  )
}
