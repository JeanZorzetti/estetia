'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HorarioEditor } from '@/components/profissionais/horario-editor'
import type { CargaHorariaInput } from '@/lib/profissionais/schema'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Props {
  professionalId: string
  professionalName: string
  initialHorario: CargaHorariaInput | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (horario: CargaHorariaInput) => void
}

export function HorarioQuickEditorDialog({
  professionalId,
  professionalName,
  initialHorario,
  open,
  onOpenChange,
  onSaved,
}: Props) {
  const [horario, setHorario] = useState<CargaHorariaInput | null>(initialHorario)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!horario) return
    setSaving(true)
    try {
      const res = await fetch(`/api/team/professionals/${professionalId}/horario`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cargaHoraria: horario }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erro ao salvar')
      }
      toast.success('Horário atualizado')
      onSaved?.(horario)
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar horário')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Horário de Atendimento</DialogTitle>
          <DialogDescription>{professionalName}</DialogDescription>
        </DialogHeader>
        <HorarioEditor value={horario} onChange={setHorario} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
