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
    groupId: string
  }
}

export function MailerLiteForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [groupId, setGroupId] = useState(initial.groupId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [accountInfo, setAccountInfo] = useState<{ email?: string; username?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, mailerliteGroupId: groupId }
      if (apiKey && !apiKey.startsWith('•')) body.mailerliteApiKey = apiKey

      const res = await fetch('/api/integrations/mailerlite/settings', {
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
      const res = await fetch('/api/integrations/mailerlite/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccountInfo(data.account)
      toast.success(`MailerLite: ${data.account?.email ?? 'verificado'}`)
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
              <CardTitle className="text-base">Credenciais MailerLite</CardTitle>
              <CardDescription>E-mail marketing simples e eficaz para clínicas</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="ml-enabled" className="text-xs">Ativo</Label>
              <Switch id="ml-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ml-key">API Key *</Label>
            <Input
              id="ml-key"
              type="password"
              placeholder="eyJhbGciOiJSUzI1NiJ9..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              MailerLite → Integrations → API → Generate new token
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ml-group">ID do Grupo</Label>
            <Input
              id="ml-group"
              placeholder="123456789"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              MailerLite → Subscribers → Groups → ID numérico do grupo
            </p>
          </div>

          {accountInfo && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{accountInfo.username ?? 'Conta verificada'}</p>
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
          <p>✓ Paciente cadastrado → assinante adicionado ao grupo MailerLite</p>
          <p>✓ Newsletters mensais sobre procedimentos e novidades da clínica</p>
          <p>✓ Automações simples de boas-vindas e follow-up</p>
          <p>✓ Landing pages integradas para captação de novos pacientes</p>
          <p>✓ Relatórios de engajamento de e-mail direto na plataforma</p>
        </CardContent>
      </Card>
    </div>
  )
}
