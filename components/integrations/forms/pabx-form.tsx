'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Check, RotateCcw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const PROVIDERS = [
  { value: 'intelbras', label: 'Intelbras Anywhere' },
  { value: 'yealink', label: 'Yealink' },
  { value: 'asterisk', label: 'Asterisk (AMI)' },
  { value: 'generic', label: 'Genérico (custom)' },
] as const

interface Props {
  initial: {
    enabled: boolean
    provider: string
    hasSecret: boolean
    webhookUrl: string
  }
}

export function PabxForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [provider, setProvider] = useState(initial.provider || 'generic')
  const [hasSecret, setHasSecret] = useState(initial.hasSecret)
  const [secret, setSecret] = useState<string | null>(null)
  const [copied, setCopied] = useState<'url' | 'secret' | null>(null)
  const [saving, setSaving] = useState(false)
  const [rotating, setRotating] = useState(false)

  function copyToClipboard(text: string, kind: 'url' | 'secret') {
    navigator.clipboard.writeText(text)
    setCopied(kind)
    toast.success('Copiado!')
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/integrations/pabx/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, provider }),
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

  async function handleRotate() {
    setRotating(true)
    try {
      const res = await fetch('/api/integrations/pabx/rotate-secret', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSecret(data.secret)
      setHasSecret(true)
      toast.success('Novo secret gerado — copie agora')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro')
    } finally {
      setRotating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Configuração PABX</CardTitle>
              <CardDescription>Receba notificações de chamadas no CRM</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="pabx-enabled" className="text-xs">Ativo</Label>
              <Switch id="pabx-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Provedor PABX</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">URL do webhook</Label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border border-border/50 bg-muted/40 p-3 font-mono text-xs break-all">
                {initial.webhookUrl}
              </code>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(initial.webhookUrl, 'url')}>
                {copied === 'url' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Secret HMAC</Label>
              <Button variant="ghost" size="sm" disabled={rotating} onClick={handleRotate} className="h-7 text-xs gap-1">
                {rotating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                {hasSecret ? 'Regenerar' : 'Gerar'}
              </Button>
            </div>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border border-border/50 bg-muted/40 p-3 font-mono text-xs break-all">
                {secret ?? (hasSecret ? '••••••••••••••••••••••••••••••••' : 'Nenhum secret gerado')}
              </code>
              {secret && (
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(secret, 'secret')}>
                  {copied === 'secret' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
            {secret && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠ Copie agora. Este secret não será exibido novamente.
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payload esperado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Envie um POST para a URL acima com este JSON (campos variam por provedor):</p>
          <pre className="rounded-lg border border-border/50 bg-muted/40 p-3 text-xs overflow-x-auto">
{`{
  "caller": "11999998888",
  "callee": "1133334444",
  "direction": "inbound",
  "status": "answered" | "missed" | "completed",
  "duration": 120,
  "timestamp": "2026-05-16T14:30:00Z",
  "recordingUrl": "https://..." // opcional
}`}
          </pre>
          <p>Header obrigatório: <code className="bg-muted px-1 py-0.5 rounded">X-Estetia-Signature: sha256=&lt;HMAC&gt;</code></p>
        </CardContent>
      </Card>
    </div>
  )
}
