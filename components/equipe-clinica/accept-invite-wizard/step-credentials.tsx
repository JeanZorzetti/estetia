'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  email: string
  password: string
  onPasswordChange: (v: string) => void
  confirmPassword: string
  onConfirmPasswordChange: (v: string) => void
  lgpdAccepted: boolean
  onLgpdChange: (v: boolean) => void
}

export function StepCredentials({
  email,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  lgpdAccepted,
  onLgpdChange,
}: Props) {
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>E-mail</Label>
        <Input value={email} disabled className="bg-muted" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="acc-password">Senha *</Label>
        <Input
          id="acc-password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="acc-confirm">Confirmar senha *</Label>
        <Input
          id="acc-confirm"
          type="password"
          placeholder="Repetir senha"
          value={confirmPassword}
          onChange={e => onConfirmPasswordChange(e.target.value)}
          className={mismatch ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {mismatch && <p className="text-xs text-destructive">Senhas não coincidem</p>}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-border/50 p-3">
        <Checkbox
          id="lgpd"
          checked={lgpdAccepted}
          onCheckedChange={v => onLgpdChange(!!v)}
          className="mt-0.5"
        />
        <Label htmlFor="lgpd" className="text-sm leading-relaxed cursor-pointer">
          Aceito os{' '}
          <a href="/termos" className="text-primary underline" target="_blank">Termos de Uso</a>
          {' '}e a{' '}
          <a href="/privacidade" className="text-primary underline" target="_blank">Política de Privacidade</a>
          {' '}(LGPD)
        </Label>
      </div>
    </div>
  )
}
