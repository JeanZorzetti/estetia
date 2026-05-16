'use client'

import { OrgRole, UserCategoria } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ROLE_LABELS: Record<OrgRole, string> = {
  OWNER: 'Owner',
  GERENTE: 'Gerente',
  COORDENADOR: 'Coordenador',
  SUPERVISOR: 'Supervisor',
  VENDEDOR: 'Profissional',
  MEMBER: 'Profissional',
}

const ROLE_DESC: Partial<Record<OrgRole, string>> = {
  GERENTE: 'Acesso completo exceto billing',
  COORDENADOR: 'Gestão de equipe e agenda',
  SUPERVISOR: 'Supervisão de atendimentos',
  VENDEDOR: 'Acesso clínico padrão',
}

interface Props {
  email: string
  onEmailChange: (v: string) => void
  jobTitle: string
  onJobTitleChange: (v: string) => void
  role: OrgRole
  onRoleChange: (v: OrgRole) => void
  assignableRoles: OrgRole[]
  categoria: UserCategoria
}

export function StepRoleAndEmail({
  email,
  onEmailChange,
  jobTitle,
  onJobTitleChange,
  role,
  onRoleChange,
  assignableRoles,
  categoria,
}: Props) {
  const defaultRole: OrgRole = categoria === 'PROPRIETARIO' ? 'GERENTE' : 'VENDEDOR'

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="invite-email">E-mail do convidado *</Label>
        <Input
          id="invite-email"
          type="email"
          placeholder="nome@email.com"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="invite-jobtitle">Cargo (opcional)</Label>
        <Input
          id="invite-jobtitle"
          placeholder={
            categoria === 'CLINICO'
              ? 'Ex: Dermatologista, Enfermeira'
              : 'Ex: Recepcionista, Gerente Financeira'
          }
          value={jobTitle}
          onChange={e => onJobTitleChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="invite-role">Função no sistema *</Label>
        <Select
          value={role ?? defaultRole}
          onValueChange={v => onRoleChange(v as OrgRole)}
        >
          <SelectTrigger id="invite-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {assignableRoles.map(r => (
              <SelectItem key={r} value={r}>
                <div className="flex flex-col">
                  <span>{ROLE_LABELS[r]}</span>
                  {ROLE_DESC[r] && (
                    <span className="text-xs text-muted-foreground">{ROLE_DESC[r]}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
