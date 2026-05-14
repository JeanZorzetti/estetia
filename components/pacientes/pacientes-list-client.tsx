'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Heart, Phone, Mail, ChevronRight, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Patient {
  id: string
  nome: string
  telefone: string | null
  email: string | null
  dataNascimento: string | null
  dadosSensiveis: boolean
  origem: string | null
  tags: string[]
  treatments: { sessions: { dataAgendada: string }[] }[]
  createdAt: string
}

interface PacientesListClientProps {
  initialPatients: Patient[]
  initialQuery: string
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

function getLastSession(patient: Patient): string | null {
  const all = patient.treatments.flatMap(t => t.sessions)
  if (!all.length) return null
  const sorted = all.sort((a, b) => new Date(b.dataAgendada).getTime() - new Date(a.dataAgendada).getTime())
  return new Date(sorted[0].dataAgendada).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function PatientRow({ patient }: { patient: Patient }) {
  const idade = calcularIdade(patient.dataNascimento)
  const lastSession = getLastSession(patient)

  return (
    <Link
      href={`/dashboard/pacientes/${patient.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group border-b border-border/40 last:border-0"
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-[#0A1F3D]/10 flex items-center justify-center text-[#0A1F3D] text-xs font-semibold flex-shrink-0">
        {patient.dadosSensiveis
          ? <Heart className="w-4 h-4 text-[#E05A4E]" />
          : getInitials(patient.nome)}
      </div>

      {/* Nome + badges */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{patient.nome}</span>
          {patient.dadosSensiveis && (
            <Badge variant="secondary" className="text-[10px] bg-red-50 text-red-600 border-red-200 hidden sm:flex">
              Dados sensíveis
            </Badge>
          )}
          {patient.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] hidden sm:flex">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {patient.telefone && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />{patient.telefone}
            </span>
          )}
          {patient.email && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground truncate hidden md:flex">
              <Mail className="w-3 h-3" />{patient.email}
            </span>
          )}
        </div>
      </div>

      {/* Idade */}
      {idade !== null && (
        <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">{idade} anos</span>
      )}

      {/* Último atend. */}
      <div className="text-xs text-muted-foreground flex-shrink-0 hidden md:block w-24 text-right">
        {lastSession ? `Últ. ${lastSession}` : 'Sem sessões'}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
    </Link>
  )
}

function PatientRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-40 mb-1.5" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-3 w-16 hidden sm:block" />
    </div>
  )
}

export function PacientesListClient({ initialPatients, initialQuery }: PacientesListClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(initialQuery)
  const [patients, setPatients] = useState(initialPatients)
  const [loading, setLoading] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) params.set('q', query)
      else params.delete('q')
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [query, pathname, router, searchParams])

  // Fetch when q changes
  useEffect(() => {
    setLoading(true)
    const url = `/api/patients${query ? `?q=${encodeURIComponent(query)}` : ''}`
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.patients) setPatients(data.patients)
      })
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, telefone ou e-mail..."
          className="pl-9"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <PatientRowSkeleton key={i} />)
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {query ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
            </p>
            {!query && (
              <p className="text-xs text-muted-foreground/60">
                Clique em &quot;Novo Paciente&quot; para começar
              </p>
            )}
          </div>
        ) : (
          patients.map(p => <PatientRow key={p.id} patient={p} />)
        )}
      </div>

      {patients.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {patients.length} paciente{patients.length !== 1 ? 's' : ''}
          {query ? ` para "${query}"` : ''}
        </p>
      )}
    </div>
  )
}
