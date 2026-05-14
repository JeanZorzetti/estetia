'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreateRecallRuleSchema, type CreateRecallRuleInput } from '@/lib/recall/schema'
import { resolveRecallTemplate } from '@/lib/recall/template'

interface Procedure {
  id: string
  nome: string
}

interface RecallRuleFormProps {
  procedures: Procedure[]
  initialData?: Partial<CreateRecallRuleInput> & { id?: string }
}

const PLACEHOLDER_HELPERS = [
  { key: '{{paciente_nome}}', desc: 'Nome do paciente' },
  { key: '{{procedimento}}', desc: 'Nome do procedimento' },
  { key: '{{dias_sem_visita}}', desc: 'Dias desde a última visita' },
  { key: '{{link_agendamento}}', desc: 'Link para agendamento online' },
]

const DEFAULT_TEMPLATES = {
  WHATSAPP: 'Olá {{paciente_nome}}! 😊 Faz {{dias_sem_visita}} dias desde sua última visita. Que tal agendar seu próximo {{procedimento}}? Reserve seu horário aqui: {{link_agendamento}}',
  EMAIL: 'Olá {{paciente_nome}},\n\nFaz {{dias_sem_visita}} dias desde sua última visita à nossa clínica.\n\nQue tal agendar seu próximo {{procedimento}}?\n\nAcesse: {{link_agendamento}}\n\nEsperamos por você!',
}

export function RecallRuleForm({ procedures, initialData }: RecallRuleFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!initialData?.id

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRecallRuleInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateRecallRuleSchema) as any,
    defaultValues: {
      nome: initialData?.nome ?? '',
      procedimentoId: initialData?.procedimentoId ?? '',
      intervaloDias: initialData?.intervaloDias ?? 90,
      canal: initialData?.canal ?? 'WHATSAPP',
      template: initialData?.template ?? DEFAULT_TEMPLATES.WHATSAPP,
      ativo: initialData?.ativo ?? true,
    },
  })

  const canal = watch('canal')
  const template = watch('template')
  const procedimentoId = watch('procedimentoId')

  const procedimentoNome = procedures.find(p => p.id === procedimentoId)?.nome

  const preview = resolveRecallTemplate(template || '', {
    paciente_nome: 'Maria Silva',
    procedimento: procedimentoNome ?? 'Botox',
    dias_sem_visita: watch('intervaloDias') || 90,
    link_agendamento: 'https://estetiacrm.com.br/agendar',
  })

  const onSubmit: SubmitHandler<CreateRecallRuleInput> = async (data) => {
    setSubmitting(true)
    setError(null)
    try {
      const url = isEdit ? `/api/recall-rules/${initialData!.id}` : '/api/recall-rules'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error?.message ?? 'Erro ao salvar regra')
      }
      router.push('/dashboard/recall')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* Identificação */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-foreground">Identificação</h2>
          <p className="text-xs text-muted-foreground">Nome interno e configurações básicas da regra</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Nome da regra</label>
            <input
              {...register('nome')}
              placeholder="Ex: Botox 90 dias, Limpeza de pele mensal..."
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#489FB5]/40 focus:border-[#489FB5] transition-all placeholder:text-muted-foreground/50"
            />
            {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Procedimento</label>
              <select
                {...register('procedimentoId')}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#489FB5]/40 focus:border-[#489FB5] transition-all"
              >
                <option value="">Qualquer procedimento</option>
                {procedures.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Intervalo (dias)</label>
              <input
                type="number"
                {...register('intervaloDias')}
                min={1}
                max={365}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#489FB5]/40 focus:border-[#489FB5] transition-all"
              />
              {errors.intervaloDias && <p className="text-xs text-red-500">{errors.intervaloDias.message}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Canal */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-foreground">Canal de envio</h2>
          <p className="text-xs text-muted-foreground">Por onde a mensagem será enviada ao paciente</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="grid grid-cols-2 gap-3">
            {(['WHATSAPP', 'EMAIL'] as const).map(ch => {
              const active = canal === ch
              return (
                <label
                  key={ch}
                  className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${
                    active
                      ? 'border-[#489FB5] bg-[#489FB5]/5'
                      : 'border-border/60 bg-background hover:border-border'
                  }`}
                >
                  <input
                    type="radio"
                    value={ch}
                    checked={active}
                    onChange={() => {
                      setValue('canal', ch)
                      if (!initialData?.template) {
                        setValue('template', DEFAULT_TEMPLATES[ch])
                      }
                    }}
                    className="hidden"
                  />
                  <span className={`text-lg ${ch === 'WHATSAPP' ? '💬' : '📧'}`}>
                    {ch === 'WHATSAPP' ? '💬' : '📧'}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${active ? 'text-[#489FB5]' : 'text-foreground'}`}>
                      {ch === 'WHATSAPP' ? 'WhatsApp' : 'E-mail'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {ch === 'WHATSAPP' ? 'Alta taxa de abertura' : 'Ideal para conteúdo detalhado'}
                    </p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </section>

      {/* Template */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-foreground">Mensagem</h2>
          <p className="text-xs text-muted-foreground">Texto enviado ao paciente. Use os placeholders abaixo.</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {PLACEHOLDER_HELPERS.map(ph => (
              <button
                key={ph.key}
                type="button"
                title={ph.desc}
                onClick={() => {
                  const el = document.querySelector<HTMLTextAreaElement>('textarea[name="template"]')
                  if (el) {
                    const pos = el.selectionStart
                    const current = template || ''
                    setValue('template', current.slice(0, pos) + ph.key + current.slice(pos))
                  }
                }}
                className="inline-flex items-center gap-1 rounded-full border border-[#489FB5]/30 bg-[#489FB5]/5 px-2.5 py-1 text-[10px] font-mono text-[#489FB5] hover:bg-[#489FB5]/15 transition-colors"
              >
                {ph.key}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Template</label>
              <textarea
                {...register('template')}
                rows={6}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#489FB5]/40 focus:border-[#489FB5] transition-all resize-none placeholder:text-muted-foreground/50 font-mono"
                placeholder="Escreva a mensagem..."
              />
              {errors.template && <p className="text-xs text-red-500">{errors.template.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Pré-visualização</label>
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground/80 whitespace-pre-wrap min-h-[144px] leading-relaxed">
                {preview || <span className="text-muted-foreground/50 text-xs">Digite o template para ver a pré-visualização</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F3D] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0A1F3D]/90 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar regra'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
