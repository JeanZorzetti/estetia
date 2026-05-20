'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const WA_NUMBER = '62983443919' // substituir pelo número real
const WA_MESSAGE = encodeURIComponent('Olá! Tenho interesse no Estetia CRM e gostaria de mais informações.')

export function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip/bubble */}
      <div className={cn(
        'flex flex-col gap-1 bg-white rounded-2xl shadow-xl border border-navy/10 p-4 w-64 transition-all duration-300',
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
      )}>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.139 1.535 5.875L.057 23.175a.75.75 0 00.922.898l5.444-1.594A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.909 0-3.703-.503-5.25-1.384l-.375-.22-3.886 1.138 1.082-3.775-.242-.388A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-navy">Suporte Estetia</p>
            <p className="text-[10px] text-slate-400">Geralmente responde em minutos</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-snug">
          Dúvidas sobre planos ou funcionalidades? Fale com a gente no WhatsApp.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors duration-200"
          onClick={() => setOpen(false)}
        >
          <MessageCircle className="h-4 w-4" />
          Iniciar conversa
        </a>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Fechar chat WhatsApp' : 'Abrir chat WhatsApp'}
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.139 1.535 5.875L.057 23.175a.75.75 0 00.922.898l5.444-1.594A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.909 0-3.703-.503-5.25-1.384l-.375-.22-3.886 1.138 1.082-3.775-.242-.388A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        )}
      </button>
    </div>
  )
}
