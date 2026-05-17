'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasApiKey: boolean
    listId: string
  }
}

export function BrevoForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [listId, setListId] = useState(initial.listId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [accountInfo, setAccountInfo] = useState<{ companyName?: string; email?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, brevoListId: listId }
      if (apiKey && !apiKey.startsWith('•')) body.brevoApiKey = apiKey

      const res = await fetch('/api/integrations/brevo/settings', {
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
    setAccountInfo(null)
    try {
      const res = await fetch('/api/integrations/brevo/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccountInfo(data.account)
      toast.success(`Brevo: ${data.account?.companyName ?? 'verificado'}`)
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
              <CardTitle className="text-base">Credenciais Brevo</CardTitle>
              <CardDescription>E-mail marketing, SMS e automações de contato</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="brevo-enabled" className="text-xs">Ativo</Label>
              <Switch id="brevo-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="brevo-key">API Key *</Label>
            <Input
              id="brevo-key"
              type="password"
              placeholder="xkeysib-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Brevo → Settings → SMTP & API → API Keys → Generate a new API key
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brevo-list">ID da Lista de Contatos</Label>
            <Input
              id="brevo-list"
              placeholder="42"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Brevo → Contacts → Lists → ID numérico da lista desejada
            </p>
          </div>

          {accountInfo && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{accountInfo.companyName ?? 'Conta verificada'}</p>
                {accountInfo.email && (
                  <p className="text-xs text-muted-foreground mt-0.5">{accountInfo.email}</p>
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
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
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
          <p>✓ Paciente cadastrado → contato criado/atualizado no Brevo</p>
          <p>✓ E-mail marketing segmentado por procedimento ou perfil</p>
          <p>✓ SMS de lembrete de consulta via Brevo SMS</p>
          <p>✓ Automações de reativação para pacientes inativos</p>
          <p>✓ Relatórios de abertura e engajamento integrados</p>
        </CardContent>
      </Card>
    </div>
  )
}
