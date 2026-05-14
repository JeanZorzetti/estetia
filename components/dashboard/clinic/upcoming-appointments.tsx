import type { TreatmentSession, Treatment, Patient, Professional, ClinicRoom, TreatmentType } from "@prisma/client"
import { Clock } from "lucide-react"

const TREATMENT_LABELS: Partial<Record<TreatmentType, string>> = {
  BOTOX: "Botox",
  PREENCHIMENTO: "Preenchimento",
  LASER: "Laser",
  PEELING: "Peeling",
  HARMONIZACAO_FACIAL: "Harmonização Facial",
  LIMPEZA_PELE: "Limpeza de Pele",
  MICROAGULHAMENTO: "Microagulhamento",
  CRIOLIPOLISE: "Criolipólise",
  RADIOFREQUENCIA: "Radiofrequência",
  LUZ_PULSADA: "Luz Pulsada",
  DEPILACAO_LASER: "Depilação Laser",
  SKINBOOSTER: "Skinbooster",
  FIOS_PDO: "Fios PDO",
  BICHECTOMIA: "Bichectomia",
  RINOPLASTIA_NONCIRURGICA: "Rinoplastia Não Cirúrgica",
  OUTROS: "Procedimento",
}

export type SessionWithRelations = TreatmentSession & {
  treatment: Treatment & {
    paciente: Patient
  }
  profissional: Professional | null
  sala: ClinicRoom | null
}

interface UpcomingAppointmentsProps {
  appointments: SessionWithRelations[]
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  AGENDADA: {
    label: "Agendada",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  CONFIRMADA: {
    label: "Confirmada",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  REALIZADA: {
    label: "Realizada",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  NO_SHOW: {
    label: "No-show",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
  REMARCADA: {
    label: "Remarcada",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  CANCELADA: {
    label: "Cancelada",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  },
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center">
        <Clock className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Nenhum atendimento agendado para hoje</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Use a agenda para agendar novos atendimentos</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {appointments.map((session) => {
        const paciente = session.treatment.paciente
        const status = STATUS_LABELS[session.status] ?? {
          label: session.status,
          className: "bg-gray-100 text-gray-600 border border-gray-200",
        }

        return (
          <div
            key={session.id}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm hover:border-[#489FB5]/40 hover:shadow-md transition-all duration-150"
          >
            {/* Avatar */}
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0A1F3D]/10 text-[#0A1F3D] text-xs font-semibold shrink-0 select-none">
              {paciente.fotoPerfil ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={paciente.fotoPerfil}
                  alt={paciente.nome}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(paciente.nome)
              )}
            </div>

            {/* Nome + procedimento */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{paciente.nome}</p>
              <p className="text-xs text-muted-foreground truncate">
                {TREATMENT_LABELS[session.treatment.tipoTratamento] ?? "Procedimento"}
                {session.profissional && (
                  <span className="text-muted-foreground/60"> · {session.profissional.nome}</span>
                )}
              </p>
            </div>

            {/* Horário */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(session.dataAgendada)}</span>
            </div>

            {/* Sala */}
            {session.sala && (
              <div className="hidden sm:block text-xs text-muted-foreground/70 shrink-0">
                {session.sala.nome}
              </div>
            )}

            {/* Status badge */}
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0 ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
