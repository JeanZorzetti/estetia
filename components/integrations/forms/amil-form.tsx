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

export function AmilForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [codigoPrestador, setCodigoPrestador] = useState('')
  const [senha, setSenha] = useState(initial.hasCredentials ? '••••••••' : '')
  const [cnpjPrestador, setCnpjPrestador] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }

      if (codigoPrestador && senha && !senha.startsWith('•')) {
        body.amilCredentialsJson = JSON.stringify({
          codigoPrestador: codigoPrestador.trim(),
          senha,
          cnpjPrestador: cnpjPrestador.replace(/\D/g, '') || undefined,
        })
      }

      const res = await fetch('/api/integrations/amil/settings', {
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
      const res = await fetch('/api/integrations/amil/test', { method: 'POST' })
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
              <CardDescription>Acesso ao portal de faturamento Amil para prestadores</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="amil-enabled" className="text-xs">Ativo</Label>
              <Switch id="amil-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              A Amil utiliza protocolo TISS/SOAP para troca eletrônica de guias. Esta integração armazena suas credenciais com segurança. A conexão TISS completa requer certificado digital A1 do prestador e habilitação pelo gestor Amil.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amil-prestador">Código do Prestador *</Label>
            <Input
              id="amil-prestador"
              placeholder="Ex: 12345678"
              value={codigoPrestador}
              onChange={(e) => setCodigoPrestador(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Código de identificação do prestador no painel Amil
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amil-senha">Senha de Acesso *</Label>
            <Input
              id="amil-senha"
              type="password"
              placeholder={initial.hasCredentials ? '••••••••' : 'Senha do portal prestador'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setSenha('') }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amil-cnpj">CNPJ do Prestador (opcional)</Label>
            <Input
              id="amil-cnpj"
              placeholder="00.000.000/0000-00"
              value={cnpjPrestador}
              onChange={(e) => setCnpjPrestador(e.target.value)}
            />
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
          <p>✓ Armazenamento seguro de credenciais do prestador</p>
          <p>✓ Consulta de elegibilidade por carteirinha (stub — TISS pendente)</p>
          <p>✓ Autorização e faturamento de guias Amil</p>
          <p>✓ Controle de glosas e devoluções</p>
          <p className="text-xs pt-1 text-amber-600 dark:text-amber-400">
            ⚠ Conexão TISS completa requer certificado A1 e habilitação Amil
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
