'use client'

import { UserCategoria } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Stethoscope, Briefcase, Crown } from 'lucide-react'

const OPTIONS: { value: UserCategoria; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    value: 'CLINICO',
    icon: <Stethoscope className="h-5 w-5" />,
    label: 'Profissional Clínico',
    desc: 'Médico, dentista, enfermeiro, fisioterapeuta — realiza atendimentos',
  },
  {
    value: 'ADMINISTRATIVO',
    icon: <Briefcase className="h-5 w-5" />,
    label: 'Equipe Administrativa',
    desc: 'Recepção, financeiro, marketing — suporte à clínica',
  },
  {
    value: 'PROPRIETARIO',
    icon: <Crown className="h-5 w-5" />,
    label: 'Sócio / Proprietário',
    desc: 'Dono ou sócio sem atendimento clínico direto',
  },
]

interface Props {
  value: UserCategoria
  onChange: (v: UserCategoria) => void
}

export function StepCategoria({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Selecione o perfil deste membro:</p>
      <div className="grid gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150',
              'hover:border-primary/50 hover:bg-muted/30',
              value === opt.value
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border/60'
            )}
          >
            <div className={cn(
              'mt-0.5 rounded-lg p-2',
              value === opt.value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {opt.icon}
            </div>
            <div>
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
