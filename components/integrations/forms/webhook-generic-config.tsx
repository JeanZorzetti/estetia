'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Copy, RotateCcw, Loader2, Check, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasSecret: boolean
    webhookUrl: string
  }
}

export function WebhookGenericConfig({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [hasSecret, setHasSecret] = useState(initial.hasSecret)
  const [secret, setSecret] = useState<string | null>(null) // shown only after generation
  const [copied, setCopied] = useState<'url' | 'secret' | null>(null)
  const [rotating, setRotating] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [testing, setTesting] = useState(false)

  function copyToClipboard(text: string, kind: 'url' | 'secret') {
    navigator.clipboard.writeText(text)
    setCopied(kind)
    toast.success('Copiado!')
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleToggle(next: boolean) {
    setToggling(true)
    try {
      const res = await fetch('/api/integrations/webhook-generic/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEnabled(next)
      // If first activation and no secret yet, generate one
      if (next && !hasSecret) {
        await handleRotate()
      } else {
        toast.success(next ? 'Webhook ativado' : 'Webhook desativado')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro')
    } finally {
      setToggling(false)
    }
  }

  async function handleRotate() {
    setRotating(true)
    try {
      const res = await fetch('/api/integrations/webhook-generic/rotate-secret', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSecret(data.secret)
      setHasSecret(true)
      toast.success('Novo secret gerado — copie agora, não será exibido novamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar secret')
    } finally {
      setRotating(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    try {
      const res = await fetch('/api/integrations/webhook-generic/test-payload', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Request de teste processada com sucesso')
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
              <CardTitle className="text-base">Webhook Inbound</CardTitle>
              <CardDescription>Receba dados de Zapier, Make, n8n ou qualquer ferramenta</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="wh-enabled" className="text-xs">Ativo</Label>
              <Switch id="wh-enabled" checked={enabled} onCheckedChange={handleToggle} disabled={toggling} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Secret (HMAC SHA256)</Label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={rotating} className="h-7 text-xs gap-1">
                    {rotating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                    {hasSecret ? 'Regenerar' : 'Gerar'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{hasSecret ? 'Regenerar secret?' : 'Gerar novo secret?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {hasSecret
                        ? 'Isso invalidará o secret atual. Você precisará atualizar todas as ferramentas que usam esta integração.'
                        : 'Será gerado um novo HMAC secret. Copie e guarde em local seguro — não conseguiremos mostrar novamente.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRotate}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border border-border/50 bg-muted/40 p-3 font-mono text-xs break-all">
                {secret ?? (hasSecret ? '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••' : 'Nenhum secret gerado ainda')}
              </code>
              {secret && (
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(secret, 'secret')}>
                  {copied === 'secret' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
            {secret && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠ Este secret só será exibido agora. Copie e salve em local seguro.
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button variant="outline" onClick={handleTest} disabled={testing || !enabled}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Enviar request de teste
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como usar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. No Zapier/Make/n8n, crie uma ação <strong>HTTP POST</strong> para a URL acima</p>
          <p>2. Adicione header <code className="bg-muted px-1 py-0.5 rounded text-xs">X-Estetia-Signature: sha256=&lt;HMAC&gt;</code></p>
          <p>3. Envie payload JSON com a estrutura abaixo:</p>
          <pre className="rounded-lg border border-border/50 bg-muted/40 p-3 text-xs overflow-x-auto">
{`{
  "event": "patient.create" | "appointment.schedule" | "payment.log",
  "data": { /* campos do evento */ }
}`}
          </pre>
          <p className="text-xs">Eventos suportados: criar paciente, agendar consulta, registrar pagamento.</p>
        </CardContent>
      </Card>
    </div>
  )
}
