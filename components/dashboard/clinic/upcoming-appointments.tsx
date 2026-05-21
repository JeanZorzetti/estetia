import type { TreatmentSession, Treatment, Patient, Professional, ClinicRoom, TreatmentType } from "@prisma/client"
import { Clock, CalendarCheck2 } from "lucide-react"

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

const STATUS_STYLES: Record<string, { label: string; badgeClass: string; borderLeftClass: string }> = {
  AGENDADA: {
    label: "Agendada",
    badgeClass: "bg-blue-500/5 text-blue-700 border-blue-500/20 group-hover:bg-blue-500/10 group-hover:border-blue-500/30",
    borderLeftClass: "bg-blue-500/40 group-hover:bg-blue-500",
  },
  CONFIRMADA: {
    label: "Confirmada",
    badgeClass: "bg-emerald-500/5 text-emerald-700 border-emerald-500/20 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30",
    borderLeftClass: "bg-emerald-500/40 group-hover:bg-emerald-500",
  },
  REALIZADA: {
    label: "Realizada",
    badgeClass: "bg-slate-500/5 text-slate-600 border-slate-500/20 group-hover:bg-slate-500/10 group-hover:border-slate-500/30",
    borderLeftClass: "bg-slate-500/40 group-hover:bg-slate-500",
  },
  NO_SHOW: {
    label: "No-show",
    badgeClass: "bg-rose-500/5 text-rose-700 border-rose-500/20 group-hover:bg-rose-500/10 group-hover:border-rose-500/30",
    borderLeftClass: "bg-rose-500/40 group-hover:bg-rose-500",
  },
  REMARCADA: {
    label: "Remarcada",
    badgeClass: "bg-amber-500/5 text-amber-700 border-amber-500/20 group-hover:bg-amber-500/10 group-hover:border-amber-500/30",
    borderLeftClass: "bg-amber-500/40 group-hover:bg-amber-500",
  },
  CANCELADA: {
    label: "Cancelada",
    badgeClass: "bg-zinc-500/5 text-zinc-500 border-zinc-500/10 group-hover:bg-zinc-500/10 group-hover:border-zinc-500/20",
    borderLeftClass: "bg-zinc-500/30 group-hover:bg-zinc-500",
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
      <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-b from-white/30 to-slate-50/10 py-12 px-6 text-center backdrop-blur-md">
        {/* Decorative halos */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#489FB5]/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-[#0A1F3D]/5 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 mb-4">
          <CalendarCheck2 className="w-5 h-5 text-[#489FB5] animate-pulse" />
        </div>
        
        <h3 className="font-serif font-bold text-slate-800 text-sm tracking-wide mb-1.5">
          Sua Agenda está Livre
        </h3>
        <p className="text-[11px] font-medium text-slate-400 max-w-[240px] leading-relaxed mb-4">
          Não há atendimentos registrados para hoje. Aproveite para planejar novos procedimentos.
        </p>

        <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/5 border border-[#C5A059]/20 px-3 py-1 rounded-full shadow-inner leading-none">
          Estetia CRM Executive
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {appointments.map((session) => {
        const paciente = session.treatment.paciente
        const status = STATUS_STYLES[session.status] ?? {
          label: session.status,
          badgeClass: "bg-slate-500/5 text-slate-600 border border-slate-500/10",
          borderLeftClass: "bg-slate-500/30 group-hover:bg-slate-500",
        }

        return (
          <div
            key={session.id}
            className="group relative flex items-center gap-3.5 rounded-xl border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 py-3 hover:border-[#489FB5]/30 hover:shadow-lg hover:shadow-[#489FB5]/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Subtle inside double-border */}
            <div className="absolute inset-0.5 rounded-[10px] border border-white/40 pointer-events-none" />

            {/* Left accent color indicator based on status */}
            <div className={`absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r transition-all duration-300 ${status.borderLeftClass}`} />

            {/* Avatar - Wrapped in high-end chrome-rimmed glowing circles */}
            <div className="relative w-9 h-9 rounded-full border border-slate-100 bg-white shadow-sm flex items-center justify-center text-[#0A1F3D] text-[11px] font-extrabold tracking-wider shrink-0 select-none overflow-hidden group-hover:scale-105 transition-transform duration-300">
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

            {/* Nome + Procedimento */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-snug group-hover:text-[#489FB5] transition-colors">
                {paciente.nome}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 truncate mt-0.5">
                <span className="text-[#C5A059] font-bold">
                  {TREATMENT_LABELS[session.treatment.tipoTratamento] ?? "Procedimento"}
                </span>
                {session.profissional && (
                  <>
                    <span className="text-slate-300 font-light">·</span>
                    <span className="truncate">{session.profissional.nome}</span>
                  </>
                )}
              </div>
            </div>

            {/* Horário e Sala em formato capsular */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              {/* Horário */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200/60 bg-slate-50/50 shadow-inner text-[10px] font-bold text-slate-600 tracking-wider">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatTime(session.dataAgendada)}</span>
              </div>

              {/* Sala */}
              {session.sala && (
                <div className="text-[9px] font-bold text-[#489FB5] uppercase tracking-wider bg-[#489FB5]/5 px-1.5 py-0.5 rounded">
                  {session.sala.nome}
                </div>
              )}
            </div>

            {/* Status badge */}
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors duration-300 ${status.badgeClass}`}
            >
              {status.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

