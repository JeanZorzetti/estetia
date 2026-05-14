'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { registerAction } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Building2, Phone, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const SEGMENTS = [
  'Clínica de Estética',
  'Clínica de Dermatologia',
  'Clínica de Harmonização Facial',
  'Clínica de Estética Corporal',
  'Spa e Bem-Estar',
  'Barbearia e Estética Masculina',
  'Salão de Beleza',
  'Clínica de Odontologia Estética',
  'Clínica de Medicina Estética',
  'Fisioterapia e Pilates',
  'Clínica Multidisciplinar',
  'Franquia ou Rede de Clínicas',
  'Outro',
]

const JOB_TITLES = [
  'Proprietário / Sócio',
  'Diretor(a) Clínico(a)',
  'Gestor(a) Administrativo(a)',
  'Recepcionista / Secretária',
  'Esteticista / Cosmetóloga',
  'Médico(a) Esteticista',
  'Dermatologista',
  'Fisioterapeuta Estética',
  'Nutricionista',
  'Outro',
]

export function RegisterForm({ inviteData, inviteToken }: { inviteData: any, inviteToken?: string }) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState(inviteData?.email || '')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [segment, setSegment] = useState('')
  const [customJobTitle, setCustomJobTitle] = useState('')
  const [customSegment, setCustomSegment] = useState('')

  const totalSteps = inviteData ? 1 : 3

  const effectiveJobTitle = jobTitle === 'Outro' ? customJobTitle : jobTitle
  const effectiveSegment = segment === 'Outro' ? customSegment : segment

  function canAdvance() {
    if (step === 1) return name && email && password
    if (step === 2) return phone && effectiveJobTitle
    if (step === 3) return company && effectiveSegment
    return false
  }

  function handleNext() {
    if (step < totalSteps) {
      setStep(step + 1)
      setError(null)
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step < totalSteps) {
      handleNext()
      return
    }

    const formData = new FormData()
    formData.set('name', name)
    formData.set('email', email)
    formData.set('password', password)
    formData.set('phone', phone)
    formData.set('jobTitle', effectiveJobTitle)
    formData.set('company', company)
    formData.set('companyDescription', companyDescription)
    formData.set('segment', effectiveSegment)
    if (inviteToken) formData.set('inviteToken', inviteToken)

    startTransition(async () => {
      const result = await registerAction(null, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard?new_user=true')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="p-4 text-sm font-medium text-[#E05A4E] bg-[#E05A4E]/10 border border-[#E05A4E]/20 rounded-xl">
            {error}
          </div>
        )}

        {/* Step indicator */}
        {totalSteps > 1 && (
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full text-xs font-bold transition-all duration-300",
                  s < step && "bg-[#C5A059] text-[#FFFFFF]",
                  s === step && "bg-[#0A1F3D] text-[#FFFFFF] shadow-lg",
                  s > step && "bg-[#F8F9FC] text-[#94A3B8] border border-[#0A1F3D]/10"
                )}>
                  {s < step ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : s === 1 ? (
                    <User className="h-4 w-4" />
                  ) : s === 2 ? (
                    <Phone className="h-4 w-4" />
                  ) : (
                    <Building2 className="h-4 w-4" />
                  )}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "h-1 w-8 rounded-full transition-all duration-300",
                    s < step ? "bg-[#C5A059]" : "bg-[#0A1F3D]/5"
                  )} />
                )}
              </div>
            ))}
            <span className="ml-auto text-xs font-bold tracking-widest uppercase text-[#94A3B8]">
              {step === 1 ? 'Sua conta' : step === 2 ? 'Sobre você' : 'Sua empresa'}
            </span>
          </div>
        )}

        {/* STEP 1: Account */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">Nome Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="João da Silva"
                required
                autoFocus
                className="h-12 bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] placeholder:text-[#94A3B8] focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">E-mail Corporativo</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="joao@empresa.com"
                required
                readOnly={!!inviteData}
                className="h-12 bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] placeholder:text-[#94A3B8] focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">Senha de Acesso</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  className="h-12 bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] placeholder:text-[#94A3B8] focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0A1F3D] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {inviteData && (
              <input type="hidden" name="inviteToken" value={inviteToken} />
            )}
          </div>
        )}

        {/* STEP 2: About you */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                required
                autoFocus
                className="h-12 bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] placeholder:text-[#94A3B8] focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
              />
              <p className="text-xs text-[#64748B]">Para receber o link de acesso ao app.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">Qual é seu cargo?</Label>
              <div className="relative">
                <select
                  id="jobTitle"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl bg-[#F8F9FC] border border-[#0A1F3D]/10 text-[#0A1F3D] px-4 pr-10 text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 transition-all"
                >
                  <option value="" disabled>Selecione um cargo</option>
                  {JOB_TITLES.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none" />
              </div>
              {jobTitle === 'Outro' && (
                <Input
                  value={customJobTitle}
                  onChange={e => setCustomJobTitle(e.target.value)}
                  placeholder="Especifique seu cargo"
                  required
                  className="mt-3 h-12 bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] rounded-xl"
                />
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Company */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">Nome da Clínica / Empresa</Label>
              <Input
                id="company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Ex: Clínica Estetia"
                required
                autoFocus
                className="h-12 bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] placeholder:text-[#94A3B8] focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">Segmento de atuação</Label>
              <div className="relative">
                <select
                  id="segment"
                  value={segment}
                  onChange={e => { setSegment(e.target.value); if (e.target.value !== 'Outro') setCustomSegment('') }}
                  required
                  className="w-full h-12 rounded-xl bg-[#F8F9FC] border border-[#0A1F3D]/10 text-[#0A1F3D] px-4 pr-10 text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 transition-all"
                >
                  <option value="" disabled>Selecione um segmento</option>
                  {SEGMENTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none" />
              </div>
              {segment === 'Outro' && (
                <Input
                  value={customSegment}
                  onChange={e => setCustomSegment(e.target.value)}
                  placeholder="Qual é o segmento?"
                  required
                  className="mt-3 h-12 bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] placeholder:text-[#94A3B8] rounded-xl"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDescription" className="text-xs font-bold tracking-widest uppercase text-[#0A1F3D]">Como você descreveria seu serviço?</Label>
              <Textarea
                id="companyDescription"
                value={companyDescription}
                onChange={e => setCompanyDescription(e.target.value)}
                placeholder="Ex: Realizamos procedimentos de harmonização orofacial..."
                rows={3}
                className="bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] placeholder:text-[#94A3B8] focus:border-[#C5A059] focus:ring-[#C5A059]/20 rounded-xl resize-none"
              />
            </div>
          </div>
        )}

      <div className="flex flex-col gap-5 pt-4 border-t border-[#0A1F3D]/5">
        <div className="flex w-full gap-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-12 px-6 rounded-full bg-[#FFFFFF] border-[#0A1F3D]/10 text-[#64748B] hover:text-[#0A1F3D] hover:bg-[#F8F9FC] font-bold text-xs tracking-widest uppercase transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}

          {step < totalSteps ? (
            <Button
              type="submit"
              disabled={!canAdvance()}
              className="flex-1 h-12 rounded-full bg-[#0A1F3D] hover:bg-[#0A1F3D]/90 text-[#FFFFFF] font-bold text-xs tracking-widest uppercase shadow-md transition-all disabled:opacity-50"
            >
              Avançar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending || !canAdvance()}
              className="flex-1 h-12 rounded-full bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#0A1F3D] font-bold text-xs tracking-widest uppercase shadow-lg shadow-[#C5A059]/20 transition-all disabled:opacity-50"
            >
              {isPending ? 'Criando conta...' : (inviteData ? 'Entrar na Equipe' : 'Criar Conta Grátis')}
            </Button>
          )}
        </div>

        {step === 1 && !inviteData && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#0A1F3D]/10" />
              </div>
              <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase">
                <span className="bg-[#FFFFFF] px-4 text-[#94A3B8]">Ou continue com</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-full bg-[#F8F9FC] border-[#0A1F3D]/10 text-[#0A1F3D] hover:bg-[#F8F9FC]/80 font-bold text-xs tracking-widest uppercase transition-all"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Workspace
            </Button>
          </>
        )}

        <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#94A3B8] pt-2">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-[#489FB5]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            SSL
          </div>
          <span className="text-[#0A1F3D]/20">•</span>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-[#489FB5]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            LGPD
          </div>
          <span className="text-[#0A1F3D]/20">•</span>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-[#489FB5]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Sem Spam
          </div>
        </div>

        <div className="text-center text-sm font-medium text-[#64748B] mt-2">
          Já tem uma conta? <Link href="/login" className="text-[#489FB5] hover:text-[#0A1F3D] font-bold transition-colors">Entrar</Link>
        </div>
      </div>
    </form>
  )
}
