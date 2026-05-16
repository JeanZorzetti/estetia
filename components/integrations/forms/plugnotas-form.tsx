'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  initial: {
    enabled: boolean
    hasApiKey: boolean
    cnpj: string
  }
}

export function PlugnotasForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [apiKey, setApiKey] = useState(initial.hasApiKey ? '••••••••••••' : '')
  const [cnpj, setCnpj] = useState(initial.cnpj)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [verified, setVerified] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled, plugnotasCnpj: cnpj }
      if (apiKey && !apiKey.startsWith('•')) body.plugnotasApiKey = apiKey

      const res = await fetch('/api/integrations/plugnotas/settings', {
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
    setVerified(false)
    try {
      const res = await fetch('/api/integrations/plugnotas/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setVerified(true)
      toast.success('Plug.notas conectado com sucesso')
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
              <CardTitle className="text-base">Credenciais Plug.notas</CardTitle>
              <CardDescription>Plataforma fiscal multi-município para NFS-e</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="plugnotas-enabled" className="text-xs">Ativo</Label>
              <Switch id="plugnotas-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="plugnotas-key">API Key *</Label>
            <Input
              id="plugnotas-key"
              type="password"
              placeholder="Sua API key do Plug.notas"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onFocus={(e) => { if (e.target.value.startsWith('•')) setApiKey('') }}
            />
            <p className="text-xs text-muted-foreground">
              Plug.notas → Configurações → Tokens de API → Gerar novo token
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plugnotas-cnpj">CNPJ do Prestador *</Label>
            <Input
              id="plugnotas-cnpj"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              CNPJ da clínica cadastrado no Plug.notas (certificado A1 necessário)
            </p>
          </div>

          {verified && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Plug.notas conectado — pronto para emissão</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
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
          <p>✓ Emissão de NFS-e em mais de 1.000 municípios brasileiros</p>
          <p>✓ Suporte a certificado A1 para autenticação com a prefeitura</p>
          <p>✓ Emissão automática ao confirmar pagamento</p>
          <p>✓ PDF da nota gerado automaticamente</p>
          <p>✓ Cancelamento e substituição de notas</p>
        </CardContent>
      </Card>
    </div>
  )
}
