'use client'

import Link from 'next/link'
import { Heart, Phone, Mail, Calendar, ChevronLeft, Sparkles, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PacienteHeaderProps {
  patient: {
    id: string
    nome: string
    telefone: string | null
    email: string | null
    dataNascimento: string | null
    sexo: string | null
    origem: string | null
    dadosSensiveis: boolean
    tags: string[]
  }
  counts: {
    treatments: number
    anamneses: number
    medicalRecords: number
  }
}

function calcularIdade(dataNascimento: string | null): number | null {
  if (!dataNascimento) return null
  const nasc = new Date(dataNascimento)
  const hoje = new Date()
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const m = hoje.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--
  return idade
}

function getInitials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const ORIGEM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  google: 'Google',
  walk_in: 'Walk-in',
  outros: 'Outros',
}

export function PacienteHeader({ patient, counts }: PacienteHeaderProps) {
  const idade = calcularIdade(patient.dataNascimento)
  const initials = getInitials(patient.nome)

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb Navigation */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/dashboard/pacientes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-teal dark:hover:text-teal transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Pacientes
        </Link>
        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-500/10 border border-teal-500/15 px-2.5 py-1 rounded-full shadow-inner select-none">
          <Sparkles className="w-3 h-3 text-teal-500 animate-pulse" />
          Ficha do Paciente
        </span>
      </div>

      {/* Patient header card (Glassmorphism Premium Design) */}
      <div className="relative z-10 bg-card/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 md:gap-8 overflow-hidden group">
        
        {/* Glow effects inside the card */}
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-teal-500/[0.08] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[150px] bg-gradient-to-tr from-gold-500/[0.05] via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full xl:w-auto flex-1">
          {/* Avatar Area */}
          <div className="relative shrink-0 select-none group-hover:scale-[1.03] transition-transform duration-300">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-navy via-teal to-gold opacity-20 blur-sm group-hover:opacity-45 transition-opacity duration-300" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-navy to-gold text-white font-black text-3xl flex items-center justify-center shadow-lg border border-white/10">
              {patient.dadosSensiveis ? (
                <Heart className="w-9 h-9 text-red-500 animate-pulse" />
              ) : (
                initials
              )}
            </div>
          </div>

          {/* Name & Badges Area */}
          <div className="space-y-4 min-w-0 flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-3.5 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-foreground leading-tight">{patient.nome}</h1>
                {patient.dadosSensiveis && (
                  <Badge className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm select-none transition-colors hover:bg-red-500/15">
                    <AlertTriangle className="h-3 w-3 shrink-0 mr-1" />
                    Dados Sensíveis
                  </Badge>
                )}
                {patient.origem && (
                  <Badge variant="outline" className="bg-gold-500/5 border-gold-500/20 text-gold-600 dark:text-gold-400 text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 rounded-lg select-none">
                    {ORIGEM_LABELS[patient.origem] ?? patient.origem}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-0.5">
              {patient.tags.map(t => (
                <Badge key={t} className="bg-navy-500/10 border border-navy-500/20 text-navy dark:text-navy-200 text-[10px] font-bold px-3.5 py-1 rounded-full shadow-sm select-none transition-colors hover:bg-navy-500/15">
                  {t}
                </Badge>
              ))}
              {patient.tags.length === 0 && (
                <Badge variant="secondary" className="text-[10px] font-semibold text-muted-foreground/80 bg-muted/40 border border-border/10 py-1 px-3.5 rounded-full select-none">
                  Sem observações registradas
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Cards (Spacious, elegant list with lots of breathing room) */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto shrink-0 z-10">
          {/* Age Card */}
          {idade !== null && (
            <div className="bg-muted/40 dark:bg-zinc-900/40 border border-border/40 rounded-2xl p-4 px-6 flex items-center gap-3.5 min-w-[130px] transition-all hover:bg-muted/60 dark:hover:bg-zinc-900/60 shadow-sm hover:scale-[1.02] duration-200">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-600 dark:text-gold-400 shrink-0 shadow-inner">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-tight">Idade</span>
                <span className="text-sm font-black text-foreground tabular-nums mt-1 whitespace-nowrap">{idade} anos</span>
              </div>
            </div>
          )}

          {/* Phone Card */}
          {patient.telefone && (
            <div className="bg-muted/40 dark:bg-zinc-900/40 border border-border/40 rounded-2xl p-4 px-6 flex items-center gap-3.5 min-w-[180px] transition-all hover:bg-muted/60 dark:hover:bg-zinc-900/60 shadow-sm hover:scale-[1.02] duration-200">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 shadow-inner">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-tight">Telefone</span>
                <span className="text-sm font-black text-foreground tabular-nums mt-1 whitespace-nowrap">{patient.telefone}</span>
              </div>
            </div>
          )}

          {/* Email Card */}
          {patient.email && (
            <div className="bg-muted/40 dark:bg-zinc-900/40 border border-border/40 rounded-2xl p-4 px-6 flex items-center gap-3.5 max-w-[240px] md:max-w-none transition-all hover:bg-muted/60 dark:hover:bg-zinc-900/60 shadow-sm hover:scale-[1.02] duration-200" title={patient.email}>
              <div className="w-10 h-10 rounded-xl bg-navy-500/10 border border-navy-500/20 flex items-center justify-center text-navy dark:text-navy-200 shrink-0 shadow-inner">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-tight">E-mail</span>
                <span className="text-sm font-black text-foreground truncate mt-1">{patient.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Counts Inset Card (High-engineered metrics block) */}
        <div className="bg-muted/30 dark:bg-zinc-900/20 border border-border/30 rounded-2xl p-4 flex sm:flex-row xl:flex-col items-center justify-center gap-6 shrink-0 min-w-full sm:min-w-0 xl:min-w-[140px] w-full sm:w-auto z-10 shadow-inner">
          <div className="text-center w-full sm:w-auto xl:w-full border-r sm:border-r xl:border-r-0 xl:border-b border-border/30 pb-0 sm:pb-0 sm:pr-6 xl:pr-0 xl:pb-3">
            <p className="text-xl font-black text-foreground leading-none tabular-nums">{counts.treatments}</p>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest leading-none">Tratamentos</p>
          </div>
          <div className="text-center w-full sm:w-auto xl:w-full border-r sm:border-r xl:border-r-0 xl:border-b border-border/30 pb-0 sm:pb-0 sm:pr-6 xl:pr-0 xl:pb-3">
            <p className="text-xl font-black text-foreground leading-none tabular-nums">{counts.anamneses}</p>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest leading-none">Anamneses</p>
          </div>
          <div className="text-center w-full sm:w-auto xl:w-full">
            <p className="text-xl font-black text-foreground leading-none tabular-nums">{counts.medicalRecords}</p>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest leading-none">Prontuários</p>
          </div>
        </div>

      </div>
    </div>
  )
}
