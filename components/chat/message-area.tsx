'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Send, Users, Loader2, Check, CheckCheck, Mic, Paperclip,
  Image as ImageIcon, Video, FileText, Download, Play, Pause,
  File, Search, Reply, X, Info, ArrowLeft, ChevronDown, Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ConversationTags } from './conversation-tags'
import { MessageSearch } from './message-search'
import { QuickReplyPicker } from './quick-reply-picker'
import { QuotedMessage } from './quoted-message'
import { ContactSidebar } from './contact-sidebar'
import { AgentAssignment } from './agent-assignment'
import { TypingIndicator } from './typing-indicator'
import { ReactionBar } from './reaction-bar'
import { ReactionChips } from './reaction-chips'
import { MediaLightbox } from './media-lightbox'
import { usePusher } from '@/hooks/use-pusher'
import type { ChatTypingEvent, MessageNewEvent, MessageStatusEvent } from '@/hooks/use-pusher'
import { useTranslations } from 'next-intl'

import type { Contact, Connection, User, WhatsAppMessage, BubblePos } from './chat-types'
import {
  formatPhone, getName, getSub, colorHash, fmtDate, needsDateSep,
  getBubblePos, bubbleRadius, getMediaTypeFromText, getMediaCaption, isMediaLoaded,
} from './message-helpers'
import { MediaBubble } from './media-bubble'

interface MessageAreaProps {
  contact: Contact; connections: Connection[]
  organizationId: string; userId: string; userName: string
  onContactUpdate?: () => void
  onBack?: () => void
  wabaEnabled?: boolean
}

type MessageItem = {
  msg: WhatsAppMessage
  showDate: boolean
  pos: BubblePos
}


// ── Component ───────────────────────────────────────────────

