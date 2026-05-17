'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasApiKey: boolean
    accountInfo?: { clinicaNome?: string; plano?: string }
  }
}

export function MedtissForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [info, setInfo] = useState<{ clinicaNome?: string; plano?: string } | null>(
    initial.accountInfo ?? null
  )

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }
      if (apiKey && !apiKey.startsWith('•')) body.medtissApiKey = apiKey

      const res = await fetch('/api/integrations/medtiss/settings', {
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
    setInfo(null)
    try {
      const res = await fetch('/api/integrations/medtiss/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInfo(data.info ?? {})
      toast.success('Conexão com MEDTISS verificada')
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
              <CardTitle className="text-base">API Key MEDTISS</CardTitle>
              <CardDescription>Plataforma TISS unificada para múltiplas operadoras</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="medtiss-enabled" className="text-xs">Ativo</Label>
              <Switch id="medtiss-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="medtiss-key">API Key *</Label>
            <Input
              id="medtiss-key"
              type="password"
              placeholder="mtk_xxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Obtenha em app.medtiss.com.br → Configurações → Integrações → API Key
            </p>
          </div>

          {info && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{info.clinicaNome ?? 'Conta verificada'}</p>
                {info.plano && (
                  <p className="text-xs text-muted-foreground mt-0.5">Plano: {info.plano}</p>
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
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funcionalidades disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Emissão de guias TISS para múltiplas operadoras via plataforma unificada</p>
          <p>✓ Consulta de elegibilidade em tempo real</p>
          <p>✓ Controle centralizado de glosas e pendências</p>
          <p>✓ Faturamento eletrônico TISS 3.05</p>
          <p>✓ Relatórios de produção e financeiro por convênio</p>
        </CardContent>
      </Card>
    </div>
  )
}
