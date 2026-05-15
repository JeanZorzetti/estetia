'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuiaTissCreateSchema, type GuiaTissCreateInput } from '@/lib/financeiro/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, Search } from 'lucide-react'

interface Operadora { id: string; nome: string }
interface Patient { id: string; nome: string; telefone: string | null }

interface Props {
  operadoras: Operadora[]
  initialData?: GuiaTissCreateInput & { id?: string }
  initialPatient?: { id: string; nome: string }
}

export function GuiaTissForm({ operadoras, initialData, initialPatient }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    initialPatient ? { ...initialPatient, telefone: null } : null,
  )
  const [searching, setSearching] = useState(false)
  const isEdit = !!initialData?.id

  const { register, handleSubmit, control, formState: { errors } } = useForm<GuiaTissCreateInput>({
    resolver: zodResolver(GuiaTissCreateSchema) as any,
    defaultValues: {
      operadoraId: initialData?.operadoraId ?? operadoras[0]?.id ?? '',
      pacienteId: initialData?.pacienteId ?? '',
      tipo: initialData?.tipo ?? 'CONSULTA',
      numeroGuia: initialData?.numeroGuia ?? '',
      codigoTuss: initialData?.codigoTuss ?? '',
      valorProcedimento: initialData?.valorProcedimento ?? null,
      valorTotal: initialData?.valorTotal ?? null,
      dataExecucao: initialData?.dataExecucao ?? null,
    },
  })

  const searchPatients = useCallback(async (q: string) => {
    if (!q.trim()) { setPatients([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=8`)
      const data = await res.json()
      setPatients(data.patients ?? [])
    } finally {
      setSearching(false)
    }
  }, [])

  const onSubmit = async (data: GuiaTissCreateInput) => {
    if (!selectedPatient) return
    setSaving(true)
    try {
      const url = isEdit ? `/api/guias-tiss/${initialData!.id}` : '/api/guias-tiss'
      const method = isEdit ? 'PATCH' : 'POST'
      const payload = {
        ...data,
        pacienteId: selectedPatient.id,
        dataExecucao: data.dataExecucao ? new Date(data.dataExecucao).toISOString() : null,
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/dashboard/financeiro/guias-tiss')
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Paciente e Operadora</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Paciente *</Label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">{selectedPatient.nome}</p>
                  {selectedPatient.telefone && <p className="text-xs text-muted-foreground">{selectedPatient.telefone}</p>}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>Trocar</Button>
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
            <Label className="text-sm font-medium">Operadora *</Label>
            <Controller
              name="operadoraId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {operadoras.map(op => (
                      <SelectItem key={op.id} value={op.id}>{op.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Dados da Guia</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Tipo de guia *</Label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONSULTA">Consulta</SelectItem>
                      <SelectItem value="SADT">SADT</SelectItem>
                      <SelectItem value="SP_SADT">SP-SADT</SelectItem>
                      <SelectItem value="INTERNACAO">Internação</SelectItem>
                      <SelectItem value="HONORARIOS">Honorários</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Número da guia</Label>
              <Input placeholder="Auto se vazio" {...register('numeroGuia')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Código TUSS</Label>
              <Input placeholder="Ex: 10101012" {...register('codigoTuss')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Data de execução</Label>
              <Input type="date" {...register('dataExecucao')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Valor procedimento (R$)</Label>
              <Input type="number" step="0.01" min="0" placeholder="0,00" {...register('valorProcedimento')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Valor total (R$)</Label>
              <Input type="number" step="0.01" min="0" placeholder="0,00" {...register('valorTotal')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={saving || !selectedPatient}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Salvar alterações' : 'Criar guia'}
        </Button>
      </div>
    </form>
  )
}
