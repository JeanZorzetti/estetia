'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import type { AgendaProfissional, AgendaSala, AgendaProcedure, AgendaSession } from './types'

interface Patient { id: string; nome: string; telefone: string | null }

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialDate: Date | null
  initialProfissionalId?: string
  profissionais: AgendaProfissional[]
  salas: AgendaSala[]
  procedures: AgendaProcedure[]
  onCreated: (session: AgendaSession) => void
}

export function NovaSessaoDialog({
  open, onOpenChange, initialDate, initialProfissionalId,
  profissionais, salas, procedures, onCreated,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [procedureId, setProcedureId] = useState<string>('')
  const [profissionalId, setProfissionalId] = useState<string>(initialProfissionalId ?? '')
  const [salaId, setSalaId] = useState<string>('')
  const [dataAgendada, setDataAgendada] = useState<string>('')
  const [duracaoMinutos, setDuracaoMinutos] = useState<number>(60)
  const [observacoes, setObservacoes] = useState<string>('')
  const [conflicts, setConflicts] = useState<{ pacienteNome: string; reason: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSelectedPatient(null)
    setSearchQuery('')
    setPatients([])
    setProcedureId('')
    setProfissionalId(initialProfissionalId ?? '')
    setSalaId('')
    setObservacoes('')
    setConflicts([])
    setError(null)
    setDuracaoMinutos(60)
    if (initialDate) {
      const local = new Date(initialDate.getTime() - initialDate.getTimezoneOffset() * 60_000)
      setDataAgendada(local.toISOString().slice(0, 16))
    }
  }, [open, initialDate, initialProfissionalId])

  const searchPatients = useCallback(async (q: string) => {
    if (!q.trim()) { setPatients([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=8`)
      const data = await res.json()
      setPatients(data.patients ?? [])
    } finally { setSearching(false) }
  }, [])

  // Update duration when procedure picked
  useEffect(() => {
    if (procedureId) {
      const p = procedures.find(p => p.id === procedureId)
      if (p?.duracaoMinutos) setDuracaoMinutos(p.duracaoMinutos)
    }
  }, [procedureId, procedures])

  // Check conflicts when key fields change
  useEffect(() => {
    if (!dataAgendada || (!profissionalId && !salaId)) {
      setConflicts([])
      return
    }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/agenda/conflicts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataAgendada: new Date(dataAgendada).toISOString(),
            duracaoMinutos,
            profissionalId: profissionalId || undefined,
            salaId: salaId || undefined,
          }),
          signal: ctrl.signal,
        })
        const data = await res.json()
        setConflicts(data.conflicts ?? [])
      } catch { /* ignore */ }
    }, 300)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [dataAgendada, duracaoMinutos, profissionalId, salaId])

  const submit = async () => {
    if (!selectedPatient || !dataAgendada) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/treatment-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: selectedPatient.id,
          procedureId: procedureId || null,
          profissionalId: profissionalId || null,
          salaId: salaId || null,
          dataAgendada: new Date(dataAgendada).toISOString(),
          duracaoMinutos,
          observacoes: observacoes || null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        onCreated(data.session)
        onOpenChange(false)
      } else {
        const data = await res.json()
        setError(data.error?.formErrors?.join(', ') ?? data.error ?? 'Falha ao criar sessão')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Sessão</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Paciente *</Label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">{selectedPatient.nome}</p>
                  {selectedPatient.telefone && (
                    <p className="text-xs text-muted-foreground">{selectedPatient.telefone}</p>
                  )}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>
                  Trocar
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Buscar paciente..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); searchPatients(e.target.value) }}
                />
                {patients.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    {patients.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
                        onClick={() => { setSelectedPatient(p); setPatients([]); setSearchQuery('') }}
                      >
                        <span className="font-medium">{p.nome}</span>
                        {p.telefone && <span className="text-muted-foreground ml-2 text-xs">{p.telefone}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Procedimento</Label>
            <Select value={procedureId || 'none'} onValueChange={v => setProcedureId(v === 'none' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Sem procedimento —</SelectItem>
                {procedures.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Profissional</Label>
              <Select value={profissionalId || 'none'} onValueChange={v => setProfissionalId(v === 'none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Nenhum —</SelectItem>
                  {profissionais.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Sala</Label>
              <Select value={salaId || 'none'} onValueChange={v => setSalaId(v === 'none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Nenhuma —</SelectItem>
                  {salas.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_120px] gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Data e hora *</Label>
              <Input
                type="datetime-local"
                value={dataAgendada}
                onChange={e => setDataAgendada(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Duração (min)</Label>
              <Input
                type="number"
                min="5"
                max="600"
                step="5"
                value={duracaoMinutos}
                onChange={e => setDuracaoMinutos(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Observações</Label>
            <Textarea
              placeholder="Observações sobre a sessão..."
              className="resize-none h-16"
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
            />
          </div>

          {conflicts.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-xs text-destructive">
                <p className="font-semibold mb-1">Conflito detectado:</p>
                {conflicts.map((c, i) => (
                  <p key={i}>· {c.pacienteNome} ({c.reason === 'PROFISSIONAL_OCUPADO' ? 'profissional ocupado' : 'sala ocupada'})</p>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button
              onClick={submit}
              disabled={saving || !selectedPatient || !dataAgendada || conflicts.length > 0}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar sessão
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
