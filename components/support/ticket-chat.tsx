'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Send, Loader2, Lock, Image as ImageIcon, File, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AttachmentUpload } from './attachment-upload'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MessageAuthor {
  id: string
  name?: string | null
  email: string
  isRoiLabsStaff?: boolean
}

interface Attachment {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  signedUrl?: string
  storageKey: string
}

interface Message {
  id: string
  authorType: 'USER' | 'STAFF' | 'SYSTEM'
  authorId?: string | null
  author?: MessageAuthor | null
  content: string
  isInternal: boolean
  createdAt: Date | string
  attachments?: Attachment[]
}

interface TicketChatProps {
  ticketId: string
  initialMessages: Message[]
  currentUserId: string
  isStaff?: boolean
  ticketStatus: string
}

function MessageBubble({ message, currentUserId }: { message: Message; currentUserId: string }) {
  const isOwn = message.authorId === currentUserId
  const isSystem = message.authorType === 'SYSTEM'
  const isStaff = message.authorType === 'STAFF'
  const authorName = message.author?.name || message.author?.email || 'Sistema'
  const initial = authorName.charAt(0).toUpperCase()
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: ptBR })

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 relative z-10">
        <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 border border-border/30 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-3 mb-5 relative z-10', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar with dynamic double-ring offset status ring */}
      <Avatar className={cn(
        'h-8 w-8 flex-shrink-0 mt-0.5 ring-2 ring-offset-2 transition-all duration-300 shadow-sm',
        isOwn 
          ? 'ring-indigo-500/30 ring-offset-background' 
          : isStaff 
            ? 'ring-indigo-500/40 ring-offset-background' 
            : 'ring-zinc-400/20 ring-offset-background'
      )}>
        <AvatarFallback className={cn(
          'text-xs font-bold transition-colors',
          isOwn
            ? 'bg-indigo-600 text-white'
            : isStaff 
              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
        )}>
          {initial}
        </AvatarFallback>
      </Avatar>

      <div className={cn('flex flex-col max-w-[75%]', isOwn ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-bold text-foreground/80">{authorName}</span>
          {isStaff && (
            <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 h-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 rounded-md">
              Suporte
            </Badge>
          )}
          {message.isInternal && (
            <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 rounded-md">
              <Lock className="h-2.5 w-2.5 mr-0.5" />
              Interna
            </Badge>
          )}
          <span className="text-[10px] font-medium text-muted-foreground">{timeAgo}</span>
        </div>

        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200',
            isOwn
              ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-tr-sm shadow-indigo-500/5'
              : 'bg-muted/70 backdrop-blur-sm border border-border/30 text-foreground rounded-tl-sm',
            message.isInternal && 'bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3.5 pt-2.5 border-t border-current/10 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Anexos</p>
              <div className="flex flex-wrap gap-2">
                {message.attachments.map((att) => (
                  <div key={att.id} className="inline-flex">
                    <a
                      href={att.signedUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm hover:shadow-md",
                        isOwn
                          ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                          : "bg-background/80 hover:bg-background border-border/40 text-foreground"
                      )}
                    >
                      {att.mimeType.startsWith('image/') ? (
                        <ImageIcon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      ) : (
                        <File className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      )}
                      <span className="truncate max-w-[130px]">{att.fileName}</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-60 shrink-0" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function TicketChat({ ticketId, initialMessages, currentUserId, isStaff, ticketStatus }: TicketChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [content, setContent] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isClosed = ticketStatus === 'CLOSED'

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // SSE real-time subscription
  useEffect(() => {
    const evtSource = new EventSource('/api/support/stream')

    evtSource.addEventListener('ticket:message', (e) => {
      const data = JSON.parse(e.data)
      if (data.ticketId === ticketId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.message.id)) return prev
          return [...prev, data.message]
        })
      }
    })

    return () => evtSource.close()
  }, [ticketId])

  const handleSend = async () => {
    if (!content.trim()) return
    setSending(true)

    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          isInternal: isStaff ? isInternal : false,
          attachmentIds: attachments.map((a) => a.id),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Erro ao enviar mensagem')
        return
      }

      const { message } = await res.json()
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev
        return [...prev, message]
      })
      setContent('')
      setAttachments([])
      setIsInternal(false)
    } catch {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUserId={currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!isClosed && (
        <div className="border-t border-border/40 p-4 bg-muted/10">
          {isStaff && (
            <div className="flex items-center gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => setIsInternal(!isInternal)}
                className={cn(
                  'flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 shadow-sm',
                  isInternal
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-background/40 backdrop-blur-sm border-border/40 text-muted-foreground hover:text-foreground hover:border-amber-500/30'
                )}
              >
                <Lock className="h-3 w-3" />
                Nota interna
              </button>
            </div>
          )}

          <div className={cn(
            'rounded-2xl border transition-all duration-300 shadow-sm relative overflow-hidden bg-background/50 backdrop-blur-sm',
            isInternal 
              ? 'border-amber-500/30 bg-amber-500/[0.02] dark:bg-amber-500/[0.04]' 
              : 'border-border/40 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10'
          )}>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isInternal ? 'Nota interna (não visível ao cliente)...' : 'Escreva sua mensagem... (Ctrl+Enter para enviar)'}
              rows={3}
              className="border-0 resize-none focus-visible:ring-0 rounded-2xl bg-transparent text-sm placeholder:text-muted-foreground/60 leading-relaxed"
              disabled={sending}
            />
            <div className="flex items-center justify-between px-3 pb-3">
              <AttachmentUpload
                ticketId={ticketId}
                attachments={attachments as never}
                onAttachmentsChange={setAttachments as never}
                disabled={sending}
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={sending || !content.trim()}
                className="gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 px-4 py-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                {sending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5 animate-pulse" />
                )}
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}

      {isClosed && (
        <div className="border-t border-border/40 p-5 text-center text-xs font-bold text-muted-foreground bg-muted/20 tracking-wide uppercase leading-none">
          Este ticket está fechado. Abra um novo ticket se precisar de mais ajuda.
        </div>
      )}
    </div>
  )
}
