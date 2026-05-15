'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, UserX, Loader2, AlertTriangle } from 'lucide-react'

interface Patient { id: string; nome: string; telefone: string | null }

export function AnonimizarPacienteSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searching, setSearching] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setPatients([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=8`)
      const data = await res.json()
      setPatients(data.patients ?? [])
    } finally { setSearching(false) }
  }, [])

  const anonymize = async () => {
    if (!selectedPatient || confirmText !== 'ANONIMIZAR') return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/lgpd/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteId: selectedPatient.id }),
      })
      if (res.ok) {
        setConfirmOpen(false)
        setSelectedPatient(null)
        setConfirmText('')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Erro ao anonimizar')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Anonimizar Paciente</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {selectedPatient ? (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">{selectedPatient.nome}</p>
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
                placeholder="Buscar paciente a anonimizar..."
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

          <Button
            variant="destructive"
            disabled={!selectedPatient}
            onClick={() => setConfirmOpen(true)}
            className="self-start"
          >
            <UserX className="w-4 h-4 mr-2" />
            Anonimizar paciente selecionado
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirmação irreversível
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm font-semibold text-destructive mb-1">Esta ação é irreversível.</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Os dados identificáveis de <strong>{selectedPatient?.nome}</strong> (nome, CPF, contato) serão substituídos por valores anonimizados.
                Prontuários clínicos são preservados conforme CFM Res. 1.821/2007 (retenção de 20 anos).
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                Digite <span className="font-mono font-bold text-destructive">ANONIMIZAR</span> para confirmar:
              </Label>
              <Input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="ANONIMIZAR"
                className="font-mono"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setConfirmOpen(false); setConfirmText('') }}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                disabled={confirmText !== 'ANONIMIZAR' || submitting}
                onClick={anonymize}
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Anonimizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
