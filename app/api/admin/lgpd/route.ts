import { NextRequest, NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "audit" // "audit" | "consents"
    const orgId = searchParams.get("orgId") || undefined
    const action = searchParams.get("action") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 50

    if (type === "audit") {
        const where: Record<string, unknown> = {}
        if (orgId) where.organizationId = orgId
        if (action) where.action = action

        const [total, logs] = await Promise.all([
            prisma.medicalAccessLog.count({ where }),
            prisma.medicalAccessLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ])

        // Enrich with user and patient names
        const userIds = [...new Set(logs.map((l) => l.userId).filter(Boolean) as string[])]
        const patientIds = [...new Set(logs.map((l) => l.pacienteId))]

        const [users, patients] = await Promise.all([
            prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, name: true, email: true },
            }),
            prisma.patient.findMany({
                where: { id: { in: patientIds } },
                select: { id: true, nome: true },
            }),
        ])

        const usersMap = new Map(users.map((u) => [u.id, u]))
        const patientsMap = new Map(patients.map((p) => [p.id, p]))

        const enriched = logs.map((log) => ({
            ...log,
            user: log.userId ? usersMap.get(log.userId) : null,
            patient: patientsMap.get(log.pacienteId),
        }))

        return NextResponse.json({ logs: enriched, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
    }

    // type === "consents"
    const where: Record<string, unknown> = {}
    if (orgId) where.organizationId = orgId

    const [total, consents] = await Promise.all([
        prisma.consentLog.count({ where }),
        prisma.consentLog.findMany({
            where,
            orderBy: { aceitoEm: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                paciente: { select: { id: true, nome: true } },
                organization: { select: { id: true, name: true } },
            },
        }),
    ])

    return NextResponse.json({ consents, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
}
