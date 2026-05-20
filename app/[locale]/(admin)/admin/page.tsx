import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import {
    Users,
    Building2,
    Database,
    TrendingUp,
    Network,
    Stethoscope,
    UserRound,
    CalendarCheck,
    ShieldCheck,
    AlertCircle,
} from "lucide-react"
import { getGraphStats } from "@/lib/nlp/pipeline"
import { getBlogProcessingStats } from "@/lib/nlp/blog-processor"
import { KnowledgeGraphQuickActions } from "./knowledge-graph-quick-actions"
import { startOfMonth } from "date-fns"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
    const now = new Date()
    const monthStart = startOfMonth(now)

    const [
        usersCount,
        orgsCount,
        clinicasAtivasCount,
        pacientesCount,
        sessoesNoMesCount,
        profissionaisPendentesCount,
        graphStats,
        blogStats,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.organization.count(),
        prisma.organization.count({
            where: { tier: { not: "FREE" }, isTestAccount: false },
        }),
        prisma.patient.count(),
        prisma.treatmentSession.count({
            where: { dataAgendada: { gte: monthStart } },
        }),
        prisma.professional.count({
            where: { conselhoStatus: "pendente" },
        }),
        getGraphStats(),
        getBlogProcessingStats(),
    ])

    const clinicaStats = [
        {
            title: "Clínicas Ativas",
            value: clinicasAtivasCount,
            icon: Stethoscope,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            description: "Planos pagos (excl. trial/test)",
        },
        {
            title: "Pacientes na Plataforma",
            value: pacientesCount,
            icon: UserRound,
            color: "text-teal-400",
            bg: "bg-teal-400/10",
            description: "Total cadastrado",
        },
        {
            title: "Sessões este Mês",
            value: sessoesNoMesCount,
            icon: CalendarCheck,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            description: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        },
        {
            title: "CFM Pendentes",
            value: profissionaisPendentesCount,
            icon: profissionaisPendentesCount > 0 ? AlertCircle : ShieldCheck,
            color: profissionaisPendentesCount > 0 ? "text-red-400" : "text-green-400",
            bg: profissionaisPendentesCount > 0 ? "bg-red-400/10" : "bg-green-400/10",
            description: "Profissionais aguardando validação",
        },
    ]

    const platformStats = [
        { title: "Total Usuários", value: usersCount, icon: Users, color: "text-slate-400" },
        { title: "Organizações", value: orgsCount, icon: Building2, color: "text-purple-400" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Visão Geral</h1>
                <p className="text-slate-400">Métricas da plataforma Estetia CRM</p>
            </div>

            {/* KPIs Clínicos — P0 */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-3">
                    Plataforma Clínica
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {clinicaStats.map((stat) => (
                        <Card key={stat.title} className="bg-slate-900 border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`rounded-lg p-1.5 ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* KPIs de Plataforma (legado — mantido para referência) */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-3">
                    Plataforma Geral
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-md">
                    {platformStats.map((stat) => (
                        <Card key={stat.title} className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-300">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Atividade Recente */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-lg font-medium text-white mb-2">Atividade Recente</h3>
                <p className="text-slate-500 text-sm">
                    Audit logs disponíveis em{" "}
                    <a href="/admin/access-logs" className="text-amber-400 hover:underline">
                        Compliance → Logs de Acesso
                    </a>{" "}
                    e{" "}
                    <a href="/admin/lgpd" className="text-amber-400 hover:underline">
                        Compliance → Solicitações LGPD
                    </a>
                    .
                </p>
            </div>

            {/* Knowledge Graph Widget */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Knowledge Graph</h2>
                    <p className="text-slate-400 text-sm">
                        NLP-powered semantic entity extraction from blog content
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Entities Extracted
                            </CardTitle>
                            <Database className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{graphStats.totalEntities}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                {graphStats.totalRelationships} relationships
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Blog Posts Processed
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {blogStats.processedPosts}/{blogStats.totalPosts}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{blogStats.pendingPosts} pending</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                Graph Density
                            </CardTitle>
                            <Network className="h-4 w-4 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {graphStats.avgRelationshipsPerEntity}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">avg rel/entity</p>
                        </CardContent>
                    </Card>
                </div>

                <KnowledgeGraphQuickActions
                    pendingPosts={blogStats.pendingPosts}
                    totalEntities={graphStats.totalEntities}
                />
            </div>
        </div>
    )
}
