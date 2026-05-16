'use client'

import { useState } from 'react'
import { OrgRole, UserCategoria } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { toast } from 'sonner'
import { StepCategoria } from './step-categoria'
import { StepRoleAndEmail } from './step-role-and-email'
import { StepPrefillClinico, PrefillData } from './step-prefill-clinico'
import { assignableRoles } from '@/lib/role-permissions'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  actorRole: OrgRole
  onInvited?: () => void
}

const STEP_TITLES = ['Tipo de membro', 'E-mail e função', 'Dados clínicos (opcional)']

export function InviteWizardDialog({ open, onOpenChange, actorRole, onInvited }: Props) {
  const [step, setStep] = useState(0)
  const [categoria, setCategoria] = useState<UserCategoria>('CLINICO')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [role, setRole] = useState<OrgRole>('VENDEDOR')
  const [prefilledData, setPrefilledData] = useState<PrefillData>({})
  const [sending, setSending] = useState(false)

  const canAssign = assignableRoles(actorRole)
  const totalSteps = categoria === 'CLINICO' ? 3 : 2

  function reset() {
    setStep(0)
    setCategoria('CLINICO')
    setEmail('')
    setJobTitle('')
    setRole('VENDEDOR')
    setPrefilledData({})
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  function canProceed() {
    if (step === 0) return true
    if (step === 1) return !!email && !!role
    return true
  }

  async function handleSend() {
    setSending(true)
    try {
      const res = await fetch('/api/team/invite-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          jobTitle: jobTitle || undefined,
          categoria,
          prefilledData: categoria === 'CLINICO' && Object.keys(prefilledData).length > 0
            ? prefilledData
            : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao enviar convite')
      toast.success(`Convite enviado para ${email}`)
      onInvited?.()
      handleClose(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar convite')
    } finally {
      setSending(false)
    }
  }

  const isLastStep = step === totalSteps - 1

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Convidar novo membro</DialogTitle>
          <DialogDescription>
            Passo {step + 1} de {totalSteps} — {STEP_TITLES[step]}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex gap-1.5 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="py-2">
          {step === 0 && (
            <StepCategoria value={categoria} onChange={c => { setCategoria(c); setRole(c === 'PROPRIETARIO' ? 'GERENTE' : 'VENDEDOR') }} />
          )}
          {step === 1 && (
            <StepRoleAndEmail
              email={email}
              onEmailChange={setEmail}
              jobTitle={jobTitle}
              onJobTitleChange={setJobTitle}
              role={role}
              onRoleChange={setRole}
              assignableRoles={canAssign}
              categoria={categoria}
            />
          )}
          {step === 2 && categoria === 'CLINICO' && (
            <StepPrefillClinico value={prefilledData} onChange={setPrefilledData} />
          )}
        </div>

        <DialogFooter className="gap-2">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={sending}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          )}
          {isLastStep ? (
            <Button onClick={handleSend} disabled={sending || !canProceed()}>
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Enviar convite
            </Button>
          ) : (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
