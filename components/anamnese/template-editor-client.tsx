'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AnamnesisFormBuilder, DEFAULT_ANAMNESIS_TEMPLATE } from '@/components/anamnese/form-builder'
import type { AnamnesisTemplate, AnamnesisSection, AnamnesisField } from '@/components/anamnese/form-builder'
import { toast } from 'sonner'
import {
  ChevronLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TIPO_OPTIONS = [
  { value: 'text', label: 'Texto curto' },
  { value: 'textarea', label: 'Texto longo' },
  { value: 'boolean', label: 'Sim / Não' },
  { value: 'select', label: 'Seleção única' },
  { value: 'multiselect', label: 'Seleção múltipla' },
  { value: 'scale', label: 'Escala (0–10)' },
  { value: 'date', label: 'Data' },
  { value: 'signature', label: 'Assinatura' },
  { value: 'photo', label: 'Foto' },
] as const

const PROCEDIMENTO_OPTIONS = [
  { value: '', label: 'Geral (todos os procedimentos)' },
  { value: 'BOTOX', label: 'Botox' },
  { value: 'PREENCHIMENTO', label: 'Preenchimento' },
  { value: 'LASER', label: 'Laser' },
  { value: 'PEELING', label: 'Peeling' },
  { value: 'HARMONIZACAO_FACIAL', label: 'Harmonização Facial' },
  { value: 'LIMPEZA_PELE', label: 'Limpeza de Pele' },
  { value: 'MICROAGULHAMENTO', label: 'Microagulhamento' },
  { value: 'CRIOLIPOLISE', label: 'Criolipolise' },
  { value: 'RADIOFREQUENCIA', label: 'Radiofrequência' },
  { value: 'LUZ_PULSADA', label: 'Luz Pulsada' },
  { value: 'DEPILACAO_LASER', label: 'Depilação Laser' },
  { value: 'SKINBOOSTER', label: 'Skinbooster' },
  { value: 'FIOS_PDO', label: 'Fios PDO' },
  { value: 'OUTROS', label: 'Outros' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40)
}

interface Props {
  mode: 'create' | 'edit'
  templateId?: string
  initialNome?: string
  initialProcedimento?: string
  initialDescricao?: string
  initialTemplate?: AnamnesisTemplate
  useDefault?: boolean
}

export function TemplateEditorClient({
  mode,
  templateId,
  initialNome = '',
  initialProcedimento = '',
  initialDescricao = '',
  initialTemplate,
  useDefault = false,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const [nome, setNome] = useState(initialNome)
  const [procedimento, setProcedimento] = useState(initialProcedimento)
  const [descricao, setDescricao] = useState(initialDescricao)
  const [sections, setSections] = useState<AnamnesisSection[]>(
    initialTemplate?.sections ?? (useDefault ? DEFAULT_ANAMNESIS_TEMPLATE.sections : [])
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const template: AnamnesisTemplate = { version: 1, sections }

  // ── Section helpers ──────────────────────────────────────────────────────────

  function addSection() {
    setSections((prev) => [...prev, { titulo: 'Nova Seção', campos: [] }])
  }

  function removeSection(sIdx: number) {
    setSections((prev) => prev.filter((_, i) => i !== sIdx))
  }

  function moveSectionUp(sIdx: number) {
    if (sIdx === 0) return
    setSections((prev) => {
      const next = [...prev]
      ;[next[sIdx - 1], next[sIdx]] = [next[sIdx], next[sIdx - 1]]
      return next
    })
  }

  function moveSectionDown(sIdx: number) {
    setSections((prev) => {
      if (sIdx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[sIdx], next[sIdx + 1]] = [next[sIdx + 1], next[sIdx]]
      return next
    })
  }

  function updateSectionTitle(sIdx: number, titulo: string) {
    setSections((prev) => prev.map((s, i) => (i === sIdx ? { ...s, titulo } : s)))
  }

  // ── Field helpers ────────────────────────────────────────────────────────────

  function addField(sIdx: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              campos: [
                ...s.campos,
                { id: `campo_${Date.now()}`, tipo: 'text', label: '', obrigatorio: false },
              ],
            }
          : s
      )
    )
  }

  function removeField(sIdx: number, fIdx: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx ? { ...s, campos: s.campos.filter((_, j) => j !== fIdx) } : s
      )
    )
  }

  function updateField(sIdx: number, fIdx: number, patch: Partial<AnamnesisField>) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              campos: s.campos.map((c, j) => (j === fIdx ? { ...c, ...patch } : c)),
            }
          : s
      )
    )
  }

  function handleLabelChange(sIdx: number, fIdx: number, label: string) {
    const campo = sections[sIdx].campos[fIdx]
    const autoId =
      campo.id.startsWith('campo_') || campo.id === '' ? slugify(label) : campo.id
    updateField(sIdx, fIdx, { label, id: autoId || campo.id })
  }

  function moveFieldUp(sIdx: number, fIdx: number) {
    if (fIdx === 0) return
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx) return s
        const campos = [...s.campos]
        ;[campos[fIdx - 1], campos[fIdx]] = [campos[fIdx], campos[fIdx - 1]]
        return { ...s, campos }
      })
    )
  }

  function moveFieldDown(sIdx: number, fIdx: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx) return s
        if (fIdx >= s.campos.length - 1) return s
        const campos = [...s.campos]
        ;[campos[fIdx], campos[fIdx + 1]] = [campos[fIdx + 1], campos[fIdx]]
        return { ...s, campos }
      })
    )
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!nome.trim()) errs.nome = 'Nome obrigatório'
    if (sections.length === 0) errs.sections = 'Adicione pelo menos uma seção'

    const allIds: string[] = []
    sections.forEach((s, sIdx) => {
      if (!s.titulo.trim()) errs[`section_${sIdx}_titulo`] = 'Título da seção obrigatório'
      if (s.campos.length === 0) errs[`section_${sIdx}_empty`] = 'Seção vazia — adicione ao menos 1 campo'
      s.campos.forEach((c, fIdx) => {
        if (!c.label.trim()) errs[`field_${sIdx}_${fIdx}_label`] = 'Label obrigatório'
        if (!c.id.trim()) errs[`field_${sIdx}_${fIdx}_id`] = 'ID obrigatório'
        if (allIds.includes(c.id)) errs[`field_${sIdx}_${fIdx}_id`] = `ID duplicado: ${c.id}`
        else allIds.push(c.id)
        if ((c.tipo === 'select' || c.tipo === 'multiselect') && (!c.opcoes || c.opcoes.length < 2)) {
          errs[`field_${sIdx}_${fIdx}_opcoes`] = 'Adicione pelo menos 2 opções'
        }
      })
    })

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!validate()) {
      toast.error('Corrija os erros antes de salvar')
      return
    }
    setLoading(true)
    try {
      const body = {
        nome: nome.trim(),
        procedimento: procedimento || undefined,
        descricao: descricao.trim() || undefined,
        template,
      }

      let res: Response
      if (mode === 'create') {
        res = await fetch('/api/clinica/anamnese/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch(`/api/clinica/anamnese/templates/${templateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Erro ao salvar')
      }

      toast.success(mode === 'create' ? 'Template criado!' : 'Template atualizado!')
      router.push('/dashboard/settings/anamnese')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar template')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-slate-500 hover:text-slate-700 -ml-2"
          onClick={() => router.push('/dashboard/settings/anamnese')}
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Templates de Anamnese
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-xl gap-1.5"
            onClick={() => setShowPreview((p) => !p)}
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? 'Ocultar preview' : 'Ver preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-xl"
            onClick={() => router.push('/dashboard/settings/anamnese')}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs rounded-xl bg-[#0A1F3D] hover:bg-[#0A1F3D]/85 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Salvando...' : mode === 'create' ? 'Criar template' : 'Salvar alterações'}
          </Button>
        </div>
      </div>

      {/* Main 2-col grid */}
      <div className={cn('grid gap-6', showPreview ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        {/* LEFT — Editor */}
        <div className="flex flex-col gap-5">
          {/* Meta */}
          <div className="rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Informações do template
              </h2>
              {mode === 'create' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-xl gap-1.5 border-[#489FB5]/30 text-[#2d7a8e] hover:bg-[#489FB5]/10"
                  onClick={() => setSections(DEFAULT_ANAMNESIS_TEMPLATE.sections)}
                >
                  <Sparkles className="w-3 h-3" />
                  Carregar modelo padrão
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Anamnese Geral, Ficha de Botox..."
                  className="h-9 text-sm rounded-xl border-slate-200/70"
                />
                {errors.nome && <p className="text-[11px] text-red-500 mt-1">{errors.nome}</p>}
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Procedimento
                </Label>
                <Select value={procedimento || '__geral__'} onValueChange={(v) => setProcedimento(v === '__geral__' ? '' : v)}>
                  <SelectTrigger className="h-9 text-sm rounded-xl border-slate-200/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROCEDIMENTO_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value || '__geral__'} value={opt.value || '__geral__'}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Descrição
                </Label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva quando usar este template..."
                  className="min-h-[60px] text-sm rounded-xl border-slate-200/70 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-3">
            {errors.sections && (
              <p className="text-[11px] text-red-500 -mb-1">{errors.sections}</p>
            )}

            {sections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-sm overflow-hidden"
              >
                {/* Section header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                  <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <Input
                    value={section.titulo}
                    onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                    className="h-7 text-sm font-semibold border-0 bg-transparent p-0 focus-visible:ring-0 flex-1"
                    placeholder="Título da seção"
                  />
                  {errors[`section_${sIdx}_titulo`] && (
                    <span className="text-[10px] text-red-500">{errors[`section_${sIdx}_titulo`]}</span>
                  )}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                      onClick={() => moveSectionUp(sIdx)}
                      disabled={sIdx === 0}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                      onClick={() => moveSectionDown(sIdx)}
                      disabled={sIdx === sections.length - 1}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                      onClick={() => removeSection(sIdx)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Fields */}
                <div className="flex flex-col divide-y divide-slate-100">
                  {errors[`section_${sIdx}_empty`] && (
                    <p className="text-[11px] text-amber-600 px-4 py-2">
                      {errors[`section_${sIdx}_empty`]}
                    </p>
                  )}

                  {section.campos.map((campo, fIdx) => (
                    <div key={campo.id || fIdx} className="px-4 py-3 flex flex-col gap-2">
                      {/* Row 1: label + tipo + obrigatorio + actions */}
                      <div className="flex items-start gap-2 flex-wrap">
                        <div className="flex-1 min-w-[160px]">
                          <Input
                            value={campo.label}
                            onChange={(e) => handleLabelChange(sIdx, fIdx, e.target.value)}
                            placeholder="Pergunta..."
                            className="h-8 text-sm rounded-xl border-slate-200/70"
                          />
                          {errors[`field_${sIdx}_${fIdx}_label`] && (
                            <p className="text-[10px] text-red-500 mt-0.5">
                              {errors[`field_${sIdx}_${fIdx}_label`]}
                            </p>
                          )}
                        </div>

                        <Select
                          value={campo.tipo}
                          onValueChange={(v) => updateField(sIdx, fIdx, { tipo: v as AnamnesisField['tipo'] })}
                        >
                          <SelectTrigger className="h-8 text-xs rounded-xl border-slate-200/70 w-36 flex-shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIPO_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1.5 h-8">
                          <Switch
                            checked={campo.obrigatorio}
                            onCheckedChange={(v) => updateField(sIdx, fIdx, { obrigatorio: v })}
                            className="scale-75"
                          />
                          <span className="text-[10px] font-semibold text-slate-500">Obrig.</span>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400"
                            onClick={() => moveFieldUp(sIdx, fIdx)}
                            disabled={fIdx === 0}
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400"
                            onClick={() => moveFieldDown(sIdx, fIdx)}
                            disabled={fIdx === section.campos.length - 1}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                            onClick={() => removeField(sIdx, fIdx)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Row 2: ID + placeholder */}
                      <div className="flex items-start gap-2 flex-wrap">
                        <div className="w-36 flex-shrink-0">
                          <Input
                            value={campo.id}
                            onChange={(e) => updateField(sIdx, fIdx, { id: e.target.value })}
                            placeholder="id_campo"
                            className={cn(
                              'h-7 text-xs rounded-xl border-slate-200/70 font-mono',
                              errors[`field_${sIdx}_${fIdx}_id`] ? 'border-red-300' : ''
                            )}
                          />
                          {errors[`field_${sIdx}_${fIdx}_id`] && (
                            <p className="text-[10px] text-red-500 mt-0.5">
                              {errors[`field_${sIdx}_${fIdx}_id`]}
                            </p>
                          )}
                        </div>
                        {campo.tipo === 'text' || campo.tipo === 'textarea' ? (
                          <Input
                            value={campo.placeholder ?? ''}
                            onChange={(e) => updateField(sIdx, fIdx, { placeholder: e.target.value })}
                            placeholder="Placeholder (opcional)"
                            className="h-7 text-xs rounded-xl border-slate-200/70 flex-1"
                          />
                        ) : null}
                      </div>

                      {/* Row 3: options for select/multiselect */}
                      {(campo.tipo === 'select' || campo.tipo === 'multiselect') && (
                        <div>
                          <Textarea
                            value={(campo.opcoes ?? []).join('\n')}
                            onChange={(e) =>
                              updateField(sIdx, fIdx, {
                                opcoes: e.target.value.split('\n').map((o) => o.trim()).filter(Boolean),
                              })
                            }
                            placeholder="Uma opção por linha"
                            className="min-h-[72px] text-xs rounded-xl border-slate-200/70 resize-none font-mono"
                          />
                          {errors[`field_${sIdx}_${fIdx}_opcoes`] && (
                            <p className="text-[10px] text-red-500 mt-0.5">
                              {errors[`field_${sIdx}_${fIdx}_opcoes`]}
                            </p>
                          )}
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {(campo.opcoes ?? []).map((opt) => (
                              <Badge key={opt} variant="secondary" className="text-[10px] h-4 px-1.5">
                                {opt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-[#2d7a8e] hover:bg-[#489FB5]/10 gap-1.5"
                      onClick={() => addField(sIdx)}
                    >
                      <Plus className="w-3 h-3" />
                      Adicionar campo
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs rounded-xl gap-1.5 border-dashed border-slate-300 text-slate-600 hover:border-[#489FB5]/50 hover:text-[#2d7a8e]"
              onClick={addSection}
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar seção
            </Button>
          </div>
        </div>

        {/* RIGHT — Preview */}
        {showPreview && (
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-lg">
                Preview ao vivo
              </Badge>
              <span className="text-[10px] text-slate-400">
                Como o profissional verá o formulário
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/40 backdrop-blur-sm p-4 overflow-y-auto max-h-[calc(100vh-200px)] sticky top-4">
              {sections.length > 0 && sections.some((s) => s.campos.length > 0) ? (
                <AnamnesisFormBuilder
                  template={template}
                  onSubmit={async () => {}}
                  readOnly
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-slate-400">
                  <Eye className="w-8 h-8 opacity-30" />
                  <p className="text-xs">Adicione seções e campos para ver o preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
