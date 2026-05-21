'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreatePatientSchema, type CreatePatientInput } from '@/lib/patients/schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, Loader2, UserPlus, User, Heart, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function Section({
  title,
  children,
  defaultOpen = true,
  icon: Icon,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon: LucideIcon
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="relative rounded-2xl border border-slate-200/50 bg-white/30 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/40 hover:bg-slate-100/40 transition-all duration-300 border-b border-slate-100/30 group"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/80 border border-slate-200/40 shadow-sm text-slate-500 group-hover:text-[#0A1F3D] transition-colors shrink-0">
            <Icon className="w-4 h-4 shrink-0" />
          </div>
          <span className="text-[11px] font-black tracking-widest text-[#0A1F3D] uppercase leading-none">{title}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open && <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 bg-white/10">{children}</div>}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-[10px] font-semibold text-rose-500 mt-1.5 tracking-wide leading-none">{message}</p>
}

export function NovoPacienteForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePatientInput>({
    resolver: zodResolver(CreatePatientSchema),
    defaultValues: {
      alergias: [],
      medicacoesUso: [],
      contraindicacoes: [],
      tags: [],
    },
  })

  const consentValue = watch('consentimentoLgpd')

  async function onSubmit(data: CreatePatientInput) {
    setSubmitting(true)
    setServerError(null)
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error ?? 'Erro ao salvar paciente')
        return
      }
      router.push(`/dashboard/pacientes/${json.patient.id}`)
    } catch {
      setServerError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "mt-1.5 bg-white/60 hover:bg-white/90 border-slate-200/80 rounded-xl transition-all duration-300 focus:border-[#489FB5]/50 focus:ring-2 focus:ring-[#489FB5]/10 text-sm shadow-inner placeholder:text-slate-300 h-10"
  const textareaClass = "mt-1.5 bg-white/60 hover:bg-white/90 border-slate-200/80 rounded-xl transition-all duration-300 focus:border-[#489FB5]/50 focus:ring-2 focus:ring-[#489FB5]/10 text-sm shadow-inner placeholder:text-slate-300 resize-none p-3"
  const labelClass = "text-[10px] font-bold tracking-widest text-slate-400 uppercase leading-none"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {serverError && (
        <div className="rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3.5 text-xs font-semibold tracking-wide text-red-600 backdrop-blur-md">
          {serverError}
        </div>
      )}

      {/* Identificação */}
      <Section title="Identificação" icon={User}>
        <div className="sm:col-span-2">
          <Label htmlFor="nome" className={labelClass}>Nome completo *</Label>
          <Input id="nome" placeholder="Nome do paciente" {...register('nome')} className={inputClass} />
          <FieldError message={errors.nome?.message} />
        </div>

        <div>
          <Label htmlFor="telefone" className={labelClass}>Telefone *</Label>
          <Input id="telefone" placeholder="(11) 99999-9999" {...register('telefone')} className={inputClass} />
          <FieldError message={errors.telefone?.message} />
        </div>

        <div>
          <Label htmlFor="dataNascimento" className={labelClass}>Data de nascimento *</Label>
          <Input id="dataNascimento" type="date" {...register('dataNascimento')} className={inputClass} />
          <FieldError message={errors.dataNascimento?.message} />
        </div>

        <div>
          <Label htmlFor="email" className={labelClass}>E-mail</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com" {...register('email')} className={inputClass} />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="cpf" className={labelClass}>CPF</Label>
          <Input id="cpf" placeholder="Somente números (11 dígitos)" {...register('cpf')} className={inputClass} />
          <FieldError message={errors.cpf?.message} />
        </div>

        <div>
          <Label className={labelClass}>Sexo</Label>
          <Select onValueChange={v => setValue('sexo', v as 'M' | 'F' | 'NB' | 'NI')}>
            <SelectTrigger className="mt-1.5 bg-white/60 hover:bg-white/90 border-slate-200/80 rounded-xl transition-all duration-300 focus:border-[#489FB5]/50 focus:ring-2 focus:ring-[#489FB5]/10 text-sm text-slate-700 h-10 shadow-inner">
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Feminino</SelectItem>
              <SelectItem value="NB">Não binário</SelectItem>
              <SelectItem value="NI">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={labelClass}>Como nos conheceu</Label>
          <Select onValueChange={v => setValue('origem', v as CreatePatientInput['origem'])}>
            <SelectTrigger className="mt-1.5 bg-white/60 hover:bg-white/90 border-slate-200/80 rounded-xl transition-all duration-300 focus:border-[#489FB5]/50 focus:ring-2 focus:ring-[#489FB5]/10 text-sm text-slate-700 h-10 shadow-inner">
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="walk_in">Walk-in</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* Saúde */}
      <Section title="Informações de Saúde" defaultOpen={false} icon={Heart}>
        <div className="sm:col-span-2">
          <Label htmlFor="alergias" className={labelClass}>Alergias</Label>
          <Input
            id="alergias"
            placeholder="Separadas por vírgula (ex: látex, dipirona)"
            className={inputClass}
            onChange={e =>
              setValue('alergias', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [])
            }
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="medicacoes" className={labelClass}>Medicações em uso</Label>
          <Input
            id="medicacoes"
            placeholder="Separadas por vírgula"
            className={inputClass}
            onChange={e =>
              setValue('medicacoesUso', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [])
            }
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="contraindicacoes" className={labelClass}>Contraindicações</Label>
          <Input
            id="contraindicacoes"
            placeholder="Separadas por vírgula"
            className={inputClass}
            onChange={e =>
              setValue('contraindicacoes', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [])
            }
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="observacoesMedicas" className={labelClass}>Observações médicas</Label>
          <Textarea
            id="observacoesMedicas"
            placeholder="Histórico relevante, condições crônicas, etc."
            {...register('observacoesMedicas')}
            className={textareaClass}
            rows={3}
          />
        </div>
      </Section>

      {/* LGPD */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/15 bg-gradient-to-r from-amber-500/[0.03] to-amber-600/[0.06] p-5 backdrop-blur-md">
        {/* Subtle inside double-border */}
        <div className="absolute inset-0.5 rounded-[14px] border border-white/40 pointer-events-none" />

        {/* Left golden highlight glow */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] rounded-r bg-amber-500/40" />

        <div className="flex items-start gap-3.5 relative z-10">
          <Checkbox
            id="consentimentoLgpd"
            checked={consentValue === true}
            onCheckedChange={checked => setValue('consentimentoLgpd', checked === true ? true : (false as never))}
            className="mt-1 border-amber-500/30 text-amber-700 focus:ring-amber-500/20 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 rounded shrink-0"
          />
          <div>
            <Label htmlFor="consentimentoLgpd" className="cursor-pointer text-xs font-black uppercase tracking-wider text-amber-800 leading-none">
              Consentimento LGPD *
            </Label>
            <p className="text-[11px] font-medium text-amber-950/60 mt-1 leading-relaxed max-w-2xl">
              O paciente concorda com o armazenamento e tratamento de seus dados de saúde de acordo com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
            </p>
            <FieldError message={errors.consentimentoLgpd?.message} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100/50 mt-2">
        <button
          type="button"
          className="border border-slate-200/80 bg-white/50 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl text-[10px] uppercase tracking-wider px-5 py-3 transition-all duration-300 disabled:opacity-50"
          onClick={() => router.push('/dashboard/pacientes')}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-[#489FB5] to-[#0A1F3D] hover:opacity-95 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest px-6 py-3 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#489FB5]/10 hover:shadow-[#489FB5]/20 gap-2 flex items-center disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          <span>{submitting ? 'Salvando...' : 'Cadastrar Paciente'}</span>
        </button>
      </div>
    </form>
  )
}

