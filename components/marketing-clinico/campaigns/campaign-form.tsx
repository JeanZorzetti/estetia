'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCampaignSchema, type CreateCampaignInput, SegmentSchema } from '@/lib/marketing-campaigns/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, Send } from 'lucide-react'
import { SegmentBuilder } from './segment-builder'

interface Props {
  initialData?: CreateCampaignInput & { id?: string }
}

const PLACEHOLDERS = ['{nome}', '{clinica}']

export function CampaignForm({ initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const isEdit = !!initialData?.id

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<CreateCampaignInput>({
    resolver: zodResolver(CreateCampaignSchema) as any,
    defaultValues: {
      nome: initialData?.nome ?? '',
      canal: initialData?.canal ?? 'WHATSAPP',
      segmento: initialData?.segmento ?? SegmentSchema.parse({}),
      mensagem: initialData?.mensagem ?? '',
      agendadoPara: initialData?.agendadoPara ?? null,
    },
  })

  const canal = watch('canal')
  const segmento = watch('segmento')

  const save = async (data: CreateCampaignInput, sendNow = false) => {
    setSaving(true)
    try {
      const url = isEdit ? `/api/marketing-campaigns/${initialData!.id}` : '/api/marketing-campaigns'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) return
      const result = await res.json()

      if (sendNow && result.campaign?.id) {
        await fetch(`/api/marketing-campaigns/${result.campaign.id}/send`, { method: 'POST' })
      }

      router.push('/dashboard/marketing-clinico/campanhas')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="flex flex-col gap-6">
      {/* Identificação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Nome da campanha *</Label>
            <Input placeholder="Ex: Promoção de Inverno" {...register('nome')} />
            {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Canal *</Label>
            <Controller
              name="canal"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="EMAIL">E-mail</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Segmento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Segmento de pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <SegmentBuilder
            campaignId={initialData?.id}
            value={segmento}
            onChange={v => setValue('segmento', v)}
          />
        </CardContent>
      </Card>

      {/* Mensagem */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mensagem</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            {PLACEHOLDERS.map(ph => (
              <Button
                key={ph}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs font-mono"
                onClick={() => {
                  const current = watch('mensagem') ?? ''
                  setValue('mensagem', current + ph)
                }}
              >
                {ph}
              </Button>
            ))}
          </div>
          <Textarea
            placeholder={`Olá {nome}, temos uma promoção especial para você na {clinica}!`}
            className="resize-none h-32"
            {...register('mensagem')}
          />
          {errors.mensagem && <p className="text-destructive text-xs">{errors.mensagem.message}</p>}
        </CardContent>
      </Card>

      {/* Agendamento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Agendamento (opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Agendar para</Label>
            <Input type="datetime-local" className="w-64" {...register('agendadoPara')} />
            <p className="text-xs text-muted-foreground">Deixe em branco para salvar como rascunho</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={handleSubmit(data => save(data, false))}
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar rascunho
        </Button>
        <Button
          type="button"
          disabled={saving}
          onClick={handleSubmit(data => save(data, true))}
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Enviar agora
        </Button>
      </div>
    </form>
  )
}
