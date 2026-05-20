import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"
import { subDays } from "date-fns"

export const dynamic = "force-dynamic"

export async function GET() {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const since = subDays(new Date(), 7)

    const [webhookStats, recentFailures, integrationCount] = await Promise.all([
        prisma.webhookLog.groupBy({
            by: ["status"],
            where: { sentAt: { gte: since } },
            _count: { id: true },
        }),
        prisma.webhookLog.findMany({
            where: {
                status: { in: ["FAILED", "RETRYING"] },
                sentAt: { gte: since },
            },
            orderBy: { sentAt: "desc" },
            take: 20,
            include: {
                organization: { select: { id: true, name: true } },
            },
        }),
        prisma.integrationLog.count().catch(() => 0),
    ])

    const webhookMap = Object.fromEntries(
        webhookStats.map((s) => [s.status, (s._count as { id: number }).id])
    )

    return NextResponse.json({
        webhooks: {
            last7days: webhookMap,
            recentFailures,
        },
        integrations: { activeCount: integrationCount },
    })
}
