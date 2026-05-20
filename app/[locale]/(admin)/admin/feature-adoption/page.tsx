import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp } from "lucide-react"
import { startOfMonth } from "date-fns"

export const dynamic = "force-dynamic"

export default async function FeatureAdoptionPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const monthStart = startOfMonth(new Date())

    const totalPaidClinics = await prisma.organization.count({
        where: { tier: { not: "FREE" }, isTestAccount: false },
    })

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
            where: { tier: { not: "FREE" }, isTestAccount: false, medicalRecords: { some: {} } },
        }),
        prisma.organization.count({
            where: { tier: { not: "FREE" }, isTestAccount: false, anamneses: { some: {} } },
        }),
        prisma.organization.count({
            where: { tier: { not: "FREE" }, isTestAccount: false, guiasTiss: { some: {} } },
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

    const pct = (n: number) =>
        totalPaidClinics > 0 ? Math.round((n / totalPaidClinics) * 100) : 0

    const features = [
        {
            name: "Prontuário Digital",
            count: withProntuario,
            pct: pct(withProntuario),
            color: "bg-amber-400",
            description: "Clínicas com ao menos 1 prontuário criado",
        },
        {
            name: "Anamnese Digital",
            count: withAnamnese,
            pct: pct(withAnamnese),
            color: "bg-teal-400",
            description: "Clínicas com ao menos 1 anamnese registrada",
        },
        {
            name: "Agenda Ativa",
            count: withAgenda,
            pct: pct(withAgenda),
            color: "bg-blue-400",
            description: "Clínicas com sessões agendadas este mês",
        },
        {
            name: "Convênios Cadastrados",
            count: withConvenio,
            pct: pct(withConvenio),
            color: "bg-purple-400",
            description: "Clínicas com ao menos 1 operadora ativa",
        },
        {
            name: "TISS (Guias)",
            count: withTiss,
            pct: pct(withTiss),
            color: "bg-rose-400",
            description: "Clínicas que emitiram guias TISS",
        },
        {
            name: "NFS-e",
            count: withNfse,
            pct: pct(withNfse),
            color: "bg-orange-400",
            description: "Clínicas que emitiram nota fiscal eletrônica",
        },
        {
            name: "No-show Predictor",
            count: withNoShow,
            pct: pct(withNoShow),
            color: "bg-green-400",
            description: "Clínicas com score preditivo ativo em pacientes",
        },
    ]

    const avgAdoption =
        features.length > 0
            ? Math.round(features.reduce((a, f) => a + f.pct, 0) / features.length)
            : 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <BarChart3 className="h-7 w-7 text-amber-400" />
                    Adoção de Features
                </h1>
                <p className="text-slate-400">
                    % das clínicas pagas ({totalPaidClinics}) utilizando cada funcionalidade
                </p>
            </div>

            {/* Average adoption */}
            <Card className="bg-slate-900 border-slate-800 max-w-xs">
                <CardContent className="pt-6 flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-amber-400 flex-shrink-0" />
                    <div>
                        <div className="text-3xl font-bold text-amber-400">{avgAdoption}%</div>
                        <p className="text-xs text-slate-500">Adoção média geral</p>
                    </div>
                </CardContent>
            </Card>

            {/* Feature bars */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Features por Clínica Paga</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {features.map((f) => (
                        <div key={f.name}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div>
                                    <span className="text-sm font-medium text-white">{f.name}</span>
                                    <p className="text-xs text-slate-500">{f.description}</p>
                                </div>
                                <div className="text-right ml-4 shrink-0">
                                    <span className="text-lg font-bold text-amber-400">
                                        {f.pct}%
                                    </span>
                                    <p className="text-xs text-slate-500">
                                        {f.count}/{totalPaidClinics}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2.5">
                                <div
                                    className={`${f.color} h-2.5 rounded-full transition-all duration-500`}
                                    style={{ width: `${f.pct}%` }}
                                />
                            </div>
                        </div>
                    ))}

                    {totalPaidClinics === 0 && (
                        <p className="text-slate-500 text-sm text-center py-8">
                            Nenhuma clínica paga cadastrada ainda.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
