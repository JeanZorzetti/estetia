import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const professionals = await prisma.professional.findMany({
        where: { conselhoStatus: "pendente" },
        orderBy: { createdAt: "asc" },
        include: {
            organization: { select: { id: true, name: true, tier: true } },
            user: { select: { id: true, name: true, email: true } },
        },
    })

    return NextResponse.json({ professionals, total: professionals.length })
}
