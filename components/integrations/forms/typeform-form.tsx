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

export function TypeformForm({ initial, orgId }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [formId, setFormId] = useState(initial.formId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [formTitle, setFormTitle] = useState<string | null>(null)

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/integrations/typeform/webhook?orgId=${orgId}`
      : `/api/integrations/typeform/webhook?orgId=${orgId}`

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, typeformFormId: formId }
      if (apiKey && !apiKey.startsWith('•')) body.typeformApiKey = apiKey
      const res = await fetch('/api/integrations/typeform/settings', {
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
      const res = await fetch('/api/integrations/typeform/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFormTitle(data.result?.formTitle ?? 'Form')
      toast.success('Form Typeform encontrado ✅')
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
              <CardTitle className="text-base">Credenciais Typeform</CardTitle>
              <CardDescription>Anamnese, pesquisas e captação de leads via Typeform</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="tf-enabled" className="text-xs">Ativo</Label>
              <Switch id="tf-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tf-key">Personal Token *</Label>
            <Input
              id="tf-key"
              type="password"
              placeholder="tfp_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              admin.typeform.com/account#/section/tokens
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tf-form">Form ID *</Label>
            <Input
              id="tf-form"
              placeholder="6 caracteres (URL: typeform.com/to/{formId})"
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
          <CardTitle className="text-base">Webhook (recebimento em tempo real)</CardTitle>
          <CardDescription>
            Configure no Typeform → Settings → Webhooks para receber respostas como leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label className="text-xs">URL do webhook</Label>
          <Input readOnly value={webhookUrl} className="font-mono text-xs" />
          <p className="text-xs text-muted-foreground">
            Copie esta URL e cole em admin.typeform.com → seu form → Connect → Webhooks
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