export function MessageArea({ contact, connections, organizationId, userId, userName, onContactUpdate, onBack, wabaEnabled = false }: MessageAreaProps) {
  const tCommon = useTranslations('common')
  const t = useTranslations('components.chat')
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [text, setText] = useState('')
  const [conn, setConn] = useState(connections[0]?.id||'')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)
  const [showQuickReply, setShowQuickReply] = useState(false)
  const [quickReplyQuery, setQuickReplyQuery] = useState('')
  const [replyingTo, setReplyingTo] = useState<WhatsAppMessage | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [contactData, setContactData] = useState<Contact | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingFilePreview, setPendingFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showReactionBar, setShowReactionBar] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<{ src: string; type: 'image' | 'video' } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [atBottom, setAtBottom] = useState(true)
  const [newMsgCount, setNewMsgCount] = useState(0)
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  // Audio recording
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)

  const openLightbox = useCallback((src: string, type: 'image' | 'video') => {
    setLightbox({ src, type })
  }, [])

  const taRef = useRef<HTMLTextAreaElement>(null)
  const prevMsgCount = useRef(0)
  // Keep refs so callbacks are never stale
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const atBottomRef = useRef(atBottom)
  atBottomRef.current = atBottom

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    virtuosoRef.current?.scrollToIndex({
      index: 'LAST',
      behavior: behavior === 'instant' ? 'auto' : 'smooth',
    })
    setNewMsgCount(0)
  }, [])

  const scrollToMessage = useCallback((messageId: string) => {
    const index = messagesRef.current.findIndex(m => m.id === messageId)
    if (index >= 0) {
      virtuosoRef.current?.scrollToIndex({ index, behavior: 'smooth', align: 'center' })
      setHighlightedMessageId(messageId)
      setTimeout(() => setHighlightedMessageId(null), 2000)
    }
  }, [])

  const fetchMsgs = useCallback(async (show=false) => {
    if (show) setLoading(true)
    try {
      const r = await fetch(`/api/contact/${contact.id}/interactions?type=WHATSAPP`)
      if (!r.ok) throw new Error()
      const d: WhatsAppMessage[] = await r.json()
      setMessages(prev => {
        // Keep any temp messages that are still being sent
        const tempMsgs = prev.filter(m => m.id.startsWith('temp-'))
        const merged = [...d, ...tempMsgs]
        const newCount = merged.length - prev.length
        if (newCount > 0) {
          if (atBottomRef.current) {
            setTimeout(() => scrollToBottom(), 100)
          } else {
            setNewMsgCount(c => c + newCount)
          }
        }
        return merged
      })
    } catch { if (show) toast.error('Erro ao carregar mensagens') }
    finally { setLoading(false) }
  }, [contact.id, scrollToBottom])

  // Pusher: real-time typing indicator + message/status updates
  const contactPhone = contact.phone
  usePusher({
    organizationId,
    onChatTyping: useCallback((data: ChatTypingEvent) => {
      if (!contactPhone) return
      const jidPhone = data.remoteJid?.replace('@s.whatsapp.net', '').replace('@c.us', '') || ''
      const cleanContactPhone = contactPhone.replace(/\D/g, '')
      if (jidPhone.includes(cleanContactPhone) || cleanContactPhone.includes(jidPhone)) {
        setIsTyping(data.isTyping)
        if (data.isTyping) {
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 5000)
        }
      }
    }, [contactPhone]),
    onMessageNew: useCallback((data: MessageNewEvent) => {
      if (data.contactId === contact.id) {
        fetchMsgs()
      }
    }, [contact.id, fetchMsgs]),
    onMessageStatus: useCallback((data: MessageStatusEvent) => {
      setMessages(prev => prev.map(m =>
        m.messageId === data.messageId ? { ...m, status: data.status } : m
      ))
    }, []),
  })

  const fetchContactData = useCallback(async () => {
    try {
      const r = await fetch(`/api/contact/${contact.id}`)
      if (r.ok) {
        const data = await r.json()
        setContactData(data)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    }
  }, [contact.id])

  const toggleSidebar = () => {
    if (!showSidebar && !contactData) {
      fetchContactData()
    }
    setShowSidebar(!showSidebar)
  }

  useEffect(() => { fetchMsgs(true) }, [contact.id, fetchMsgs])

  // Polling: rebusca mensagens a cada 5s (simples, confiável, self-healing)
  useEffect(() => {
    const i = setInterval(() => fetchMsgs(), 5000)
    return () => clearInterval(i)
  }, [fetchMsgs])

  // Buscar usuários da organização
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/whatsapp/users')
        if (res.ok) {
          const data = await res.json()
          setUsers(data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  // Fetch profile picture via proxy (WhatsApp CDN URLs expire)
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null)
  useEffect(() => {
    setProfilePicUrl(null)
    if (contact.phone && !contact.phone.includes('@g.us')) {
      fetch(`/api/whatsapp/profile-pic?contactId=${contact.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.profilePicUrl) setProfilePicUrl(data.profilePicUrl)
        })
        .catch(() => {})
    }
  }, [contact.id, contact.phone])

  // Marcar mensagens como lidas quando a conversa é aberta
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch('/api/whatsapp/messages/mark-read', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactId: contact.id }),
        })
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    }
    markAsRead()
  }, [contact.id])

  // Auto-resize textarea
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 120) + 'px'
    }
  }, [text])

  // Quick Reply detection: "/" triggers autocomplete
  useEffect(() => {
    const lastChar = text[text.length - 1]
    const words = text.split(/\s/)
    const lastWord = words[words.length - 1]

    if (lastWord.startsWith('/') && lastWord.length > 1) {
      setShowQuickReply(true)
      setQuickReplyQuery(lastWord.slice(1)) // Remove "/" prefix
    } else if (lastWord === '/') {
      setShowQuickReply(true)
      setQuickReplyQuery('')
    } else {
      setShowQuickReply(false)
      setQuickReplyQuery('')
    }
  }, [text])

  // Scroll to bottom on first load
  useEffect(() => {
    if (messages.length > 0 && prevMsgCount.current === 0) {
      setTimeout(() => scrollToBottom('instant'), 50)
    }
    prevMsgCount.current = messages.length
  }, [messages.length, scrollToBottom])

  // Pre-compute per-item metadata for Virtuoso (avoids re-computing inside render)
  const messageItems = useMemo((): MessageItem[] =>
    messages.map((msg, i) => ({
      msg,
      showDate: needsDateSep(msg, i > 0 ? messages[i - 1] : null),
      pos: getBubblePos(messages, i),
    })),
  [messages])

  const handleQuickReplySelect = (content: string) => {
    // Substituir o "/" + query pelo conteúdo da resposta rápida
    const words = text.split(/\s/)
    words[words.length - 1] = content
    setText(words.join(' '))
    setShowQuickReply(false)
    setQuickReplyQuery('')
    // Focus no textarea
    taRef.current?.focus()
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const r = await fetch(`/api/whatsapp/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      })
      if (!r.ok) throw new Error('Failed to react')

      // Refresh messages to get updated reactions
      fetchMsgs()
      setShowReactionBar(null)
    } catch (error) {
      console.error('Error reacting:', error)
      toast.error('Erro ao reagir à mensagem')
    }
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    if (!wabaEnabled && !conn) return

    const messageText = text.trim()
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Create optimistic message
    const optimisticMsg: WhatsAppMessage = {
      id: tempId,
      text: messageText,
      direction: 'OUTBOUND',
      sentAt: new Date(),
      deliveredAt: null,
      readAt: null,
      status: 'SENDING',
      mediaUrl: null,
      mediaType: null,
      messageId: undefined,
      replyToId: replyingTo?.id || null,
      replyToText: replyingTo?.text || null,
      reactions: [],
    }

    // Add optimistic message instantly to UI
    setMessages(prev => [...prev, optimisticMsg])
    setText('')
    const replyingToMsg = replyingTo
    setReplyingTo(null)
    setTimeout(() => scrollToBottom(), 50)

    setSending(true)
    try {
      let r: Response
      if (wabaEnabled) {
        const payload: any = { contactId: contact.id, message: messageText }
        if (replyingToMsg) payload.replyToId = replyingToMsg.id
        r = await fetch('/api/whatsapp/send-waba', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        const payload: any = { connectionId: conn, contactId: contact.id, message: messageText }
        if (replyingToMsg) payload.replyToId = replyingToMsg.id
        r = await fetch('/api/whatsapp/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!r.ok) {
        const d = await r.json()
        throw new Error(d.error)
      }
      const confirmedMsg = await r.json()

      // Replace temp message with confirmed one from server
      setMessages(prev => prev.map(m => m.id === tempId ? confirmedMsg : m))
      setTimeout(() => scrollToBottom(), 100)
    } catch(err:any) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId))
      toast.error(err.message||'Erro ao enviar')
    }
    finally { setSending(false) }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 16 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 16MB.')
      return
    }
    setPendingFile(file)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPendingFilePreview(url)
    } else {
      setPendingFilePreview(null)
    }
  }

  const cancelFile = () => {
    setPendingFile(null)
    if (pendingFilePreview) {
      URL.revokeObjectURL(pendingFilePreview)
      setPendingFilePreview(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const sendMedia = async () => {
    if (!pendingFile || (!wabaEnabled && !conn)) return
    const tempId = `temp-media-${Date.now()}`
    const mediaLabel = pendingFile.type.startsWith('image/') ? '[Imagem]'
      : pendingFile.type.startsWith('video/') ? '[Vídeo]'
      : pendingFile.type.startsWith('audio/') ? '[Áudio]'
      : `[Documento] ${pendingFile.name}`

    const caption = text.trim()
    const messageText = caption ? `${mediaLabel} ${caption}` : mediaLabel

    const optimisticMsg: WhatsAppMessage = {
      id: tempId,
      text: messageText,
      direction: 'OUTBOUND',
      sentAt: new Date(),
      deliveredAt: null,
      readAt: null,
      status: 'SENDING',
      mediaUrl: pendingFilePreview,
      mediaType: pendingFile.type.startsWith('image/') ? 'image'
        : pendingFile.type.startsWith('video/') ? 'video'
        : pendingFile.type.startsWith('audio/') ? 'audio' : 'document',
      messageId: undefined,
      replyToId: null,
      replyToText: null,
      reactions: [],
    }

    setMessages(prev => [...prev, optimisticMsg])
    setText('')
    const fileToSend = pendingFile
    cancelFile()
    setTimeout(() => scrollToBottom(), 50)

    setSending(true)
    try {
      const formData = new FormData()
      formData.append('file', fileToSend)
      formData.append('contactId', contact.id)
      if (caption) formData.append('caption', caption)
      if (!wabaEnabled && conn) formData.append('connectionId', conn)

      const endpoint = wabaEnabled ? '/api/whatsapp/send-waba-media' : '/api/whatsapp/send-media'
      const r = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      if (!r.ok) {
        const d = await r.json()
        throw new Error(d.error)
      }
      const confirmedMsg = await r.json()
      // Replace temp message with confirmed one from server
      setMessages(prev => prev.map(m => m.id === tempId ? confirmedMsg : m))
      setTimeout(() => scrollToBottom(), 100)
    } catch (err: any) {
      setMessages(prev => prev.filter(m => m.id !== tempId))
      toast.error(err.message || 'Erro ao enviar mídia')
    } finally {
      setSending(false)
    }
  }

  // --- Audio recording ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream
      audioChunksRef.current = []

      // Prefer ogg/opus (WhatsApp PTT native format); fallback to webm
      const mimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        // Cleanup stream tracks
        stream.getTracks().forEach(t => t.stop())
        audioStreamRef.current = null
      }

      recorder.start(100) // collect in 100ms chunks
      setIsRecording(true)
      setRecordingTime(0)
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err: any) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Seu browser não suporta gravação de áudio')
      } else if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        toast.error('Permissão de microfone negada. Clique no cadeado na barra de endereço e permita o microfone.')
      } else if (err?.name === 'NotFoundError') {
        toast.error('Nenhum microfone encontrado no dispositivo')
      } else {
        toast.error('Não foi possível acessar o microfone. Verifique as permissões do browser.')
      }
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop()
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
    audioChunksRef.current = []
    setIsRecording(false)
    setRecordingTime(0)
  }

  const sendRecording = async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') return

    if (!wabaEnabled && !conn) return

    // Stop recording and wait for final data
    return new Promise<void>((resolve) => {
      recorder.onstop = async () => {
        audioStreamRef.current?.getTracks().forEach(t => t.stop())
        audioStreamRef.current = null

        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
        setIsRecording(false)

        // Use the actual recorded mimetype so WhatsApp gets the right format
        const recordedMime = recorder.mimeType || 'audio/webm'
        const audioBlob = new Blob(audioChunksRef.current, { type: recordedMime })
        audioChunksRef.current = []

        if (audioBlob.size === 0) {
          setRecordingTime(0)
          resolve()
          return
        }

        const duration = recordingTime
        setRecordingTime(0)

        const localUrl = URL.createObjectURL(audioBlob)
        const tempId = `temp-audio-${Date.now()}`
        const optimisticMsg: WhatsAppMessage = {
          id: tempId,
          text: `[Áudio ${fmtDuration(duration)}]`,
          direction: 'OUTBOUND',
          sentAt: new Date(),
          deliveredAt: null,
          readAt: null,
          status: 'SENDING',
          mediaUrl: localUrl,
          mediaType: 'audio',
          messageId: undefined,
          replyToId: null,
          replyToText: null,
          reactions: [],
        }

        setMessages(prev => [...prev, optimisticMsg])
        setTimeout(() => scrollToBottom(), 50)

        setSending(true)
        try {
          // Pick file extension based on actual mime type
          const ext = recordedMime.includes('ogg') ? 'ogg' : 'webm'
          const formData = new FormData()
          formData.append('file', audioBlob, `audio.${ext}`)
          formData.append('contactId', contact.id)
          formData.append('ptt', 'true')
          formData.append('duration', String(duration))
          if (!wabaEnabled) formData.append('connectionId', conn)

          const endpoint = wabaEnabled ? '/api/whatsapp/send-waba-media' : '/api/whatsapp/send-media'
          const r = await fetch(endpoint, {
            method: 'POST',
            body: formData,
          })
          if (!r.ok) {
            const d = await r.json()
            throw new Error(d.error)
          }
          const confirmedMsg = await r.json()
          URL.revokeObjectURL(localUrl)
          // Preserve the duration text from the optimistic message
          setMessages(prev => prev.map(m =>
            m.id === tempId
              ? { ...confirmedMsg, text: `[Áudio ${fmtDuration(duration)}]` }
              : m
          ))
          setTimeout(() => scrollToBottom(), 100)
        } catch (err: any) {
          URL.revokeObjectURL(localUrl)
          setMessages(prev => prev.filter(m => m.id !== tempId))
          toast.error(err.message || 'Erro ao enviar áudio')
        } finally {
          setSending(false)
        }
        resolve()
      }

      recorder.stop()
    })
  }

  const fmtDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop()
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      audioStreamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const fmtTime = (d: Date) => new Date(d).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})

  const name = getName(contact)
  const sub = getSub(contact)
  const isGrp = contact.phone?.includes('@g.us')??false
  const clr = colorHash(name)

  const initials = () => {
    if (contact.name && !contact.name.includes('@'))
      return contact.name.split(' ').filter(Boolean).map(w=>w[0]).join('').toUpperCase().slice(0,2)
    return '??'
  }

  // Check if message has media
  const hasMedia = (msg: WhatsAppMessage): boolean => {
    if (msg.mediaType) return true
    return !!getMediaTypeFromText(msg.text)
  }

  // Get display text (remove media prefix for pure media messages)
  const getDisplayText = (msg: WhatsAppMessage): string | null => {
    const caption = getMediaCaption(msg.text)
    // If the text is just a tag like [Imagem], [Áudio], etc., show nothing (media handles it)
    if (!caption || caption === msg.text) {
      // Check if it's a plain text message
      const mType = msg.mediaType || getMediaTypeFromText(msg.text)
      if (mType) return caption || null // media message - return caption or nothing
      return msg.text // plain text
    }
    return null // caption is handled by MediaBubble
  }

  return (
    <div
      className="flex-1 flex min-w-0 overflow-hidden relative"
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
          if (file.size > 16 * 1024 * 1024) {
            toast.error('Arquivo muito grande (máx 16MB)')
            return
          }
          setPendingFile(file)
          if (file.type.startsWith('image/')) {
            setPendingFilePreview(URL.createObjectURL(file))
          } else {
            setPendingFilePreview(null)
          }
        }
      }}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-40 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-zinc-800 rounded-xl px-6 py-4 shadow-lg flex items-center gap-3">
            <Paperclip className="h-6 w-6 text-primary" />
            <span className="text-lg font-medium text-foreground">Solte o arquivo aqui</span>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <MediaLightbox
          src={lightbox.src}
          type={lightbox.type}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Main message area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Search bar (conditionally rendered) */}
        {isSearchOpen && (
        <MessageSearch
          messages={messages.map(m => ({ id: m.id, text: m.text }))}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={scrollToMessage}
          containerRef={{ current: null }}
        />
      )}

      {/* Header — hidden on mobile (app bar contextual already shows name + back) */}
      <div className="hidden lg:flex h-[60px] px-4 border-b items-center justify-between bg-[#f0f2f5] whatsapp-header flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0 md:hidden"
              title="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            {profilePicUrl && (
              <AvatarImage src={profilePicUrl} alt={name} />
            )}
            <AvatarFallback className={cn('text-xs font-semibold text-white', clr)}>
              {isGrp ? <Users className="h-4 w-4" /> : initials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-[15px] text-[#111b21] dark:text-zinc-100 leading-tight">{name}</p>
            {isTyping ? (
              <TypingIndicator variant="inline" className="mt-0.5" />
            ) : (
              sub && <p className="text-[12px] text-[#667781] leading-tight mt-0.5">{sub}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Agent Assignment (Fase 3.1) */}
          {users.length > 0 && (
            <AgentAssignment
              contactId={contact.id}
              assignedUserId={contact.chatConversation?.assignedUserId || null}
              users={users}
              onAssignmentChange={onContactUpdate}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            aria-label="Informações do contato"
            aria-pressed={showSidebar}
            className={cn(
              'h-8 w-8 p-0',
              showSidebar && 'bg-[#00a884]/10 text-[#00a884]'
            )}
            title="Informações do contato"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Buscar na conversa"
            aria-pressed={isSearchOpen}
            className="h-8 w-8 p-0"
            title="Buscar na conversa"
          >
            <Search className="h-4 w-4" />
          </Button>
          <ConversationTags
            contactId={contact.id}
            contactTags={contact.tags || []}
            onTagsUpdate={onContactUpdate}
          />
          {connections.length > 1 && (
            <Select value={conn} onValueChange={setConn}>
              <SelectTrigger className="w-auto max-w-[180px] h-8 text-xs border-[#e9edef]">
                <SelectValue placeholder="Conexão" />
              </SelectTrigger>
              <SelectContent>
                {connections.map(c => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {c.displayName || c.phoneNumber || c.instanceName.split('-').pop()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Mobile action bar — shown only on mobile (header is hidden there) */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-1.5 border-b bg-[#f0f2f5] dark:bg-zinc-900 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 flex-1">
          <Avatar className="h-6 w-6 shrink-0">
            {profilePicUrl && <AvatarImage src={profilePicUrl} alt={name} />}
            <AvatarFallback className={cn('text-[9px] font-semibold text-white', clr)}>
              {isGrp ? <Users className="h-3 w-3" /> : initials()}
            </AvatarFallback>
          </Avatar>
          {sub && <span className="truncate">{sub}</span>}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {users.length > 0 && (
            <AgentAssignment
              contactId={contact.id}
              assignedUserId={contact.chatConversation?.assignedUserId || null}
              users={users}
              onAssignmentChange={onContactUpdate}
            />
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="h-8 w-8 p-0" aria-label="Buscar">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleSidebar}
            className={cn('h-8 w-8 p-0', showSidebar && 'bg-[#00a884]/10 text-[#00a884]')}
            aria-label="Informações do contato">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      {loading && messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4 whatsapp-bg-pattern">
          <div className="w-full max-w-md space-y-3">
            {[...Array(5)].map((_,i) => (
              <div key={i} className={cn('flex', i%2===0?'justify-start':'justify-end')}>
                <div className={cn(
                  'h-10 rounded-[18px] animate-pulse',
                  i%2===0 ? 'bg-white/60 w-[55%]' : 'bg-[#d9fdd3]/60 w-[45%]'
                )} />
              </div>
            ))}
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center whatsapp-bg-pattern">
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-xl px-6 py-5 text-center shadow-[0_1px_3px_rgba(11,20,26,0.08)] max-w-[280px]">
            <div className="w-14 h-14 rounded-full bg-[#00a884]/10 flex items-center justify-center mx-auto mb-3">
              <Send className="h-6 w-6 text-[#00a884]" />
            </div>
            <p className="text-sm font-semibold text-[#111b21] dark:text-zinc-100">{t('noConversations')}</p>
            <p className="text-xs text-[#667781] mt-1">
              Envie a primeira mensagem para iniciar a conversa
            </p>
          </div>
        </div>
      ) : (
        <Virtuoso
          ref={virtuosoRef}
          style={{ flex: 1 }}
          className="whatsapp-bg-pattern overflow-x-hidden"
          role="log"
          aria-live="polite"
          aria-label="Mensagens da conversa"
          data={messageItems}
          followOutput="smooth"
          initialTopMostItemIndex={Math.max(0, messageItems.length - 1)}
          atBottomStateChange={(bottom) => {
            setAtBottom(bottom)
            if (bottom) setNewMsgCount(0)
          }}
          components={{
            Footer: () => (
              <>
                {isTyping && (
                  <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
                    <TypingIndicator variant="bubble" className="mt-2 ml-2" />
                  </div>
                )}
                <div className="h-4" />
              </>
            ),
          }}
          itemContent={(_index, { msg, showDate, pos }) => {
              const out = msg.direction === 'OUTBOUND'
              const isGroupedWithPrev = pos === 'middle' || pos === 'last'
              const media = hasMedia(msg)
              const displayText = getDisplayText(msg)

              return (
                <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
                  {/* Date separator - sticky */}
                  {showDate && (
                    <div className="sticky top-0 z-10 flex justify-center py-2 my-1">
                      <span className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur text-[12.5px] text-[#54656f] px-3 py-1 rounded-lg shadow-[0_1px_1px_rgba(11,20,26,0.13)] font-medium select-none">
                        {fmtDate(msg.sentAt)}
                      </span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={cn(
                      'flex message-bubble-animate group relative w-full',
                      out ? 'justify-end' : 'justify-start',
                      isGroupedWithPrev ? 'mt-[2px]' : 'mt-2'
                    )}
                    onMouseEnter={() => setShowReactionBar(msg.id)}
                    onMouseLeave={() => setShowReactionBar(null)}
                  >
                    {/* Reply button (shows on hover) */}
                    {!out && (
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 self-end mb-1 p-1.5 rounded-full hover:bg-black/5"
                        title="Responder"
                      >
                        <Reply className="h-4 w-4 text-[#667781]" />
                      </button>
                    )}

                    <div
                      role="article"
                      aria-label={`Mensagem ${out ? 'enviada' : 'recebida'} às ${fmtTime(msg.sentAt)}`}
                      className={cn(
                        'max-w-[65%] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] relative overflow-hidden transition-colors',
                        media ? 'p-[3px]' : 'px-[9px] pt-[6px] pb-[7px]',
                        bubbleRadius(pos, out),
                        highlightedMessageId === msg.id
                          ? 'ring-2 ring-[#f59e0b] bg-[#fef3c7]'
                          : out
                            ? 'bg-[#d9fdd3] whatsapp-bubble-outgoing'
                            : 'bg-white whatsapp-bubble-incoming'
                      )}
                    >
                      {/* Quoted message (if replying) */}
                      {msg.replyToId && msg.replyToText && (
                        <div className="mb-1">
                          <QuotedMessage
                            text={msg.replyToText}
                            senderName={msg.direction === 'INBOUND' ? name : 'Você'}
                            outbound={out}
                            onClick={() => {
                              if (msg.replyToId) {
                                scrollToMessage(msg.replyToId)
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Media content */}
                      {media && (
                        <div className="mb-0.5">
                          <MediaBubble msg={msg} outbound={out} onOpenLightbox={openLightbox} />
                        </div>
                      )}

                      {/* Text content */}
                      {(!media || displayText) && (
                        <div className={cn(media && 'px-[6px] pb-[4px] pt-[2px]')}>
                          <p className="text-[14.2px] leading-[1.46] text-[#111b21] dark:text-zinc-100 whitespace-pre-wrap break-words">
                            {media ? (displayText || '') : msg.text}
                            {/* Invisible spacer for timestamp */}
                            <span className="inline-block w-[70px]" />
                          </p>
                        </div>
                      )}

                      {/* Timestamp + status */}
                      <span className={cn(
                        'float-right flex items-center gap-1 ml-2 relative',
                        media && !displayText ? 'px-[6px] pb-[4px] -mt-1' : '-mt-4',
                      )}>
                        <span className="text-[10.5px] text-[#667781] leading-none tabular-nums">
                          {fmtTime(msg.sentAt)}
                        </span>
                        {out && (
                          msg.status === 'SENDING'
                            ? <Loader2 className="h-[14px] w-[14px] text-[#8696a0] animate-spin message-status-icon" />
                            : msg.status === 'READ'
                              ? <CheckCheck className="h-[16px] w-[16px] text-[#53bdeb] message-status-icon" />
                              : msg.status === 'DELIVERED'
                                ? <CheckCheck className="h-[16px] w-[16px] text-[#8696a0] message-status-icon" />
                                : <Check className="h-[16px] w-[16px] text-[#8696a0] message-status-icon" />
                        )}
                      </span>
                    </div>

                    {/* Reaction bar (shows on hover) */}
                    {showReactionBar === msg.id && (
                      <div className={cn(
                        'absolute -top-12 z-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-150',
                        out ? 'right-0' : 'left-0'
                      )}>
                        <ReactionBar
                          onReact={(emoji) => handleReaction(msg.id, emoji)}
                        />
                      </div>
                    )}

                    {/* Reaction chips below bubble */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={cn(
                        'absolute -bottom-5',
                        out ? 'right-0' : 'left-0'
                      )}>
                        <ReactionChips
                          reactions={msg.reactions}
                          onToggle={(emoji) => handleReaction(msg.id, emoji)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
          }}
        />
      )}

      {/* Scroll to bottom FAB */}
      {!atBottom && messages.length > 0 && (
        <div className="relative">
          <button
            onClick={() => scrollToBottom()}
            className="absolute bottom-2 right-4 z-20 h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
            title="Rolar para o final"
          >
            <ChevronDown className="h-5 w-5 text-[#54656f]" />
            {newMsgCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full bg-[#00a884] text-white text-[11px] font-bold flex items-center justify-center px-1">
                {newMsgCount > 99 ? '99+' : newMsgCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Reply preview bar */}
      {replyingTo && (
        <div className="px-4 py-2 bg-white whatsapp-header border-t border-[#e9edef] dark:border-zinc-700 flex items-center gap-2">
          <Reply className="h-4 w-4 text-[#00a884] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#00a884] leading-tight">
              Respondendo a {replyingTo.direction === 'INBOUND' ? name : 'Você'}
            </p>
            <p className="text-[12px] text-[#667781] truncate leading-tight">
              {replyingTo.text}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 rounded-full hover:bg-black/5 transition-colors flex-shrink-0"
            title="Cancelar resposta"
          >
            <X className="h-4 w-4 text-[#667781]" />
          </button>
        </div>
      )}

      {/* File preview bar */}
      {pendingFile && (
        <div className="px-3 py-2 bg-[#e2f7cb] dark:bg-emerald-900/30 border-t border-[#e9edef] dark:border-zinc-700 flex items-center gap-3">
          {pendingFilePreview ? (
            <img src={pendingFilePreview} alt="Preview" className="h-12 w-12 rounded object-cover" />
          ) : (
            <div className="h-12 w-12 rounded bg-white/50 dark:bg-white/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#54656f]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-[#111b21] dark:text-white">{pendingFile.name}</p>
            <p className="text-xs text-[#667781]">{(pendingFile.size / 1024).toFixed(0)} KB</p>
          </div>
          <button onClick={cancelFile} className="p-1 rounded-full hover:bg-black/5" title={tCommon('buttons.cancel')}>
            <X className="h-4 w-4 text-[#667781]" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="px-3 py-2 bg-[#f0f2f5] whatsapp-header border-t border-[#e9edef] dark:border-zinc-700 flex items-end gap-2">
        {isRecording ? (
          /* Recording UI — replaces the normal input */
          <>
            <button
              type="button"
              onClick={cancelRecording}
              aria-label="Cancelar gravação"
              className="h-[42px] w-[42px] rounded-full flex items-center justify-center flex-shrink-0 text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            <div className="flex-1 flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-lg px-4 py-2 min-h-[42px] shadow-[0_1px_1px_rgba(11,20,26,0.06)]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <span className="text-sm font-medium text-[#111b21] dark:text-zinc-100 tabular-nums">
                {fmtDuration(recordingTime)}
              </span>
              <div className="flex-1 flex items-center gap-[2px] overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-[#00a884]/60"
                    style={{
                      height: `${8 + Math.sin((recordingTime * 3 + i) * 0.5) * 8 + Math.random() * 6}px`,
                      transition: 'height 0.15s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={sendRecording}
              disabled={sending}
              aria-label="Enviar áudio"
              className="h-[42px] w-[42px] rounded-full flex items-center justify-center flex-shrink-0 bg-[#00a884] hover:bg-[#008f72] text-white transition-all duration-200 active:scale-90"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </>
        ) : (
          /* Normal input */
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              aria-label="Anexar arquivo"
              className="h-[42px] w-[42px] rounded-full flex items-center justify-center flex-shrink-0 text-[#54656f] hover:text-[#3b4a54] hover:bg-black/5 transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <div className="flex-1 relative">
              {showQuickReply && taRef.current && (
                <QuickReplyPicker
                  query={quickReplyQuery}
                  onSelect={handleQuickReplySelect}
                  onClose={() => {
                    setShowQuickReply(false)
                    setQuickReplyQuery('')
                  }}
                  position={{
                    top: taRef.current.offsetHeight,
                    left: 0,
                  }}
                  contact={contact}
                  userName={userName}
                />
              )}

              <textarea
                ref={taRef}
                placeholder="Mensagem"
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={sending}
                rows={1}
                aria-label="Campo de mensagem"
                aria-describedby="message-help-text"
                className={cn(
                  'w-full resize-none rounded-lg border-0',
                  'bg-white whatsapp-input px-3 py-[9px] text-[14px] leading-[1.46]',
                  'placeholder:text-[#8696a0]',
                  'focus:outline-none focus:ring-1 focus:ring-[#00a884]/40',
                  'disabled:opacity-50',
                  'min-h-[42px] max-h-[120px]',
                  'shadow-[0_1px_1px_rgba(11,20,26,0.06)]',
                  'whatsapp-text-primary'
                )}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e) }
                }}
                onPaste={e => {
                  const items = e.clipboardData?.items
                  if (!items) return
                  for (const item of Array.from(items)) {
                    if (item.type.startsWith('image/')) {
                      e.preventDefault()
                      const file = item.getAsFile()
                      if (file) {
                        setPendingFile(file)
                        setPendingFilePreview(URL.createObjectURL(file))
                      }
                      break
                    }
                  }
                }}
              />
              <span id="message-help-text" className="sr-only">
                Pressione Enter para enviar, Shift+Enter para nova linha
              </span>
            </div>

            {(text.trim() || pendingFile) ? (
              <button
                type="button"
                onClick={pendingFile ? sendMedia : send}
                disabled={sending}
                aria-label={pendingFile ? 'Enviar arquivo' : 'Enviar mensagem'}
                className="h-[42px] w-[42px] rounded-full flex items-center justify-center flex-shrink-0 bg-[#00a884] hover:bg-[#008f72] text-white transition-all duration-200 active:scale-90 focus-visible:ring-2 focus-visible:ring-[#00a884] focus-visible:ring-offset-2"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                disabled={sending}
                aria-label="Gravar áudio"
                className="h-[42px] w-[42px] rounded-full flex items-center justify-center flex-shrink-0 bg-[#00a884] hover:bg-[#008f72] text-white transition-all duration-200 active:scale-90 focus-visible:ring-2 focus-visible:ring-[#00a884] focus-visible:ring-offset-2"
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </>
        )}
      </div>
      </div>

      {/* Contact Sidebar */}
      {showSidebar && contactData && contactData.tags && contactData.deals && contactData.notes && contactData._count && (
        <ContactSidebar
          contact={{
            ...contactData,
            tags: contactData.tags,
            deals: contactData.deals,
            notes: contactData.notes,
            _count: contactData._count,
          }}
          onClose={() => setShowSidebar(false)}
          onChatCleared={() => { setMessages([]); fetchContactData() }}
        />
      )}
    </div>
  )
}
