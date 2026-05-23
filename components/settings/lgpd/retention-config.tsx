'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
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
    <Card className={cn(
      "border-border/50 relative overflow-hidden",
      "bg-gradient-to-br from-card to-background/40",
      "rounded-2xl shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-300"
    )}>
      <CardHeader className="pb-3 border-b border-border/20">
        <CardTitle className="text-base font-semibold">Política de Retenção de Dados</CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground/80 mt-0.5">
          Defina o tempo limite de inatividade antes de anonimizar dados sensíveis de pacientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="flex items-end gap-3 max-w-md">
          <div className="space-y-2 flex-1">
            <Label htmlFor="ret-months" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Anonimizar após (meses)</Label>
            <Input
              id="ret-months"
              type="number"
              min={6}
              max={120}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="h-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/20 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            />
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isPending}
            className="rounded-xl h-10 px-5 shadow-sm transition-all duration-200"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </div>
        
        {/* Decorative Alert Panel */}
        <div className="rounded-xl bg-primary/[0.02] dark:bg-primary/[0.04] border border-primary/10 p-3.5 flex items-start gap-3 mt-4">
          <HelpCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pacientes sem nenhum atendimento registrado por mais de <strong className="text-foreground">{months} meses</strong> serão identificados como candidatos à anonimização segura. O procedimento final é manual, auditado e irreversível.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
