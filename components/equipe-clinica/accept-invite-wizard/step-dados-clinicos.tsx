'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CONSELHOS = ['CRM', 'CRO', 'CRBM', 'CRF', 'COREN', 'CFBM', 'CREFITO', 'CRP']

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

export interface ClinicalFormData {
  conselho: string
  numeroConselho: string
  ufConselho: string
  especialidades: string[]
  bio: string
}

interface Props {
  value: ClinicalFormData
  onChange: (v: ClinicalFormData) => void
}

export function StepDadosClinicos({ value, onChange }: Props) {
  function patch(key: keyof ClinicalFormData, val: string | string[]) {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Preencha seus dados clínicos. Você poderá editar depois.</p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Conselho</Label>
          <Select value={value.conselho} onValueChange={v => patch('conselho', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              {CONSELHOS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dc-num">Número</Label>
          <Input
            id="dc-num"
            value={value.numeroConselho}
            onChange={e => patch('numeroConselho', e.target.value)}
            placeholder="12345"
          />
        </div>

        <div className="space-y-1.5">
          <Label>UF</Label>
          <Select value={value.ufConselho} onValueChange={v => patch('ufConselho', v)}>
            <SelectTrigger>
              <SelectValue placeholder="UF..." />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dc-esp">Especialidades (separadas por vírgula)</Label>
        <Input
          id="dc-esp"
          value={value.especialidades.join(', ')}
          onChange={e => patch('especialidades', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="Dermatologia, Estética Avançada"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dc-bio">Bio profissional (opcional)</Label>
        <Textarea
          id="dc-bio"
          rows={3}
          placeholder="Breve descrição da sua trajetória e especialização..."
          value={value.bio}
          onChange={e => patch('bio', e.target.value)}
          className="resize-none"
        />
      </div>
    </div>
  )
}
