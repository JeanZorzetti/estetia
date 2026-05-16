'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MedicalCouncil } from '@prisma/client'
import { updateResponsavelTecnico } from '@/app/[locale]/dashboard/settings/clinica/actions'

const CONSELHOS: MedicalCouncil[] = ['CRM', 'CRO', 'CRBM', 'CRF', 'COREN', 'CFBM', 'CREFITO', 'CRP']

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

interface Props {
  initial: {
    rtNome: string | null
    rtConselho: MedicalCouncil | null
    rtNumeroConselho: string | null
    rtUfConselho: string | null
    rtCpf: string | null
  }
}

export function RtForm({ initial }: Props) {
  const [rtNome, setRtNome] = useState(initial.rtNome ?? '')
  const [rtConselho, setRtConselho] = useState<MedicalCouncil | ''>(initial.rtConselho ?? '')
  const [rtNumero, setRtNumero] = useState(initial.rtNumeroConselho ?? '')
  const [rtUf, setRtUf] = useState(initial.rtUfConselho ?? '')
  const [rtCpf, setRtCpf] = useState(initial.rtCpf ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      try {
        await updateResponsavelTecnico({
          rtNome: rtNome || null,
          rtConselho: (rtConselho || null) as MedicalCouncil | null,
          rtNumeroConselho: rtNumero || null,
          rtUfConselho: rtUf || null,
          rtCpf: rtCpf || null,
        })
        toast.success('Responsável Técnico salvo')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
        <p className="text-muted-foreground">
          O Responsável Técnico é uma obrigação sanitária. Aparece em emissão de NF-Se,
          alvarás e documentos regulados pela Anvisa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identificação do RT</CardTitle>
          <CardDescription>Profissional registrado em conselho de classe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rt-nome">Nome completo *</Label>
            <Input id="rt-nome" value={rtNome} onChange={(e) => setRtNome(e.target.value)} placeholder="Dr. João Silva" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Conselho</Label>
              <Select value={rtConselho} onValueChange={(v) => setRtConselho(v as MedicalCouncil)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  {CONSELHOS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rt-num">Número</Label>
              <Input id="rt-num" value={rtNumero} onChange={(e) => setRtNumero(e.target.value)} placeholder="12345" />
            </div>
            <div className="space-y-1.5">
              <Label>UF</Label>
              <Select value={rtUf} onValueChange={setRtUf}>
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rt-cpf">CPF (opcional)</Label>
            <Input id="rt-cpf" value={rtCpf} onChange={(e) => setRtCpf(e.target.value)} placeholder="000.000.000-00" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar Responsável Técnico
      </Button>
    </div>
  )
}
