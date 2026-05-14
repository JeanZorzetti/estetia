'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Pen } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnamnesisField {
  id: string
  tipo: 'text' | 'textarea' | 'select' | 'multiselect' | 'boolean' | 'scale' | 'date' | 'signature' | 'photo'
  label: string
  obrigatorio: boolean
  opcoes?: string[]
  placeholder?: string
}

export interface AnamnesisSection {
  titulo: string
  campos: AnamnesisField[]
}

export interface AnamnesisTemplate {
  version: number
  sections: AnamnesisSection[]
}

export interface AnamnesisFormBuilderProps {
  template: AnamnesisTemplate
  onSubmit: (respostas: Record<string, unknown>, assinatura?: string) => Promise<void>
  loading?: boolean
  readOnly?: boolean
  initialValues?: Record<string, unknown>
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScaleField({
  field,
  value,
  onChange,
  readOnly,
}: {
  field: AnamnesisField
  value: number | undefined
  onChange: (v: number) => void
  readOnly: boolean
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 11 }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={readOnly}
          onClick={() => onChange(i)}
          className={cn(
            'h-8 w-8 rounded-full border text-xs font-medium transition-colors',
            value === i
              ? 'border-rose-400 bg-rose-500 text-white'
              : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50'
          )}
        >
          {i}
        </button>
      ))}
    </div>
  )
}

function SignatureField({
  value,
  onChange,
  readOnly,
}: {
  value: string | undefined
  onChange: (v: string) => void
  readOnly: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSig, setHasSig] = useState(!!value)

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    setDrawing(true)
    ctx.beginPath()
    const rect = canvasRef.current!.getBoundingClientRect()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || readOnly) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDraw = () => {
    setDrawing(false)
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL()
      setHasSig(true)
      onChange(dataUrl)
    }
  }

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      setHasSig(false)
      onChange('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
        {value && !hasSig ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Assinatura registrada
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={400}
            height={96}
            className="w-full cursor-crosshair touch-none"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        )}
        {!readOnly && (
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <Pen className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Assine aqui</span>
          </div>
        )}
      </div>
      {!readOnly && hasSig && (
        <Button type="button" variant="ghost" size="sm" onClick={clear}>
          Limpar assinatura
        </Button>
      )}
    </div>
  )
}

// ─── Main FormBuilder ─────────────────────────────────────────────────────────

