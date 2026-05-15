'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Users, DoorOpen, UserCheck, Minus, Plus } from 'lucide-react'
import { formatBRL } from '@/lib/pricing/calculator'
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
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/40 bg-muted/30">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">
            {included} inclusos · +{formatBRL(unitCents)}/un
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="w-7 h-7"
          disabled={extra === 0}
          onClick={() => onChange(Math.max(0, extra - 1))}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="text-sm font-bold tabular-nums w-10 text-center">{total}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="w-7 h-7"
          onClick={() => onChange(extra + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

export function ExtrasSliders({ extraUsers, extraRooms, extraProfs, onChange }: Props) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recursos adicionais
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Stepper
          label="Usuários"
          icon={Users}
          included={INCLUDED_BASE_QUOTAS.users}
          extra={extraUsers}
          unitCents={EXTRA_USER_CENTS}
          onChange={(v) => onChange({ extraUsers: v, extraRooms, extraProfs })}
        />
        <Stepper
          label="Salas"
          icon={DoorOpen}
          included={INCLUDED_BASE_QUOTAS.rooms}
          extra={extraRooms}
          unitCents={EXTRA_ROOM_CENTS}
          onChange={(v) => onChange({ extraUsers, extraRooms: v, extraProfs })}
        />
        <Stepper
          label="Profissionais na agenda"
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
