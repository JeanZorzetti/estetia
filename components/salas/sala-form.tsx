'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SalaCreateSchema, type SalaCreateInput } from '@/lib/salas/schema'
import { DEFAULT_HORARIO } from '@/lib/profissionais/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'
import { HorarioEditor } from '@/components/profissionais/horario-editor'
import { ColorPicker } from './color-picker'

interface Props {
  initialData?: SalaCreateInput & { id?: string }
}

export function SalaForm({ initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [equipamentoInput, setEquipamentoInput] = useState('')
  const isEdit = !!initialData?.id

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<SalaCreateInput>({
    resolver: zodResolver(SalaCreateSchema) as any,
    defaultValues: {
      nome: initialData?.nome ?? '',
      tipo: initialData?.tipo ?? 'PROCEDIMENTO',
      equipamentos: initialData?.equipamentos ?? [],
      cor: initialData?.cor ?? '',
      capacidade: initialData?.capacidade ?? null,
      disponibilidade: initialData?.disponibilidade ?? DEFAULT_HORARIO,
      ativo: initialData?.ativo ?? true,
    },
  })

  const equipamentos = watch('equipamentos')
  const disponibilidade = watch('disponibilidade')
  const cor = watch('cor')
  const ativo = watch('ativo')

  const addEquipamento = () => {
    const trim = equipamentoInput.trim()
    if (!trim || equipamentos.includes(trim)) return
    setValue('equipamentos', [...equipamentos, trim])
    setEquipamentoInput('')
  }

  const removeEquipamento = (e: string) => {
    setValue('equipamentos', equipamentos.filter(x => x !== e))
  }

  const onSubmit = async (data: SalaCreateInput) => {
    setSaving(true)
    try {
      const url = isEdit ? `/api/salas/${initialData!.id}` : '/api/salas'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        router.push('/dashboard/settings/salas')
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Nome *</Label>
              <Input placeholder="Ex: Sala 1" {...register('nome')} />
              {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Tipo *</Label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONSULTA">Consulta</SelectItem>
                      <SelectItem value="PROCEDIMENTO">Procedimento</SelectItem>
                      <SelectItem value="LASER">Laser</SelectItem>
                      <SelectItem value="PEELING">Peeling</SelectItem>
                      <SelectItem value="RECUPERACAO">Recuperação</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              value={cor || null}
              onChange={(v) => setValue('cor', v ?? '')}
            />
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Capacidade</Label>
              <p className="text-xs text-muted-foreground">Pessoas simultâneas (opcional)</p>
              <Input
                type="number"
                min="1"
                max="99"
                placeholder="Ex: 1"
                className="w-32"
                {...register('capacidade')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Equipamentos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Maca elétrica · Enter para adicionar"
              value={equipamentoInput}
              onChange={e => setEquipamentoInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEquipamento() } }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addEquipamento}>Adicionar</Button>
          </div>
          {equipamentos.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {equipamentos.map(e => (
                <Badge key={e} variant="secondary" className="gap-1 pr-1">
                  {e}
                  <button type="button" onClick={() => removeEquipamento(e)} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Disponibilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <HorarioEditor
            value={disponibilidade ?? null}
            onChange={(v) => setValue('disponibilidade', v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Sala ativa</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Salas inativas não aparecem em seleções de agenda.</p>
            </div>
            <Switch checked={ativo} onCheckedChange={v => setValue('ativo', v)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Salvar alterações' : 'Criar sala'}
        </Button>
      </div>
    </form>
  )
}
