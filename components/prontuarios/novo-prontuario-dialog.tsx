'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, User, ChevronRight, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateMedicalRecordSchema, type CreateMedicalRecordInput } from '@/lib/prontuarios/schema'

interface Patient {
  id: string
  nome: string
  telefone: string | null
  email: string | null
}

interface Professional {
  id: string
  nome: string
}

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function NovoProntuarioDialog({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Patient[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CreateMedicalRecordInput>({
    resolver: zodResolver(CreateMedicalRecordSchema),
    defaultValues: {
      dataAtendimento: new Date().toISOString().slice(0, 16),
    },
  })

  // Debounced patient search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/patients?q=${encodeURIComponent(query)}&limit=10`)
        const data = await res.json()
        setResults(data.patients ?? [])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Load professionals when step 2 opens
  useEffect(() => {
    if (step !== 2) return
    fetch('/api/professionals')
      .then(r => r.json())
      .then(d => setProfessionals(d.professionals ?? []))
      .catch(() => {})
  }, [step])

  const selectPatient = useCallback((p: Patient) => {
    setSelectedPatient(p)
    setValue('pacienteId', p.id)
    setStep(2)
  }, [setValue])

  const handleClose = useCallback((v: boolean) => {
    if (!v) {
      setStep(1)
      setQuery('')
      setResults([])
      setSelectedPatient(null)
      reset({ dataAtendimento: new Date().toISOString().slice(0, 16) })
    }
    onOpenChange(v)
  }, [onOpenChange, reset])

  const onSubmit = async (data: CreateMedicalRecordInput) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        profissionalId: data.profissionalId || undefined,
        dataAtendimento: data.dataAtendimento
          ? new Date(data.dataAtendimento).toISOString()
          : new Date().toISOString(),
      }
      const res = await fetch('/api/clinica/prontuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      handleClose(false)
      router.refresh()
    } catch {
      // keep form open on error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {step === 1 ? 'Selecionar paciente' : 'Novo prontuário'}
          </DialogTitle>
          {step === 2 && selectedPatient && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {selectedPatient.nome}
              </div>
              <button
                type="button"
                onClick={() => { setStep(1); setSelectedPatient(null) }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Trocar
              </button>
            </div>
          )}
        </DialogHeader>

        {/* Step 1 — Patient search */}
        {step === 1 && (
          <div className="flex flex-col gap-3 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail ou telefone..."
                className="pl-9"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            {searching && (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm">Buscando...</span>
              </div>
            )}

            {!searching && results.length > 0 && (
              <div className="flex flex-col gap-1">
                {results.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPatient(p)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-left',
                      'border border-border/50 hover:border-primary/50 hover:bg-primary/5',
                      'transition-all duration-150 group'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.telefone || p.email || 'Sem contato'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {!searching && query.trim() && results.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
                <p className="text-sm">Nenhum paciente encontrado</p>
                <p className="text-xs mt-1">Tente outro nome ou cadastre um novo paciente</p>
              </div>
            )}

            {!query.trim() && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Digite para buscar um paciente
              </p>
            )}
          </div>
        )}

        {/* Step 2 — Clinical form */}
        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
            <input type="hidden" {...register('pacienteId')} />

            {/* Atendimento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dataAtendimento">Data do atendimento</Label>
                <Input
                  id="dataAtendimento"
                  type="datetime-local"
                  {...register('dataAtendimento')}
                />
                {errors.dataAtendimento && (
                  <p className="text-xs text-destructive">{errors.dataAtendimento.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Profissional</Label>
                <Select onValueChange={v => setValue('profissionalId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clínica */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="queixaPrincipal">Queixa principal</Label>
              <Textarea
                id="queixaPrincipal"
                placeholder="Descreva a queixa principal do paciente..."
                rows={2}
                {...register('queixaPrincipal')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="historiaClinica">História clínica <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Textarea
                id="historiaClinica"
                placeholder="História clínica relevante..."
                rows={2}
                {...register('historiaClinica')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avaliacaoFisica">Avaliação física <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Textarea
                id="avaliacaoFisica"
                placeholder="Achados do exame físico..."
                rows={2}
                {...register('avaliacaoFisica')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hipoteseDiagnostica">Hipótese diagnóstica <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Textarea
                id="hipoteseDiagnostica"
                placeholder="Hipótese diagnóstica..."
                rows={2}
                {...register('hipoteseDiagnostica')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="planoTratamento">Plano de tratamento <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Textarea
                id="planoTratamento"
                placeholder="Plano terapêutico proposto..."
                rows={2}
                {...register('planoTratamento')}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleClose(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar prontuário'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
