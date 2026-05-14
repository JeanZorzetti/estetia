'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatientReferralCreateSchema, type PatientReferralCreateInput } from '@/lib/patient-referrals/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Patient { id: string; nome: string; telefone: string | null }

export function ReferralForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedIndicador, setSelectedIndicador] = useState<Patient | null>(null)
  const [searching, setSearching] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PatientReferralCreateInput>({
    resolver: zodResolver(PatientReferralCreateSchema) as any,
    defaultValues: { recompensaTipo: 'pontos_fidelidade' },
  })

  const recompensaTipo = watch('recompensaTipo')

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

  const onSubmit = async (data: PatientReferralCreateInput) => {
    if (!selectedIndicador) return
    setSaving(true)
    try {
      const res = await fetch('/api/patient-referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, indicadorId: selectedIndicador.id }),
      })
      if (res.ok) {
        router.push('/dashboard/marketing-clinico/indicacoes')
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Indicador */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quem indicou</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedIndicador ? (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div>
                <p className="font-medium">{selectedIndicador.nome}</p>
                {selectedIndicador.telefone && <p className="text-sm text-muted-foreground">{selectedIndicador.telefone}</p>}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedIndicador(null)}>Trocar</Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar paciente indicador..."
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
                      onClick={() => { setSelectedIndicador(p); setPatients([]); setSearchQuery('') }}
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
        </CardContent>
      </Card>

      {/* Indicado (pré-cadastro) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quem foi indicado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Nome</Label>
              <Input placeholder="Nome do indicado" {...register('nomeIndicado')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Telefone</Label>
              <Input placeholder="(11) 99999-9999" {...register('telefoneIndicado')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recompensa */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recompensa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Tipo</Label>
              <Select
                value={recompensaTipo ?? ''}
                onValueChange={v => setValue('recompensaTipo', v as 'pontos_fidelidade' | 'desconto_proximo' | 'outro')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pontos_fidelidade">Pontos fidelidade</SelectItem>
                  <SelectItem value="desconto_proximo">Desconto próxima sessão</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Valor</Label>
              <Input type="number" min="0" placeholder="Ex: 100" {...register('recompensaValor')} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Observações</Label>
            <Textarea placeholder="Observações opcionais..." className="resize-none h-20" {...register('observacoes')} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={saving || !selectedIndicador}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar indicação
        </Button>
      </div>
    </form>
  )
}
