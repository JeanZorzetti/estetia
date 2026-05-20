import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const snapshots = await prisma.revenueSnapshot.findMany({
        where: { organizationId: null },
        orderBy: [{ year: "asc" }, { month: "asc" }],
        take: 24,
    })

    // Real-time counts for current state
    const [byTier, inadimplentes, founders] = await Promise.all([
        prisma.organization.groupBy({
            by: ["tier"],
            where: { isTestAccount: false },
            _count: { id: true },
        }),
        prisma.organization.count({
            where: { failedPaymentAttempts: { gte: 3 }, isTestAccount: false },
        }),
        prisma.organization.count({ where: { isFounder: true } }),
    ])

    const tierMap = Object.fromEntries(byTier.map((t) => [t.tier, t._count.id]))

    return NextResponse.json({
        snapshots: snapshots.map((s) => ({
            ...s,
            mrr: Number(s.mrr),
            arr: Number(s.arr),
            avgLtv: s.avgLtv ? Number(s.avgLtv) : null,
            avgCac: s.avgCac ? Number(s.avgCac) : null,
            forecastNext30d: s.forecastNext30d ? Number(s.forecastNext30d) : null,
        })),
        currentState: {
            byTier: tierMap,
            inadimplentes,
            founders,
        },
    })
}
