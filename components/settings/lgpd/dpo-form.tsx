'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Encarregado de Dados (DPO)</CardTitle>
        <CardDescription>
          Art. 41 da LGPD — responsável pelo tratamento de dados pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="dpo-name">Nome completo</Label>
            <Input id="dpo-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Souza" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dpo-email">E-mail</Label>
            <Input id="dpo-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dpo@clinica.com" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="dpo-phone">Telefone</Label>
            <Input id="dpo-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dpo-cpf">CPF</Label>
            <Input id="dpo-cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
          </div>
        </div>

        <Button onClick={handleSave} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar DPO
        </Button>
      </CardContent>
    </Card>
  )
}
