'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Heart, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  integrationId: string
  integrationName: string
}

export function UpvoteButton({ integrationId, integrationName }: Props) {
  const [voted, setVoted] = useState(false)
  const [total, setTotal] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch(`/api/integrations/upvote?integrationId=${integrationId}`)
      .then((r) => r.json())
      .then((data) => {
        setTotal(data.total ?? 0)
        setVoted(data.voted ?? false)
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [integrationId])

  async function handleVote() {
    setLoading(true)
    try {
      const res = await fetch('/api/integrations/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId, notes: notes || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTotal(data.total)
      setVoted(true)
      toast.success(`Você está na lista de ${integrationName}!`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao votar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-blue-500/30 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="h-4 w-4 text-blue-500" />
          Quer essa integração?
        </CardTitle>
        <CardDescription>
          Demonstre interesse e priorizamos as integrações mais pedidas pelas clínicas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {fetching ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Carregando...
          </div>
        ) : voted ? (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-foreground">Você está na lista!</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {total > 1
                  ? `Mais ${total - 1} ${total - 1 === 1 ? 'clínica também solicitou' : 'clínicas também solicitaram'} essa integração.`
                  : 'Você é a primeira pessoa a pedir essa integração — vamos te avisar quando estiver pronta.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="upvote-notes" className="text-xs font-medium text-muted-foreground">
                Como você usaria essa integração? (opcional)
              </label>
              <Textarea
                id="upvote-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Para enviar recibos via PIX automaticamente..."
                rows={2}
                className="mt-1 resize-none"
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Button onClick={handleVote} disabled={loading} className="gap-1.5">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
                Quero acesso antecipado
              </Button>
              {total > 0 && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {total} {total === 1 ? 'clínica já solicitou' : 'clínicas já solicitaram'}
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
