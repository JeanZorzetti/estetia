'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2, Calendar, AlertCircle, ExternalLink, Settings } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    email: string | null
    hasRefreshToken: boolean
    hasAzureCreds: boolean
    clientId: string | null
    tenantId: string | null
  }
}

export function OutlookCalendarForm({ initial }: Props) {
  const [isConnected, setIsConnected] = useState(initial.hasRefreshToken)
  const [email, setEmail] = useState(initial.email)
  const [hasAzureCreds, setHasAzureCreds] = useState(initial.hasAzureCreds)

  const [clientId, setClientId] = useState(initial.clientId ?? '')
  const [clientSecret, setClientSecret] = useState(initial.hasAzureCreds ? '••••••••••••' : '')
  const [tenantId, setTenantId] = useState(initial.tenantId ?? 'common')

  const [savingCreds, setSavingCreds] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleSaveCreds() {
    if (!clientId.trim() || !tenantId.trim()) {
      toast.error('Preencha Client ID e Tenant ID')
      return
    }
    if (!clientSecret.trim() || clientSecret.startsWith('•')) {
      // Allow saving without touching secret if already set
      if (!initial.hasAzureCreds) {
        toast.error('Preencha o Client Secret')
        return
      }
    }

    setSavingCreds(true)
    try {
      const body: Record<string, string> = { clientId, tenantId }
      if (!clientSecret.startsWith('•')) body.clientSecret = clientSecret

      const res = await fetch('/api/integrations/outlook-calendar/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHasAzureCreds(true)
      toast.success('Credenciais Azure salvas — agora clique em "Conectar com Microsoft"')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSavingCreds(false)
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      const res = await fetch('/api/integrations/outlook-calendar/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disconnect: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setIsConnected(false)
      setEmail(null)
      toast.success('Conta Microsoft desconectada')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao desconectar')
    } finally {
      setDisconnecting(false)
    }
  }

  async function handleReset() {
    if (!confirm('Remover todas as credenciais Azure e desconectar a conta Microsoft?')) return
    setResetting(true)
    try {
      const res = await fetch('/api/integrations/outlook-calendar/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setIsConnected(false)
      setEmail(null)
      setHasAzureCreds(false)
      setClientId('')
      setClientSecret('')
      setTenantId('common')
      toast.success('Integração removida')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1 — Azure app credentials */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
              1
            </div>
            <div>
              <CardTitle className="text-base">Credenciais do App Azure</CardTitle>
              <CardDescription>
                Crie um app no portal Azure e cole as credenciais abaixo. Feito uma vez — vale para sempre.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Como criar o app Azure (2 min):</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Acesse{' '}
                <a
                  href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  portal.azure.com → App registrations
                </a>
              </li>
              <li>Clique em <strong>New registration</strong></li>
              <li>Nome: qualquer (ex: "Estetia Calendar")</li>
              <li>
                Redirect URI:{' '}
                <code className="bg-muted px-1 rounded font-mono">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/api/integrations/outlook-calendar/callback
                </code>
              </li>
              <li>Copie o <strong>Application (client) ID</strong> e o <strong>Directory (tenant) ID</strong></li>
              <li>Em <strong>Certificates & secrets</strong>, gere um <strong>Client secret</strong></li>
              <li>Em <strong>API permissions</strong>, adicione <strong>Calendars.ReadWrite</strong> (Microsoft Graph)</li>
            </ol>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="outlook-client-id">Client ID *</Label>
              <Input
                id="outlook-client-id"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="outlook-tenant-id">Tenant ID *</Label>
              <Input
                id="outlook-tenant-id"
                placeholder="common  ou  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use "common" para aceitar qualquer conta Microsoft</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="outlook-client-secret">Client Secret *</Label>
            <Input
              id="outlook-client-secret"
              type="password"
              placeholder="Valor do secret gerado no portal Azure"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setClientSecret('') }}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveCreds} disabled={savingCreds}>
              {savingCreds && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Settings className="mr-2 h-4 w-4" />
              Salvar credenciais
            </Button>
            {(hasAzureCreds || isConnected) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={resetting}
                className="text-destructive hover:text-destructive hover:bg-destructive/5"
              >
                {resetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Remover tudo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2 — OAuth connect */}
      <Card className={!hasAzureCreds ? 'opacity-50 pointer-events-none' : ''}>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
              2
            </div>
            <div>
              <CardTitle className="text-base">Conectar conta Microsoft</CardTitle>
              <CardDescription>
                {isConnected
                  ? 'Conta Microsoft conectada — eventos serão sincronizados automaticamente'
                  : 'Após salvar as credenciais, autorize o acesso ao seu calendário'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <>
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Conectado</p>
                  {email && (
                    <p className="text-xs font-mono text-green-600 dark:text-green-400 mt-0.5">{email}</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="text-destructive border-destructive/30 hover:bg-destructive/5"
              >
                {disconnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Desconectar conta Microsoft
              </Button>
            </>
          ) : (
            <>
              {!hasAzureCreds && (
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Salve as credenciais Azure acima para habilitar o botão de conexão.
                  </p>
                </div>
              )}
              <Button
                onClick={() => { window.location.href = '/api/integrations/outlook-calendar/auth' }}
                disabled={!hasAzureCreds}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Conectar com Microsoft
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Info card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            O que será sincronizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Agendamentos criados no Estetia → eventos no Outlook Calendar</p>
          <p>✓ Lembretes automáticos configurados na sua conta Microsoft</p>
          <p>✓ Segurança total: seu Client Secret fica criptografado (AES-256), nunca exposto</p>
          <p>✓ Você pode revogar o acesso a qualquer momento no portal Azure</p>
        </CardContent>
      </Card>
    </div>
  )
}
