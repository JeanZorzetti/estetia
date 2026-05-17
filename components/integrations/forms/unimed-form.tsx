'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasCredentials: boolean
  }
}

export function UnimedForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [codigoPrestador, setCodigoPrestador] = useState('')
  const [senha, setSenha] = useState(initial.hasCredentials ? '••••••••' : '')
  const [codigoOperadora, setCodigoOperadora] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }

      if (codigoPrestador && senha && !senha.startsWith('•')) {
        // Serialize credentials as JSON string — encrypted by settings-handler
        body.unimedCredentialsJson = JSON.stringify({
          codigoPrestador: codigoPrestador.trim(),
          senha,
          codigoOperadora: codigoOperadora.trim() || undefined,
        })
      }

      const res = await fetch('/api/integrations/unimed/settings', {
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
      const res = await fetch('/api/integrations/unimed/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTested(true)
      toast.success('Credenciais validadas com sucesso')
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
              <CardDescription>Código e senha de acesso ao portal da Unimed singular</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="unimed-enabled" className="text-xs">Ativo</Label>
              <Switch id="unimed-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              A Unimed não possui API REST pública. Esta integração armazena credenciais para futura conexão via SOAP/TISS com certificado A1 do prestador. Consulte sua Unimed singular para obter credenciais e protocolo de integração.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="unimed-prestador">Código do Prestador *</Label>
            <Input
              id="unimed-prestador"
              placeholder="Ex: 00001234"
              value={codigoPrestador}
              onChange={(e) => setCodigoPrestador(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Fornecido pela Unimed singular ao credenciar o prestador
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="unimed-senha">Senha de Acesso *</Label>
            <Input
              id="unimed-senha"
              type="password"
              placeholder={initial.hasCredentials ? '••••••••' : 'Senha do portal prestador'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setSenha('') }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="unimed-operadora">Código ANS da Operadora (opcional)</Label>
            <Input
              id="unimed-operadora"
              placeholder="Ex: 302147"
              value={codigoOperadora}
              onChange={(e) => setCodigoOperadora(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              6 dígitos — código ANS da Unimed singular (confira no rol de operadoras ANS)
            </p>
          </div>

          {tested && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm">Credenciais armazenadas com sucesso</p>
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
          <p>✓ Armazenamento seguro das credenciais do prestador</p>
          <p>✓ Consulta de elegibilidade do beneficiário (stub — TISS pendente)</p>
          <p>✓ Registro de guias TISS por atendimento</p>
          <p>✓ Controle de glosas e pendências de faturamento</p>
          <p className="text-xs pt-1 text-amber-600 dark:text-amber-400">
            ⚠ Integração completa via SOAP/TISS requer certificado A1 do prestador
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
