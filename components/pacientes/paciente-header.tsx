'use client'

import Link from 'next/link'
import { Heart, Phone, Mail, Calendar, MapPin, ChevronLeft } from 'lucide-react'
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
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
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

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/pacientes"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Pacientes
      </Link>

      {/* Header card */}
      <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
        {/* Avatar */}
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#0A1F3D]/10 flex items-center justify-center text-[#0A1F3D] text-xl font-bold select-none">
          {patient.dadosSensiveis ? (
            <Heart className="w-7 h-7 text-[#E05A4E]" />
          ) : (
            getInitials(patient.nome)
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-foreground">{patient.nome}</h1>
            {patient.dadosSensiveis && (
              <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-200 text-[10px]">
                Dados sensíveis
              </Badge>
            )}
            {patient.origem && (
              <Badge variant="outline" className="text-[10px]">
                {ORIGEM_LABELS[patient.origem] ?? patient.origem}
              </Badge>
            )}
            {patient.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059]">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            {patient.telefone && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                {patient.telefone}
              </span>
            )}
            {patient.email && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                {patient.email}
              </span>
            )}
            {idade !== null && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {idade} anos
              </span>
            )}
          </div>
        </div>

        {/* Counts */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{counts.treatments}</p>
            <p className="text-[10px] text-muted-foreground">Tratamentos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{counts.anamneses}</p>
            <p className="text-[10px] text-muted-foreground">Anamneses</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{counts.medicalRecords}</p>
            <p className="text-[10px] text-muted-foreground">Prontuários</p>
          </div>
        </div>
      </div>
    </div>
  )
}
