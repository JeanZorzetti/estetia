'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Loader2, CheckCircle2 } from 'lucide-react'

export function OmieSyncButton() {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<{ total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sync = async () => {
    setSyncing(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/integrations/omie/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'financial' }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ total: data.totalSynced ?? 0 })
        router.refresh()
      } else {
        setError(data.error ?? 'Erro ao sincronizar')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Sincronizar Recebíveis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Importa contas a receber do Omie ERP para o módulo financeiro do CRM.
        </p>
        <Button onClick={sync} disabled={syncing} className="self-start">
          {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {syncing ? 'Sincronizando...' : 'Sync agora'}
        </Button>

        {result && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            {result.total} registro{result.total !== 1 ? 's' : ''} sincronizado{result.total !== 1 ? 's' : ''}
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
