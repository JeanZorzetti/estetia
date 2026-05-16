'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserCategoria } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Loader2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { StepCredentials } from './step-credentials'
import { StepDadosPessoais } from './step-dados-pessoais'
import { StepDadosClinicos, ClinicalFormData } from './step-dados-clinicos'

interface InviteData {
  email: string
  categoria: UserCategoria
  prefilledData: Record<string, unknown> | null
}

interface Props {
  token: string
  invite: InviteData
}

const STEP_TITLES = ['Crie sua senha', 'Seus dados', 'Perfil clínico']

export function AcceptInvitePageClient({ token, invite }: Props) {
  const router = useRouter()
  const isClinical = invite.categoria === 'CLINICO'
  const totalSteps = isClinical ? 3 : 2

  const pd = invite.prefilledData ?? {}

  const [step, setStep] = useState(0)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [lgpdAccepted, setLgpdAccepted] = useState(false)
  const [name, setName] = useState((pd.nome as string) ?? '')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [clinicalData, setClinicalData] = useState<ClinicalFormData>({
    conselho: (pd.conselho as string) ?? '',
    numeroConselho: (pd.numeroConselho as string) ?? '',
    ufConselho: (pd.ufConselho as string) ?? '',
    especialidades: (pd.especialidades as string[]) ?? [],
    bio: '',
  })
  const [submitting, setSubmitting] = useState(false)

  function canProceed(): boolean {
    if (step === 0) return password.length >= 8 && password === confirmPassword && lgpdAccepted
    if (step === 1) return name.trim().length > 0
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        name,
        password,
        phone: phone || undefined,
        jobTitle: jobTitle || undefined,
      }

      if (isClinical) {
        body.professionalData = {
          conselho: clinicalData.conselho || undefined,
          numeroConselho: clinicalData.numeroConselho || undefined,
          ufConselho: clinicalData.ufConselho || undefined,
          especialidades: clinicalData.especialidades,
          bio: clinicalData.bio || undefined,
        }
      }

      const res = await fetch(`/api/team/accept-invite/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao aceitar convite')

      toast.success('Conta criada! Redirecionando...')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setSubmitting(false)
    }
  }

  const isLastStep = step === totalSteps - 1

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo ao Estetia CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Passo {step + 1} de {totalSteps} — {STEP_TITLES[step]}
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {step === 0 && (
            <StepCredentials
              email={invite.email}
              password={password}
              onPasswordChange={setPassword}
              confirmPassword={confirmPassword}
              onConfirmPasswordChange={setConfirmPassword}
              lgpdAccepted={lgpdAccepted}
              onLgpdChange={setLgpdAccepted}
            />
          )}
          {step === 1 && (
            <StepDadosPessoais
              name={name}
              onNameChange={setName}
              phone={phone}
              onPhoneChange={setPhone}
              jobTitle={jobTitle}
              onJobTitleChange={setJobTitle}
              prefilled={{ nome: pd.nome as string | undefined }}
            />
          )}
          {step === 2 && isClinical && (
            <StepDadosClinicos value={clinicalData} onChange={setClinicalData} />
          )}

          <div className="flex gap-2 mt-6 justify-end">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={submitting}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            )}
            {isLastStep ? (
              <Button onClick={handleSubmit} disabled={submitting || !canProceed()}>
                {submitting
                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  : <CheckCircle2 className="h-4 w-4 mr-2" />
                }
                Criar minha conta
              </Button>
            ) : (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
