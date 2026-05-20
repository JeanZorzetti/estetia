'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, ArrowLeft, Phone, Building2, ShieldCheck, ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const SEGMENTS = [
  'Agronegócio',
  'Agências de Marketing e Publicidade',
  'Consultorias e Treinamentos',
  'e-Commerce',
  'Educação e Ensino',
  'Engenharia e Indústria Geral',
  'Eventos',
  'Governo e Órgãos Públicos',
  'Hardware e Eletrônicos',
  'Imobiliárias',
  'Jurídico e Serviços Relacionados',
  'Mídia e Comunicação',
  'ONGs',
  'Saúde e Estética',
  'Serviços em Geral',
  'Serviços em RH e Coaching',
  'Software e Cloud',
  'Telecomunicações',
  'Turismo e Lazer',
  'Varejo',
  'Outro',
]

const JOB_TITLES = [
  'Sócio / Fundador / Proprietário',
  'CEO / Diretor Geral',
  'Diretor de Vendas / Comercial',
  'Gerente de Vendas',
  'Coordenador Comercial',
  'Vendedor / Consultor de Vendas',
  'Gerente de Marketing',
  'Analista / Assistente',
  'Outro',
]

const CONSELHOS = ['CRM', 'CRO', 'CRBM', 'CRF', 'COREN', 'CFBM', 'CREFITO', 'CRP']
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

interface CompleteProfileFormProps {
  userId: string
  userName: string
  organizationId: string
  currentOrgName: string
}

