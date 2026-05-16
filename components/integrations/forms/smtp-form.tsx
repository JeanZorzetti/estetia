'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Send, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PRESETS = [
  { name: 'Gmail', host: 'smtp.gmail.com', port: 587 },
  { name: 'Outlook', host: 'smtp.office365.com', port: 587 },
  { name: 'SendGrid', host: 'smtp.sendgrid.net', port: 587 },
  { name: 'Resend', host: 'smtp.resend.com', port: 587 },
  { name: 'Mailgun', host: 'smtp.mailgun.org', port: 587 },
  { name: 'Amazon SES', host: 'email-smtp.us-east-1.amazonaws.com', port: 587 },
] as const

interface Props {
  initial: {
    enabled: boolean
    host: string
    port: number
    username: string
    hasPassword: boolean
    fromEmail: string
    fromName: string
    useTLS: boolean
  }
  userEmail: string
}

export function SmtpForm({ initial, userEmail }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [host, setHost] = useState(initial.host)
  const [port, setPort] = useState(String(initial.port))
  const [username, setUsername] = useState(initial.username)
  const [password, setPassword] = useState(initial.hasPassword ? '••••••••••••' : '')
  const [fromEmail, setFromEmail] = useState(initial.fromEmail)
  const [fromName, setFromName] = useState(initial.fromName)
  const [useTLS, setUseTLS] = useState(initial.useTLS)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(
    PRESETS.find((p) => p.host === initial.host)?.name ?? null
  )

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setHost(preset.host)
    setPort(String(preset.port))
    setUseTLS(true)
    setActivePreset(preset.name)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        enabled,
        host,
        port: Number(port),
        username,
        fromEmail,
        fromName,
        useTLS,
      }
      if (password && !password.startsWith('•')) body.password = password

      const res = await fetch('/api/integrations/smtp/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao salvar')
      toast.success('Configuração SMTP salva')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    try {
      const body: Record<string, unknown> = {
        host,
        port: Number(port),
        username,
        fromEmail,
        fromName,
        useTLS,
      }
      if (password && !password.startsWith('•')) body.password = password
      // If user kept bullets, server will load from DB

      const res = await fetch('/api/integrations/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falha no teste')
      toast.success(`E-mail de teste enviado para ${userEmail}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar teste')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Presets rápidos</CardTitle>
          <CardDescription>Clique em um provedor para preencher host e porta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  activePreset === p.name
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Credenciais SMTP</CardTitle>
              <CardDescription>Use o e-mail do seu próprio domínio</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="smtp-enabled" className="text-xs">Ativo</Label>
              <Switch id="smtp-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="smtp-host">Servidor SMTP *</Label>
              <Input id="smtp-host" placeholder="smtp.gmail.com" value={host} onChange={(e) => setHost(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp-port">Porta</Label>
              <Input id="smtp-port" type="number" value={port} onChange={(e) => setPort(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="smtp-user">Usuário *</Label>
              <Input id="smtp-user" placeholder="seu@email.com" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp-pass">Senha / API Key *</Label>
              <Input
                id="smtp-pass"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => { if (e.target.value.startsWith('•')) setPassword('') }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="smtp-from">E-mail remetente *</Label>
              <Input id="smtp-from" type="email" placeholder="contato@minhaclinica.com.br" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtp-name">Nome remetente</Label>
              <Input id="smtp-name" placeholder="Clínica Estetia" value={fromName} onChange={(e) => setFromName(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="smtp-tls" checked={useTLS} onCheckedChange={setUseTLS} />
            <Label htmlFor="smtp-tls" className="text-sm cursor-pointer">Usar TLS (recomendado)</Label>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing || !host || !username}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Enviar e-mail de teste
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="pt-6 text-sm flex items-start gap-3">
          <Mail className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Se SMTP estiver desativado</p>
            <p className="text-muted-foreground mt-1">
              Os e-mails do CRM serão enviados pelo remetente padrão da plataforma (no-reply@estetiacrm.com.br).
              Para usar seu próprio domínio, ative e configure acima.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
