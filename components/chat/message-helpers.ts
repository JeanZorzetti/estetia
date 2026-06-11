// Pure helpers for the chat module (extracted from message-area.tsx)

import type { Contact, WhatsAppMessage, BubblePos } from './chat-types'

export function formatPhone(p: string | null): string {
  if (!p || p.includes('@')) return ''
  const d = p.replace(/\D/g, '')
  if (d.startsWith('55') && d.length === 13)
    return `+55 (${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}`
  if (d.startsWith('55') && d.length === 12)
    return `+55 (${d.slice(2,4)}) ${d.slice(4,8)}-${d.slice(8)}`
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  return p
}

export function getName(c: Contact): string {
  if (c.name && !c.name.includes('@g.us') && !c.name.includes('@s.whatsapp.net')) return c.name
  return formatPhone(c.phone) || c.phone?.replace(/@.+/,'') || 'Sem nome'
}

export function getSub(c: Contact): string {
  if (c.phone?.includes('@g.us')) return 'Grupo'
  return formatPhone(c.phone) || ''
}

const COLORS = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-amber-500','bg-rose-500','bg-cyan-500','bg-pink-500','bg-teal-500']
export function colorHash(n: string) { let h=0; for(let i=0;i<n.length;i++) h=n.charCodeAt(i)+((h<<5)-h); return COLORS[Math.abs(h)%COLORS.length] }

export function fmtDate(d: Date): string {
  const now = new Date(), msg = new Date(d)
  const days = Math.floor((now.getTime()-msg.getTime())/86400000)
  if (days===0) return 'Hoje'
  if (days===1) return 'Ontem'
  return msg.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})
}

export function needsDateSep(cur: WhatsAppMessage, prev: WhatsAppMessage|null): boolean {
  if (!prev) return true
  return new Date(cur.sentAt).toDateString() !== new Date(prev.sentAt).toDateString()
}

export function getBubblePos(msgs: WhatsAppMessage[], i: number): BubblePos {
  const cur = msgs[i]
  const prev = i > 0 ? msgs[i-1] : null
  const next = i < msgs.length-1 ? msgs[i+1] : null
  const sameAsPrev = prev && prev.direction === cur.direction &&
    new Date(cur.sentAt).getTime() - new Date(prev.sentAt).getTime() < 60000
  const sameAsNext = next && next.direction === cur.direction &&
    new Date(next.sentAt).getTime() - new Date(cur.sentAt).getTime() < 60000
  if (sameAsPrev && sameAsNext) return 'middle'
  if (sameAsPrev) return 'last'
  if (sameAsNext) return 'first'
  return 'single'
}

export function bubbleRadius(pos: BubblePos, outbound: boolean): string {
  if (outbound) {
    switch(pos) {
      case 'single': return 'rounded-[18px]'
      case 'first':  return 'rounded-tl-[18px] rounded-tr-[18px] rounded-br-[4px] rounded-bl-[18px]'
      case 'middle': return 'rounded-tl-[18px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[18px]'
      case 'last':   return 'rounded-tl-[18px] rounded-tr-[4px] rounded-br-[18px] rounded-bl-[18px]'
    }
  } else {
    switch(pos) {
      case 'single': return 'rounded-[18px]'
      case 'first':  return 'rounded-tl-[18px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[4px]'
      case 'middle': return 'rounded-tl-[4px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[4px]'
      case 'last':   return 'rounded-tl-[4px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px]'
    }
  }
}

// ── Media detection from text ──────────────────────────────

export function getMediaTypeFromText(text: string): string | null {
  if (text.startsWith('[Imagem]')) return 'image'
  if (text.startsWith('[Vídeo]')) return 'video'
  if (text.startsWith('[Documento]')) return 'document'
  if (text.startsWith('[Áudio]')) return 'audio'
  if (text.startsWith('[Figurinha]')) return 'sticker'
  return null
}

export function getMediaCaption(text: string): string {
  return text
    .replace(/^\[Imagem\]\s*/, '')
    .replace(/^\[Vídeo\]\s*/, '')
    .replace(/^\[Documento\]\s*/, '')
    .replace(/^\[Áudio\]\s*/, '')
    .replace(/^\[Figurinha\]\s*/, '')
    .replace(/^\[Localiza[^\]]*\]\s*/, '')
    .replace(/^\[Contato\]\s*/, '')
    .replace(/^\[Enquete\]\s*/, '')
    .replace(/^\[Visualiza[^\]]*\]\s*/, '')
    .replace(/^\[Mensagem[^\]]*\]\s*/, '')
    .trim()
}

export function isMediaLoaded(data: string | null): boolean {
  return !!data && (data.startsWith('data:') || data.startsWith('http'))
}
