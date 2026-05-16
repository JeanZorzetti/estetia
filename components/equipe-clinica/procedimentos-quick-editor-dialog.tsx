'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProcedureMultiSelect } from '@/components/profissionais/procedure-multi-select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Procedure {
  id: string
  nome: string
  categoria: string | null
}

interface Props {
  professionalId: string
  professionalName: string
  initialIds: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (ids: string[]) => void
}

export function ProcedimentosQuickEditorDialog({
  professionalId,
  professionalName,
  initialIds,
  open,
  onOpenChange,
  onSaved,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds)
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [saving, setSaving] = useState(false)
  const [loadingProcs, setLoadingProcs] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoadingProcs(true)
    fetch('/api/procedures')
      .then(r => r.json())
      .then(data => setProcedures(Array.isArray(data) ? data : []))
      .catch(() => setProcedures([]))
      .finally(() => setLoadingProcs(false))
  }, [open])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/team/professionals/${professionalId}/procedimentos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ procedimentosHabilitadosIds: selectedIds }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erro ao salvar')
      }
      toast.success('Procedimentos atualizados')
      onSaved?.(selectedIds)
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar procedimentos')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Procedimentos Habilitados</DialogTitle>
          <DialogDescription>{professionalName}</DialogDescription>
        </DialogHeader>
        {loadingProcs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ProcedureMultiSelect
            procedures={procedures}
            value={selectedIds}
            onChange={setSelectedIds}
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || loadingProcs}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
