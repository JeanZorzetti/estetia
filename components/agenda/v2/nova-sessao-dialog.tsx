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
import { Search, Loader2, AlertCircle, User } from 'lucide-react'
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
  onUpdated?: (session: AgendaSession) => void
  session?: AgendaSession | null
}

export function NovaSessaoDialog({
  open, onOpenChange, initialDate, initialProfissionalId,
  profissionais, salas, procedures, onCreated, onUpdated,
  session: editSession,
}: Props) {
  const isEdit = !!editSession

  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [procedureId, setProcedureId] = useState<string>('')
  const [profissionalId, setProfissionalId] = useState<string>('')
  const [salaId, setSalaId] = useState<string>('')
  const [dataAgendada, setDataAgendada] = useState<string>('')
  const [duracaoMinutos, setDuracaoMinutos] = useState<number>(60)
  const [observacoes, setObservacoes] = useState<string>('')
  const [conflicts, setConflicts] = useState<{ pacienteNome: string; reason: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setConflicts([])
    setError(null)
    setPatients([])
    setSearchQuery('')

    if (editSession) {
      // Modo edição: pré-preencher
      const { paciente, procedure } = editSession.treatment
      setSelectedPatient({ id: paciente.id, nome: paciente.nome, telefone: paciente.telefone })
      setProcedureId(procedure?.id ?? '')
      setProfissionalId(editSession.profissional?.id ?? '')
      setSalaId(editSession.sala?.id ?? '')
      setObservacoes(editSession.observacoes ?? '')
      setDuracaoMinutos(editSession.duracaoMinutos ?? 60)
      const dt = new Date(editSession.dataAgendada)
      const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60_000)
      setDataAgendada(local.toISOString().slice(0, 16))
    } else {
      // Modo criação
      setSelectedPatient(null)
      setProcedureId('')
      setProfissionalId(initialProfissionalId ?? '')
      setSalaId('')
      setObservacoes('')
      setDuracaoMinutos(60)
      if (initialDate) {
        const local = new Date(initialDate.getTime() - initialDate.getTimezoneOffset() * 60_000)
        setDataAgendada(local.toISOString().slice(0, 16))
      } else {
        setDataAgendada('')
      }
    }
  }, [open, editSession, initialDate, initialProfissionalId])

  const searchPatients = useCallback(async (q: string) => {
    if (!q.trim()) { setPatients([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=8`)
      const data = await res.json()
      setPatients(data.patients ?? [])
    } finally { setSearching(false) }
  }, [])

  useEffect(() => {
    if (procedureId) {
      const p = procedures.find(p => p.id === procedureId)
      if (p?.duracaoMinutos) setDuracaoMinutos(p.duracaoMinutos)
    }
  }, [procedureId, procedures])

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
            ignoreSessionId: editSession?.id,
          }),
          signal: ctrl.signal,
        })
        const data = await res.json()
        setConflicts(data.conflicts ?? [])
      } catch { /* ignore */ }
    }, 300)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [dataAgendada, duracaoMinutos, profissionalId, salaId, editSession?.id])

  const submit = async () => {
    if (!selectedPatient || !dataAgendada) return
    setSaving(true)
    setError(null)
    try {
      let res: Response
      if (isEdit && editSession) {
        res = await fetch(`/api/treatment-sessions/${editSession.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            procedureId: procedureId || null,
            profissionalId: profissionalId || null,
            salaId: salaId || null,
            dataAgendada: new Date(dataAgendada).toISOString(),
            duracaoMinutos,
            observacoes: observacoes || null,
          }),
        })
      } else {
        res = await fetch('/api/treatment-sessions', {
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
      }

      if (res.ok) {
        const data = await res.json()
        if (isEdit) {
          onUpdated?.(data.session)
        } else {
          onCreated(data.session)
        }
        onOpenChange(false)
      } else {
        const data = await res.json()
        setError(data.error?.formErrors?.join(', ') ?? data.error ?? 'Erro ao salvar sessão')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white border-navy/10">
        {/* Header */}
        <DialogHeader className="pb-2 border-b border-navy/10">
          <DialogTitle className="font-serif text-navy text-lg">
            {isEdit ? 'Editar Sessão' : 'Nova Sessão'}
          </DialogTitle>
          {isEdit && editSession && (
            <p className="text-xs text-slate-400 mt-1">
              Paciente: <span className="font-semibold text-navy">{editSession.treatment.paciente.nome}</span>
            </p>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">

          {/* Paciente — somente leitura em modo edição */}
          {isEdit && editSession ? (
            <div className="flex items-center gap-3 p-4 bg-navy-50 border border-navy/10 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-teal" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy">{editSession.treatment.paciente.nome}</p>
                {editSession.treatment.paciente.telefone && (
                  <p className="text-xs text-slate-400">{editSession.treatment.paciente.telefone}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Paciente *</Label>
              {selectedPatient ? (
                <div className="flex items-center justify-between p-4 bg-navy-50 border border-navy/10 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-navy">{selectedPatient.nome}</p>
                    {selectedPatient.telefone && (
                      <p className="text-xs text-slate-400">{selectedPatient.telefone}</p>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}
                    className="text-xs text-slate-400 hover:text-navy">
                    Trocar
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-9 border-navy/20 focus-visible:ring-teal"
                    placeholder="Buscar paciente por nome, telefone..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); searchPatients(e.target.value) }}
                  />
                  {patients.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-navy/10 rounded-2xl shadow-lg z-50 overflow-hidden">
                      {patients.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-navy-50 transition-colors text-sm border-b border-navy/5 last:border-0"
                          onClick={() => { setSelectedPatient(p); setPatients([]); setSearchQuery('') }}
                        >
                          <span className="font-semibold text-navy">{p.nome}</span>
                          {p.telefone && <span className="text-slate-400 ml-2 text-xs">{p.telefone}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />}
                </div>
              )}
            </div>
          )}

          {/* Procedimento */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Procedimento</Label>
            <Select value={procedureId || 'none'} onValueChange={v => setProcedureId(v === 'none' ? '' : v)}>
              <SelectTrigger className="border-navy/20 focus:ring-teal">
                <SelectValue placeholder="Selecionar procedimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Sem procedimento —</SelectItem>
                {procedures.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profissional + Sala */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Profissional</Label>
              <Select value={profissionalId || 'none'} onValueChange={v => setProfissionalId(v === 'none' ? '' : v)}>
                <SelectTrigger className="border-navy/20 focus:ring-teal">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Nenhum —</SelectItem>
                  {profissionais.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sala</Label>
              <Select value={salaId || 'none'} onValueChange={v => setSalaId(v === 'none' ? '' : v)}>
                <SelectTrigger className="border-navy/20 focus:ring-teal">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Nenhuma —</SelectItem>
                  {salas.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data/hora + Duração */}
          <div className="grid grid-cols-[1fr_110px] gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Data e hora *</Label>
              <Input
                type="datetime-local"
                className="border-navy/20 focus-visible:ring-teal"
                value={dataAgendada}
                onChange={e => setDataAgendada(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Duração (min)</Label>
              <Input
                type="number"
                min="5"
                max="600"
                step="5"
                className="border-navy/20 focus-visible:ring-teal"
                value={duracaoMinutos}
                onChange={e => setDuracaoMinutos(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Observações */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Observações</Label>
            <Textarea
              placeholder="Observações sobre a sessão..."
              className="resize-none h-16 border-navy/20 focus-visible:ring-teal"
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
            />
          </div>

          {/* Conflitos */}
          {conflicts.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs text-red-700">
                <p className="font-bold mb-1">Conflito detectado:</p>
                {conflicts.map((c, i) => (
                  <p key={i}>· {c.pacienteNome} ({c.reason === 'PROFISSIONAL_OCUPADO' ? 'profissional ocupado' : 'sala ocupada'})</p>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-2 border-t border-navy/10">
            <Button variant="outline" className="border-navy/20 text-navy hover:bg-navy-50 rounded-xl" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-navy text-white hover:bg-navy-600 rounded-xl font-bold"
              onClick={submit}
              disabled={saving || !selectedPatient || !dataAgendada || conflicts.length > 0}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Salvar alterações' : 'Criar sessão'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
