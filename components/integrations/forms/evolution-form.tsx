'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Loader2, QrCode, Wifi, WifiOff } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    baseUrl: string
    instance: string
    hasApiKey: boolean
  }
}

export function EvolutionForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl)
  const [instance, setInstance] = useState(initial.instance)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loadingQr, setLoadingQr] = useState(false)
  const [connState, setConnState] = useState<'open' | 'connecting' | 'close' | 'unknown' | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, baseUrl, instance }
      // Only send apiKey if user changed it (not bullets)
      if (apiKey && !apiKey.startsWith('•')) body.apiKey = apiKey

      const res = await fetch('/api/integrations/whatsapp-evolution/settings', {
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
    setConnState(null)
    try {
      const res = await fetch('/api/integrations/whatsapp-evolution/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falha no teste')
      setConnState(data.state)
      if (data.connected) toast.success('Conectado ao WhatsApp')
      else toast.info(`Estado: ${data.state}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no teste')
    } finally {
      setTesting(false)
    }
  }

  async function handleQrCode() {
    setLoadingQr(true)
    try {
      const res = await fetch('/api/integrations/whatsapp-evolution/qrcode', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao gerar QR')
      setQrCode(data.base64 ?? null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar QR Code')
    } finally {
      setLoadingQr(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Conexão Evolution API</CardTitle>
              <CardDescription>Credenciais da sua instância self-hosted</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="evo-enabled" className="text-xs">Ativo</Label>
              <Switch id="evo-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="evo-url">URL da instância *</Label>
            <Input
              id="evo-url"
              placeholder="https://evolution.minhaclinica.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">URL pública onde sua Evolution API está hospedada</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="evo-key">API Key *</Label>
            <Input
              id="evo-key"
              type="password"
              placeholder="Sua API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => {
                if (e.target.value.startsWith('•')) setApiKey('')
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="evo-instance">Nome da instância *</Label>
            <Input
              id="evo-instance"
              placeholder="clinica-principal"
              value={instance}
              onChange={(e) => setInstance(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing || !baseUrl || !instance}>
              {testing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : connState === 'open' ? (
                <Wifi className="mr-2 h-4 w-4 text-emerald-500" />
              ) : connState ? (
                <WifiOff className="mr-2 h-4 w-4 text-amber-500" />
              ) : null}
              Testar conexão
            </Button>
            <Button variant="outline" onClick={handleQrCode} disabled={loadingQr || !baseUrl || !instance}>
              {loadingQr ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />}
              Gerar QR Code
            </Button>
          </div>

          {qrCode && (
            <div className="rounded-xl border border-border/50 bg-muted/30 p-6 flex flex-col items-center gap-3">
              <p className="text-sm font-medium">Escaneie com o WhatsApp do seu celular</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`} alt="QR Code" className="w-56 h-56 rounded-lg bg-white p-2" />
              <p className="text-xs text-muted-foreground">WhatsApp → Configurações → Aparelhos conectados → Conectar aparelho</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook de eventos</CardTitle>
          <CardDescription>Cole esta URL na sua Evolution API para receber mensagens no Estetia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/40 p-3 font-mono text-xs break-all border border-border/50">
            {typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/evolution` : 'https://seu-dominio/api/webhooks/evolution'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Configure na Evolution: <code className="bg-muted px-1 py-0.5 rounded">POST</code> com eventos <code className="bg-muted px-1 py-0.5 rounded">messages.upsert</code> e <code className="bg-muted px-1 py-0.5 rounded">qrcode.updated</code>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Como instalar Evolution API
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3 text-muted-foreground">
          <p>1. Provisione uma VPS (DigitalOcean, Hetzner, Contabo ~R$ 30/mês)</p>
          <p>2. Siga o guia oficial em <a className="text-primary underline" href="https://doc.evolution-api.com/install" target="_blank" rel="noreferrer">doc.evolution-api.com/install</a> (Docker recomendado)</p>
          <p>3. Após subir, obtenha a API key gerada e crie uma instância</p>
          <p>4. Cole as credenciais acima e clique em <strong>Gerar QR Code</strong></p>
        </CardContent>
      </Card>
    </div>
  )
}