export function AnamnesisFormBuilder({
  template,
  onSubmit,
  loading = false,
  readOnly = false,
  initialValues = {},
}: AnamnesisFormBuilderProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const [signature, setSignature] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setValue = (fieldId: string, value: unknown) => {
    setValues((prev: Record<string, unknown>) => ({ ...prev, [fieldId]: value }))
    setErrors((prev: Record<string, string>) => ({ ...prev, [fieldId]: '' }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    for (const section of template.sections) {
      for (const field of section.campos) {
        if (field.obrigatorio) {
          const val = values[field.id]
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            newErrors[field.id] = 'Campo obrigatório'
          }
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(values, signature || undefined)
  }

  const renderField = (field: AnamnesisField) => {
    const val = values[field.id]
    const err = errors[field.id]

    return (
      <div key={field.id} className="space-y-1.5">
        <Label className={cn('text-sm', field.obrigatorio && "after:content-['*'] after:ml-0.5 after:text-rose-500")}>
          {field.label}
        </Label>

        {field.tipo === 'text' && (
          <Input
            value={(val as string) ?? ''}
            onChange={(e: { target: { value: string } }) => setValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
          />
        )}

        {field.tipo === 'textarea' && (
          <Textarea
            value={(val as string) ?? ''}
            onChange={(e: { target: { value: string } }) => setValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            disabled={readOnly}
          />
        )}

        {field.tipo === 'boolean' && (
          <div className="flex gap-3">
            {['Sim', 'Não'].map(opt => (
              <button
                key={opt}
                type="button"
                disabled={readOnly}
                onClick={() => setValue(field.id, opt === 'Sim')}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  val === (opt === 'Sim')
                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                    : 'border-gray-200 hover:border-rose-300'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {field.tipo === 'select' && field.opcoes && (
          <div className="flex flex-wrap gap-2">
            {field.opcoes.map(opt => (
              <button
                key={opt}
                type="button"
                disabled={readOnly}
                onClick={() => setValue(field.id, opt)}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm transition-colors',
                  val === opt
                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                    : 'border-gray-200 hover:border-rose-300'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {field.tipo === 'multiselect' && field.opcoes && (
          <div className="flex flex-wrap gap-2">
            {field.opcoes.map(opt => {
              const selected = Array.isArray(val) && (val as string[]).includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    const current = Array.isArray(val) ? (val as string[]) : []
                    setValue(field.id, selected ? current.filter(v => v !== opt) : [...current, opt])
                  }}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    selected
                      ? 'border-rose-400 bg-rose-50 text-rose-700'
                      : 'border-gray-200 hover:border-rose-300'
                  )}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {field.tipo === 'scale' && (
          <ScaleField
            field={field}
            value={val as number | undefined}
            onChange={v => setValue(field.id, v)}
            readOnly={readOnly}
          />
        )}

        {field.tipo === 'date' && (
          <Input
            type="date"
            value={(val as string) ?? ''}
            onChange={(e: { target: { value: string } }) => setValue(field.id, e.target.value)}
            disabled={readOnly}
          />
        )}

        {field.tipo === 'signature' && (
          <SignatureField
            value={signature}
            onChange={v => { setSignature(v); setValue(field.id, v ? 'signed' : '') }}
            readOnly={readOnly}
          />
        )}

        {err && <p className="text-xs text-red-500">{err}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {template.sections.map((section, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-rose-700">{section.titulo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.campos.map(renderField)}
          </CardContent>
        </Card>
      ))}

      {!readOnly && (
        <div className="space-y-3">
          <div className="rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs text-rose-700">
            Ao assinar, você confirma que as informações acima são verdadeiras e autoriza o uso
            desses dados para fins de tratamento clínico, conforme a LGPD Art. 11.
          </div>
          <Button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Anamnese'}
          </Button>
        </div>
      )}

      {readOnly && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          Anamnese registrada e assinada digitalmente.
        </div>
      )}
    </form>
  )
}

// ─── Default template for general aesthetic procedures ───────────────────────

export const DEFAULT_ANAMNESIS_TEMPLATE: AnamnesisTemplate = {
  version: 1,
  sections: [
    {
      titulo: 'Informações Gerais de Saúde',
      campos: [
        { id: 'gestante', tipo: 'boolean', label: 'Está gestante ou amamentando?', obrigatorio: true },
        { id: 'alergias', tipo: 'boolean', label: 'Possui alergias conhecidas?', obrigatorio: true },
        { id: 'alergias_desc', tipo: 'textarea', label: 'Se sim, quais alergias?', obrigatorio: false, placeholder: 'Descreva as alergias...' },
        { id: 'medicamentos', tipo: 'boolean', label: 'Faz uso de medicamentos?', obrigatorio: true },
        { id: 'medicamentos_desc', tipo: 'textarea', label: 'Se sim, quais medicamentos?', obrigatorio: false },
        { id: 'doencas_cronicas', tipo: 'multiselect', label: 'Doenças crônicas', obrigatorio: false,
          opcoes: ['Diabetes', 'Hipertensão', 'Doenças autoimunes', 'Distúrbios de coagulação', 'Nenhuma'] },
        { id: 'cirurgias_anteriores', tipo: 'boolean', label: 'Realizou cirurgias anteriores no rosto ou área tratada?', obrigatorio: true },
        { id: 'tratamentos_anteriores', tipo: 'textarea', label: 'Tratamentos estéticos realizados nos últimos 6 meses', obrigatorio: false, placeholder: 'Botox, preenchimento, laser...' },
      ],
    },
    {
      titulo: 'Expectativas e Autorização',
      campos: [
        { id: 'expectativas', tipo: 'textarea', label: 'O que espera com o procedimento?', obrigatorio: true, placeholder: 'Descreva suas expectativas...' },
        { id: 'foto_consentimento', tipo: 'boolean', label: 'Autoriza o uso de fotos antes/depois para fins de acompanhamento clínico?', obrigatorio: true },
        { id: 'foto_marketing', tipo: 'boolean', label: 'Autoriza o uso de fotos para marketing (redes sociais)?', obrigatorio: true },
        { id: 'assinatura', tipo: 'signature', label: 'Assinatura digital', obrigatorio: true },
      ],
    },
  ],
}
