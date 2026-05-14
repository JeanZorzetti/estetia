'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoyaltyConfigSchema, type LoyaltyConfigInput } from '@/lib/loyalty/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'

interface Props {
  initialConfig: LoyaltyConfigInput | null
}

export function LoyaltyConfigForm({ initialConfig }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<LoyaltyConfigInput>({
    resolver: zodResolver(LoyaltyConfigSchema) as any,
    defaultValues: {
      pontosPorReal: initialConfig?.pontosPorReal ?? 1,
      ativo: initialConfig?.ativo ?? true,
      regrasResgate: initialConfig?.regrasResgate ?? {},
    },
  })

  const ativo = watch('ativo')

  const onSubmit = async (data: LoyaltyConfigInput) => {
    setSaving(true)
    try {
      await fetch('/api/loyalty/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Configuração do Programa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="pontosPorReal" className="text-sm font-medium">
                Pontos por R$ gasto
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">Ex: 1 = 1 ponto para cada R$1,00</p>
            </div>
            <Input
              id="pontosPorReal"
              type="number"
              step="0.1"
              min="0"
              className="w-24 text-right"
              {...register('pontosPorReal')}
            />
          </div>

          {errors.pontosPorReal && (
            <p className="text-destructive text-xs">{errors.pontosPorReal.message}</p>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Programa ativo</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Pacientes acumulam e resgatam pontos</p>
            </div>
            <Switch
              checked={ativo}
              onCheckedChange={v => setValue('ativo', v)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving} size="sm">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saved ? 'Salvo!' : 'Salvar configuração'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
