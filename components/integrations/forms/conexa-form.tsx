'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Video, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    clinicId: string
    hasApiKey: boolean
  }
}

export function ConexaForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [clinicId, setClinicId] = useState(initial.clinicId)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{ clinicName?: string; status?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, clinicId }
      if (apiKey && !apiKey.startsWith('•')) body.apiKey = apiKey

      const res = await fetch('/api/integrations/conexa/settings', {
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
    setAccount(null)
    try {
      const res = await fetch('/api/integrations/conexa/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.account)
      toast.success(`Conexa conectada: ${data.account?.clinicName ?? 'Clínica verificada'}`)
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
              <CardTitle className="text-base">Credenciais Conexa Saúde</CardTitle>
              <CardDescription>Plataforma de telemedicina — geração de links de teleconsulta</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="conexa-enabled" className="text-xs">Ativo</Label>
              <Switch id="conexa-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="conexa-clinic">Clinic ID *</Label>
            <Input
              id="conexa-clinic"
              placeholder="ID da clínica na Conexa"
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Encontrado em Conexa Saúde → Painel → Configurações → Integração.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="conexa-key">API Key *</Label>
            <Input
              id="conexa-key"
              type="password"
              placeholder="Chave de API Conexa"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Conexa Saúde → Integrações → Gerar API Key
            </p>
          </div>

          {account && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{account.clinicName ?? 'Clínica verificada'}</p>
                {account.status && (
                  <p className="text-xs text-muted-foreground mt-0.5">Status: {account.status}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
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
          <p>✓ Gerar link de teleconsulta diretamente do prontuário</p>
          <p>✓ Enviar link ao paciente via WhatsApp com um clique</p>
          <p>✓ Registrar consultas telemedicina no histórico do paciente</p>
          <p>✓ Faturar teleconsultas normalmente via convênio ou particular</p>
          <p>✓ Conformidade CFM (Resolução 2.314/2022)</p>
        </CardContent>
      </Card>
    </div>
  )
}
