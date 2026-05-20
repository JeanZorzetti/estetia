import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { startOfMonth } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
    ArrowLeft,
    Stethoscope,
    UserRound,
    CalendarCheck,
    LifeBuoy,
    ShieldCheck,
    AlertCircle,
    FileText,
    Heart,
    Users,
} from "lucide-react"

export const dynamic = "force-dynamic"

const TIER_BADGE: Record<string, string> = {
    FREE: "bg-slate-700 text-slate-300",
    STARTER: "bg-blue-600 text-white",
    PRO: "bg-purple-600 text-white",
    BUSINESS: "bg-amber-500 text-slate-950",
}

export default async function ClinicDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const { id } = await params
    const now = new Date()
    const monthStart = startOfMonth(now)

    const clinic = await prisma.organization.findUnique({
        where: { id },
        include: {
            professionals: {
                select: {
                    id: true,
                    nome: true,
                    conselho: true,
                    numeroConselho: true,
                    conselhoStatus: true,
                    especialidades: true,
                },
                orderBy: { nome: "asc" },
            },
            _count: {
                select: {
                    patients: true,
                    users: true,
                    medicalRecords: true,
                    supportTickets: true,
                },
            },
        },
    })

    if (!clinic) notFound()

    const [sessionsThisMonth, consentimentos, guiasTissData, ticketsAbertos] = await Promise.all([
        prisma.treatmentSession.count({
            where: { organizationId: id, dataAgendada: { gte: monthStart } },
        }),
        prisma.consentLog.count({
            where: { organizationId: id, revokedAt: null },
        }),
        prisma.guiaTiss
            .groupBy({
                by: ["status"],
                where: { organizationId: id },
                _count: { id: true },
            })
            .catch(() => []),
        prisma.supportTicket.findMany({
            where: { organizationId: id, status: { in: ["OPEN", "IN_PROGRESS"] } },
            select: { id: true, subject: true, status: true, priority: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
    ])

    const profPendentes = clinic.professionals.filter((p) => p.conselhoStatus === "pendente")
    const guiasMap = new Map(guiasTissData.map((g) => [g.status as string, (g._count as { id: number }).id]))

    const statusClinica =
        clinic.trialStatus === "ACTIVE" && clinic.trialEndsAt && clinic.trialEndsAt > now
            ? "trial"
            : clinic.failedPaymentAttempts >= 3
            ? "suspended"
            : clinic.tier !== "FREE"
            ? "active"
            : "free"

    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/clinics"
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Clínicas
                </Link>
                <span className="text-slate-600">/</span>
                <span className="text-white font-medium">{clinic.name}</span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-amber-400/10 p-3">
                        <Stethoscope className="h-7 w-7 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{clinic.name}</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {clinic.slug} • Criada em {clinic.createdAt.toLocaleDateString("pt-BR")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {clinic.isFounder && (
                        <Badge className="bg-amber-400/20 text-amber-400 border border-amber-400/30">
                            ★ Fundador
                        </Badge>
                    )}
                    <Badge className={TIER_BADGE[clinic.tier]}>{clinic.tier}</Badge>
                    <Badge
                        className={
                            statusClinica === "active"
                                ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                : statusClinica === "trial"
                                ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                                : statusClinica === "suspended"
                                ? "bg-red-600/20 text-red-400 border border-red-600/30"
                                : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                        }
                    >
                        {statusClinica === "active"
                            ? "Ativa"
                            : statusClinica === "trial"
                            ? "Trial"
                            : statusClinica === "suspended"
                            ? "Suspensa"
                            : "Free"}
                    </Badge>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Pacientes",
                        value: clinic._count.patients,
                        icon: UserRound,
                        color: "text-teal-400",
                    },
                    {
                        label: "Sessões este mês",
                        value: sessionsThisMonth,
                        icon: CalendarCheck,
                        color: "text-blue-400",
                    },
                    {
                        label: "Prontuários",
                        value: clinic._count.medicalRecords,
                        icon: FileText,
                        color: "text-purple-400",
                    },
                    {
                        label: "Consentimentos LGPD",
                        value: consentimentos,
                        icon: ShieldCheck,
                        color: "text-green-400",
                    },
                ].map((s) => (
                    <Card key={s.label} className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-6 flex items-center gap-4">
                            <s.icon className={`h-8 w-8 ${s.color} flex-shrink-0`} />
                            <div>
                                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                <p className="text-xs text-slate-500">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Profissionais */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            Profissionais ({clinic.professionals.length})
                        </CardTitle>
                        {profPendentes.length > 0 && (
                            <Badge className="bg-red-600/20 text-red-400 border border-red-600/30">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {profPendentes.length} pendente(s) CFM
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {clinic.professionals.length === 0 ? (
                                <p className="text-slate-500 text-sm">Nenhum profissional cadastrado.</p>
                            ) : (
                                clinic.professionals.map((prof) => (
                                    <div
                                        key={prof.id}
                                        className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm text-white font-medium">{prof.nome}</p>
                                            <p className="text-xs text-slate-500">
                                                {prof.conselho && `${prof.conselho} ${prof.numeroConselho || ""}`}
                                                {prof.especialidades.length > 0 &&
                                                    ` • ${prof.especialidades[0]}`}
                                            </p>
                                        </div>
                                        <Badge
                                            className={
                                                prof.conselhoStatus === "ativo"
                                                    ? "bg-green-600/20 text-green-400 text-xs"
                                                    : prof.conselhoStatus === "pendente"
                                                    ? "bg-red-600/20 text-red-400 text-xs"
                                                    : "bg-slate-700 text-slate-400 text-xs"
                                            }
                                        >
                                            {prof.conselhoStatus || "—"}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* TISS / Guias */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Heart className="h-4 w-4 text-slate-400" />
                            Guias TISS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {guiasTissData.length === 0 ? (
                            <p className="text-slate-500 text-sm">Nenhuma guia emitida.</p>
                        ) : (
                            <div className="space-y-2">
                                {[
                                    { status: "AUTORIZADA", label: "Autorizadas", color: "text-green-400" },
                                    { status: "ENVIADA", label: "Enviadas", color: "text-blue-400" },
                                    { status: "GLOSADA", label: "Glosadas", color: "text-red-400" },
                                    { status: "PAGA", label: "Pagas", color: "text-amber-400" },
                                    { status: "RASCUNHO", label: "Rascunho", color: "text-slate-400" },
                                ].map(({ status, label, color }) =>
                                    guiasMap.has(status) ? (
                                        <div key={status} className="flex justify-between">
                                            <span className="text-sm text-slate-400">{label}</span>
                                            <span className={`text-sm font-medium ${color}`}>
                                                {guiasMap.get(status)}
                                            </span>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tickets de Suporte */}
                <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <LifeBuoy className="h-4 w-4 text-slate-400" />
                            Tickets de Suporte Abertos
                        </CardTitle>
                        <Link
                            href={`/admin/support?org=${id}`}
                            className="text-xs text-amber-400 hover:underline"
                        >
                            Ver todos
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {ticketsAbertos.length === 0 ? (
                            <p className="text-slate-500 text-sm">Nenhum ticket aberto.</p>
                        ) : (
                            <div className="space-y-2">
                                {ticketsAbertos.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                                    >
                                        <p className="text-sm text-slate-200">{ticket.subject}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={
                                                    ticket.priority === "HIGH" || ticket.priority === "URGENT"
                                                        ? "bg-red-600/20 text-red-400 text-xs"
                                                        : "bg-slate-700 text-slate-400 text-xs"
                                                }
                                            >
                                                {ticket.priority}
                                            </Badge>
                                            <Badge className="bg-slate-800 text-slate-400 text-xs">
                                                {ticket.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
