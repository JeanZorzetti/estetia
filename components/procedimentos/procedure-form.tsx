'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Loader2, X, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateProcedureSchema, type ProcedureInput } from '@/lib/procedures/schema'

interface Professional {
  id: string
  nome: string
}

interface ProcedureFull {
  id: string
  nome: string
  categoria: string | null
  descricao: string | null
  duracaoMinutos: number
  valorPadrao: number | null
  contraindicacoesGerais: string[]
  preCuidados: string | null
  posCuidados: string | null
  exigeAnamneseEspecifica: boolean
  profissionaisHabilitadosIds: string[]
  ativo: boolean
}

interface Props {
  initialData?: ProcedureFull
}

function Section({
  title, defaultOpen = true, children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-sm font-semibold">{title}</span>
        {open
          ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground" />
        }
      </button>
      {open && <div className="px-5 py-4 flex flex-col gap-4">{children}</div>}
    </div>
  )
}

export function ProcedureForm({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData?.id
  const [submitting, setSubmitting] = useState(false)
  const [professionals, setProfessionals] = useState<Professional[]>([])

  // Tag input state for contraindicacoesGerais
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialData?.contraindicacoesGerais ?? [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProcedureInput>({
    resolver: zodResolver(CreateProcedureSchema) as any,
    defaultValues: {
      nome: initialData?.nome ?? '',
      categoria: (initialData?.categoria as any) ?? '',
      descricao: initialData?.descricao ?? '',
      duracaoMinutos: initialData?.duracaoMinutos ?? 60,
      valorPadrao: initialData?.valorPadrao ?? undefined,
      contraindicacoesGerais: initialData?.contraindicacoesGerais ?? [],
      preCuidados: initialData?.preCuidados ?? '',
      posCuidados: initialData?.posCuidados ?? '',
      exigeAnamneseEspecifica: initialData?.exigeAnamneseEspecifica ?? false,
      profissionaisHabilitadosIds: initialData?.profissionaisHabilitadosIds ?? [],
      ativo: initialData?.ativo ?? true,
    },
  })

  const exigeAnamnese = watch('exigeAnamneseEspecifica')
  const ativo = watch('ativo')
  const selectedProfIds = watch('profissionaisHabilitadosIds') ?? []

  useEffect(() => {
    fetch('/api/professionals')
      .then(r => r.json())
      .then(d => setProfessionals(d.professionals ?? []))
      .catch(() => {})
  }, [])

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      const next = [...tags, t]
      setTags(next)
      setValue('contraindicacoesGerais', next)
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    const next = tags.filter(t => t !== tag)
    setTags(next)
    setValue('contraindicacoesGerais', next)
  }

  const toggleProfessional = (id: string) => {
    const current = selectedProfIds ?? []
    const next = current.includes(id)
      ? current.filter(p => p !== id)
      : [...current, id]
    setValue('profissionaisHabilitadosIds', next)
  }

  const onSubmit = async (data: ProcedureInput) => {
    setSubmitting(true)
    try {
      const url = isEdit ? `/api/procedures/${initialData!.id}` : '/api/procedures'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          categoria: data.categoria || null,
          descricao: data.descricao || null,
          preCuidados: data.preCuidados || null,
          posCuidados: data.posCuidados || null,
          contraindicacoesGerais: tags,
        }),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      router.push('/dashboard/procedimentos')
      router.refresh()
    } catch {
      // keep form open on error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">

      <Section title="Identificação">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nome">Nome do procedimento *</Label>
          <Input id="nome" placeholder="ex: Limpeza de pele profunda" {...register('nome')} />
          {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Categoria</Label>
            <Select
              defaultValue={initialData?.categoria ?? ''}
              onValueChange={v => setValue('categoria', v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facial">Facial</SelectItem>
                <SelectItem value="corporal">Corporal</SelectItem>
                <SelectItem value="capilar">Capilar</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="descricao">Descrição <span className="text-muted-foreground font-normal">(opcional)</span></Label>
          <Textarea id="descricao" placeholder="Descreva o procedimento..." rows={3} {...register('descricao')} />
        </div>
      </Section>

      <Section title="Tempo e Valor">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duracaoMinutos">Duração (minutos)</Label>
            <Input id="duracaoMinutos" type="number" min={5} max={600} {...register('duracaoMinutos')} />
            {errors.duracaoMinutos && <p className="text-xs text-destructive">{errors.duracaoMinutos.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="valorPadrao">Valor padrão (R$) <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Input id="valorPadrao" type="number" min={0} step={0.01} placeholder="0,00" {...register('valorPadrao')} />
          </div>
        </div>
      </Section>

      <Section title="Informações Clínicas" defaultOpen={false}>
        <div className="flex flex-col gap-1.5">
          <Label>Contraindicações gerais</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Digite e pressione Enter..."
            />
            <Button type="button" variant="outline" onClick={addTag} size="sm">
              Adicionar
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {tags.map(t => (
                <Badge key={t} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="preCuidados">Pré-cuidados <span className="text-muted-foreground font-normal">(opcional)</span></Label>
          <Textarea id="preCuidados" placeholder="Orientações antes do procedimento..." rows={3} {...register('preCuidados')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="posCuidados">Pós-cuidados <span className="text-muted-foreground font-normal">(opcional)</span></Label>
          <Textarea id="posCuidados" placeholder="Orientações após o procedimento..." rows={3} {...register('posCuidados')} />
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium">Exige anamnese específica</p>
            <p className="text-xs text-muted-foreground">Paciente deve preencher anamnese antes deste procedimento</p>
          </div>
          <Switch
            checked={exigeAnamnese}
            onCheckedChange={v => setValue('exigeAnamneseEspecifica', v)}
          />
        </div>
      </Section>

      <Section title="Profissionais Habilitados" defaultOpen={false}>
        {professionals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum profissional cadastrado ainda.</p>
        ) : (
          <ScrollArea className="h-48 pr-2">
            <div className="flex flex-col gap-2">
              {professionals.map(p => (
                <label
                  key={p.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer',
                    'border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all',
                    selectedProfIds.includes(p.id) && 'border-primary/40 bg-primary/5',
                  )}
                >
                  <Checkbox
                    checked={selectedProfIds.includes(p.id)}
                    onCheckedChange={() => toggleProfessional(p.id)}
                  />
                  <span className="text-sm">{p.nome}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        )}
      </Section>

      {isEdit && (
        <Section title="Status" defaultOpen>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Procedimento ativo</p>
              <p className="text-xs text-muted-foreground">Procedimentos inativos não aparecem no booking público</p>
            </div>
            <Switch
              checked={ativo}
              onCheckedChange={v => setValue('ativo', v)}
            />
          </div>
        </Section>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/dashboard/procedimentos')}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
          ) : (
            isEdit ? 'Salvar alterações' : 'Criar procedimento'
          )}
        </Button>
      </div>
    </form>
  )
}
