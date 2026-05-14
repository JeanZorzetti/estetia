'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreatePatientSchema, type CreatePatientInput } from '@/lib/patients/schema'
import { Button } from '@/components/ui/button'
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
import { ChevronDown, ChevronRight, Loader2, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-medium">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-1">{message}</p>
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Identificação */}
      <Section title="Identificação">
        <div className="sm:col-span-2">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input id="nome" placeholder="Nome do paciente" {...register('nome')} className="mt-1" />
          <FieldError message={errors.nome?.message} />
        </div>

        <div>
          <Label htmlFor="telefone">Telefone *</Label>
          <Input id="telefone" placeholder="(11) 99999-9999" {...register('telefone')} className="mt-1" />
          <FieldError message={errors.telefone?.message} />
        </div>

        <div>
          <Label htmlFor="dataNascimento">Data de nascimento *</Label>
          <Input id="dataNascimento" type="date" {...register('dataNascimento')} className="mt-1" />
          <FieldError message={errors.dataNascimento?.message} />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com" {...register('email')} className="mt-1" />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" placeholder="Somente números (11 dígitos)" {...register('cpf')} className="mt-1" />
          <FieldError message={errors.cpf?.message} />
        </div>

        <div>
          <Label>Sexo</Label>
          <Select onValueChange={v => setValue('sexo', v as 'M' | 'F' | 'NB' | 'NI')}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Feminino</SelectItem>
              <SelectItem value="NB">Não binário</SelectItem>
              <SelectItem value="NI">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Como nos conheceu</Label>
          <Select onValueChange={v => setValue('origem', v as CreatePatientInput['origem'])}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
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
      <Section title="Informações de Saúde" defaultOpen={false}>
        <div className="sm:col-span-2">
          <Label htmlFor="alergias">Alergias</Label>
          <Input
            id="alergias"
            placeholder="Separadas por vírgula (ex: látex, dipirona)"
            className="mt-1"
            onChange={e =>
              setValue('alergias', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [])
            }
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="medicacoes">Medicações em uso</Label>
          <Input
            id="medicacoes"
            placeholder="Separadas por vírgula"
            className="mt-1"
            onChange={e =>
              setValue('medicacoesUso', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [])
            }
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="contraindicacoes">Contraindicações</Label>
          <Input
            id="contraindicacoes"
            placeholder="Separadas por vírgula"
            className="mt-1"
            onChange={e =>
              setValue('contraindicacoes', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [])
            }
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="observacoesMedicas">Observações médicas</Label>
          <Textarea
            id="observacoesMedicas"
            placeholder="Histórico relevante, condições crônicas, etc."
            {...register('observacoesMedicas')}
            className="mt-1 resize-none"
            rows={3}
          />
        </div>
      </Section>

      {/* LGPD */}
      <div className="rounded-xl border border-border/60 p-4 bg-amber-50/50">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consentimentoLgpd"
            checked={consentValue === true}
            onCheckedChange={checked => setValue('consentimentoLgpd', checked === true ? true : (false as never))}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="consentimentoLgpd" className="cursor-pointer font-medium text-sm">
              Consentimento LGPD *
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              O paciente concorda com o armazenamento e tratamento de seus dados de saúde de acordo com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
            </p>
            <FieldError message={errors.consentimentoLgpd?.message} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/pacientes')}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          {submitting ? 'Salvando...' : 'Cadastrar Paciente'}
        </Button>
      </div>
    </form>
  )
}
