'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X, Users, Loader2 } from 'lucide-react'
import type { SegmentInput } from '@/lib/marketing-campaigns/schema'

interface Props {
  campaignId?: string
  value: SegmentInput
  onChange: (v: SegmentInput) => void
}

export function SegmentBuilder({ campaignId, value, onChange }: Props) {
  const [tagInput, setTagInput] = useState('')
  const [previewCount, setPreviewCount] = useState<number | null>(null)
  const [previewing, setPreviewing] = useState(false)

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || value.tags.includes(trimmed)) return
    onChange({ ...value, tags: [...value.tags, trimmed] })
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    onChange({ ...value, tags: value.tags.filter(t => t !== tag) })
  }

  const getPreview = async () => {
    if (!campaignId) return
    setPreviewing(true)
    try {
      const res = await fetch(`/api/marketing-campaigns/${campaignId}/preview`, { method: 'POST' })
      const data = await res.json()
      setPreviewCount(data.totalDestinatarios ?? 0)
    } finally {
      setPreviewing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">Tags dos pacientes</Label>
        <p className="text-xs text-muted-foreground">Enviar apenas para pacientes com essas tags (ex: VIP, Particular)</p>
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar tag..."
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => addTag(tagInput)}>
            Adicionar
          </Button>
        </div>
        {value.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {value.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Origem */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">Origem</Label>
        <Select value={value.origem ?? 'all'} onValueChange={v => onChange({ ...value, origem: v === 'all' ? '' : v })}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os pacientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="indicacao">Indicação</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="walk_in">Walk-in</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Aniversariantes */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Apenas aniversariantes do mês</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Filtrar somente pacientes que fazem aniversário este mês</p>
        </div>
        <Switch
          checked={value.aniversariantesMes}
          onCheckedChange={v => onChange({ ...value, aniversariantesMes: v })}
        />
      </div>

      {/* Inativos */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">Inativos há mais de (dias)</Label>
        <p className="text-xs text-muted-foreground">Pacientes sem atividade há N dias. 0 = ignorar</p>
        <Input
          type="number"
          min="0"
          placeholder="Ex: 90"
          value={value.inativosDias ?? ''}
          onChange={e => onChange({ ...value, inativosDias: e.target.value ? Number(e.target.value) : null })}
          className="w-32"
        />
      </div>

      {/* Preview */}
      {campaignId && (
        <div className="flex items-center gap-3 pt-2 border-t border-border/50">
          <Button type="button" variant="outline" size="sm" onClick={getPreview} disabled={previewing}>
            {previewing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
            Calcular destinatários
          </Button>
          {previewCount !== null && (
            <p className="text-sm font-medium">
              ~{previewCount.toLocaleString('pt-BR')} paciente{previewCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
