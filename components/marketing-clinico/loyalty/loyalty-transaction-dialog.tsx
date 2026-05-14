'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoyaltyTransactionCreateSchema, type LoyaltyTransactionCreateInput } from '@/lib/loyalty/schema'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2, Search } from 'lucide-react'

interface Patient { id: string; nome: string; telefone: string | null }

interface Props {
  onSuccess?: () => void
}

export function LoyaltyTransactionDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searching, setSearching] = useState(false)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<LoyaltyTransactionCreateInput>({
    resolver: zodResolver(LoyaltyTransactionCreateSchema) as any,
    defaultValues: { tipo: 'GANHO', pontos: 100 },
  })

  const tipo = watch('tipo')

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

  const onSubmit = async (data: LoyaltyTransactionCreateInput) => {
    if (!selectedPatient) return
    setSaving(true)
    try {
      const res = await fetch('/api/loyalty/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, patientId: selectedPatient.id }),
      })
      if (res.ok) {
        setOpen(false)
        reset()
        setSelectedPatient(null)
        setSearchQuery('')
        setPatients([])
        onSuccess?.()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Lançar pontos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lançar Pontos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {/* Patient search */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Paciente *</Label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium">{selectedPatient.nome}</p>
                  {selectedPatient.telefone && <p className="text-xs text-muted-foreground">{selectedPatient.telefone}</p>}
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
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    searchPatients(e.target.value)
                  }}
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

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Pontos *</Label>
              <Input type="number" min="1" {...register('pontos')} />
              {errors.pontos && <p className="text-destructive text-xs">{errors.pontos.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Tipo *</Label>
              <Select value={tipo} onValueChange={v => setValue('tipo', v as 'GANHO' | 'RESGATE' | 'EXPIRACAO')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GANHO">Ganho</SelectItem>
                  <SelectItem value="RESGATE">Resgate</SelectItem>
                  <SelectItem value="EXPIRACAO">Expiração</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Descrição</Label>
            <Textarea
              placeholder="Ex: Bônus campanha de verão..."
              className="resize-none h-20"
              {...register('descricao')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving || !selectedPatient}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Lançar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
