'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  integrationId: 'contaazul' | 'bling'
  clientIdField: 'contaazulClientId' | 'blingClientId'
  clientSecretField: 'contaazulClientSecret' | 'blingClientSecret'
  refreshTokenField: 'contaazulRefreshToken' | 'blingRefreshToken'
  initial: {
    enabled: boolean
    clientId: string
    hasClientSecret: boolean
    hasRefreshToken: boolean
  }
  oauthHelperText: string
}

export function OAuthCredentialsForm({
  integrationId,
  clientIdField,
  clientSecretField,
  refreshTokenField,
  initial,
  oauthHelperText,
}: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [clientId, setClientId] = useState(initial.clientId)
  const [clientSecret, setClientSecret] = useState(
    initial.hasClientSecret ? '••••••••••••' : ''
  )
  const [refreshToken, setRefreshToken] = useState(
    initial.hasRefreshToken ? '••••••••••••' : ''
  )
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [company, setCompany] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        enabled,
        [clientIdField]: clientId,
      }
      if (clientSecret && !clientSecret.startsWith('•')) body[clientSecretField] = clientSecret
      if (refreshToken && !refreshToken.startsWith('•')) body[refreshTokenField] = refreshToken

      const res = await fetch(`/api/integrations/${integrationId}/settings`, {
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
    setCompany(null)
    try {
      const res = await fetch(`/api/integrations/${integrationId}/test`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCompany(data.result?.company ?? 'OAuth válido')
      toast.success('Token renovado com sucesso ✅')
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
              <CardTitle className="text-base">Credenciais OAuth</CardTitle>
              <CardDescription>{oauthHelperText}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`${integrationId}-enabled`} className="text-xs">Ativo</Label>
              <Switch
                id={`${integrationId}-enabled`}
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${integrationId}-cid`}>Client ID *</Label>
            <Input
              id={`${integrationId}-cid`}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${integrationId}-secret`}>Client Secret *</Label>
            <Input
              id={`${integrationId}-secret`}
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setClientSecret('') }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${integrationId}-refresh`}>Refresh Token *</Label>
            <Input
              id={`${integrationId}-refresh`}
              type="password"
              value={refreshToken}
              onChange={(e) => setRefreshToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setRefreshToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              Gere o refresh token via fluxo OAuth manual no painel do provider — em breve, fluxo automatizado integrado.
            </p>
          </div>

          {company && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{company}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
              Validar OAuth
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
