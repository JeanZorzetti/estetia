'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    environment: 'homologacao' | 'producao'
    hasToken: boolean
  }
}

export function FocusNfeForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [environment, setEnvironment] = useState<'homologacao' | 'producao'>(initial.environment)
  const [token, setToken] = useState(initial.hasToken ? '••••••••••••' : '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [empresas, setEmpresas] = useState<Array<{ cnpj?: string; nome?: string; habilita_nfse?: boolean }> | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, environment }
      if (token && !token.startsWith('•')) body.token = token

      const res = await fetch('/api/integrations/focus-nfe/settings', {
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
    setEmpresas(null)
    try {
      const res = await fetch('/api/integrations/focus-nfe/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEmpresas(data.empresas ?? [])
      toast.success(`${data.empresas?.length ?? 0} empresa(s) cadastrada(s)`)
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
              <CardTitle className="text-base">Credenciais Focus NFe</CardTitle>
              <CardDescription>Emissão automática de NF-Se após atendimento</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="focus-enabled" className="text-xs">Ativo</Label>
              <Switch id="focus-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Ambiente</Label>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as 'homologacao' | 'producao')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homologacao">Homologação (testes)</SelectItem>
                <SelectItem value="producao">Produção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="focus-token">Token *</Label>
            <Input
              id="focus-token"
              type="password"
              placeholder="Token Focus NFe"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setToken('') }}
            />
            <p className="text-xs text-muted-foreground">
              Focus NFe → API → Token de acesso
            </p>
          </div>

          {empresas && empresas.length > 0 && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Empresas cadastradas
              </div>
              {empresas.slice(0, 3).map((e, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-center justify-between">
                  <span className="font-mono">{e.cnpj ?? '—'}</span>
                  <span className="truncate">{e.nome ?? '—'}</span>
                  <span className={e.habilita_nfse ? 'text-emerald-600' : 'text-muted-foreground/60'}>
                    NF-Se {e.habilita_nfse ? '✓' : '✗'}
                  </span>
                </div>
              ))}
              {empresas.length > 3 && (
                <p className="text-[10px] text-muted-foreground/70">+ {empresas.length - 3} outras</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Listar empresas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Crie conta gratuita em <a className="text-primary underline" href="https://focusnfe.com.br" target="_blank" rel="noreferrer">focusnfe.com.br</a></p>
          <p>2. Cadastre o CNPJ da sua clínica e suba o certificado A1</p>
          <p>3. Habilite NF-Se na sua empresa pelo painel Focus</p>
          <p>4. Cole o token de produção acima e ative</p>
          <p>5. Após cada atendimento concluído, a nota é emitida automaticamente</p>
        </CardContent>
      </Card>
    </div>
  )
}
