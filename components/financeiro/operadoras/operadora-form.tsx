'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OperadoraCreateSchema, type OperadoraCreateInput } from '@/lib/financeiro/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface Props {
  initialData?: OperadoraCreateInput & { id?: string }
}

export function OperadoraForm({ initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const isEdit = !!initialData?.id

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<OperadoraCreateInput>({
    resolver: zodResolver(OperadoraCreateSchema) as any,
    defaultValues: {
      nome: initialData?.nome ?? '',
      codigoAns: initialData?.codigoAns ?? '',
      cnpj: initialData?.cnpj ?? '',
      tipo: initialData?.tipo ?? 'CONVENIO',
      contatoNome: initialData?.contatoNome ?? '',
      contatoEmail: initialData?.contatoEmail ?? '',
      contatoTelefone: initialData?.contatoTelefone ?? '',
      prazoRepasseDias: initialData?.prazoRepasseDias ?? null,
      ativo: initialData?.ativo ?? true,
    },
  })

  const ativo = watch('ativo')

  const onSubmit = async (data: OperadoraCreateInput) => {
    setSaving(true)
    try {
      const url = isEdit ? `/api/operadoras/${initialData!.id}` : '/api/operadoras'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Nome *</Label>
            <Input placeholder="Ex: Unimed BH" {...register('nome')} />
            {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Código ANS</Label>
              <Input placeholder="6 dígitos" maxLength={10} {...register('codigoAns')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">CNPJ</Label>
              <Input placeholder="00.000.000/0000-00" {...register('cnpj')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Tipo *</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONVENIO">Convênio</SelectItem>
                    <SelectItem value="PARTICULAR">Particular</SelectItem>
                    <SelectItem value="CORTESIA">Cortesia</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contato e Repasse</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Nome do contato</Label>
              <Input {...register('contatoNome')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Telefone</Label>
              <Input {...register('contatoTelefone')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">E-mail</Label>
              <Input type="email" {...register('contatoEmail')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Prazo de repasse (dias)</Label>
              <Input type="number" min="0" placeholder="Ex: 60" {...register('prazoRepasseDias')} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <Label className="text-sm font-medium">Operadora ativa</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Operadoras inativas não aparecem em listas</p>
            </div>
            <Switch checked={ativo} onCheckedChange={v => setValue('ativo', v)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Salvar alterações' : 'Criar operadora'}
        </Button>
      </div>
    </form>
  )
}
