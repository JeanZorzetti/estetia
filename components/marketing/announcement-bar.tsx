'use client'

import { Link } from "@/i18n/routing"
import { X } from "lucide-react"
import { useState } from "react"

export function AnnouncementBar() {
    const [visible, setVisible] = useState(true)
    if (!visible) return null

    return (
        <div className="relative bg-[#0A1F3D] text-white text-sm py-2.5 px-4 text-center">
            <span className="inline-flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 px-2.5 py-0.5 text-[#C5A059] text-xs font-semibold uppercase tracking-wider">
                    Novo
                </span>
                <span className="text-white/90">
                    Estetia IA para prontuário eletrônico — preenche fichas clínicas automaticamente.{" "}
                    <Link href="/features/ia" className="font-semibold text-[#C5A059] hover:text-[#D4B06A] underline underline-offset-2 transition-colors">
                        Saiba mais
                    </Link>
                </span>
            </span>
            <button
                onClick={() => setVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                aria-label="Fechar aviso"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
