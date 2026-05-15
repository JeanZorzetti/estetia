'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DpoUpdateSchema, type DpoUpdateInput } from '@/lib/lgpd/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save, CheckCircle2 } from 'lucide-react'

interface Props {
  initialData: DpoUpdateInput | null
}

export function DpoForm({ initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<DpoUpdateInput>({
    resolver: zodResolver(DpoUpdateSchema) as any,
    defaultValues: {
      dpoName: initialData?.dpoName ?? '',
      dpoEmail: initialData?.dpoEmail ?? '',
      dpoPhone: initialData?.dpoPhone ?? '',
      dpoCpf: initialData?.dpoCpf ?? '',
    },
  })

  const onSubmit = async (data: DpoUpdateInput) => {
    setSaving(true)
    try {
      const res = await fetch('/api/lgpd/dpo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Encarregado de Dados (DPO)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Nome completo *</Label>
            <Input placeholder="Ex: Maria Silva" {...register('dpoName')} />
            {errors.dpoName && <p className="text-destructive text-xs">{errors.dpoName.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">E-mail *</Label>
            <Input type="email" placeholder="dpo@suaclinica.com.br" {...register('dpoEmail')} />
            {errors.dpoEmail && <p className="text-destructive text-xs">{errors.dpoEmail.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Telefone</Label>
              <Input placeholder="(11) 99999-9999" {...register('dpoPhone')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">CPF (opcional)</Label>
              <Input placeholder="000.000.000-00" {...register('dpoCpf')} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
            {saved && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                DPO atualizado
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
