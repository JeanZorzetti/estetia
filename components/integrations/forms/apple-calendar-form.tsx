'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    feedSecret: string | null
    orgId: string
    appUrl: string
  }
}

export function AppleCalendarForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [feedSecret, setFeedSecret] = useState(initial.feedSecret)
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const feedUrl = feedSecret
    ? `${initial.appUrl}/api/calendar/${initial.orgId}?secret=${feedSecret}`
    : null

  async function handleToggle(val: boolean) {
    setSaving(true)
    try {
      const res = await fetch('/api/integrations/apple-calendar/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: val }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEnabled(val)
      if (data.feedSecret) setFeedSecret(data.feedSecret)
      toast.success(val ? 'Feed Apple Calendar ativado' : 'Feed desativado')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleRegenerate() {
    if (!confirm('Gerar nova URL invalida a URL atual. Continuar?')) return
    setRegenerating(true)
    try {
      const res = await fetch('/api/integrations/apple-calendar/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerate: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFeedSecret(data.feedSecret)
      toast.success('Nova URL gerada')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar URL')
    } finally {
      setRegenerating(false)
    }
  }

  async function copyUrl() {
    if (!feedUrl) return
    await navigator.clipboard.writeText(feedUrl)
    toast.success('URL copiada')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Feed de Agendamentos (.ics)</CardTitle>
              <CardDescription>
                Assine a URL abaixo no Apple Calendar, Google Calendar ou qualquer app compatível com iCal
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="apple-cal-enabled" className="text-xs">Ativo</Label>
              <Switch
                id="apple-cal-enabled"
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={saving}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {enabled && feedUrl ? (
            <>
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Feed ativo</p>
              </div>

              <div className="space-y-1.5">
                <Label>URL do feed</Label>
                <div className="flex gap-2">
                  <Input readOnly value={feedUrl} className="font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={copyUrl} title="Copiar URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  No Apple Calendar: Arquivo → Nova Assinatura de Calendário → cole a URL acima.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10"
              >
                {regenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Gerar nova URL
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ative o feed para gerar a URL de assinatura .ics dos seus agendamentos.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como adicionar ao Apple Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>Ative o feed acima e copie a URL gerada</li>
            <li>Abra o <strong className="text-foreground">Apple Calendar</strong> no Mac ou iPhone</li>
            <li>Mac: <strong className="text-foreground">Arquivo → Nova Assinatura de Calendário</strong></li>
            <li>iPhone: <strong className="text-foreground">Calendários → Adicionar Calendário → Assinar Calendário</strong></li>
            <li>Cole a URL e configure atualização automática (recomendado: a cada hora)</li>
          </ol>
          <div className="pt-2 border-t">
            <p className="text-xs">
              O feed é somente leitura — alterações de agenda devem ser feitas no Estetia. A URL inclui um token secreto — não compartilhe publicamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
