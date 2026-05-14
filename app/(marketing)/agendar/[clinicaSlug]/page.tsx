'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, User, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { use } from 'react'

interface Procedure {
  id: string
  nome: string
  categoria: string
  duracaoMinutos: number
  valorPadrao: number | null
}

interface Professional {
  id: string
  nome: string
  especialidades: string[]
}

interface Slot {
  time: string
  available: boolean
}

type Step = 'procedimento' | 'profissional' | 'data' | 'horario' | 'dados' | 'confirmacao'

export default function PublicBookingPage({
  params,
}: {
  params: Promise<{ clinicaSlug: string }>
}) {
  const { clinicaSlug } = use(params)

  const [step, setStep] = useState<Step>('procedimento')
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [slots, setSlots] = useState<Slot[]>([])

  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [pacienteNome, setPacienteNome] = useState('')
  const [pacienteTelefone, setPacienteTelefone] = useState('')
  const [pacienteEmail, setPacienteEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)
  const [orgName, setOrgName] = useState('')

  // Load org data and procedures
  useEffect(() => {
    fetch(`/api/booking/${clinicaSlug}/procedures`)
      .then(r => r.json())
      .then(data => {
        setProcedures(data.procedures ?? [])
        setOrgName(data.orgName ?? '')
      })
      .catch(() => {})
  }, [clinicaSlug])

  // Load professionals when procedure selected
  useEffect(() => {
    if (!selectedProcedure) return
    fetch(`/api/booking/${clinicaSlug}/professionals?procedureId=${selectedProcedure.id}`)
      .then(r => r.json())
      .then(data => setProfessionals(data.professionals ?? []))
      .catch(() => {})
  }, [selectedProcedure, clinicaSlug])

  // Load slots when date + professional selected
  useEffect(() => {
    if (!selectedDate || !selectedProfessional || !selectedProcedure) return
    fetch(`/api/booking/${clinicaSlug}/slots?date=${selectedDate}&profissionalId=${selectedProfessional.id}&duracaoMinutos=${selectedProcedure.duracaoMinutos}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots ?? []))
      .catch(() => {})
  }, [selectedDate, selectedProfessional, selectedProcedure, clinicaSlug])

  const handleBook = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/booking/${clinicaSlug}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureId: selectedProcedure?.id,
          profissionalId: selectedProfessional?.id,
          dataAgendada: selectedSlot,
          pacienteNome,
          pacienteTelefone,
          pacienteEmail,
        }),
      })
      if (res.ok) setBooked(true)
    } finally {
      setLoading(false)
    }
  }

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    if (d.getDay() === 0) return null // skip Sunday
    return d.toISOString().split('T')[0]
  }).filter(Boolean) as string[]

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  }

  const formatTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    })
  }

  if (booked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold">Agendamento Confirmado!</h2>
            <p className="text-muted-foreground">
              {pacienteNome}, seu {selectedProcedure?.nome} foi agendado para{' '}
              <strong>{formatDate(selectedDate)}</strong> às{' '}
              <strong>{formatTime(selectedSlot)}</strong> com {selectedProfessional?.nome}.
            </p>
            <p className="text-sm text-muted-foreground">
              Você receberá uma confirmação via WhatsApp em {pacienteTelefone}.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">{orgName || 'Agendar Procedimento'}</h1>
          <p className="text-sm text-muted-foreground">Escolha o procedimento, profissional e horário</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-1">
          {(['procedimento', 'profissional', 'data', 'horario', 'dados'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ['procedimento', 'profissional', 'data', 'horario', 'dados', 'confirmacao'].indexOf(step) >= i
                  ? 'bg-rose-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step: Procedimento */}
        {step === 'procedimento' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#d6dff0] text-[#0a1f3d] text-xs flex items-center justify-center font-bold">1</span>
                Qual procedimento?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {procedures.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Carregando procedimentos...</p>
              )}
              {procedures.map(proc => (
                <button
                  key={proc.id}
                  onClick={() => { setSelectedProcedure(proc); setStep('profissional') }}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-[#eef2f9] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{proc.nome}</p>
                      <p className="text-xs text-muted-foreground">{proc.duracaoMinutos} min · {proc.categoria}</p>
                    </div>
                    {proc.valorPadrao && (
                      <Badge variant="secondary">
                        {proc.valorPadrao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step: Profissional */}
        {step === 'profissional' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <button onClick={() => setStep('procedimento')} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="w-6 h-6 rounded-full bg-[#d6dff0] text-[#0a1f3d] text-xs flex items-center justify-center font-bold">2</span>
                Com quem?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {professionals.map(prof => (
                <button
                  key={prof.id}
                  onClick={() => { setSelectedProfessional(prof); setStep('data') }}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-[#eef2f9] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#d6dff0] flex items-center justify-center">
                      <User className="h-4 w-4 text-[#0a1f3d]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{prof.nome}</p>
                      {prof.especialidades.length > 0 && (
                        <p className="text-xs text-muted-foreground">{prof.especialidades.slice(0, 2).join(', ')}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step: Data */}
        {step === 'data' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <button onClick={() => setStep('profissional')} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="w-6 h-6 rounded-full bg-[#d6dff0] text-[#0a1f3d] text-xs flex items-center justify-center font-bold">3</span>
                Qual data?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setStep('horario') }}
                    className={`p-2 rounded-lg border text-center text-sm transition-colors ${
                      selectedDate === date
                        ? 'border-rose-400 bg-[#eef2f9] text-rose-700'
                        : 'border-gray-200 hover:border-rose-300 hover:bg-[#eef2f9]'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Horario */}
        {step === 'horario' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <button onClick={() => setStep('data')} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="w-6 h-6 rounded-full bg-[#d6dff0] text-[#0a1f3d] text-xs flex items-center justify-center font-bold">4</span>
                Qual horário?
              </CardTitle>
            </CardHeader>
            <CardContent>
              {slots.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Carregando horários...</p>
              )}
              <div className="grid grid-cols-4 gap-2">
                {slots.filter(s => s.available).map(slot => (
                  <button
                    key={slot.time}
                    onClick={() => { setSelectedSlot(slot.time); setStep('dados') }}
                    className={`p-2 rounded-lg border text-sm text-center transition-colors ${
                      selectedSlot === slot.time
                        ? 'border-rose-400 bg-[#eef2f9] text-rose-700'
                        : 'border-gray-200 hover:border-rose-300 hover:bg-[#eef2f9]'
                    }`}
                  >
                    <Clock className="h-3 w-3 mx-auto mb-0.5" />
                    {formatTime(slot.time)}
                  </button>
                ))}
                {slots.length > 0 && slots.filter(s => s.available).length === 0 && (
                  <p className="col-span-4 text-sm text-center text-muted-foreground py-4">
                    Sem horários disponíveis neste dia.{' '}
                    <button onClick={() => setStep('data')} className="text-[#0a1f3d] underline">Escolher outra data</button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Dados do paciente */}
        {step === 'dados' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <button onClick={() => setStep('horario')} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="w-6 h-6 rounded-full bg-[#d6dff0] text-[#0a1f3d] text-xs flex items-center justify-center font-bold">5</span>
                Seus dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  value={pacienteNome}
                  onChange={e => setPacienteNome(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tel">WhatsApp *</Label>
                <Input
                  id="tel"
                  value={pacienteTelefone}
                  onChange={e => setPacienteTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  type="tel"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  value={pacienteEmail}
                  onChange={e => setPacienteEmail(e.target.value)}
                  placeholder="seu@email.com"
                  type="email"
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-[#eef2f9] border border-rose-100 p-3 space-y-1 text-sm">
                <p><strong>Procedimento:</strong> {selectedProcedure?.nome}</p>
                <p><strong>Profissional:</strong> {selectedProfessional?.nome}</p>
                <p><strong>Data:</strong> {formatDate(selectedDate)} às {formatTime(selectedSlot)}</p>
              </div>

              <Button
                className="w-full bg-[#0a1f3d] hover:bg-[#0d2547]"
                disabled={!pacienteNome || !pacienteTelefone || loading}
                onClick={handleBook}
              >
                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Você receberá uma confirmação via WhatsApp
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
