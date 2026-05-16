'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasSecretKey: boolean
    hasWebhookSecret: boolean
  }
}

export function StripeForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [secretKey, setSecretKey] = useState(initial.hasSecretKey ? '••••••••••••' : '')
  const [webhookSecret, setWebhookSecret] = useState(initial.hasWebhookSecret ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{
    id?: string
    email?: string
    business_profile?: { name?: string }
    country?: string
    default_currency?: string
  } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }
      if (secretKey && !secretKey.startsWith('•')) body.stripeSecretKey = secretKey
      if (webhookSecret && !webhookSecret.startsWith('•')) body.stripeWebhookSecret = webhookSecret

      const res = await fetch('/api/integrations/stripe/settings', {
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
      const res = await fetch('/api/integrations/stripe/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.account)
      const name = data.account?.business_profile?.name ?? data.account?.email ?? 'verificada'
      toast.success(`Stripe: conta ${name}`)
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
              <CardTitle className="text-base">Credenciais Stripe</CardTitle>
              <CardDescription>Pagamentos internacionais via cartão, PIX e link</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="stripe-enabled" className="text-xs">Ativo</Label>
              <Switch id="stripe-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="stripe-secret">Secret Key *</Label>
            <Input
              id="stripe-secret"
              type="password"
              placeholder="sk_live_... ou sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setSecretKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Dashboard Stripe → Developers → API Keys → Secret key
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stripe-webhook">Webhook Secret (opcional)</Label>
            <Input
              id="stripe-webhook"
              type="password"
              placeholder="whsec_..."
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setWebhookSecret('') }}
            />
            <p className="text-xs text-muted-foreground">
              Stripe → Developers → Webhooks → Signing secret. Necessário para receber eventos.
            </p>
          </div>

          {account && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{account.business_profile?.name ?? account.email ?? 'Conta verificada'}</p>
                <div className="flex gap-3 mt-0.5">
                  {account.country && (
                    <p className="text-xs text-muted-foreground">País: {account.country.toUpperCase()}</p>
                  )}
                  {account.default_currency && (
                    <p className="text-xs text-muted-foreground">Moeda: {account.default_currency.toUpperCase()}</p>
                  )}
                </div>
                {account.id && (
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{account.id}</p>
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
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
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
          <p>✓ Checkout session para pagamento online</p>
          <p>✓ Aceitar cartões internacionais (Visa, Master, Amex)</p>
          <p>✓ PIX via Stripe (para contas BR ativadas)</p>
          <p>✓ Assinatura recorrente para pacotes de procedimentos</p>
          <p>✓ Webhook de confirmação automática de pagamento</p>
        </CardContent>
      </Card>
    </div>
  )
}
