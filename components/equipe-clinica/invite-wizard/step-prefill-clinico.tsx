'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

const CONSELHOS = ['CRM', 'CRO', 'CRBM', 'CRF', 'COREN', 'CFBM', 'CREFITO', 'CRP']

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

export interface PrefillData {
  nome?: string
  conselho?: string
  numeroConselho?: string
  ufConselho?: string
  especialidades?: string[]
}

interface Props {
  value: PrefillData
  onChange: (v: PrefillData) => void
}

export function StepPrefillClinico({ value, onChange }: Props) {
  const [enabled, setEnabled] = useState(false)

  if (!enabled) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border/50 p-4">
        <Switch id="prefill-toggle" checked={enabled} onCheckedChange={setEnabled} />
        <div>
          <Label htmlFor="prefill-toggle" className="cursor-pointer font-medium text-sm">
            Pré-preencher dados clínicos
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Opcional — o profissional poderá completar ao aceitar o convite
          </p>
        </div>
      </div>
    )
  }

  function patch(key: keyof PrefillData, val: string | string[]) {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Switch id="prefill-toggle" checked={enabled} onCheckedChange={setEnabled} />
        <div>
          <Label htmlFor="prefill-toggle" className="cursor-pointer font-medium text-sm">
            Pré-preencher dados clínicos
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">Esses dados serão carregados quando o profissional aceitar</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="pf-nome">Nome completo</Label>
          <Input
            id="pf-nome"
            value={value.nome ?? ''}
            onChange={e => patch('nome', e.target.value)}
            placeholder="Dr. João Silva"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Conselho</Label>
          <Select value={value.conselho ?? ''} onValueChange={v => patch('conselho', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              {CONSELHOS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pf-num">Número do conselho</Label>
          <Input
            id="pf-num"
            value={value.numeroConselho ?? ''}
            onChange={e => patch('numeroConselho', e.target.value)}
            placeholder="12345"
          />
        </div>

        <div className="space-y-1.5">
          <Label>UF do conselho</Label>
          <Select value={value.ufConselho ?? ''} onValueChange={v => patch('ufConselho', v)}>
            <SelectTrigger>
              <SelectValue placeholder="UF..." />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pf-esp">Especialidades (separadas por vírgula)</Label>
          <Input
            id="pf-esp"
            value={(value.especialidades ?? []).join(', ')}
            onChange={e => patch('especialidades', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="Dermatologia, Estética"
          />
        </div>
      </div>
    </div>
  )
}
