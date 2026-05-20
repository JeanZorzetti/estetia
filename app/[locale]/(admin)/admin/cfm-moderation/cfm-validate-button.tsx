'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, XCircle, MinusCircle, ChevronDown } from "lucide-react"

interface CFMValidateButtonProps {
    professionalId: string
    nome: string
}

export function CFMValidateButton({ professionalId, nome }: CFMValidateButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const validate = async (status: "ativo" | "inativo" | "nao_aplicavel") => {
        setLoading(true)
        try {
            await fetch(`/api/admin/professionals/${professionalId}/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={loading}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 h-7 text-xs"
                >
                    {loading ? "Salvando…" : "Validar"}
                    <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-slate-900 border-slate-800 text-slate-200"
            >
                <DropdownMenuItem
                    onClick={() => validate("ativo")}
                    className="cursor-pointer text-green-400 focus:text-green-300 focus:bg-green-500/10"
                >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                    Aprovar (Conselho ativo)
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem
                    onClick={() => validate("inativo")}
                    className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
                >
                    <XCircle className="h-3.5 w-3.5 mr-2" />
                    Reprovar (Conselho inativo)
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => validate("nao_aplicavel")}
                    className="cursor-pointer text-slate-400 focus:text-slate-300"
                >
                    <MinusCircle className="h-3.5 w-3.5 mr-2" />
                    Não aplicável
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
