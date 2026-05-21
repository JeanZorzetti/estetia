import type { Patient } from "@prisma/client"
import { RefreshCw, CalendarCheck } from "lucide-react"

export type PatientWithLastSession = Patient & {
  lastSessionAt: Date | null
}

interface RecallSuggestionsProps {
  patients: PatientWithLastSession[]
}

function daysSince(date: Date | null): number | null {
  if (!date) return null
  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  }

export function RecallSuggestions({ patients }: RecallSuggestionsProps) {
  if (patients.length === 0) {
    return (
      <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-b from-white/30 to-slate-50/10 py-10 px-4 text-center backdrop-blur-md">
        {/* Decorative subtle light halo */}
        <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-[#C5A059]/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-[#489FB5]/5 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 mb-3.5 group-hover:scale-105 transition-transform duration-300">
          <CalendarCheck className="w-5 h-5 text-[#C5A059] animate-pulse" />
        </div>
        
        <h3 className="font-serif font-bold text-slate-800 text-sm tracking-wide mb-1">
          Monitoramento Ativo
        </h3>
        <p className="text-[11px] font-medium text-slate-400 max-w-[200px] leading-relaxed">
          Nenhum paciente necessita de retorno imediato no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {patients.slice(0, 5).map((patient) => {
        const days = daysSince(patient.lastSessionAt)
        return (
          <div
            key={patient.id}
            className="group relative flex items-center gap-3.5 rounded-xl border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 py-2.5 hover:border-[#C5A059]/30 hover:shadow-lg hover:shadow-[#C5A059]/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Subtle inside double-border */}
            <div className="absolute inset-0.5 rounded-[10px] border border-white/40 pointer-events-none" />

            {/* Left accent color highlight */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] rounded-r bg-[#C5A059]/40 group-hover:bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {/* Avatar - Luxurious metallic golden gradient */}
            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#C5A059]/20 to-[#E5C07B]/40 border border-[#C5A059]/25 text-[#8E6D31] text-[11px] font-bold tracking-wider shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
              {getInitials(patient.nome)}
            </div>

            {/* Nome */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase leading-none mb-1">
                Sugestão de Retorno
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-[#8E6D31] transition-colors leading-tight">
                {patient.nome}
              </p>
            </div>

            {/* Chip - Polished metal gold-bronze badge */}
            {days !== null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C5A059]/5 border border-[#C5A059]/20 shadow-inner px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#8E6D31] shrink-0 transition-colors group-hover:bg-[#C5A059]/10 group-hover:border-[#C5A059]/30">
                {days}d sem visita
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