function formatCnpj(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`
}

function validateCnpj(cnpj: string): boolean {
  const d = cnpj.replace(/\D/g, '')
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) { sum += parseInt(d[i]) * weight; weight = weight === 2 ? 9 : weight - 1 }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (parseInt(d[12]) !== digit) return false
  sum = 0; weight = 6
  for (let i = 0; i < 13; i++) { sum += parseInt(d[i]) * weight; weight = weight === 2 ? 9 : weight - 1 }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return parseInt(d[13]) === digit
}

const STEP_ICONS = [Phone, Building2, ShieldCheck]
const STEP_LABELS = ['Você', 'Clínica', 'Compliance']

export function CompleteProfileForm({ userId, userName, organizationId, currentOrgName }: CompleteProfileFormProps) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Step 1
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [customJobTitle, setCustomJobTitle] = useState('')

  // Step 2
  const [company, setCompany] = useState(currentOrgName === userName ? '' : currentOrgName)
  const [companyDescription, setCompanyDescription] = useState('')
  const [segment, setSegment] = useState('')
  const [customSegment, setCustomSegment] = useState('')

  // Step 3 — CNPJ + RT
  const [cnpj, setCnpj] = useState('')
  const [rtNome, setRtNome] = useState('')
  const [rtConselho, setRtConselho] = useState('')
  const [rtNumeroConselho, setRtNumeroConselho] = useState('')
  const [rtUfConselho, setRtUfConselho] = useState('')

  const totalSteps = 3

  const effectiveJobTitle = jobTitle === 'Outro' ? customJobTitle : jobTitle
  const effectiveSegment = segment === 'Outro' ? customSegment : segment
  const phoneDigits = phone.replace(/\D/g, '')
  const phoneValid = phoneDigits.length >= 10
  const cnpjValid = validateCnpj(cnpj)

  function canAdvance() {
    if (step === 1) return phoneValid && effectiveJobTitle
    if (step === 2) return company && effectiveSegment
    if (step === 3) return cnpjValid && rtNome && rtConselho && rtNumeroConselho && rtUfConselho
    return false
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (step < totalSteps) {
      setStep(step + 1)
      setError(null)
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/complete-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            jobTitle: effectiveJobTitle,
            company,
            companyDescription,
            segment: effectiveSegment,
            cnpj: cnpj.replace(/\D/g, ''),
            rtNome,
            rtConselho,
            rtNumeroConselho,
            rtUfConselho,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Erro ao salvar. Tente novamente.')
          return
        }

        router.push('/dashboard?new_user=true')
      } catch {
        setError('Erro de conexão. Tente novamente.')
      }
    })
  }

  const stepHeadings = [
    { title: 'Conte-nos sobre você', sub: 'Precisamos de alguns dados para personalizar sua experiência.' },
    { title: 'Sobre sua clínica', sub: 'Essas informações configuram o CRM clínico para você.' },
    { title: 'Dados de compliance', sub: 'Obrigatório para emitir prontuários e NFS-e conforme a Anvisa.' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gold/10 text-gold border border-gold/20 text-xs font-semibold tracking-widest uppercase mb-4">
            Passo {step} de {totalSteps}
          </div>
          <h1 className="text-2xl font-bold text-navy">
            {stepHeadings[step - 1].title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {stepHeadings[step - 1].sub}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => {
            const Icon = STEP_ICONS[s - 1]
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  'flex items-center justify-center h-9 w-9 rounded-full text-sm font-semibold transition-all',
                  s < step && 'bg-gold text-navy',
                  s === step && 'bg-navy text-white ring-2 ring-navy/20',
                  s > step && 'bg-slate-100 text-slate-400'
                )}>
                  {s < step ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  s === step ? 'text-navy' : 'text-slate-400'
                )}>{STEP_LABELS[s - 1]}</span>
                {s < totalSteps && <div className={cn('h-0.5 w-8 rounded-full', s < step ? 'bg-gold' : 'bg-slate-200')} />}
              </div>
            )
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-clinic-red bg-clinic-red/5 border border-clinic-red/20 rounded-xl">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-navy font-medium">
                  Telefone Principal <span className="text-clinic-red">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^0-9+\(\)\-\s]/g, ''))}
                  placeholder="+55 (11) 99999-9999"
                  required
                  autoFocus
                  className={cn(
                    'border-navy/20 focus:border-navy focus:ring-navy/20',
                    phone && !phoneValid && 'border-clinic-red focus:border-clinic-red'
                  )}
                />
                {phone && !phoneValid && (
                  <p className="text-xs text-clinic-red">Informe um número válido com pelo menos 10 dígitos.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-navy font-medium">Qual é seu cargo?</Label>
                <div className="relative">
                  <select
                    id="jobTitle"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    required
                    className="w-full h-10 rounded-md bg-white border border-navy/20 text-navy px-3 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  >
                    <option value="" disabled>Selecionar</option>
                    {JOB_TITLES.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {jobTitle === 'Outro' && (
                  <Input
                    value={customJobTitle}
                    onChange={e => setCustomJobTitle(e.target.value)}
                    placeholder="Digite seu cargo"
                    required
                    className="border-navy/20 focus:border-navy focus:ring-navy/20"
                  />
                )}
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-navy font-medium">
                  Nome da Clínica <span className="text-clinic-red">*</span>
                </Label>
                <Input
                  id="company"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Clínica Bella Pele Ltda"
                  required
                  autoFocus
                  className="border-navy/20 focus:border-navy focus:ring-navy/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription" className="text-navy font-medium">O que sua clínica oferece?</Label>
                <Textarea
                  id="companyDescription"
                  value={companyDescription}
                  onChange={e => setCompanyDescription(e.target.value)}
                  placeholder="Ex: Especializada em procedimentos estéticos faciais e corporais..."
                  rows={3}
                  className="border-navy/20 focus:border-navy focus:ring-navy/20 resize-none"
                />
                <p className="text-xs text-slate-400">Opcional. Nos ajuda a personalizar sua experiência.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="segment" className="text-navy font-medium">
                  Segmento <span className="text-clinic-red">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="segment"
                    value={segment}
                    onChange={e => { setSegment(e.target.value); if (e.target.value !== 'Outro') setCustomSegment('') }}
                    required
                    className="w-full h-10 rounded-md bg-white border border-navy/20 text-navy px-3 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  >
                    <option value="" disabled>Selecionar</option>
                    {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {segment === 'Outro' && (
                  <Input
                    value={customSegment}
                    onChange={e => setCustomSegment(e.target.value)}
                    placeholder="Qual é o segmento?"
                    required
                    className="border-navy/20 focus:border-navy focus:ring-navy/20"
                  />
                )}
              </div>
            </>
          )}

          {/* STEP 3 — CNPJ + Responsável Técnico */}
          {step === 3 && (
            <>
              <div className="p-3 rounded-xl bg-gold/8 border border-gold/20 text-xs text-navy/70 leading-relaxed">
                Exigência sanitária (Anvisa/CFM). Necessário para emitir prontuários clínicos e NFS-e.
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-navy font-medium">
                  CNPJ da Clínica <span className="text-clinic-red">*</span>
                </Label>
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={e => setCnpj(formatCnpj(e.target.value))}
                  placeholder="00.000.000/0001-00"
                  required
                  autoFocus
                  inputMode="numeric"
                  className={cn(
                    'border-navy/20 focus:border-navy focus:ring-navy/20',
                    cnpj.replace(/\D/g, '').length === 14 && !cnpjValid && 'border-clinic-red focus:border-clinic-red'
                  )}
                />
                {cnpj.replace(/\D/g, '').length === 14 && !cnpjValid && (
                  <p className="text-xs text-clinic-red">CNPJ inválido.</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">Responsável Técnico (RT)</p>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="rtNome" className="text-navy font-medium">
                      Nome completo <span className="text-clinic-red">*</span>
                    </Label>
                    <Input
                      id="rtNome"
                      value={rtNome}
                      onChange={e => setRtNome(e.target.value)}
                      placeholder="Dra. Ana Paula Silva"
                      required
                      className="border-navy/20 focus:border-navy focus:ring-navy/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="rtConselho" className="text-navy font-medium">
                        Conselho <span className="text-clinic-red">*</span>
                      </Label>
                      <div className="relative">
                        <select
                          id="rtConselho"
                          value={rtConselho}
                          onChange={e => setRtConselho(e.target.value)}
                          required
                          className="w-full h-10 rounded-md bg-white border border-navy/20 text-navy px-3 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                        >
                          <option value="" disabled>Tipo</option>
                          {CONSELHOS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtUf" className="text-navy font-medium">
                        UF <span className="text-clinic-red">*</span>
                      </Label>
                      <div className="relative">
                        <select
                          id="rtUf"
                          value={rtUfConselho}
                          onChange={e => setRtUfConselho(e.target.value)}
                          required
                          className="w-full h-10 rounded-md bg-white border border-navy/20 text-navy px-3 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                        >
                          <option value="" disabled>UF</option>
                          {UFS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rtNumero" className="text-navy font-medium">
                      Número do registro <span className="text-clinic-red">*</span>
                    </Label>
                    <Input
                      id="rtNumero"
                      value={rtNumeroConselho}
                      onChange={e => setRtNumeroConselho(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      required
                      inputMode="numeric"
                      className="border-navy/20 focus:border-navy focus:ring-navy/20"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => { setStep(step - 1); setError(null) }}
                className="border-navy/20 text-navy hover:bg-navy/5"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                type="submit"
                disabled={!canAdvance()}
                className="flex-1 bg-navy hover:bg-navy/90 text-white"
              >
                Avançar
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending || !canAdvance()}
                className="flex-1 bg-gold hover:bg-gold/90 text-navy font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Começar a usar o Estetia'
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            SSL Seguro
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            LGPD
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-teal" />
            Anvisa
          </div>
        </div>
      </div>
    </div>
  )
}
