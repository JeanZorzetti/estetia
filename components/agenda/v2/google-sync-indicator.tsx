'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function GoogleSyncIndicator() {
  const [status, setStatus] = useState<{
    enabled: boolean
    email: string | null
    pendingSessions: number
  } | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    fetch('/api/agenda/google-sync').then(r => r.json()).then(setStatus).catch(() => null)
  }, [])

  if (!status?.enabled) return null

  const sync = async () => {
    setSyncing(true)
    try {
      await fetch('/api/agenda/google-sync', { method: 'POST' })
      setLastSync(new Date())
      const fresh = await fetch('/api/agenda/google-sync').then(r => r.json())
      setStatus(fresh)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={sync}
      disabled={syncing}
      className="gap-2 h-8 text-xs"
      title={status.email ? `Sincronizando com ${status.email}` : undefined}
    >
      {syncing ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : status.pendingSessions > 0 ? (
        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      )}
      Google
      {status.pendingSessions > 0 && (
        <span className="text-[10px] text-muted-foreground">({status.pendingSessions})</span>
      )}
      {lastSync && <RefreshCw className="w-3 h-3 text-muted-foreground" />}
    </Button>
  )
}
