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
  initial: {
    enabled: boolean
    chatId: string
    hasBotToken: boolean
  }
}

export function TelegramForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [botToken, setBotToken] = useState(initial.hasBotToken ? '••••••••••••' : '')
  const [chatId, setChatId] = useState(initial.chatId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, chatId }
      if (botToken && !botToken.startsWith('•')) body.botToken = botToken

      const res = await fetch('/api/integrations/telegram/settings', {
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
      const res = await fetch('/api/integrations/telegram/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(
        data.messageSent
          ? `Bot @${data.botUsername} conectado — mensagem enviada!`
          : `Bot @${data.botUsername} conectado. Configure o Chat ID para receber notificações.`
      )
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
              <CardTitle className="text-base">Bot Telegram</CardTitle>
              <CardDescription>Receba notificações da clínica no seu Telegram</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="tg-enabled" className="text-xs">Ativo</Label>
              <Switch id="tg-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tg-token">Bot Token *</Label>
            <Input
              id="tg-token"
              type="password"
              placeholder="123456:ABC-DEF1234..."
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setBotToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              Obtenha em @BotFather no Telegram → /newbot
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tg-chat">Chat ID (opcional)</Label>
            <Input
              id="tg-chat"
              placeholder="123456789 ou -100123456789 para grupos"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Para descobrir: envie /start ao seu bot e use @userinfobot
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como configurar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Abra o Telegram e procure por <code className="bg-muted px-1 py-0.5 rounded">@BotFather</code></p>
          <p>2. Envie <code className="bg-muted px-1 py-0.5 rounded">/newbot</code> e siga as instruções</p>
          <p>3. Copie o token gerado e cole no campo acima</p>
          <p>4. Para receber notificações, envie <code className="bg-muted px-1 py-0.5 rounded">/start</code> ao seu bot</p>
          <p>5. Obtenha seu Chat ID enviando <code className="bg-muted px-1 py-0.5 rounded">/start</code> para <code className="bg-muted px-1 py-0.5 rounded">@userinfobot</code></p>
        </CardContent>
      </Card>
    </div>
  )
}
