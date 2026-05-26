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
import { Plus, Search, Loader2, User, Landmark, Hash, FileSignature } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Patient { id: string; nome: string; telefone: string | null }

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

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
        <Button className="rounded-xl bg-gradient-to-r from-navy via-navy-600 to-teal-500 hover:from-navy-600 hover:to-teal text-white font-extrabold shadow-md shadow-navy/20 hover:shadow-navy/30 px-5 h-11 transition-all duration-300 cursor-pointer border border-navy/20 uppercase tracking-widest text-[10px] font-black leading-none flex items-center justify-center">
          <Plus className="w-4.5 h-4.5 mr-1.5" />
          Novo Consentimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-3xl border border-border/40 bg-card/95 backdrop-blur-md shadow-xl p-6">
        <DialogHeader className="border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal flex items-center justify-center shrink-0 border border-teal-500/20">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-black tracking-tight text-foreground uppercase">Registrar Consentimento</DialogTitle>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">Associe um novo termo de conformidade LGPD a um paciente</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4.5 mt-4">
          {/* Patient Selector */}
          <div className="flex flex-col gap-2">
            <Label className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Paciente *</Label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3.5 bg-teal-500/5 rounded-xl border border-teal-500/20 shadow-inner group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal flex items-center justify-center shrink-0 border border-teal-500/20 font-extrabold text-xs">
                    {getInitials(selectedPatient.nome)}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-teal-700 dark:text-teal-400 leading-none">{selectedPatient.nome}</p>
                    {selectedPatient.telefone && (
                      <p className="text-[10px] text-muted-foreground/80 font-semibold mt-1">{selectedPatient.telefone}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-8 text-xs font-black text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all cursor-pointer px-3"
                  onClick={() => setSelectedPatient(null)}
                >
                  Trocar
                </Button>
              </div>
            ) : (
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 transition-colors group-focus-within:text-teal" />
                <Input
                  className="pl-10 h-11 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
                  placeholder="Buscar paciente por nome ou telefone..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); search(e.target.value) }}
                />
                {patients.length > 0 && (
                  <div className="absolute top-full mt-1.5 w-full bg-card/95 border border-border/40 rounded-xl shadow-lg z-50 overflow-hidden backdrop-blur-md">
                    {patients.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-teal-500/5 hover:text-teal-600 border-b border-border/5 transition-all text-xs font-bold flex flex-col gap-0.5 cursor-pointer"
                        onClick={() => { setSelectedPatient(p); setPatients([]); setSearchQuery('') }}
                      >
                        <span className="font-extrabold text-foreground">{p.nome}</span>
                        {p.telefone && <span className="text-[9px] text-muted-foreground/80 font-normal">{p.telefone}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {searching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 animate-spin text-muted-foreground" />}
              </div>
            )}
          </div>

          {/* Consent Type */}
          <div className="flex flex-col gap-2">
            <Label className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Tipo de consentimento *</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="h-11 rounded-xl bg-card/60 border-border/40 focus:ring-teal-500/10 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40">
                <SelectItem value="LGPD_DADOS_SAUDE" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">LGPD — Dados de Saúde</SelectItem>
                <SelectItem value="USO_FOTO_MARKETING" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Uso de Foto/Marketing</SelectItem>
                <SelectItem value="AUTORIZACAO_PROCEDIMENTO" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Autorização de Procedimento</SelectItem>
                <SelectItem value="TERMO_RISCO" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Termo de Risco</SelectItem>
                <SelectItem value="TERMO_MENOR_IDADE" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Termo para Menor de Idade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Document Version */}
          <div className="flex flex-col gap-2">
            <Label className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Versão do documento (ID ou SHA-256) *</Label>
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-muted-foreground/60 transition-colors group-focus-within:text-teal">
                <Hash className="w-4 h-4" />
              </span>
              <Input
                placeholder="Ex: v1.2-2026-05-15 ou hash SHA-256"
                value={versaoDocumento}
                onChange={e => setVersaoDocumento(e.target.value)}
                className="h-11 pl-10 rounded-xl bg-card/60 border-border/40 focus-visible:border-teal-500/60 focus-visible:ring-[3px] focus-visible:ring-teal-500/10 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Acquisition Method */}
          <div className="flex flex-col gap-2">
            <Label className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest leading-none">Método de coleta</Label>
            <Select value={metodo} onValueChange={setMetodo}>
              <SelectTrigger className="h-11 rounded-xl bg-card/60 border-border/40 focus:ring-teal-500/10 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40">
                <SelectItem value="click" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Clique (digital)</SelectItem>
                <SelectItem value="assinatura_digital" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Assinatura digital</SelectItem>
                <SelectItem value="voz" className="focus:bg-teal-500/10 focus:text-teal-600 rounded-lg">Gravação de voz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border/40 hover:bg-muted text-xs font-bold transition-all h-11 px-6 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={submit}
              disabled={saving || !selectedPatient || !versaoDocumento}
              className="rounded-xl bg-gradient-to-r from-navy via-navy-600 to-teal-500 hover:from-navy-600 hover:to-teal text-white font-extrabold shadow-md shadow-navy/20 hover:shadow-navy/30 px-6 h-11 transition-all duration-300 cursor-pointer border border-navy/20 uppercase tracking-widest text-xs font-black leading-none flex items-center justify-center"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registrando...</>
              ) : (
                'Registrar'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

