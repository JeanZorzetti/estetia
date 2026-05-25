import { FileText } from 'lucide-react'
import { ProntuarioRecordCard } from './prontuario-record-card'
import { EmptyState } from '@/components/pacientes/shared/empty-state'
import type { MedicalRecord } from '@/lib/clinical/types'

interface Props {
  records: MedicalRecord[]
}

export function ProntuarioTimeline({ records }: Props) {
  if (records.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Nenhum registro clínico ainda"
        description="Registre o histórico de atendimentos do paciente"
      />
    )
  }

  return (
    <div className="space-y-4">
      {records.map(record => (
        <ProntuarioRecordCard key={record.id} record={record} />
      ))}
    </div>
  )
}
