import type { Patient } from "@prisma/client"
import { RefreshCw } from "lucide-react"

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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
        <RefreshCw className="w-8 h-8 text-muted-foreground/40 mb-2" />
        <p className="text-xs text-muted-foreground">Nenhum paciente para recall no momento</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {patients.slice(0, 5).map((patient) => {
        const days = daysSince(patient.lastSessionAt)
        return (
          <div
            key={patient.id}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-3 py-2.5 hover:border-[#C5A059]/40 transition-colors"
          >
            {/* Avatar */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-semibold shrink-0">
              {getInitials(patient.nome)}
            </div>
            {/* Nome */}
            <p className="flex-1 text-sm text-foreground truncate">{patient.nome}</p>
            {/* Chip */}
            {days !== null && (
              <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-700 shrink-0">
                {days}d sem visita
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
