'use client'

import { useState, useCallback } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, Search } from 'lucide-react'

interface Patient { id: string; nome: string; telefone: string | null }

type ActionType = 'convert' | 'reward' | 'cancel'

interface Props {
  referralId: string
  action: ActionType
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess: () => void
}

export function ReferralActionDialog({ referralId, action, open, onOpenChange, onSuccess }: Props) {
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [recompensaTipo, setRecompensaTipo] = useState('pontos_fidelidade')
  const [recompensaValor, setRecompensaValor] = useState('')
  const [searching, setSearching] = useState(false)

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

  const handleSave = async () => {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {}
      if (action === 'convert') {
        body.status = 'CONVERTIDO'
        if (selectedPatient) body.indicadoId = selectedPatient.id
      } else if (action === 'reward') {
        body.status = 'RECOMPENSADO'
        body.recompensaTipo = recompensaTipo
        body.recompensaValor = recompensaValor ? Number(recompensaValor) : null
        body.recompensaConcedidaEm = new Date().toISOString()
      } else if (action === 'cancel') {
        body.status = 'CANCELADO'
      }

      await fetch(`/api/patient-referrals/${referralId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      onOpenChange(false)
      onSuccess()
    } finally {
      setSaving(false)
    }
  }

  const titles: Record<ActionType, string> = {
    convert: 'Marcar como Convertido',
    reward: 'Marcar como Recompensado',
    cancel: 'Cancelar Indicação',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titles[action]}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          {action === 'convert' && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Vincular paciente cadastrado (opcional)</Label>
              {selectedPatient ? (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm font-medium">{selectedPatient.nome}</p>
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
          )}

          {action === 'reward' && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">Tipo de recompensa</Label>
                <Select value={recompensaTipo} onValueChange={setRecompensaTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pontos_fidelidade">Pontos fidelidade</SelectItem>
                    <SelectItem value="desconto_proximo">Desconto próxima sessão</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">Valor da recompensa</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ex: 100"
                  value={recompensaValor}
                  onChange={e => setRecompensaValor(e.target.value)}
                />
              </div>
            </>
          )}

          {action === 'cancel' && (
            <p className="text-sm text-muted-foreground">Esta indicação será marcada como cancelada. Esta ação não pode ser desfeita facilmente.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              variant={action === 'cancel' ? 'destructive' : 'default'}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
