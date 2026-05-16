'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CalendarSearch, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    clinicId: string
    hasApiKey: boolean
  }
}

export function DoctoraliaForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [clinicId, setClinicId] = useState(initial.clinicId)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [facility, setFacility] = useState<{ name?: string; id?: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, clinicId }
      if (apiKey && !apiKey.startsWith('•')) body.apiKey = apiKey

      const res = await fetch('/api/integrations/doctoralia/settings', {
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
    setFacility(null)
    try {
      const res = await fetch('/api/integrations/doctoralia/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFacility(data.facility)
      toast.success(`Doctoralia conectado: ${data.facility?.name ?? 'Clínica verificada'}`)
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
              <CardTitle className="text-base">Credenciais Doctoralia</CardTitle>
              <CardDescription>Docplanner API — sync de agenda pública</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="doctoralia-enabled" className="text-xs">Ativo</Label>
              <Switch id="doctoralia-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="doctoralia-clinic">Facility ID *</Label>
            <Input
              id="doctoralia-clinic"
              placeholder="Ex: 12345"
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              ID da sua clínica na plataforma Docplanner. Encontrado em Configurações → Integração.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doctoralia-key">API Key *</Label>
            <Input
              id="doctoralia-key"
              type="password"
              placeholder="Bearer token da Docplanner API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Docplanner → Integrações → Gerar chave de API
            </p>
          </div>

          {facility && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{facility.name ?? 'Clínica verificada'}</p>
                {facility.id && (
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">ID: {facility.id}</p>
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
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarSearch className="mr-2 h-4 w-4" />}
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
          <p>✓ Sincronizar agenda pública com slots disponíveis em tempo real</p>
          <p>✓ Exibir disponibilidade da clínica no perfil Doctoralia</p>
          <p>✓ Converter agendamentos online em leads no CRM</p>
          <p>✓ Reduzir faltas com confirmação automática via WhatsApp</p>
          <p>✓ Relatório de origem dos pacientes (buscas orgânicas vs indicação)</p>
        </CardContent>
      </Card>
    </div>
  )
}
