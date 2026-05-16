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
  integrationId: 'zapier' | 'make'
  fieldName: 'zapierWebhookUrl' | 'makeWebhookUrl'
  initial: { enabled: boolean; hasWebhookUrl: boolean }
  description: string
  helperText: string
}

export function SimpleWebhookForm({ integrationId, fieldName, initial, description, helperText }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [webhookUrl, setWebhookUrl] = useState(initial.hasWebhookUrl ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }
      if (webhookUrl && !webhookUrl.startsWith('•')) body[fieldName] = webhookUrl
      const res = await fetch(`/api/integrations/${integrationId}/settings`, {
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
      const res = await fetch(`/api/integrations/${integrationId}/test`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Evento de teste enviado ✅')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha no teste')
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Webhook URL</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`${integrationId}-enabled`} className="text-xs">Ativo</Label>
            <Switch
              id={`${integrationId}-enabled`}
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${integrationId}-url`}>Webhook URL *</Label>
          <Input
            id={`${integrationId}-url`}
            type="password"
            placeholder="https://hooks..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            onFocus={(e) => { if (e.target.value.startsWith('•')) setWebhookUrl('') }}
          />
          <p className="text-xs text-muted-foreground">{helperText}</p>
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
  )
}
