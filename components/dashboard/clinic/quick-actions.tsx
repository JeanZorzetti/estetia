"use client"

import Link from "next/link"
import { UserPlus, CalendarPlus, PlayCircle, BellRing } from "lucide-react"

const ACTIONS = [
  {
    label: "Novo Paciente",
    href: "/dashboard/pacientes/novo",
    icon: UserPlus,
    accent: "text-[#489FB5]",
    bg: "bg-[#489FB5]/10 hover:bg-[#489FB5]/20",
    border: "border-[#489FB5]/20 hover:border-[#489FB5]/40",
  },
  {
    label: "Agendar",
    href: "/dashboard/agenda",
    icon: CalendarPlus,
    accent: "text-[#0A1F3D]",
    bg: "bg-[#0A1F3D]/5 hover:bg-[#0A1F3D]/10",
    border: "border-[#0A1F3D]/15 hover:border-[#0A1F3D]/30",
  },
  {
    label: "Iniciar Atendimento",
    href: "/dashboard/agenda",
    icon: PlayCircle,
    accent: "text-emerald-600",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-200 hover:border-emerald-300",
  },
  {
    label: "Enviar Recall",
    href: "/dashboard/recall",
    icon: BellRing,
    accent: "text-[#C5A059]",
    bg: "bg-[#C5A059]/10 hover:bg-[#C5A059]/20",
    border: "border-[#C5A059]/20 hover:border-[#C5A059]/40",
  },
] as const

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ACTIONS.map(({ label, href, icon: Icon, accent, bg, border }) => (
        <Link
          key={label}
          href={href}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-3 py-4 text-center transition-all duration-150 ${bg} ${border}`}
        >
          <Icon className={`w-5 h-5 ${accent}`} />
          <span className={`text-xs font-medium leading-tight ${accent}`}>{label}</span>
        </Link>
      ))}
    </div>
  )
}
