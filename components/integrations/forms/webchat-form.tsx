'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    widgetSecret: string | null
    allowedOrigins: string
  }
}

export function WebchatForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [allowedOrigins, setAllowedOrigins] = useState(initial.allowedOrigins)
  const [widgetSecret, setWidgetSecret] = useState(initial.widgetSecret)
  const [saving, setSaving] = useState(false)
  const [snippet, setSnippet] = useState<string | null>(null)

  async function handleSave(regenerate = false) {
    setSaving(true)
    try {
      const res = await fetch('/api/integrations/webchat/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, allowedOrigins, regenerate }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.widgetSecret) setWidgetSecret(data.widgetSecret)
      toast.success(regenerate ? 'Novo widget gerado' : 'Configuração salva')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleGetSnippet() {
    try {
      const res = await fetch('/api/integrations/webchat/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSnippet(data.snippet)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao gerar snippet')
    }
  }

  function copySnippet() {
    if (snippet) {
      navigator.clipboard.writeText(snippet)
      toast.success('Snippet copiado')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget de Chat no Site</CardTitle>
        <CardDescription>
          Cole o snippet abaixo no &lt;head&gt; do site da clínica. Mensagens entrarão no Chat Center.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="webchat-enabled">Habilitar widget</Label>
          <Switch id="webchat-enabled" checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="webchat-origins">Domínios permitidos (opcional, vírgula)</Label>
          <Input
            id="webchat-origins"
            value={allowedOrigins}
            onChange={(e) => setAllowedOrigins(e.target.value)}
            placeholder="https://minhaclinica.com.br, https://www.minhaclinica.com.br"
          />
          <p className="text-xs text-muted-foreground">
            Deixe vazio para permitir qualquer origem (não recomendado em produção).
          </p>
        </div>

        {widgetSecret && (
          <div className="space-y-2">
            <Label>Widget Secret</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded border bg-muted px-3 py-2 text-xs font-mono truncate">
                {widgetSecret}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Regenerar
              </Button>
            </div>
          </div>
        )}

        {snippet && (
          <div className="space-y-2">
            <Label>Snippet para o site</Label>
            <div className="flex items-start gap-2">
              <pre className="flex-1 rounded border bg-muted px-3 py-2 text-xs overflow-x-auto">
                {snippet}
              </pre>
              <Button type="button" variant="outline" size="sm" onClick={copySnippet}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={() => handleSave(false)} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
          <Button onClick={handleGetSnippet} variant="outline" disabled={!widgetSecret}>
            Gerar snippet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
