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
    hasApiKey: boolean
    recipientId: string
  }
}

export function PagarmeForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [recipientId, setRecipientId] = useState(initial.recipientId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{ id?: string; name?: string; email?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, pagarmeRecipientId: recipientId }
      if (apiKey && !apiKey.startsWith('•')) body.pagarmeApiKey = apiKey

      const res = await fetch('/api/integrations/pagarme/settings', {
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
      const res = await fetch('/api/integrations/pagarme/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.account)
      toast.success(`Pagar.me: ${data.account?.name ?? 'conta verificada'}`)
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
              <CardTitle className="text-base">Credenciais Pagar.me</CardTitle>
              <CardDescription>Gateway da Stone para PIX e cartão</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="pagarme-enabled" className="text-xs">Ativo</Label>
              <Switch id="pagarme-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pagarme-key">API Key (Secret Key) *</Label>
            <Input
              id="pagarme-key"
              type="password"
              placeholder="sk_live_... ou sk_test_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Dashboard Pagar.me → Configurações → Dados da API → Chave Secreta
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pagarme-recipient">Recipient ID (opcional)</Label>
            <Input
              id="pagarme-recipient"
              type="text"
              placeholder="re_..."
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Necessário para split de pagamentos. Dashboard → Recebedores
            </p>
          </div>

          {account && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{account.name ?? 'Conta verificada'}</p>
                {account.email && (
                  <p className="text-xs text-muted-foreground mt-0.5">{account.email}</p>
                )}
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
          <p>✓ Gerar cobrança PIX com QR Code instantâneo</p>
          <p>✓ Aceitar cartão de crédito em até 12x</p>
          <p>✓ Split automático com fornecedores ou parceiros</p>
          <p>✓ Webhook de confirmação de pagamento em tempo real</p>
          <p>✓ Conciliação automática no financeiro do Estetia</p>
        </CardContent>
      </Card>
    </div>
  )
}
