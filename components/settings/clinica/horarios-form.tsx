'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { HorarioEditor } from '@/components/profissionais/horario-editor'
import type { CargaHorariaInput } from '@/lib/profissionais/schema'
import { updateClinicaHorarios } from '@/app/[locale]/dashboard/settings/clinica/actions'

interface Props {
  initial: CargaHorariaInput | null
}

export function HorariosForm({ initial }: Props) {
  const [horario, setHorario] = useState<CargaHorariaInput | null>(initial)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (!horario) return
    startTransition(async () => {
      try {
        await updateClinicaHorarios(horario)
        toast.success('Horários salvos')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
        <p className="text-muted-foreground">
          Esses horários definem a janela <strong className="text-foreground">global</strong> de agendamento da clínica.
          Cada profissional e sala pode ter horários mais restritos no próprio cadastro.
        </p>
      </div>

      <HorarioEditor value={horario} onChange={setHorario} />

      <Button onClick={handleSave} disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar horários
      </Button>
    </div>
  )
}
