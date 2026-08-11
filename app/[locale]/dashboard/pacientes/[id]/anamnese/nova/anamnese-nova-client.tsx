'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnamnesisFormBuilder, type AnamnesisTemplate } from '@/components/anamnese/form-builder'
import logger from '@/lib/logger'

interface Props {
  patientId: string
  template: AnamnesisTemplate
  templateHash: string
}

export function AnamnesesNovaClient({ patientId, template, templateHash }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (respostas: Record<string, unknown>, assinatura?: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/clinica/anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: patientId,
          templateHash,
          respostas,
          assinaturaDigital: assinatura,
          preenchidoPor: 'profissional',
        }),
      })
      if (!res.ok) throw new Error('Erro ao salvar anamnese')
      router.push(`/dashboard/pacientes/${patientId}/anamnese`)
      router.refresh()
    } catch (err) {
      logger.error({ err }, 'Erro ao salvar anamnese')
      alert('Erro ao salvar anamnese. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <AnamnesisFormBuilder template={template} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
