import { NextRequest, NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"
import { startOfMonth, subMonths } from "date-fns"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const { searchParams } = new URL(request.url)
    const tier = searchParams.get("tier") || undefined
    const status = searchParams.get("status") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 20

    const now = new Date()
    const monthStart = startOfMonth(now)

    const where: Record<string, unknown> = {
        isTestAccount: false,
    }
    if (tier) where.tier = tier
    if (status === "trial") {
        where.trialStatus = "ACTIVE"
        where.trialEndsAt = { gte: now }
    } else if (status === "suspended") {
        where.failedPaymentAttempts = { gte: 3 }
    } else if (status === "active") {
        where.tier = { not: "FREE" }
        where.failedPaymentAttempts = { lt: 3 }
    }

    const [total, clinics] = await Promise.all([
        prisma.organization.count({ where }),
        prisma.organization.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                name: true,
                slug: true,
                tier: true,
                billingPeriod: true,
                failedPaymentAttempts: true,
                trialStatus: true,
                trialEndsAt: true,
                isFounder: true,
                createdAt: true,
                _count: {
                    select: {
                        patients: true,
                        professionals: true,
                        users: true,
                        supportTickets: true,
                    },
                },
            },
        }),
    ])

    // For each clinic, count sessions this month
    const clinicIds = clinics.map((c) => c.id)
    const sessionsThisMonth = await prisma.treatmentSession.groupBy({
        by: ["organizationId"],
        where: {
            organizationId: { in: clinicIds },
            dataAgendada: { gte: monthStart },
        },
        _count: { id: true },
    })
    const sessionsMap = new Map(sessionsThisMonth.map((s) => [s.organizationId, (s._count as { id: number }).id]))

    const enriched = clinics.map((clinic) => ({
        ...clinic,
        sessionsThisMonth: sessionsMap.get(clinic.id) || 0,
        status:
            clinic.trialStatus === "ACTIVE" && clinic.trialEndsAt && clinic.trialEndsAt > now
                ? "trial"
                : clinic.failedPaymentAttempts >= 3
                ? "suspended"
                : clinic.tier !== "FREE"
                ? "active"
                : "free",
    }))

    return NextResponse.json({
        clinics: enriched,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    })
}
