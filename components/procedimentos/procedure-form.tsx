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
import { Loader2, X, ChevronRight, FileText, Tag, Clock, DollarSign, HeartPulse, UserCheck, Settings, Sparkles, AlertCircle, Plus, Activity } from 'lucide-react'
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

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Section({
  title, description, icon: Icon, defaultOpen = true, children, accentColor = 'navy'
}: {
  title: string
  description?: string
  icon?: any
  defaultOpen?: boolean
  children: React.ReactNode
  accentColor?: 'navy' | 'gold' | 'teal'
}) {
  const [open, setOpen] = useState(defaultOpen)
  
  const accentGradients = {
    navy: 'from-navy via-navy-600 to-teal-500',
    gold: 'from-gold via-gold-500 to-gold-600',
    teal: 'from-teal via-teal-500 to-teal-600',
  }
  
  const borderColors = {
    navy: 'hover:border-navy-500/25 focus-within:border-navy-500/30',
    gold: 'hover:border-gold-500/25 focus-within:border-gold-500/30',
    teal: 'hover:border-teal-500/25 focus-within:border-teal-500/30',
  }

  const iconColors = {
    navy: 'text-navy dark:text-navy-200 bg-navy-500/10 border-navy-500/20',
    gold: 'text-gold-600 dark:text-gold-400 bg-gold-500/10 border-gold-500/20',
    teal: 'text-teal dark:text-teal-400 bg-teal-500/10 border-teal-500/20',
  }

  return (
    <div className={cn(
      "overflow-hidden border border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 rounded-2xl group relative pl-3.5 shadow-sm",
      borderColors[accentColor]
    )}>
      {/* Left accent color bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b rounded-l-2xl", accentGradients[accentColor])} />
      
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-colors text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner transition-colors duration-300", iconColors[accentColor])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="text-xs font-black text-foreground group-hover:text-teal dark:group-hover:text-teal-400 transition-colors tracking-widest block uppercase">{title}</span>
            {description && <span className="text-[11px] text-muted-foreground font-semibold mt-0.5 block">{description}</span>}
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border/10 flex items-center justify-center shrink-0">
          <ChevronRight className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-300',
            open && 'rotate-90 text-teal'
          )} />
        </div>
      </button>
      {open && (
        <div className="border-t border-border/10 bg-muted/5 dark:bg-zinc-900/5 px-5 py-5 flex flex-col gap-5">
          {children}
        </div>
      )}
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
  const watchDuracao = watch('duracaoMinutos')

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full relative z-10">

      <Section title="Identificação" description="Dados básicos, nome e categoria do procedimento" icon={Tag} accentColor="navy">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="nome" className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Nome do procedimento *</Label>
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-muted-foreground/60 transition-colors group-focus-within:text-teal">
                <Tag className="w-4 h-4" />
              </span>
              <Input
                id="nome"
                placeholder="ex: Toxina Botulínica, Preenchimento Labial..."
                {...register('nome')}
                className="h-11 pl-10 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
              />
            </div>
            {errors.nome && <p className="text-xs text-destructive font-semibold mt-1">{errors.nome.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Categoria</Label>
            <Select
              defaultValue={initialData?.categoria ?? ''}
              onValueChange={v => setValue('categoria', v as any)}
            >
              <SelectTrigger className="h-11 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold">
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40">
                <SelectItem value="facial" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Facial</SelectItem>
                <SelectItem value="corporal" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Corporal</SelectItem>
                <SelectItem value="capilar" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Capilar</SelectItem>
                <SelectItem value="outros" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="descricao" className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Descrição <span className="text-muted-foreground/60 font-normal">(opcional)</span></Label>
          <Textarea
            id="descricao"
            placeholder="Descreva o procedimento, benefícios e detalhes para a equipe..."
            rows={3}
            {...register('descricao')}
            className="rounded-xl resize-none bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
          />
        </div>
      </Section>

      <Section title="Tempo e Valor" description="Duração do atendimento e precificação padrão" icon={Clock} accentColor="gold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="duracaoMinutos" className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Duração (minutos)</Label>
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-muted-foreground/60 transition-colors group-focus-within:text-teal">
                <Clock className="w-4 h-4" />
              </span>
              <Input
                id="duracaoMinutos"
                type="number"
                min={5}
                max={600}
                {...register('duracaoMinutos')}
                className="h-11 pl-10 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
              />
            </div>
            {/* Quick-set duration pills */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[15, 30, 45, 60, 90, 120].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setValue('duracaoMinutos', val)}
                  className={cn(
                    "text-[10px] font-black px-3 py-1 rounded-full border transition-all cursor-pointer select-none",
                    Number(watchDuracao) === val
                      ? "bg-gold-500/10 border-gold-500/40 text-gold-600 dark:text-gold-400 shadow-sm"
                      : "bg-muted/40 border-border/20 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {val} min
                </button>
              ))}
            </div>
            {errors.duracaoMinutos && <p className="text-xs text-destructive font-semibold mt-1">{errors.duracaoMinutos.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="valorPadrao" className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Valor padrão (R$) <span className="text-muted-foreground/60 font-normal">(opcional)</span></Label>
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-xs font-black text-muted-foreground/60 select-none transition-colors group-focus-within:text-teal">
                R$
              </span>
              <Input
                id="valorPadrao"
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                {...register('valorPadrao')}
                className="h-11 pl-9 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Informações Clínicas" description="Orientações, contraindicações e exigências clínicas" defaultOpen={false} icon={HeartPulse} accentColor="teal">
        <div className="flex flex-col gap-2">
          <Label className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Contraindicações gerais</Label>
          <div className="flex gap-2">
            <div className="relative flex items-center group flex-1">
              <span className="absolute left-3.5 text-muted-foreground/60 transition-colors group-focus-within:text-teal">
                <AlertCircle className="w-4 h-4" />
              </span>
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="ex: Gestação, Alergia a componentes..."
                className="h-11 pl-10 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              className="border-teal/20 bg-teal-500/5 hover:bg-teal hover:text-white transition-all duration-300 text-xs font-bold text-teal-600 dark:text-teal-400 cursor-pointer h-11 px-4 rounded-xl shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5 bg-muted/20 dark:bg-zinc-900/20 border border-border/10 p-2.5 rounded-xl">
              {tags.map(t => (
                <Badge key={t} className="bg-navy-500/10 dark:bg-navy-500/20 border border-navy-500/20 text-navy dark:text-navy-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 select-none transition-colors">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors cursor-pointer text-muted-foreground hover:bg-red-500/10 p-0.5 rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="preCuidados" className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Pré-cuidados <span className="text-muted-foreground/60 font-normal">(opcional)</span></Label>
          <Textarea
            id="preCuidados"
            placeholder="Orientações prévias e preparo do paciente antes do procedimento..."
            rows={3}
            {...register('preCuidados')}
            className="rounded-xl resize-none bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="posCuidados" className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Pós-cuidados <span className="text-muted-foreground/60 font-normal">(opcional)</span></Label>
          <Textarea
            id="posCuidados"
            placeholder="Orientações pós-procedimento, cuidados domiciliares e recuperação..."
            rows={3}
            {...register('posCuidados')}
            className="rounded-xl resize-none bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-teal-500/5 backdrop-blur-xs shadow-sm mt-2 transition-all hover:border-teal-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal border border-teal-500/20 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground">Exige anamnese específica</p>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">O paciente precisará preencher uma ficha clínica antes deste procedimento</p>
            </div>
          </div>
          <Switch
            checked={exigeAnamnese}
            onCheckedChange={v => setValue('exigeAnamneseEspecifica', v)}
            className="data-[state=checked]:bg-teal"
          />
        </div>
      </Section>

      <Section title="Profissionais Habilitados" description="Selecione quais profissionais podem realizar este procedimento" defaultOpen={false} icon={UserCheck} accentColor="navy">
        {professionals.length === 0 ? (
          <div className="text-center py-6 bg-muted/20 rounded-2xl border border-border/20">
            <AlertCircle className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-semibold">Nenhum profissional cadastrado ainda.</p>
          </div>
        ) : (
          <ScrollArea className="h-64 pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-0.5">
              {professionals.map(p => {
                const isSelected = selectedProfIds.includes(p.id)
                return (
                  <label
                    key={p.id}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer border transition-all duration-300 relative overflow-hidden group shadow-sm select-none',
                      isSelected
                        ? 'border-teal-500/40 bg-teal-500/5 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold shadow-md shadow-teal-500/5'
                        : 'border-border/40 bg-card/65 hover:border-teal-500/25 hover:bg-teal-500/3 dark:hover:bg-teal-500/5',
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleProfessional(p.id)}
                      className="rounded-md border-border/60 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 w-4.5 h-4.5 shrink-0"
                    />
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 border transition-all duration-300",
                      isSelected
                        ? "bg-teal bg-gradient-to-tr from-teal to-teal-600 text-white border-transparent"
                        : "bg-navy-500/10 text-navy dark:text-navy-200 border-navy-500/15"
                    )}>
                      {getInitials(p.nome)}
                    </div>
                    <span className="text-sm font-extrabold tracking-tight truncate flex-1">{p.nome}</span>
                  </label>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </Section>

      {isEdit && (
        <Section title="Status" description="Visibilidade e ativação do procedimento na plataforma" defaultOpen icon={Settings} accentColor="teal">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-gold-500/5 backdrop-blur-xs shadow-sm transition-all hover:border-gold-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold border border-gold-500/20 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground">Procedimento ativo</p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">Procedimentos inativos não aparecem no booking público ou agendamento rápido</p>
              </div>
            </div>
            <Switch
              checked={ativo}
              onCheckedChange={v => setValue('ativo', v)}
              className="data-[state=checked]:bg-gold"
            />
          </div>
        </Section>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/10">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border border-border/40 hover:bg-muted text-xs font-bold transition-all h-11 px-6 cursor-pointer"
          onClick={() => router.push('/dashboard/procedimentos')}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-navy via-navy-600 to-teal-500 hover:from-navy-600 hover:to-teal text-white font-extrabold shadow-md shadow-navy/20 hover:shadow-navy/30 px-6 h-11 transition-all duration-300 cursor-pointer border border-navy/20 uppercase tracking-widest text-xs font-black leading-none flex items-center justify-center"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin animate-infinite" />Salvando...</>
          ) : (
            isEdit ? 'Salvar alterações' : 'Criar procedimento'
          )}
        </Button>
      </div>
    </form>
  )
}

