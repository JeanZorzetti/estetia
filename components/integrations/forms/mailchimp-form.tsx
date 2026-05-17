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
    server: string
  }
}

export function MailchimpForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [listId, setListId] = useState(initial.listId)
  const [server, setServer] = useState(initial.server)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [accountInfo, setAccountInfo] = useState<{ account_name?: string; email?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, mailchimpListId: listId, mailchimpServer: server }
      if (apiKey && !apiKey.startsWith('•')) body.mailchimpApiKey = apiKey

      const res = await fetch('/api/integrations/mailchimp/settings', {
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
      const res = await fetch('/api/integrations/mailchimp/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccountInfo(data.account)
      toast.success(`Mailchimp: ${data.account?.account_name ?? 'verificado'}`)
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
              <CardTitle className="text-base">Credenciais Mailchimp</CardTitle>
              <CardDescription>Sincronize pacientes com suas listas de e-mail</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="mailchimp-enabled" className="text-xs">Ativo</Label>
              <Switch id="mailchimp-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mailchimp-key">API Key *</Label>
            <Input
              id="mailchimp-key"
              type="password"
              placeholder="sua-api-key-abc123def456"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Mailchimp → Account → Extras → API keys → Create A Key
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mailchimp-server">Servidor (prefix do datacenter)</Label>
            <Input
              id="mailchimp-server"
              placeholder="us21"
              value={server}
              onChange={(e) => setServer(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Encontre no fim da API Key (ex: key-us21 → servidor é "us21")
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mailchimp-list">ID da Lista (Audience)</Label>
            <Input
              id="mailchimp-list"
              placeholder="abc1234def"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Mailchimp → Audience → Manage Audience → Settings → Audience ID
            </p>
          </div>

          {accountInfo && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{accountInfo.account_name ?? 'Conta verificada'}</p>
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
          <p>✓ Paciente cadastrado → adicionado automaticamente à lista Mailchimp</p>
          <p>✓ Nome, sobrenome e telefone sincronizados como merge fields</p>
          <p>✓ Segmentação por tags (ex: paciente-novo, procedimento-laser)</p>
          <p>✓ Campanhas de reativação para pacientes sem agendamento recente</p>
          <p>✓ Fluxos automáticos de pré e pós-procedimento</p>
        </CardContent>
      </Card>
    </div>
  )
}
