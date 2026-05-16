'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  professionalId: string
  onValidated?: (status: string) => void
}

export function CfmValidateButton({ professionalId, onValidated }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleValidate() {
    setLoading(true)
    try {
      const res = await fetch('/api/clinica/cfm-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professionalId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao validar')
      const status: string = data.status ?? 'desconhecido'
      toast.success(`Validação: ${status}`)
      onValidated?.(status)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao validar conselho')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors duration-200"
      onClick={handleValidate}
      disabled={loading}
      title="Validar conselho"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
    </Button>
  )
}
