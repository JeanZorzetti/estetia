'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: { enabled: boolean; hasApiKey: boolean; formId: string }
  orgId: string
}

export function JotformForm({ initial, orgId }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [formId, setFormId] = useState(initial.formId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [formTitle, setFormTitle] = useState<string | null>(null)

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/integrations/jotform/webhook?orgId=${orgId}`
      : `/api/integrations/jotform/webhook?orgId=${orgId}`

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, jotformFormId: formId }
      if (apiKey && !apiKey.startsWith('•')) body.jotformApiKey = apiKey
      const res = await fetch('/api/integrations/jotform/settings', {
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
    setFormTitle(null)
    try {
      const res = await fetch('/api/integrations/jotform/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFormTitle(data.result?.formTitle ?? 'Form')
      toast.success('Form JotForm encontrado ✅')
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
              <CardTitle className="text-base">Credenciais JotForm</CardTitle>
              <CardDescription>Formulários online e captação via JotForm</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="jf-enabled" className="text-xs">Ativo</Label>
              <Switch id="jf-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="jf-key">API Key *</Label>
            <Input
              id="jf-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">jotform.com/myaccount/api</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jf-form">Form ID *</Label>
            <Input
              id="jf-form"
              placeholder="Numérico (URL: form.jotform.com/{formId})"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
            />
          </div>

          {formTitle && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{formTitle}</p>
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
          <CardTitle className="text-base">Webhook</CardTitle>
          <CardDescription>JotForm → Form Settings → Integrations → Webhooks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label className="text-xs">URL do webhook</Label>
          <Input readOnly value={webhookUrl} className="font-mono text-xs" />
        </CardContent>
      </Card>
    </div>
  )
}
