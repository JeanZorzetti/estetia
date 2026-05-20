import { NextRequest, NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"
import { startOfMonth } from "date-fns"

export const dynamic = "force-dynamic"

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const { id } = await params

    const now = new Date()
    const monthStart = startOfMonth(now)

    const clinic = await prisma.organization.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    patients: true,
                    professionals: true,
                    users: true,
                    supportTickets: true,
                    medicalRecords: true,
                },
            },
        },
    })

    if (!clinic) {
        return NextResponse.json({ error: "Clínica não encontrada" }, { status: 404 })
    }

    const [
        sessionsThisMonth,
        profissionaisPendentes,
        ticketsAbertos,
        lgpdSolicitacoes,
        guiasTiss,
    ] = await Promise.all([
        prisma.treatmentSession.count({
            where: { organizationId: id, dataAgendada: { gte: monthStart } },
        }),
        prisma.professional.count({
            where: { organizationId: id, conselhoStatus: "pendente" },
        }),
        prisma.supportTicket.count({
            where: { organizationId: id, status: { in: ["OPEN", "IN_PROGRESS"] } },
        }),
        prisma.consentLog.count({
            where: { organizationId: id, revokedAt: null },
        }),
        prisma.guiaTiss.count({
            where: { organizationId: id },
        }).catch(() => 0),
    ])

    return NextResponse.json({
        clinic: {
            ...clinic,
            sessionsThisMonth,
            profissionaisPendentes,
            ticketsAbertos,
            lgpdSolicitacoes,
            guiasTiss,
        },
    })
}
