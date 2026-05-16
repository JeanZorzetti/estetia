'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  name: string
  onNameChange: (v: string) => void
  phone: string
  onPhoneChange: (v: string) => void
  jobTitle: string
  onJobTitleChange: (v: string) => void
  prefilled?: { nome?: string; jobTitle?: string }
}

export function StepDadosPessoais({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  jobTitle,
  onJobTitleChange,
  prefilled,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="dp-name">Nome completo *</Label>
        <Input
          id="dp-name"
          placeholder="Seu nome completo"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          autoFocus={!prefilled?.nome}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dp-phone">Telefone</Label>
        <Input
          id="dp-phone"
          type="tel"
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dp-job">Cargo</Label>
        <Input
          id="dp-job"
          placeholder="Ex: Dermatologista, Recepcionista"
          value={jobTitle}
          onChange={e => onJobTitleChange(e.target.value)}
        />
      </div>
    </div>
  )
}
