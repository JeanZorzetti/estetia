'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Loader2 } from 'lucide-react'

interface Patient { id: string; nome: string; telefone: string | null }

export function NovoConsentimentoDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searching, setSearching] = useState(false)
  const [tipo, setTipo] = useState('LGPD_DADOS_SAUDE')
  const [versaoDocumento, setVersaoDocumento] = useState('')
  const [metodo, setMetodo] = useState('click')

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setPatients([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=8`)
      const data = await res.json()
      setPatients(data.patients ?? [])
    } finally { setSearching(false) }
  }, [])

  const submit = async () => {
    if (!selectedPatient || !versaoDocumento) return
    setSaving(true)
    try {
      const res = await fetch('/api/lgpd/consent-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: selectedPatient.id,
          tipo,
          versaoDocumento,
          evidencia: { metodo, evidencia: `Registrado manualmente em ${new Date().toISOString()}` },
        }),
      })
      if (res.ok) {
        setOpen(false)
        setSelectedPatient(null)
        setSearchQuery('')
        setVersaoDocumento('')
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Consentimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Consentimento</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Paciente *</Label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <p className="font-medium text-sm">{selectedPatient.nome}</p>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>Trocar</Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Buscar paciente..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); search(e.target.value) }}
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
                      </button>
                    ))}
                  </div>
                )}
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Tipo de consentimento *</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="LGPD_DADOS_SAUDE">LGPD — Dados de Saúde</SelectItem>
                <SelectItem value="USO_FOTO_MARKETING">Uso de Foto/Marketing</SelectItem>
                <SelectItem value="AUTORIZACAO_PROCEDIMENTO">Autorização de Procedimento</SelectItem>
                <SelectItem value="TERMO_RISCO">Termo de Risco</SelectItem>
                <SelectItem value="TERMO_MENOR_IDADE">Termo para Menor de Idade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Versão do documento (hash SHA-256 ou identificador) *</Label>
            <Input
              placeholder="Ex: v1.2-2026-05-15 ou hash SHA-256"
              value={versaoDocumento}
              onChange={e => setVersaoDocumento(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Método de coleta</Label>
            <Select value={metodo} onValueChange={setMetodo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="click">Clique (digital)</SelectItem>
                <SelectItem value="assinatura_digital">Assinatura digital</SelectItem>
                <SelectItem value="voz">Gravação de voz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={saving || !selectedPatient || !versaoDocumento}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Registrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
