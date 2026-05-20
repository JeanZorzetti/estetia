import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
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
import { Server, CheckCircle2, AlertCircle, RefreshCw, Link2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { subDays } from "date-fns"

export const dynamic = "force-dynamic"

export default async function SystemHealthPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const since = subDays(new Date(), 7)

    const [webhookStats, recentFailures, integrationCount, totalWebhooks] = await Promise.all([
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
        prisma.webhookLog.count({ where: { sentAt: { gte: since } } }),
    ])

    const webhookMap = Object.fromEntries(
        webhookStats.map((s) => [s.status, (s._count as { id: number }).id])
    )
    const failed = (webhookMap["FAILED"] || 0) + (webhookMap["RETRYING"] || 0)
    const delivered = webhookMap["DELIVERED"] || 0
    const successRate =
        totalWebhooks > 0 ? Math.round((delivered / totalWebhooks) * 100) : null

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Server className="h-7 w-7 text-amber-400" />
                    Saúde do Sistema
                </h1>
                <p className="text-slate-400">Webhooks, integrações e status nos últimos 7 dias</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Total Webhooks (7d)",
                        value: totalWebhooks,
                        color: "text-white",
                        icon: Server,
                    },
                    {
                        label: "Entregues",
                        value: delivered,
                        color: "text-green-400",
                        icon: CheckCircle2,
                    },
                    {
                        label: "Falhas / Retry",
                        value: failed,
                        color: failed > 0 ? "text-red-400" : "text-green-400",
                        icon: AlertCircle,
                    },
                    {
                        label: "Integrações Ativas",
                        value: integrationCount,
                        color: "text-blue-400",
                        icon: Link2,
                    },
                ].map((s) => (
                    <Card key={s.label} className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-5 flex items-center gap-3">
                            <s.icon className={`h-7 w-7 ${s.color} flex-shrink-0`} />
                            <div>
                                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                <p className="text-xs text-slate-500">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Success rate bar */}
            {successRate !== null && (
                <Card className="bg-slate-900 border-slate-800 max-w-lg">
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Taxa de entrega (7d)</span>
                            <span
                                className={`text-sm font-bold ${
                                    successRate >= 95
                                        ? "text-green-400"
                                        : successRate >= 80
                                        ? "text-amber-400"
                                        : "text-red-400"
                                }`}
                            >
                                {successRate}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${
                                    successRate >= 95
                                        ? "bg-green-400"
                                        : successRate >= 80
                                        ? "bg-amber-400"
                                        : "bg-red-400"
                                }`}
                                style={{ width: `${successRate}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Sentry note */}
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400">
                    Para monitoramento de erros em tempo real, acesse o{" "}
                    <strong className="text-white">Sentry Dashboard</strong> configurado em{" "}
                    <code className="text-amber-400 text-xs bg-slate-800 px-1 py-0.5 rounded">
                        sentry.io
                    </code>
                    . Os arquivos{" "}
                    <code className="text-amber-400 text-xs bg-slate-800 px-1 py-0.5 rounded">
                        sentry.*.config.ts
                    </code>{" "}
                    estão ativos no projeto.
                </p>
            </div>

            {/* Recent failures */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-red-400" />
                        Falhas Recentes de Webhook (últimos 7 dias)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Evento</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">HTTP</TableHead>
                                <TableHead className="text-slate-400">Tentativas</TableHead>
                                <TableHead className="text-slate-400">Organização</TableHead>
                                <TableHead className="text-slate-400">Erro</TableHead>
                                <TableHead className="text-slate-400">Quando</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(recentFailures as Array<{id: string; eventType: string; status: string; statusCode?: number | null; attempts: number; errorMessage?: string | null; sentAt: Date; organization: {name: string}}>).map((log) => (
                                <TableRow
                                    key={log.id}
                                    className="border-slate-800 hover:bg-slate-800/50"
                                >
                                    <TableCell className="text-slate-300 text-sm font-mono">
                                        {log.eventType}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                log.status === "FAILED"
                                                    ? "bg-red-600/20 text-red-400 text-xs"
                                                    : "bg-amber-600/20 text-amber-400 text-xs"
                                            }
                                        >
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm font-mono">
                                        {log.statusCode || "—"}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {log.attempts}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {log.organization.name}
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-xs max-w-xs truncate">
                                        {log.errorMessage || "—"}
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-xs">
                                        {formatDistanceToNow(new Date(log.sentAt), {
                                            addSuffix: true,
                                            locale: ptBR,
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {recentFailures.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-slate-500 py-8"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-2" />
                                        Nenhuma falha nos últimos 7 dias.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
