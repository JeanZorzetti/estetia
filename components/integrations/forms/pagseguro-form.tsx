'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CheckCircle2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    environment: 'sandbox' | 'production'
    hasToken: boolean
  }
}

export function PagSeguroForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>(initial.environment)
  const [token, setToken] = useState(initial.hasToken ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{ name?: string; email?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, environment }
      if (token && !token.startsWith('•')) body.pagseguroToken = token

      const res = await fetch('/api/integrations/pagseguro/settings', {
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
      const res = await fetch('/api/integrations/pagseguro/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.account)
      toast.success('PagSeguro conectado com sucesso')
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
              <CardTitle className="text-base">Credenciais PagSeguro / PagBank</CardTitle>
              <CardDescription>Token de integração da sua conta PagBank</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="pagseguro-enabled" className="text-xs">Ativo</Label>
              <Switch id="pagseguro-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Ambiente</Label>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as 'sandbox' | 'production')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (homologação)</SelectItem>
                <SelectItem value="production">Produção</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Use Sandbox para testes — crie conta em sandbox.pagseguro.uol.com.br
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pagseguro-token">Token de Integração *</Label>
            <Input
              id="pagseguro-token"
              type="password"
              placeholder="Seu token gerado no painel PagBank"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              PagBank → Minha Conta → Preferências → Integrações → Token de Integração
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
          <p>✓ Cobrança PIX com QR Code gerado automaticamente</p>
          <p>✓ Link de pagamento enviado por WhatsApp após atendimento</p>
          <p>✓ Boleto bancário com vencimento personalizado</p>
          <p>✓ Cartão de crédito parcelado para procedimentos estéticos</p>
          <p>✓ Conciliação automática no financeiro do Estetia</p>
        </CardContent>
      </Card>
    </div>
  )
}
