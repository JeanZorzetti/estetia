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
import { Loader2, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

const REGIONAIS = [
  { value: 'CE', label: 'Ceará (CE)' },
  { value: 'RN', label: 'Rio Grande do Norte (RN)' },
  { value: 'PE', label: 'Pernambuco (PE)' },
  { value: 'BA', label: 'Bahia (BA)' },
  { value: 'GO', label: 'Goiás (GO)' },
  { value: 'SP', label: 'São Paulo (SP)' },
  { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
  { value: 'MG', label: 'Minas Gerais (MG)' },
  { value: 'outros', label: 'Outras regionais' },
]

interface Props {
  initial: {
    enabled: boolean
    hasCredentials: boolean
  }
}

export function HapvidaForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [codigoPrestador, setCodigoPrestador] = useState('')
  const [senha, setSenha] = useState(initial.hasCredentials ? '••••••••' : '')
  const [cnpjPrestador, setCnpjPrestador] = useState('')
  const [regional, setRegional] = useState('CE')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }

      if (codigoPrestador && senha && !senha.startsWith('•')) {
        body.hapvidaCredentialsJson = JSON.stringify({
          codigoPrestador: codigoPrestador.trim(),
          senha,
          cnpjPrestador: cnpjPrestador.replace(/\D/g, '') || undefined,
          regional,
        })
      }

      const res = await fetch('/api/integrations/hapvida/settings', {
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
    setTested(false)
    try {
      const res = await fetch('/api/integrations/hapvida/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTested(true)
      toast.success('Credenciais armazenadas verificadas')
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
              <CardTitle className="text-base">Credenciais do Prestador</CardTitle>
              <CardDescription>Acesso ao portal Hapvida NotreDame Intermédica por regional</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="hapvida-enabled" className="text-xs">Ativo</Label>
              <Switch id="hapvida-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              A Hapvida NotreDame Intermédica opera por regionais com portais TISS distintos. Esta integração armazena suas credenciais com segurança. A conexão TISS completa requer certificado A1 e habilitação pelo gestor regional Hapvida.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Regional *</Label>
            <Select value={regional} onValueChange={setRegional}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONAIS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Selecione a regional da Hapvida onde sua clínica está credenciada
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hapvida-prestador">Código do Prestador *</Label>
            <Input
              id="hapvida-prestador"
              placeholder="Ex: 00001234"
              value={codigoPrestador}
              onChange={(e) => setCodigoPrestador(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hapvida-senha">Senha de Acesso *</Label>
            <Input
              id="hapvida-senha"
              type="password"
              placeholder={initial.hasCredentials ? '••••••••' : 'Senha do portal prestador'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setSenha('') }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hapvida-cnpj">CNPJ do Prestador (opcional)</Label>
            <Input
              id="hapvida-cnpj"
              placeholder="00.000.000/0000-00"
              value={cnpjPrestador}
              onChange={(e) => setCnpjPrestador(e.target.value)}
            />
          </div>

          {tested && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm">Credenciais armazenadas com sucesso — regional: {regional}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing || !initial.hasCredentials}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              Verificar credenciais
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funcionalidades disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Armazenamento seguro de credenciais por regional</p>
          <p>✓ Consulta de elegibilidade por carteirinha (stub — TISS pendente)</p>
          <p>✓ Envio de guias de consulta, SADT e internação</p>
          <p>✓ Controle de glosas e pendências de faturamento</p>
          <p className="text-xs pt-1 text-amber-600 dark:text-amber-400">
            ⚠ Integração TISS completa requer certificado A1 e habilitação regional Hapvida
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
