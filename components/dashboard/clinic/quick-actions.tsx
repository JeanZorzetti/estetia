"use client"

import Link from "next/link"
import { UserPlus, CalendarPlus, PlayCircle, BellRing } from "lucide-react"

const ACTIONS = [
  {
    label: "Novo Paciente",
    href: "/dashboard/pacientes/novo",
    icon: UserPlus,
    accent: "text-[#489FB5]",
    bg: "bg-[#489FB5]/5 hover:bg-[#489FB5]/12",
    border: "border-[#489FB5]/15 hover:border-[#489FB5]/30",
    shadow: "hover:shadow-[#489FB5]/5 hover:shadow-lg",
  },
  {
    label: "Agendar",
    href: "/dashboard/agenda",
    icon: CalendarPlus,
    accent: "text-[#0A1F3D]",
    bg: "bg-[#0A1F3D]/5 hover:bg-[#0A1F3D]/8",
    border: "border-[#0A1F3D]/10 hover:border-[#0A1F3D]/25",
    shadow: "hover:shadow-[#0A1F3D]/5 hover:shadow-lg",
  },
  {
    label: "Iniciar",
    href: "/dashboard/agenda",
    icon: PlayCircle,
    accent: "text-[#10B981]",
    bg: "bg-[#10B981]/5 hover:bg-[#10B981]/12",
    border: "border-[#10B981]/15 hover:border-[#10B981]/30",
    shadow: "hover:shadow-[#10B981]/5 hover:shadow-lg",
  },
  {
    label: "Enviar Recall",
    href: "/dashboard/recall",
    icon: BellRing,
    accent: "text-[#C5A059]",
    bg: "bg-[#C5A059]/5 hover:bg-[#C5A059]/12",
    border: "border-[#C5A059]/15 hover:border-[#C5A059]/30",
    shadow: "hover:shadow-[#C5A059]/5 hover:shadow-lg",
  },
] as const

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ACTIONS.map(({ label, href, icon: Icon, accent, bg, border, shadow }) => (
        <Link
          key={label}
          href={href}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white/70 backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 relative group ${bg} ${border} ${shadow}`}
        >
          {/* Subtle inside double-border */}
          <div className="absolute inset-1 rounded-[12px] border border-white/40 pointer-events-none" />

          <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300`}>
            <Icon className={`w-5 h-5 ${accent}`} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider leading-tight ${accent}`}>{label}</span>
        </Link>
      ))}
    </div>
  )
}

