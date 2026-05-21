import type { TreatmentSession, Treatment, Patient } from "@prisma/client"
import { ClipboardList, Clock } from "lucide-react"
import Link from "next/link"

export type SessionForAnamnesis = TreatmentSession & {
  treatment: Treatment & {
    paciente: Patient
  }
}

interface PendingAnamnesesProps {
  sessions: SessionForAnamnesis[]
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function PendingAnamneses({ sessions }: PendingAnamnesesProps) {
  if (sessions.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2.5">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/dashboard/pacientes/${session.treatment.pacienteId}`}
          className="group relative flex items-center gap-3.5 rounded-xl border border-amber-500/15 bg-gradient-to-r from-amber-500/[0.03] to-amber-600/[0.06] hover:from-amber-500/[0.08] hover:to-amber-600/[0.12] hover:border-amber-500/30 px-3.5 py-2.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-600/5"
        >
          {/* Subtle inside double-border */}
          <div className="absolute inset-0.5 rounded-[10px] border border-white/40 pointer-events-none" />

          {/* Left golden highlight glow */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] rounded-r bg-amber-500/40 group-hover:bg-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Icon Container resembling premium jewel box */}
          <div className="flex items-center justify-center p-2 rounded-lg bg-white/90 shadow-sm border border-amber-200/40 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <ClipboardList className="w-4 h-4 text-amber-600 shrink-0" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase leading-none mb-1">
              Ficha pendente
            </p>
            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-amber-800 transition-colors">
              {session.treatment.paciente.nome}
            </p>
          </div>

          {/* Polished chrome golden capsule */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/15 bg-amber-500/5 shadow-inner text-[10px] font-bold text-amber-700 tracking-wider uppercase shrink-0 transition-colors duration-300 group-hover:bg-amber-500/10 group-hover:border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{formatTime(session.dataAgendada)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

