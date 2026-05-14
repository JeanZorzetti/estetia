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
    <div className="flex flex-col gap-1.5">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/dashboard/pacientes/${session.treatment.pacienteId}`}
          className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 hover:bg-amber-50 hover:border-amber-300 transition-colors group"
        >
          <ClipboardList className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate group-hover:text-amber-800 transition-colors">
              {session.treatment.paciente.nome}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600 shrink-0">
            <Clock className="w-3 h-3" />
            <span>{formatTime(session.dataAgendada)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
