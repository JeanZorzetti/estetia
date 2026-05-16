'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, ListChecks } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasApiKey: boolean
    projectId: string
  }
}

export function AsanaForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [projectId, setProjectId] = useState(initial.projectId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [projectName, setProjectName] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, asanaProjectId: projectId }
      if (apiKey && !apiKey.startsWith('•')) body.asanaApiKey = apiKey
      const res = await fetch('/api/integrations/asana/settings', {
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
    setProjectName(null)
    try {
      const res = await fetch('/api/integrations/asana/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProjectName(data.result?.projectName ?? 'Projeto')
      toast.success('Projeto Asana encontrado ✅')
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
              <CardTitle className="text-base">Credenciais Asana</CardTitle>
              <CardDescription>Crie tasks por procedimento agendado em um projeto Asana</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="asana-enabled" className="text-xs">Ativo</Label>
              <Switch id="asana-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="asana-key">Personal Access Token *</Label>
            <Input
              id="asana-key"
              type="password"
              placeholder="2/.../..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              app.asana.com/0/my-apps → Create new token
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asana-project">Project ID *</Label>
            <Input
              id="asana-project"
              placeholder="Numérico (URL: app.asana.com/0/{projectId}/list)"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </div>

          {projectName && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{projectName}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListChecks className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
