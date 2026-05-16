'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, Wallet } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasAccessToken: boolean
  }
}

export function MercadoPagoCheckoutForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [accessToken, setAccessToken] = useState(initial.hasAccessToken ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [userInfo, setUserInfo] = useState<{ nickname?: string; email?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }
      if (accessToken && !accessToken.startsWith('•')) body.accessToken = accessToken

      const res = await fetch('/api/integrations/mercadopago-checkout/settings', {
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
      const res = await fetch('/api/integrations/mercadopago-checkout/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUserInfo(data.user)
      toast.success(`Conta MercadoPago: ${data.user.nickname ?? 'verificada'}`)
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
            <strong className="text-foreground">Importante:</strong> esta integração é para a clínica RECEBER pagamentos
            dos pacientes — não é a assinatura SaaS do Estetia (que já está configurada).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Credenciais MercadoPago</CardTitle>
              <CardDescription>Receba pagamentos via PIX, cartão e boleto</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="mp-enabled" className="text-xs">Ativo</Label>
              <Switch id="mp-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mp-token">Access Token *</Label>
            <Input
              id="mp-token"
              type="password"
              placeholder="APP_USR-..."
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setAccessToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              MercadoPago → Suas integrações → Credenciais → Access Token
            </p>
          </div>

          {userInfo && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{userInfo.nickname}</p>
                {userInfo.email && <p className="text-xs text-muted-foreground mt-0.5">{userInfo.email}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
