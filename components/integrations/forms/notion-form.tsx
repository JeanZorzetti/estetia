'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, Database } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasApiKey: boolean
    databaseId: string
  }
}

export function NotionForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [databaseId, setDatabaseId] = useState(initial.databaseId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [dbTitle, setDbTitle] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, notionDatabaseId: databaseId }
      if (apiKey && !apiKey.startsWith('•')) body.notionApiKey = apiKey
      const res = await fetch('/api/integrations/notion/settings', {
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
    setDbTitle(null)
    try {
      const res = await fetch('/api/integrations/notion/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDbTitle(data.result?.databaseTitle ?? 'Database')
      toast.success('Database Notion encontrada ✅')
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
              <CardTitle className="text-base">Credenciais Notion</CardTitle>
              <CardDescription>Sincronize pacientes com uma database Notion</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="notion-enabled" className="text-xs">Ativo</Label>
              <Switch id="notion-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="notion-key">Internal Integration Token *</Label>
            <Input
              id="notion-key"
              type="password"
              placeholder="secret_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              notion.so/profile/integrations → New integration → Internal
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notion-db">Database ID *</Label>
            <Input
              id="notion-db"
              placeholder="32 caracteres hex (URL da database)"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Abra a database → Share → Add connections → cole o token. Database precisa de Name (title), Email (email), Phone (phone).
            </p>
          </div>

          {dbTitle && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{dbTitle}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">O que será sincronizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Cada paciente novo vira uma página na database</p>
          <p>✓ Campos: Nome, Email, Telefone</p>
          <p>✓ Útil para CRMs pessoais paralelos, follow-ups, ou bases de conhecimento</p>
        </CardContent>
      </Card>
    </div>
  )
}
