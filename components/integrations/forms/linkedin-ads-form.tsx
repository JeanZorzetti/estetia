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
    hasAccessToken: boolean
    accountId: string
  }
}

export function LinkedInAdsForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [accessToken, setAccessToken] = useState(initial.hasAccessToken ? '••••••••••••' : '')
  const [accountId, setAccountId] = useState(initial.accountId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ stored: boolean; note: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        enabled,
        linkedinAdsAccountId: accountId,
      }
      if (accessToken && !accessToken.startsWith('•')) {
        body.linkedinAdsAccessToken = accessToken
      }
      const res = await fetch('/api/integrations/linkedin-ads/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Configuracao salva')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/integrations/linkedin-ads/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTestResult(data.result)
      toast.success('Token LinkedIn Ads verificado')
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
              <CardTitle className="text-base">Credenciais LinkedIn Ads</CardTitle>
              <CardDescription>Marketing API para rastreamento de conversoes B2B e Lead Gen Forms</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="linkedin-enabled" className="text-xs">Ativo</Label>
              <Switch id="linkedin-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="linkedin-token">Access Token OAuth *</Label>
            <Input
              id="linkedin-token"
              type="password"
              placeholder="Seu token OAuth LinkedIn Marketing Solutions"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setAccessToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              LinkedIn Developer Portal → seu app → OAuth 2.0 → gere um token com escopos r_ads e rw_conversions
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkedin-account">Ad Account ID (opcional)</Label>
            <Input
              id="linkedin-account"
              placeholder="Ex: 123456789"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              LinkedIn Campaign Manager → conta de anuncio → ID visivel na URL (urn:li:sponsoredAccount:ID)
            </p>
          </div>

          {testResult && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Token verificado</p>
                <p className="text-xs text-muted-foreground mt-0.5">{testResult.note}</p>
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
              Verificar token
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">O que voce pode fazer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>+ Rastrear conversoes de leads vindos de campanhas LinkedIn</p>
          <p>+ Integrar Lead Gen Forms do LinkedIn com o CRM em tempo real</p>
          <p>+ Medir o CAC de campanhas B2B para clinicas e dermatos</p>
          <p>+ Enviar eventos de conversao via LinkedIn Conversions API (CAPI)</p>
          <p>+ Otimizar campanhas com dados reais de atendimento e agendamento</p>
        </CardContent>
      </Card>
    </div>
  )
}
