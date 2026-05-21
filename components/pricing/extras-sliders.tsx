'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, DoorOpen, UserCheck, Minus, Plus } from 'lucide-react'
import { formatBRL } from '@/lib/pricing/calculator'
import { cn } from '@/lib/utils'
import {
  EXTRA_USER_CENTS,
  EXTRA_ROOM_CENTS,
  EXTRA_PROF_CENTS,
  INCLUDED_BASE_QUOTAS,
} from '@/lib/pricing/modules'

interface Props {
  extraUsers: number
  extraRooms: number
  extraProfs: number
  onChange: (next: { extraUsers: number; extraRooms: number; extraProfs: number }) => void
}

function Stepper({
  label, icon: Icon, included, extra, unitCents, onChange,
}: {
  label: string
  icon: React.ElementType
  included: number
  extra: number
  unitCents: number
  onChange: (v: number) => void
}) {
  const total = included + extra
  const hasExtra = extra > 0

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm",
      hasExtra
        ? "bg-white/70 dark:bg-slate-900/60 border-[#C5A059]/30 shadow-md shadow-[#C5A059]/2"
        : "bg-white/30 dark:bg-slate-900/20 border-slate-200/30 dark:border-white/5 hover:bg-white/50 dark:hover:bg-slate-900/30"
    )}>
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300",
          hasExtra
            ? "bg-[#C5A059]/10 text-[#C5A059]"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-sans font-bold text-[#0A1F3D] dark:text-white leading-snug">{label}</p>
          <p className="text-[11px] font-sans font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {included} inclusos no plano · <span className="text-[#489FB5]">+{formatBRL(unitCents)}</span>/un
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 bg-slate-100/50 dark:bg-slate-850/60 p-1 rounded-full border border-slate-200/40 dark:border-white/5 backdrop-blur-xs">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "w-7 h-7 rounded-full transition-all duration-200",
            extra === 0
              ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
              : "text-[#0A1F3D] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          )}
          disabled={extra === 0}
          onClick={() => onChange(Math.max(0, extra - 1))}
        >
          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
        </Button>
        
        <span className={cn(
          "text-sm font-bold tabular-nums w-8 text-center font-sans",
          hasExtra ? "text-[#C5A059]" : "text-[#0A1F3D] dark:text-white"
        )}>
          {total}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-7 h-7 rounded-full text-[#0A1F3D] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
          onClick={() => onChange(extra + 1)}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  )
}

export function ExtrasSliders({ extraUsers, extraRooms, extraProfs, onChange }: Props) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="pb-4 pt-6 px-6">
        <h3 className="font-serif font-bold text-base text-[#0A1F3D] dark:text-white tracking-tight">
          Recursos Adicionais
        </h3>
        <p className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-1">
          Ajuste as capacidades da sua clínica conforme suas necessidades crescem.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5 px-6 pb-6 pt-0">
        <Stepper
          label="Usuários / Recepcionistas"
          icon={Users}
          included={INCLUDED_BASE_QUOTAS.users}
          extra={extraUsers}
          unitCents={EXTRA_USER_CENTS}
          onChange={(v) => onChange({ extraUsers: v, extraRooms, extraProfs })}
        />
        <Stepper
          label="Salas de Atendimento"
          icon={DoorOpen}
          included={INCLUDED_BASE_QUOTAS.rooms}
          extra={extraRooms}
          unitCents={EXTRA_ROOM_CENTS}
          onChange={(v) => onChange({ extraUsers, extraRooms: v, extraProfs })}
        />
        <Stepper
          label="Profissionais na Agenda"
          icon={UserCheck}
          included={INCLUDED_BASE_QUOTAS.profs}
          extra={extraProfs}
          unitCents={EXTRA_PROF_CENTS}
          onChange={(v) => onChange({ extraUsers, extraRooms, extraProfs: v })}
        />
      </CardContent>
    </Card>
  )
}

