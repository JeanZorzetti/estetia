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
      className="relative flex items-center gap-4 px-5 py-4 hover:bg-white/95 transition-all duration-300 group border-b border-slate-100 last:border-0 hover:shadow-[0_8px_25px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* Light glow indicator on hover */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-300" />

      {/* Avatar with luxury perolade or ruby glow */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0A1F3D]/5 to-[#489FB5]/5 border border-slate-200/50 flex items-center justify-center text-[#0A1F3D] text-xs font-bold flex-shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:scale-105 transition-transform duration-300">
        {patient.dadosSensiveis ? (
          <div className="relative">
            <Heart className="w-4 h-4 text-[#E05A4E] drop-shadow-[0_2px_5px_rgba(224,90,78,0.3)] animate-pulse" />
          </div>
        ) : (
          <span className="font-serif tracking-wider text-[#0A1F3D]/80 group-hover:text-[#8E6D31] transition-colors duration-300">
            {getInitials(patient.nome)}
          </span>
        )}
      </div>

      {/* Nome + badges */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-semibold text-slate-800 group-hover:text-[#8E6D31] transition-colors duration-300 truncate">
            {patient.nome}
          </span>
          {patient.dadosSensiveis && (
            <span className="inline-flex items-center text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/10 text-[#E05A4E] border border-red-500/15 shadow-[0_2px_8px_rgba(224,90,78,0.1)] hidden sm:inline-flex">
              Dados sensíveis
            </span>
          )}
          {patient.tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#8E6D31] hidden sm:inline-flex"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Contact info in per-slot items */}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {patient.telefone && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
              <Phone className="w-3 h-3 text-[#489FB5]/70" />
              {patient.telefone}
            </span>
          )}
          {patient.email && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 truncate hidden md:flex max-w-[200px]">
              <Mail className="w-3 h-3 text-[#489FB5]/70" />
              {patient.email}
            </span>
          )}
        </div>
      </div>

      {/* Idade capsular */}
      {idade !== null && (
        <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/40 text-slate-500 flex-shrink-0 hidden sm:inline-flex">
          {idade} anos
        </span>
      )}

      {/* Último atendimento com badge cromada */}
      <div className="flex-shrink-0 hidden md:block w-32 text-right">
        {lastSession ? (
          <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-700 border border-emerald-500/15">
            Últ. {lastSession}
          </span>
        ) : (
          <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-400 border border-slate-200/30">
            Sem sessões
          </span>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200/30 group-hover:bg-[#C5A059]/10 group-hover:border-[#C5A059]/20 transition-all duration-300 flex-shrink-0">
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8E6D31] transition-colors" />
      </div>
    </Link>
  )
}

function PatientRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0 bg-white/40 backdrop-blur-md animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-100" />
      <div className="flex-1">
        <div className="h-4 w-44 bg-slate-100 rounded mb-2" />
        <div className="h-3 w-32 bg-slate-100 rounded" />
      </div>
      <div className="h-5 w-16 bg-slate-100 rounded hidden sm:block" />
      <div className="h-5 w-24 bg-slate-100 rounded hidden md:block" />
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
    <div className="flex flex-col gap-5 w-full">
      {/* Search Input Bar in Premium Glass */}
      <div className="relative w-full rounded-2xl border border-slate-200/40 bg-white/50 backdrop-blur-md transition-all duration-300 focus-within:border-[#489FB5]/40 focus-within:ring-4 focus-within:ring-[#489FB5]/10 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center px-4 py-1.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0A1F3D]/5 to-[#489FB5]/5 flex items-center justify-center border border-slate-200/10 mr-3 flex-shrink-0">
          <Search className="w-4 h-4 text-[#0A1F3D]/70" />
        </div>
        <Input
          placeholder="Buscar por nome, telefone ou e-mail..."
          className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-xs font-semibold text-slate-700 placeholder-slate-400 h-9"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {isPending && (
          <div className="w-4 h-4 border-2 border-[#489FB5] border-t-transparent rounded-full animate-spin flex-shrink-0 ml-2" />
        )}
      </div>

      {/* Patients List Board */}
      <div className="relative rounded-[2.2rem] border border-slate-200/50 bg-white/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-2">
        {/* Inside white border for double-border luxury glass look */}
        <div className="absolute inset-0.5 rounded-[2.1rem] border border-white/60 pointer-events-none z-20" />
        
        <div className="relative z-10 overflow-hidden rounded-[2.1rem]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <PatientRowSkeleton key={i} />)
          ) : patients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 gap-4 text-center">
              {/* Luxury icon container with double ring */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#C5A059]/10 to-[#E5C07B]/10 flex items-center justify-center border border-[#C5A059]/20 shadow-[0_10px_25px_rgba(197,160,89,0.1)]">
                <div className="absolute inset-1 rounded-full border border-white/50" />
                <UserPlus className="w-6 h-6 text-[#8E6D31] drop-shadow-[0_2px_4px_rgba(142,109,49,0.2)]" />
              </div>
              
              <div className="max-w-xs flex flex-col gap-1">
                <p className="font-serif text-base font-bold text-slate-800 tracking-wide">
                  {query ? 'Nenhum registro localizado' : 'Registro de Elite Vazio'}
                </p>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed mt-1">
                  {query 
                    ? `Não encontramos resultados correspondentes a "${query}" no banco de dados.` 
                    : 'Não há pacientes cadastrados nesta organização. Inicie um novo cadastro VIP.'}
                </p>
              </div>

              {!query && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 text-[8px] font-extrabold text-[#8E6D31] tracking-widest uppercase">
                    ✨ Estetia CRM Executive
                  </span>
                </div>
              )}
            </div>
          ) : (
            patients.map(p => <PatientRow key={p.id} patient={p} />)
          )}
        </div>
      </div>

      {patients.length > 0 && (
        <p className="text-[10px] font-bold text-slate-400 text-center tracking-wider uppercase mt-1">
          {patients.length} paciente{patients.length !== 1 ? 's' : ''}
          {query ? ` para "${query}"` : ''}
        </p>
      )}
    </div>
  )
}
