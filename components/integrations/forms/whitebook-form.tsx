'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, BookOpen, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasApiKey: boolean
  }
}

export function WhitebookForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [account, setAccount] = useState<{ partnerName?: string; plan?: string; activeUsers?: number } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }
      if (apiKey && !apiKey.startsWith('•')) body.apiKey = apiKey

      const res = await fetch('/api/integrations/whitebook/settings', {
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
      const res = await fetch('/api/integrations/whitebook/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAccount(data.account)
      toast.success(`Whitebook conectado: ${data.account?.partnerName ?? 'Conta verificada'}`)
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
              <CardTitle className="text-base">Credenciais Whitebook (PEBMED)</CardTitle>
              <CardDescription>Decisão clínica e protocolos — deep-links contextuais</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="whitebook-enabled" className="text-xs">Ativo</Label>
              <Switch id="whitebook-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="whitebook-key">API Key *</Label>
            <Input
              id="whitebook-key"
              type="password"
              placeholder="Chave de parceiro PEBMED"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Entre em contato com a equipe PEBMED para obter sua chave de parceiro: parceiros@pebmed.com.br
            </p>
          </div>

          {account && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">{account.partnerName ?? 'Conta verificada'}</p>
                <div className="flex gap-3 mt-0.5">
                  {account.plan && (
                    <p className="text-xs text-muted-foreground">Plano: {account.plan}</p>
                  )}
                  {account.activeUsers !== undefined && (
                    <p className="text-xs text-muted-foreground">Usuários ativos: {account.activeUsers}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
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
          <p>✓ Abrir bula de medicamento com um clique no prontuário</p>
          <p>✓ Consultar protocolos clínicos por CID-10 diretamente</p>
          <p>✓ Deep-link contextual para calculadoras médicas (peso/idade/dose)</p>
          <p>✓ Acesso offline ao Whitebook pelo app no smartphone</p>
          <p>✓ Reduzir tempo de busca de informação durante a consulta</p>
        </CardContent>
      </Card>
    </div>
  )
}
