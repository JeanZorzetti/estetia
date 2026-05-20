import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Star } from "lucide-react"
import { RevenueChart } from "./revenue-chart"

export const dynamic = "force-dynamic"

export default async function RevenuePage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const snapshots = await prisma.revenueSnapshot.findMany({
        where: { organizationId: null },
        orderBy: [{ year: "asc" }, { month: "asc" }],
        take: 24,
    })

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

    const latestSnapshot = snapshots[snapshots.length - 1]
    const prevSnapshot = snapshots[snapshots.length - 2]

    const mrrGrowth =
        latestSnapshot && prevSnapshot && Number(prevSnapshot.mrr) > 0
            ? (
                  ((Number(latestSnapshot.mrr) - Number(prevSnapshot.mrr)) /
                      Number(prevSnapshot.mrr)) *
                  100
              ).toFixed(1)
            : null

    const TIER_PRICES: Record<string, number> = {
        FREE: 0,
        STARTER: 149,
        PRO: 349,
        BUSINESS: 799,
    }

    const estimatedMRR = Object.entries(tierMap).reduce(
        (acc, [tier, count]) => acc + (TIER_PRICES[tier] || 0) * count,
        0
    )

    const chartData = snapshots.map((s) => ({
        label: `${s.month.toString().padStart(2, "0")}/${s.year}`,
        mrr: Number(s.mrr),
        newOrgs: s.newOrganizations,
        churnedOrgs: s.churnedOrganizations,
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <DollarSign className="h-7 w-7 text-amber-400" />
                    Saúde Financeira
                </h1>
                <p className="text-slate-400">MRR, churn e distribuição de planos</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs text-slate-400 uppercase tracking-wide">
                            MRR Estimado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-400">
                            R$ {estimatedMRR.toLocaleString("pt-BR")}
                        </div>
                        {mrrGrowth !== null && (
                            <div
                                className={`flex items-center gap-1 text-xs mt-1 ${
                                    parseFloat(mrrGrowth) >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                {parseFloat(mrrGrowth) >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {mrrGrowth}% vs mês anterior
                            </div>
                        )}
                    </CardContent>
                </Card>

                {[
                    { tier: "BUSINESS", color: "text-amber-400", label: "Business" },
                    { tier: "PRO", color: "text-purple-400", label: "Pro" },
                    { tier: "STARTER", color: "text-blue-400", label: "Starter" },
                ].map(({ tier, color, label }) => (
                    <Card key={tier} className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-slate-400 uppercase tracking-wide">
                                {label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${color}`}>
                                {tierMap[tier] || 0}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                R$ {((tierMap[tier] || 0) * TIER_PRICES[tier]).toLocaleString("pt-BR")}/mês
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-5 flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                        <div>
                            <div className="text-xl font-bold text-red-400">{inadimplentes}</div>
                            <p className="text-xs text-slate-500">Inadimplentes</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-5 flex items-center gap-3">
                        <Star className="h-6 w-6 text-amber-400 flex-shrink-0" />
                        <div>
                            <div className="text-xl font-bold text-amber-400">{founders}</div>
                            <p className="text-xs text-slate-500">Fundadores</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-5 flex items-center gap-3">
                        <DollarSign className="h-6 w-6 text-slate-400 flex-shrink-0" />
                        <div>
                            <div className="text-xl font-bold text-slate-300">{tierMap["FREE"] || 0}</div>
                            <p className="text-xs text-slate-500">Free (não pagantes)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Distribuição de planos */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Distribuição de Planos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { tier: "BUSINESS", label: "Business", color: "bg-amber-400", price: 799 },
                            { tier: "PRO", label: "Pro", color: "bg-purple-500", price: 349 },
                            { tier: "STARTER", label: "Starter", color: "bg-blue-500", price: 149 },
                            { tier: "FREE", label: "Free", color: "bg-slate-600", price: 0 },
                        ].map(({ tier, label, color, price }) => {
                            const count = tierMap[tier] || 0
                            const total = Object.values(tierMap).reduce((a, b) => a + b, 0) || 1
                            const pct = Math.round((count / total) * 100)
                            return (
                                <div key={tier} className="flex items-center gap-4">
                                    <div className="w-24 text-sm text-slate-300 shrink-0">{label}</div>
                                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                                        <div
                                            className={`${color} h-2 rounded-full transition-all`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right text-sm font-medium text-slate-300">
                                        {count}
                                    </div>
                                    <div className="w-20 text-right text-xs text-slate-500">
                                        {price > 0
                                            ? `R$ ${(count * price).toLocaleString("pt-BR")}`
                                            : "—"}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Historical chart */}
            {chartData.length > 0 && (
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">MRR Histórico</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RevenueChart data={chartData} />
                    </CardContent>
                </Card>
            )}

            {chartData.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Nenhum snapshot histórico disponível ainda. Os dados serão preenchidos mensalmente
                        pelo cron job de RevenueSnapshot.
                    </p>
                </div>
            )}
        </div>
    )
}
