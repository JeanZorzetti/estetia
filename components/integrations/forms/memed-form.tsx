'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    publicKey: string
    hasApiKey: boolean
  }
}

export function MemedForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [publicKey, setPublicKey] = useState(initial.publicKey)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{ partnerName?: string; status?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, publicKey }
      if (apiKey && !apiKey.startsWith('•')) body.apiKey = apiKey

      const res = await fetch('/api/integrations/memed/settings', {
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
      const res = await fetch('/api/integrations/memed/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.account)
      toast.success(`Memed conectado: ${data.account?.partnerName ?? 'Conta verificada'}`)
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
              <CardTitle className="text-base">Credenciais Memed</CardTitle>
              <CardDescription>Prescrição digital válida — widget embedável no prontuário</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="memed-enabled" className="text-xs">Ativo</Label>
              <Switch id="memed-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="memed-key">API Key (Secret Key) *</Label>
            <Input
              id="memed-key"
              type="password"
              placeholder="Chave secreta Memed"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Memed → Portal do Parceiro → Credenciais → Secret Key
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memed-public">Public Key</Label>
            <Input
              id="memed-public"
              placeholder="Chave pública para assinar tokens JWT"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Opcional — usada para assinar tokens JWT de prescrição. Se não informada, usa a API Key.
            </p>
          </div>

          {account && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{account.partnerName ?? 'Conta verificada'}</p>
                {account.status && (
                  <p className="text-xs text-muted-foreground mt-0.5">Status: {account.status}</p>
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
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
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
          <p>✓ Prescrever medicamentos digitalmente com validade legal</p>
          <p>✓ Widget Memed embedado diretamente no prontuário</p>
          <p>✓ Receituário com assinatura digital do médico</p>
          <p>✓ Paciente recebe PDF via WhatsApp ou e-mail</p>
          <p>✓ Histórico de prescrições por paciente no Estetia</p>
          <p>✓ Interações medicamentosas sinalizadas em tempo real</p>
        </CardContent>
      </Card>
    </div>
  )
}
