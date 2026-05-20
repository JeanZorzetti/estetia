import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/support-auth"
import { prisma } from "@/lib/prisma"
import { startOfMonth } from "date-fns"

export const dynamic = "force-dynamic"

export async function GET() {
    const ctx = await requireStaff()
    if (ctx instanceof NextResponse) return ctx

    const monthStart = startOfMonth(new Date())

    const totalPaidClinics = await prisma.organization.count({
        where: { tier: { not: "FREE" }, isTestAccount: false },
    })

    if (totalPaidClinics === 0) {
        return NextResponse.json({ features: [], total: 0 })
    }

    const [
        withProntuario,
        withAnamnese,
        withTiss,
        withNfse,
        withAgenda,
        withNoShow,
        withConvenio,
    ] = await Promise.all([
        prisma.organization.count({
            where: {
                tier: { not: "FREE" },
                isTestAccount: false,
                medicalRecords: { some: {} },
            },
        }),
        prisma.organization.count({
            where: {
                tier: { not: "FREE" },
                isTestAccount: false,
                anamneses: { some: {} },
            },
        }),
        prisma.organization.count({
            where: {
                tier: { not: "FREE" },
                isTestAccount: false,
                guiasTiss: { some: {} },
            },
        }),
        prisma.organization.count({
            where: {
                tier: { not: "FREE" },
                isTestAccount: false,
                guiasTiss: { some: { nfseStatus: { not: null } } },
            },
        }),
        prisma.organization.count({
            where: {
                tier: { not: "FREE" },
                isTestAccount: false,
                treatmentSessions: { some: { dataAgendada: { gte: monthStart } } },
            },
        }),
        prisma.organization.count({
            where: {
                tier: { not: "FREE" },
                isTestAccount: false,
                treatmentSessions: { some: { noShowScore: { not: null } } },
            },
        }),
        prisma.organization.count({
            where: {
                tier: { not: "FREE" },
                isTestAccount: false,
                operadoras: { some: { ativo: true } },
            },
        }),
    ])

    const pct = (n: number) => Math.round((n / totalPaidClinics) * 100)

    const features = [
        { name: "Prontuário Digital", count: withProntuario, pct: pct(withProntuario) },
        { name: "Anamnese Digital", count: withAnamnese, pct: pct(withAnamnese) },
        { name: "Agenda Ativa (mês atual)", count: withAgenda, pct: pct(withAgenda) },
        { name: "Convênios Cadastrados", count: withConvenio, pct: pct(withConvenio) },
        { name: "TISS (Guias emitidas)", count: withTiss, pct: pct(withTiss) },
        { name: "NFS-e", count: withNfse, pct: pct(withNfse) },
        { name: "No-show Predictor", count: withNoShow, pct: pct(withNoShow) },
    ]

    return NextResponse.json({ features, total: totalPaidClinics })
}
