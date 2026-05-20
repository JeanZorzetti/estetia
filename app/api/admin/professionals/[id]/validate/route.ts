import { NextRequest, NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const { id } = await params
    const body = await request.json()
    const { status, justificativa } = body as {
        status: "ativo" | "inativo" | "nao_aplicavel"
        justificativa?: string
    }

    if (!["ativo", "inativo", "nao_aplicavel"].includes(status)) {
        return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    const professional = await prisma.professional.update({
        where: { id },
        data: {
            conselhoStatus: status,
            conselhoValidadoEm: new Date(),
        },
    })

    return NextResponse.json({ professional })
}
