'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, BarChart2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    clientId: string
    hasClientSecret: boolean
    hasRefreshToken: boolean
  }
}

export function RDStationForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [clientId, setClientId] = useState(initial.clientId)
  const [clientSecret, setClientSecret] = useState(initial.hasClientSecret ? '••••••••••••' : '')
  const [refreshToken, setRefreshToken] = useState(initial.hasRefreshToken ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [accountInfo, setAccountInfo] = useState<{ name?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, rdStationClientId: clientId }
      if (clientSecret && !clientSecret.startsWith('•')) body.rdStationClientSecret = clientSecret
      if (refreshToken && !refreshToken.startsWith('•')) body.rdStationRefreshToken = refreshToken

      const res = await fetch('/api/integrations/rd-station/settings', {
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
    setAccountInfo(null)
    try {
      const res = await fetch('/api/integrations/rd-station/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccountInfo(data.account)
      toast.success('RD Station: conexão verificada')
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
              <CardTitle className="text-base">Credenciais RD Station</CardTitle>
              <CardDescription>Plataforma brasileira de automação de marketing</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="rds-enabled" className="text-xs">Ativo</Label>
              <Switch id="rds-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Configuração OAuth (3 passos)</p>
            <ol className="space-y-1 list-decimal list-inside text-xs">
              <li>Crie um app em <span className="font-mono">app.rdstation.com.br/integrations/apps</span></li>
              <li>Obtenha Client ID e Client Secret do app criado</li>
              <li>Gere o Refresh Token via fluxo OAuth e cole abaixo</li>
            </ol>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rds-client-id">Client ID *</Label>
            <Input
              id="rds-client-id"
              placeholder="seu-client-id-aqui"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rds-secret">Client Secret *</Label>
            <Input
              id="rds-secret"
              type="password"
              placeholder="seu-client-secret-aqui"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setClientSecret('') }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rds-refresh">Refresh Token *</Label>
            <Input
              id="rds-refresh"
              type="password"
              placeholder="seu-refresh-token-aqui"
              value={refreshToken}
              onChange={(e) => setRefreshToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setRefreshToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              Gerado no fluxo OAuth — necessário para manter a conexão ativa
            </p>
          </div>

          <div>
            <a
              href="https://developers.rdstation.com/reference/autenticacao"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Documentação de autenticação RD Station
            </a>
          </div>

          {accountInfo && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{accountInfo.name ?? 'Conta verificada'}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart2 className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">O que você poderá fazer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Paciente cadastrado → conversão enviada ao RD Station Marketing</p>
          <p>✓ Leads qualificados do CRM alimentam automações do RD</p>
          <p>✓ Fluxos de nutrição por estágio do ciclo do paciente</p>
          <p>✓ Relatórios de ROI de campanhas de captação integrados</p>
          <p>✓ Plataforma 100% brasileira com suporte em PT-BR</p>
        </CardContent>
      </Card>
    </div>
  )
}
