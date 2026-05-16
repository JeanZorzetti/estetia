'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Props {
  orgId: string
  onComplete?: () => void
}

export function CfmValidateAllButton({ orgId: _orgId, onComplete }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleValidateAll() {
    setLoading(true)
    const toastId = toast.loading('Validando conselheiros...')
    try {
      const res = await fetch('/api/clinica/cfm-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulk: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro na validação em lote')
      toast.dismiss(toastId)
      toast.success(`Validação concluída: ${data.validated ?? 0} validados, ${data.errors ?? 0} erros`)
      onComplete?.()
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err instanceof Error ? err.message : 'Erro ao validar em lote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading} className="gap-1.5">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Validar Todos
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Validar todos os conselhos?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso irá consultar o CFM para todos os profissionais com conselho registrado.
            O processo pode levar alguns minutos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleValidateAll}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
