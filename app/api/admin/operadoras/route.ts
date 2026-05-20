import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const operadoras = await prisma.operadora.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" },
        include: {
            organization: { select: { id: true, name: true } },
            _count: { select: { guias: true, convenios: true } },
        },
    })

    // Compute glosa rate per operadora
    const operadoraIds = operadoras.map((o) => o.id)

    const guiaStats = await prisma.guiaTiss.groupBy({
        by: ["operadoraId", "status"],
        where: { operadoraId: { in: operadoraIds } },
        _count: { id: true },
    })

    const statsMap = new Map<string, Record<string, number>>()
    for (const stat of guiaStats) {
        const existing = statsMap.get(stat.operadoraId) || {}
        existing[stat.status] = stat._count.id
        statsMap.set(stat.operadoraId, existing)
    }

    const enriched = operadoras.map((op) => {
        const stats = statsMap.get(op.id) || {}
        const total = Object.values(stats).reduce((a, b) => a + b, 0)
        const glosadas = (stats["GLOSADA"] || 0) + (stats["NEGADA"] || 0)
        const glosaRate = total > 0 ? ((glosadas / total) * 100).toFixed(1) : null
        return { ...op, guiaStats: stats, glosaRate, totalGuias: total }
    })

    return NextResponse.json({ operadoras: enriched })
}
