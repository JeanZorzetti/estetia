import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { startOfMonth } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import {
    Stethoscope,
    Users,
    UserRound,
    CalendarCheck,
    LifeBuoy,
    ExternalLink,
    AlertCircle,
} from "lucide-react"

export const dynamic = "force-dynamic"

const TIER_BADGE: Record<string, string> = {
    FREE: "bg-slate-700 text-slate-300",
    STARTER: "bg-blue-600 text-white",
    PRO: "bg-purple-600 text-white",
    BUSINESS: "bg-amber-500 text-slate-950",
}

const STATUS_BADGE: Record<string, string> = {
    active: "bg-green-600/20 text-green-400 border-green-600/30",
    trial: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    free: "bg-slate-700/50 text-slate-400 border-slate-600/30",
    suspended: "bg-red-600/20 text-red-400 border-red-600/30",
}

const STATUS_LABEL: Record<string, string> = {
    active: "Ativa",
    trial: "Trial",
    free: "Free",
    suspended: "Suspensa",
}

export default async function ClinicsPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const now = new Date()
    const monthStart = startOfMonth(now)

    const clinics = await prisma.organization.findMany({
        where: { isTestAccount: false },
        orderBy: { createdAt: "desc" },
        take: 100,
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
    })

    const clinicIds = clinics.map((c) => c.id)
    const sessionsThisMonth = await prisma.treatmentSession.groupBy({
        by: ["organizationId"],
        where: { organizationId: { in: clinicIds }, dataAgendada: { gte: monthStart } },
        _count: { id: true },
    })
    const sessionsMap = new Map(sessionsThisMonth.map((s) => [s.organizationId, (s._count as { id: number }).id]))

    const enriched = clinics.map((clinic) => {
        const status =
            clinic.trialStatus === "ACTIVE" && clinic.trialEndsAt && clinic.trialEndsAt > now
                ? "trial"
                : clinic.failedPaymentAttempts >= 3
                ? "suspended"
                : clinic.tier !== "FREE"
                ? "active"
                : "free"
        return { ...clinic, sessionsThisMonth: sessionsMap.get(clinic.id) || 0, status }
    })

    const totals = {
        all: enriched.length,
        active: enriched.filter((c) => c.status === "active").length,
        trial: enriched.filter((c) => c.status === "trial").length,
        suspended: enriched.filter((c) => c.status === "suspended").length,
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Stethoscope className="h-7 w-7 text-amber-400" />
                    Clínicas
                </h1>
                <p className="text-slate-400">Gestão das clínicas-clientes da plataforma Estetia</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: totals.all, color: "text-white" },
                    { label: "Ativas", value: totals.active, color: "text-green-400" },
                    { label: "Em Trial", value: totals.trial, color: "text-blue-400" },
                    { label: "Suspensas", value: totals.suspended, color: "text-red-400" },
                ].map((s) => (
                    <Card key={s.label} className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-6">
                            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Listagem de Clínicas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Clínica</TableHead>
                                <TableHead className="text-slate-400">Plano</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400 text-right">
                                    <span className="flex items-center justify-end gap-1">
                                        <UserRound className="h-3.5 w-3.5" /> Pacientes
                                    </span>
                                </TableHead>
                                <TableHead className="text-slate-400 text-right">
                                    <span className="flex items-center justify-end gap-1">
                                        <Users className="h-3.5 w-3.5" /> Profissionais
                                    </span>
                                </TableHead>
                                <TableHead className="text-slate-400 text-right">
                                    <span className="flex items-center justify-end gap-1">
                                        <CalendarCheck className="h-3.5 w-3.5" /> Sessões/mês
                                    </span>
                                </TableHead>
                                <TableHead className="text-slate-400 text-right">
                                    <span className="flex items-center justify-end gap-1">
                                        <LifeBuoy className="h-3.5 w-3.5" /> Tickets
                                    </span>
                                </TableHead>
                                <TableHead className="text-slate-400 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enriched.map((clinic) => (
                                <TableRow
                                    key={clinic.id}
                                    className="border-slate-800 hover:bg-slate-800/50"
                                >
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{clinic.name}</span>
                                            <span className="text-xs text-slate-500">{clinic.slug}</span>
                                            {clinic.isFounder && (
                                                <span className="text-xs text-amber-400 font-medium">
                                                    ★ Fundador
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${TIER_BADGE[clinic.tier]} text-xs`}>
                                            {clinic.tier}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`${STATUS_BADGE[clinic.status]} border text-xs`}
                                        >
                                            {clinic.status === "suspended" && (
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                            )}
                                            {STATUS_LABEL[clinic.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-slate-300">
                                        {clinic._count.patients}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-300">
                                        {clinic._count.professionals}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-300">
                                        {clinic.sessionsThisMonth}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span
                                            className={
                                                clinic._count.supportTickets > 0
                                                    ? "text-amber-400 font-medium"
                                                    : "text-slate-500"
                                            }
                                        >
                                            {clinic._count.supportTickets}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            href={`/admin/clinics/${clinic.id}`}
                                            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                                        >
                                            Ver
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
