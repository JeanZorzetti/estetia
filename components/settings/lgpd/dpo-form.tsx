'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateDpo } from '@/app/[locale]/dashboard/settings/lgpd/actions'

interface Props {
  initial: {
    dpoName: string | null
    dpoEmail: string | null
    dpoPhone: string | null
    dpoCpf: string | null
  }
}

export function DpoForm({ initial }: Props) {
  const [name, setName] = useState(initial.dpoName ?? '')
  const [email, setEmail] = useState(initial.dpoEmail ?? '')
  const [phone, setPhone] = useState(initial.dpoPhone ?? '')
  const [cpf, setCpf] = useState(initial.dpoCpf ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      try {
        await updateDpo({ dpoName: name, dpoEmail: email, dpoPhone: phone, dpoCpf: cpf })
        toast.success('Encarregado de Dados atualizado')
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
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Encarregado de Dados (DPO)
        </CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground/80 mt-0.5">
          Art. 41 da LGPD — encarregado pelo tratamento e canal de comunicação de dados pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dpo-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome completo</Label>
            <Input 
              id="dpo-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Maria Souza" 
              className="h-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/20 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dpo-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-mail</Label>
            <Input 
              id="dpo-email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="dpo@clinica.com" 
              className="h-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/20 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dpo-phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Telefone</Label>
            <Input 
              id="dpo-phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="(11) 99999-9999" 
              className="h-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/20 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dpo-cpf" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CPF</Label>
            <Input 
              id="dpo-cpf" 
              value={cpf} 
              onChange={(e) => setCpf(e.target.value)} 
              placeholder="000.000.000-00" 
              className="h-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/20 hover:border-border/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSave} 
            disabled={isPending}
            className="rounded-xl px-5 h-10 shadow-sm transition-all duration-200"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar DPO
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
