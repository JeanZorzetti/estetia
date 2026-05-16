'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Video, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    accountId: string
    clientId: string
    hasClientSecret: boolean
  }
}

export function ZoomForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [accountId, setAccountId] = useState(initial.accountId)
  const [clientId, setClientId] = useState(initial.clientId)
  const [clientSecret, setClientSecret] = useState(initial.hasClientSecret ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{ first_name?: string; last_name?: string; email?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, accountId, clientId }
      if (clientSecret && !clientSecret.startsWith('•')) body.clientSecret = clientSecret

      const res = await fetch('/api/integrations/zoom/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Configuração salva')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setAccount(null)
    try {
      const res = await fetch('/api/integrations/zoom/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.user)
      toast.success(`Zoom conectado: ${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no teste')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Requer conta Zoom paga.</strong> Use OAuth Server-to-Server criado em
            marketplace.zoom.us → Build App → Server-to-Server OAuth.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Credenciais Zoom</CardTitle>
              <CardDescription>OAuth Server-to-Server</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="zoom-enabled" className="text-xs">Ativo</Label>
              <Switch id="zoom-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="zoom-account">Account ID *</Label>
            <Input
              id="zoom-account"
              placeholder="abc123XYZ..."
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="zoom-client">Client ID *</Label>
            <Input
              id="zoom-client"
              placeholder="Client ID do app"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="zoom-secret">Client Secret *</Label>
            <Input
              id="zoom-secret"
              type="password"
              placeholder="Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setClientSecret('') }}
            />
          </div>

          {account && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{account.first_name} {account.last_name}</p>
                {account.email && <p className="text-xs text-muted-foreground mt-0.5">{account.email}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
