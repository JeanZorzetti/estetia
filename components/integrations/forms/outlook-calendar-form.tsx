'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, Calendar, AlertCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    email: string | null
    hasRefreshToken: boolean
  }
}

export function OutlookCalendarForm({ initial }: Props) {
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(initial.hasRefreshToken)
  const [email, setEmail] = useState(initial.email)

  async function handleConnect() {
    setConnecting(true)
    try {
      // Redirect to OAuth flow
      window.location.href = '/api/integrations/outlook-calendar/auth'
    } catch {
      toast.error('Erro ao iniciar autenticação')
      setConnecting(false)
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      const res = await fetch('/api/integrations/outlook-calendar/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: false, refreshToken: null, email: null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setIsConnected(false)
      setEmail(null)
      toast.success('Outlook Calendar desconectado')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao desconectar')
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Status da Conexão</CardTitle>
              <CardDescription>
                {isConnected
                  ? 'Outlook Calendar conectado — eventos serão sincronizados automaticamente'
                  : 'Conecte via Microsoft para sincronizar agendamentos'}
              </CardDescription>
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Calendar className="h-4 w-4" />
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
                Desconectar
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Nenhuma conta Microsoft conectada. Clique no botão abaixo para autorizar.
                </p>
              </div>
              <Button onClick={handleConnect} disabled={connecting}>
                {connecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                Conectar com Microsoft
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Sincronização bidirecional</p>
            <p>Agendamentos criados no Estetia aparecem automaticamente no Outlook Calendar como eventos. Edições de horário são refletidas em ambas as direções.</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Lembretes automáticos</p>
            <p>O Outlook envia lembretes configurados na conta Microsoft antes de cada atendimento.</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Segurança OAuth 2.0</p>
            <p>Nunca pedimos sua senha. O acesso é concedido via protocolo OAuth padrão Microsoft — você pode revogar a qualquer momento no portal Azure.</p>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs">
              Requer: conta Microsoft 365 ou Outlook.com pessoal.{' '}
              <a
                href="https://support.microsoft.com/pt-br/office/outlook"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                Ver documentação
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
