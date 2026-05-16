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
    advertiserId: string
    pixelId: string
  }
}

export function TikTokAdsForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [accessToken, setAccessToken] = useState(initial.hasAccessToken ? '••••••••••••' : '')
  const [advertiserId, setAdvertiserId] = useState(initial.advertiserId)
  const [pixelId, setPixelId] = useState(initial.pixelId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ stored: boolean; note: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        enabled,
        tiktokAdsAdvertiserId: advertiserId,
        tiktokAdsPixelId: pixelId,
      }
      if (accessToken && !accessToken.startsWith('•')) {
        body.tiktokAdsAccessToken = accessToken
      }
      const res = await fetch('/api/integrations/tiktok-ads/settings', {
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
      const res = await fetch('/api/integrations/tiktok-ads/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTestResult(data.result)
      toast.success('Token TikTok Ads verificado')
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
              <CardTitle className="text-base">Credenciais TikTok Ads</CardTitle>
              <CardDescription>Business API para rastreamento de conversoes via pixel server-side</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="tiktok-enabled" className="text-xs">Ativo</Label>
              <Switch id="tiktok-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tiktok-token">Access Token *</Label>
            <Input
              id="tiktok-token"
              type="password"
              placeholder="Seu token de acesso TikTok Business"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setAccessToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              TikTok Business Center → Assets → Developer App → gere um token com permissao de ads
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tiktok-advertiser">Advertiser ID (Business Center ID)</Label>
            <Input
              id="tiktok-advertiser"
              placeholder="Ex: 7012345678901234567"
              value={advertiserId}
              onChange={(e) => setAdvertiserId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Business Center → visivel na URL ou em Configuracoes → ID da conta
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tiktok-pixel">Pixel ID (opcional)</Label>
            <Input
              id="tiktok-pixel"
              placeholder="Ex: CIABCDE123456"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              TikTok Ads Manager → Ativos → Eventos → ID do pixel — necessario para rastrear conversoes server-side
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
          <p>+ Rastrear conversoes de leads vindos de campanhas TikTok</p>
          <p>+ Enviar eventos de pixel server-side (sem bloqueio de ad blockers)</p>
          <p>+ Calcular o CAC real por campanha dentro do Estetia</p>
          <p>+ Atribuir agendamentos e procedimentos a origens de anuncio</p>
          <p>+ Otimizar campanhas com dados de conversao de qualidade</p>
        </CardContent>
      </Card>
    </div>
  )
}
