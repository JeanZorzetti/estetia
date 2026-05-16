'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export interface FieldDef {
  name: string
  label: string
  type?: 'text' | 'password' | 'url'
  placeholder?: string
  required?: boolean
  /** se true, é tratada como credencial sensível: mascarada se já preenchida */
  sensitive?: boolean
  helperText?: string
}

interface Props {
  integrationId: string
  description?: string
  fields: FieldDef[]
  initial: Record<string, unknown> & { enabled: boolean }
  /** se true, exibe botão "Testar conexão" — endpoint /test deve existir */
  enableTest?: boolean
}

export function GenericCredentialsForm({
  integrationId,
  description,
  fields,
  initial,
  enableTest = true,
}: Props) {
  const [enabled, setEnabled] = useState(initial.enabled)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {}
    for (const f of fields) {
      const init = initial[f.name]
      if (f.sensitive) v[f.name] = init ? '••••••••••••' : ''
      else v[f.name] = (init as string | undefined) ?? ''
    }
    return v
  })
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<unknown>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { enabled }
      for (const f of fields) {
        const val = values[f.name]
        if (f.sensitive) {
          if (val && !val.startsWith('•')) body[f.name] = val
        } else {
          body[f.name] = val
        }
      }
      const res = await fetch(`/api/integrations/${integrationId}/settings`, {
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
    setTestResult(null)
    try {
      const res = await fetch(`/api/integrations/${integrationId}/test`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTestResult(data.account ?? data.result ?? { ok: true })
      toast.success('Conexão validada')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao testar')
    } finally {
      setTesting(false)
    }
  }

  const anySensitiveFilled = fields.some(
    (f) => f.sensitive && initial[f.name]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${integrationId}-enabled`}>Habilitar integração</Label>
          <Switch
            id={`${integrationId}-enabled`}
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {fields.map((f) => (
          <div key={f.name} className="space-y-2">
            <Label htmlFor={`${integrationId}-${f.name}`}>
              {f.label}
              {f.required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            <Input
              id={`${integrationId}-${f.name}`}
              type={f.type === 'password' || f.sensitive ? 'password' : (f.type ?? 'text')}
              value={values[f.name]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [f.name]: e.target.value }))
              }
              placeholder={f.placeholder}
            />
            {f.helperText && (
              <p className="text-xs text-muted-foreground">{f.helperText}</p>
            )}
          </div>
        ))}

        {testResult !== null && (
          <div className="flex items-start gap-2 rounded-lg border bg-emerald-500/5 p-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
          {enableTest && (
            <Button
              onClick={handleTest}
              variant="outline"
              disabled={testing || !anySensitiveFilled}
            >
              {testing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Testar conexão
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
