'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Loader2, CheckCircle2 } from 'lucide-react'

interface Patient { id: string; nome: string; telefone: string | null }

export function ExportPacienteSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searching, setSearching] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [success, setSuccess] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setPatients([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=8`)
      const data = await res.json()
      setPatients(data.patients ?? [])
    } finally { setSearching(false) }
  }, [])

  const exportData = async () => {
    if (!selectedPatient) return
    setExporting(true)
    setSuccess(false)
    try {
      const res = await fetch(`/api/lgpd/export?pacienteId=${selectedPatient.id}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lgpd-export-${selectedPatient.nome.replace(/\s+/g, '-')}-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Solicitar Exportação</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          LGPD Art. 18, II — direito à portabilidade. Gera JSON completo com prontuário, anamneses, consentimentos e histórico de tratamento.
        </p>

        {selectedPatient ? (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
            <div>
              <p className="font-medium text-sm">{selectedPatient.nome}</p>
              {selectedPatient.telefone && <p className="text-xs text-muted-foreground">{selectedPatient.telefone}</p>}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedPatient(null); setSuccess(false) }}>
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
                    {p.telefone && <span className="text-muted-foreground ml-2 text-xs">{p.telefone}</span>}
                  </button>
                ))}
              </div>
            )}
            {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button onClick={exportData} disabled={!selectedPatient || exporting}>
            {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Gerar export JSON
          </Button>
          {success && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Exportação baixada e registrada no audit log
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
