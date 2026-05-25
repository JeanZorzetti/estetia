"use client"

import Link from "next/link"
import { UserPlus, CalendarPlus, PlayCircle, BellRing } from "lucide-react"

const STATIC_ACTIONS = [
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
] as const

const RECALL_ACTION = {
  label: "Enviar Recall",
  href: "/dashboard/recall",
  icon: BellRing,
  accent: "text-[#C5A059]",
  bg: "bg-[#C5A059]/5 hover:bg-[#C5A059]/12",
  border: "border-[#C5A059]/15 hover:border-[#C5A059]/30",
  shadow: "hover:shadow-[#C5A059]/5 hover:shadow-lg",
} as const

interface QuickActionsProps {
  nextSessionId?: string | null
}

function ActionCard({
  label,
  icon: Icon,
  accent,
  bg,
  border,
  shadow,
}: {
  label: string
  icon: React.ElementType
  accent: string
  bg: string
  border: string
  shadow: string
}) {
  return (
    <>
      <div className="absolute inset-1 rounded-[12px] border border-white/40 pointer-events-none" />
      <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300`}>
        <Icon className={`w-5 h-5 ${accent}`} />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-wider leading-tight ${accent}`}>{label}</span>
    </>
  )
}

export function QuickActions({ nextSessionId }: QuickActionsProps) {
  const hasSession = Boolean(nextSessionId)

  return (
    <div className="grid grid-cols-2 gap-3">
      {STATIC_ACTIONS.map(({ label, href, icon, accent, bg, border, shadow }) => (
        <Link
          key={label}
          href={href}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white/70 backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 relative group ${bg} ${border} ${shadow}`}
        >
          <ActionCard label={label} icon={icon} accent={accent} bg={bg} border={border} shadow={shadow} />
        </Link>
      ))}

      {/* Iniciar — dinâmico: ativo se há sessão, desabilitado se não */}
      {hasSession ? (
        <Link
          href={`/dashboard/atendimento/${nextSessionId}`}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white/70 backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 relative group bg-[#10B981]/5 hover:bg-[#10B981]/12 border-[#10B981]/15 hover:border-[#10B981]/30 hover:shadow-[#10B981]/5 hover:shadow-lg"
        >
          <ActionCard
            label="Iniciar"
            icon={PlayCircle}
            accent="text-[#10B981]"
            bg="bg-[#10B981]/5 hover:bg-[#10B981]/12"
            border="border-[#10B981]/15 hover:border-[#10B981]/30"
            shadow="hover:shadow-[#10B981]/5 hover:shadow-lg"
          />
        </Link>
      ) : (
        <div
          title="Nenhum atendimento hoje"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white/70 backdrop-blur-md px-4 py-5 text-center relative opacity-40 cursor-not-allowed grayscale"
        >
          <div className="absolute inset-1 rounded-[12px] border border-white/40 pointer-events-none" />
          <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100">
            <PlayCircle className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider leading-tight text-slate-400">Iniciar</span>
        </div>
      )}

      <Link
        href={RECALL_ACTION.href}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white/70 backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 relative group ${RECALL_ACTION.bg} ${RECALL_ACTION.border} ${RECALL_ACTION.shadow}`}
      >
        <ActionCard
          label={RECALL_ACTION.label}
          icon={RECALL_ACTION.icon}
          accent={RECALL_ACTION.accent}
          bg={RECALL_ACTION.bg}
          border={RECALL_ACTION.border}
          shadow={RECALL_ACTION.shadow}
        />
      </Link>
    </div>
  )
}
