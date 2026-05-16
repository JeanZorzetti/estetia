'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    instanceId: string
    hasInstanceToken: boolean
    hasClientToken: boolean
  }
}

export function ZapiForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [instanceId, setInstanceId] = useState(initial.instanceId)
  const [instanceToken, setInstanceToken] = useState(initial.hasInstanceToken ? '••••••••••••' : '')
  const [clientToken, setClientToken] = useState(initial.hasClientToken ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [connected, setConnected] = useState<boolean | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, instanceId }
      if (instanceToken && !instanceToken.startsWith('•')) body.instanceToken = instanceToken
      if (clientToken && !clientToken.startsWith('•')) body.clientToken = clientToken

      const res = await fetch('/api/integrations/whatsapp-zapi/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao salvar')
      toast.success('Configuração salva')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setConnected(null)
    try {
      const res = await fetch('/api/integrations/whatsapp-zapi/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falha no teste')
      setConnected(data.connected)
      if (data.connected) toast.success('Conectado ao WhatsApp')
      else toast.info('Z-API alcançada, mas WhatsApp não está conectado. Escaneie o QR no painel Z-API.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no teste')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6 text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-300">Provider brasileiro pago</p>
          <p className="text-muted-foreground mt-1">
            Z-API custa ~R$ 99/mês. Crie sua conta em <a className="text-primary underline" href="https://z-api.io" target="_blank" rel="noreferrer">z-api.io</a>, conecte um número e cole as credenciais abaixo.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Credenciais Z-API</CardTitle>
              <CardDescription>Obtenha em z-api.io → Sua instância → Detalhes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="zapi-enabled" className="text-xs">Ativo</Label>
              <Switch id="zapi-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="zapi-id">Instance ID *</Label>
            <Input
              id="zapi-id"
              placeholder="3D9E1234ABCD..."
              value={instanceId}
              onChange={(e) => setInstanceId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="zapi-token">Instance Token *</Label>
            <Input
              id="zapi-token"
              type="password"
              placeholder="Token da instância"
              value={instanceToken}
              onChange={(e) => setInstanceToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setInstanceToken('') }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="zapi-client">Client Token (segurança da conta) *</Label>
            <Input
              id="zapi-client"
              type="password"
              placeholder="Account security token"
              value={clientToken}
              onChange={(e) => setClientToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setClientToken('') }}
            />
            <p className="text-xs text-muted-foreground">Disponível em Minha Conta → Segurança</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing || !instanceId}>
              {testing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : connected === true ? (
                <Wifi className="mr-2 h-4 w-4 text-emerald-500" />
              ) : connected === false ? (
                <WifiOff className="mr-2 h-4 w-4 text-amber-500" />
              ) : null}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook de eventos</CardTitle>
          <CardDescription>Cole esta URL no painel Z-API → Webhook ao receber</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/40 p-3 font-mono text-xs break-all border border-border/50">
            {typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/zapi` : 'https://seu-dominio/api/webhooks/zapi'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
