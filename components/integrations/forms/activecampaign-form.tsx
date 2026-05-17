'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasApiKey: boolean
    accountUrl: string
  }
}

export function ActiveCampaignForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [accountUrl, setAccountUrl] = useState(initial.accountUrl)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [userInfo, setUserInfo] = useState<{ username?: string; email?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, activecampaignUrl: accountUrl }
      if (apiKey && !apiKey.startsWith('•')) body.activecampaignApiKey = apiKey

      const res = await fetch('/api/integrations/activecampaign/settings', {
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
    setUserInfo(null)
    try {
      const res = await fetch('/api/integrations/activecampaign/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUserInfo(data.user)
      toast.success(`ActiveCampaign: ${data.user?.email ?? 'verificado'}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no teste')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Credenciais ActiveCampaign</CardTitle>
              <CardDescription>Automação avançada de marketing e CRM de leads</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="ac-enabled" className="text-xs">Ativo</Label>
              <Switch id="ac-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ac-url">URL da Conta *</Label>
            <Input
              id="ac-url"
              type="url"
              placeholder="https://suaclinica.activehosted.com"
              value={accountUrl}
              onChange={(e) => setAccountUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              ActiveCampaign → Settings → Developer → URL
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ac-key">API Key *</Label>
            <Input
              id="ac-key"
              type="password"
              placeholder="sua-api-key-aqui"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              ActiveCampaign → Settings → Developer → API Key
            </p>
          </div>

          {userInfo && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{userInfo.username ?? 'Conta verificada'}</p>
                {userInfo.email && (
                  <p className="text-xs text-muted-foreground mt-0.5">{userInfo.email}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">O que você poderá fazer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Paciente cadastrado → contato sincronizado via Contact Sync API</p>
          <p>✓ Tags automáticas por procedimento realizado</p>
          <p>✓ Pipelines de automação baseados em etapas do tratamento</p>
          <p>✓ Lead scoring para identificar pacientes com maior potencial</p>
          <p>✓ Segmentação avançada para reativação e campanhas direcionadas</p>
        </CardContent>
      </Card>
    </div>
  )
}
