'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Loader2, MessageSquare } from 'lucide-react'

interface Props {
  guiaId: string
}

export function RespostaDialog({ guiaId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('AUTORIZADA')
  const [xmlResposta, setXmlResposta] = useState('')
  const [motivoGlosa, setMotivoGlosa] = useState('')

  const submit = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/guias-tiss/${guiaId}/resposta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, xmlResposta, motivoGlosa }),
      })
      if (res.ok) {
        setOpen(false)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Registrar resposta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar resposta da operadora</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Novo status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTORIZADA">Autorizada</SelectItem>
                <SelectItem value="NEGADA">Negada</SelectItem>
                <SelectItem value="GLOSADA">Glosada</SelectItem>
                <SelectItem value="PAGA">Paga</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">XML de resposta (opcional)</Label>
            <Textarea
              placeholder="Cole o XML retornado pela operadora..."
              className="resize-none h-32 font-mono text-xs"
              value={xmlResposta}
              onChange={e => setXmlResposta(e.target.value)}
            />
          </div>

          {(status === 'GLOSADA' || status === 'NEGADA') && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Motivo</Label>
              <Textarea
                placeholder="Motivo da glosa/negação..."
                className="resize-none h-20"
                value={motivoGlosa}
                onChange={e => setMotivoGlosa(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar resposta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
