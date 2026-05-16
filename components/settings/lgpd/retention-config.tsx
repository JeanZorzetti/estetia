'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateRetention } from '@/app/[locale]/dashboard/settings/lgpd/actions'

interface Props {
  initial: number
}

export function RetentionConfig({ initial }: Props) {
  const [months, setMonths] = useState(initial)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      try {
        await updateRetention(months)
        toast.success('Política de retenção atualizada')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Política de Retenção</CardTitle>
        <CardDescription>
          Dados de pacientes inativos podem ser anonimizados após o período definido
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3 max-w-md">
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="ret-months">Anonimizar após (meses)</Label>
            <Input
              id="ret-months"
              type="number"
              min={6}
              max={120}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            />
          </div>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Pacientes sem atendimentos por {months} meses serão candidatos à anonimização.
          O processo é manual e auditado.
        </p>
      </CardContent>
    </Card>
  )
}
