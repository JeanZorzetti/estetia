'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: { enabled: boolean; hasWebhookUrl: boolean }
}

export function SlackForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [webhookUrl, setWebhookUrl] = useState(initial.hasWebhookUrl ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }
      if (webhookUrl && !webhookUrl.startsWith('•')) body.slackWebhookUrl = webhookUrl
      const res = await fetch('/api/integrations/slack/settings', {
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
    try {
      const res = await fetch('/api/integrations/slack/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Mensagem de teste enviada ao Slack ✅')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha no teste')
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
              <CardTitle className="text-base">Slack Incoming Webhook</CardTitle>
              <CardDescription>Receba notificações da clínica em um canal Slack</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="slack-enabled" className="text-xs">Ativo</Label>
              <Switch id="slack-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="slack-url">Webhook URL *</Label>
            <Input
              id="slack-url"
              type="password"
              placeholder="https://hooks.slack.com/services/T00/B00/XXXXXXXX"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setWebhookUrl('') }}
            />
            <p className="text-xs text-muted-foreground">
              Slack → Apps → Incoming Webhooks → Add to Slack → escolha o canal
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Enviar teste
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Eventos enviados ao Slack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Novo agendamento criado</p>
          <p>✓ Reagendamento ou cancelamento</p>
          <p>✓ Confirmação de pagamento</p>
          <p>✓ Lead novo qualificado pelo Sofia IA</p>
        </CardContent>
      </Card>
    </div>
  )
}
