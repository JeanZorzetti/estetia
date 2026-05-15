'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConvenioCreateSchema, type ConvenioCreateInput } from '@/lib/financeiro/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface Operadora { id: string; nome: string }

interface Props {
  initialData?: ConvenioCreateInput & { id?: string }
  operadoras: Operadora[]
  preSelectedOperadoraId?: string
}

export function ConvenioForm({ initialData, operadoras, preSelectedOperadoraId }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const isEdit = !!initialData?.id

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<ConvenioCreateInput>({
    resolver: zodResolver(ConvenioCreateSchema) as any,
    defaultValues: {
      operadoraId: initialData?.operadoraId ?? preSelectedOperadoraId ?? operadoras[0]?.id ?? '',
      procedureId: initialData?.procedureId ?? null,
      codigoTuss: initialData?.codigoTuss ?? '',
      descricaoTuss: initialData?.descricaoTuss ?? '',
      valorNegociado: initialData?.valorNegociado ?? null,
      porcentagemCo: initialData?.porcentagemCo ?? null,
      vigenciaInicio: initialData?.vigenciaInicio ?? null,
      vigenciaFim: initialData?.vigenciaFim ?? null,
      ativo: initialData?.ativo ?? true,
    },
  })

  const ativo = watch('ativo')

  const onSubmit = async (data: ConvenioCreateInput) => {
    setSaving(true)
    try {
      const url = isEdit ? `/api/convenios/${initialData!.id}` : '/api/convenios'
      const method = isEdit ? 'PATCH' : 'POST'
      const payload = {
        ...data,
        vigenciaInicio: data.vigenciaInicio ? new Date(data.vigenciaInicio).toISOString() : null,
        vigenciaFim: data.vigenciaFim ? new Date(data.vigenciaFim).toISOString() : null,
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/dashboard/financeiro/operadoras')
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Operadora</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="operadoraId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a operadora" />
                </SelectTrigger>
                <SelectContent>
                  {operadoras.map(op => (
                    <SelectItem key={op.id} value={op.id}>{op.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.operadoraId && <p className="text-destructive text-xs mt-1">{errors.operadoraId.message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Procedimento TUSS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Código TUSS</Label>
              <Input placeholder="Ex: 10101012" {...register('codigoTuss')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Descrição</Label>
              <Input placeholder="Ex: Consulta médica" {...register('descricaoTuss')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Valores e vigência</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Valor negociado (R$)</Label>
              <Input type="number" step="0.01" min="0" placeholder="0,00" {...register('valorNegociado')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">% Co-participação</Label>
              <Input type="number" step="0.1" min="0" max="100" placeholder="0" {...register('porcentagemCo')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Vigência início</Label>
              <Input type="date" {...register('vigenciaInicio')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Vigência fim</Label>
              <Input type="date" {...register('vigenciaFim')} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label className="text-sm font-medium">Convênio ativo</Label>
            <Switch checked={ativo} onCheckedChange={v => setValue('ativo', v)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Salvar alterações' : 'Criar convênio'}
        </Button>
      </div>
    </form>
  )
}
