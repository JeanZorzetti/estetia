'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, Trello } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    apiKey: string
    hasToken: boolean
    boardId: string
  }
}

export function TrelloForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.apiKey)
  const [token, setToken] = useState(initial.hasToken ? '••••••••••••' : '')
  const [boardId, setBoardId] = useState(initial.boardId)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [boardName, setBoardName] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        enabled,
        trelloApiKey: apiKey,
        trelloBoardId: boardId,
      }
      if (token && !token.startsWith('•')) body.trelloToken = token
      const res = await fetch('/api/integrations/trello/settings', {
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
    setBoardName(null)
    try {
      const res = await fetch('/api/integrations/trello/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBoardName(data.result?.boardName ?? 'Board')
      toast.success('Board Trello encontrado ✅')
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
              <CardTitle className="text-base">Credenciais Trello</CardTitle>
              <CardDescription>Crie cards em um board Trello para cada procedimento agendado</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="trello-enabled" className="text-xs">Ativo</Label>
              <Switch id="trello-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="trello-key">API Key *</Label>
            <Input
              id="trello-key"
              placeholder="32 caracteres alfanuméricos"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">trello.com/app-key</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="trello-token">Token *</Label>
            <Input
              id="trello-token"
              type="password"
              placeholder="Gerado em trello.com/app-key → Generate token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setToken('') }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="trello-board">Board ID *</Label>
            <Input
              id="trello-board"
              placeholder="ID do board (URL: trello.com/b/{boardId}/...)"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
            />
          </div>

          {boardName && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{boardName}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trello className="mr-2 h-4 w-4" />}
              Testar conexão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
