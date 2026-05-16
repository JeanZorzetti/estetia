'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    senderName: string
    hasToken: boolean
  }
}

export function ViberForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [senderName, setSenderName] = useState(initial.senderName)
  const [authToken, setAuthToken] = useState(initial.hasToken ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{ name?: string; uri?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, senderName }
      if (authToken && !authToken.startsWith('•')) body.authToken = authToken
      const res = await fetch('/api/integrations/viber/settings', {
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
      const res = await fetch('/api/integrations/viber/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.account)
      toast.success('Conexão validada')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao testar')
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração</CardTitle>
        <CardDescription>
          Gere um token na conta Viber Business (Public Account) e cole abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="viber-enabled">Habilitar integração</Label>
          <Switch id="viber-enabled" checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="viber-sender">Nome do remetente</Label>
          <Input
            id="viber-sender"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Estetia"
            maxLength={28}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="viber-token">Auth Token</Label>
          <Input
            id="viber-token"
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="X-Viber-Auth-Token"
          />
        </div>

        {account && (
          <div className="flex items-start gap-2 rounded-lg border bg-emerald-500/5 p-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{account.name}</p>
              <p className="text-xs text-muted-foreground">{account.uri}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
          <Button onClick={handleTest} variant="outline" disabled={testing || !initial.hasToken}>
            {testing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Testar conexão
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
