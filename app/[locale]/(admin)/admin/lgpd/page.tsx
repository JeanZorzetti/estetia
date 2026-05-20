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
import { Scale, ShieldCheck, Eye, FileDown, Trash2, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export const dynamic = "force-dynamic"

const ACTION_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    VIEW: { label: "Visualização", icon: Eye, color: "text-blue-400" },
    CREATE: { label: "Criação", icon: ShieldCheck, color: "text-green-400" },
    UPDATE: { label: "Atualização", icon: ShieldCheck, color: "text-amber-400" },
    EXPORT: { label: "Exportação", icon: FileDown, color: "text-purple-400" },
    DELETE: { label: "Exclusão", icon: Trash2, color: "text-red-400" },
}

export default async function LGPDPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const [totalConsents, revokedConsents, totalAuditLogs, recentLogs, exportLogs, deleteLogs] =
        await Promise.all([
            prisma.consentLog.count({ where: { revokedAt: null } }),
            prisma.consentLog.count({ where: { revokedAt: { not: null } } }),
            prisma.medicalAccessLog.count(),
            prisma.medicalAccessLog.findMany({
                orderBy: { createdAt: "desc" },
                take: 50,
            }),
            prisma.medicalAccessLog.count({ where: { action: "EXPORT" } }),
            prisma.medicalAccessLog.count({ where: { action: "DELETE" } }),
        ])

    // Enrich logs with user and patient
    const userIds = [...new Set(recentLogs.map((l) => l.userId).filter(Boolean) as string[])]
    const patientIds = [...new Set(recentLogs.map((l) => l.pacienteId))]
    const orgIds = [...new Set(recentLogs.map((l) => l.organizationId))]

    const [users, patients, orgs] = await Promise.all([
        prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true },
        }),
        prisma.patient.findMany({
            where: { id: { in: patientIds } },
            select: { id: true, nome: true },
        }),
        prisma.organization.findMany({
            where: { id: { in: orgIds } },
            select: { id: true, name: true },
        }),
    ])

    const usersMap = new Map(users.map((u) => [u.id, u]))
    const patientsMap = new Map(patients.map((p) => [p.id, p]))
    const orgsMap = new Map(orgs.map((o) => [o.id, o]))

    const enrichedLogs = recentLogs.map((log) => ({
        ...log,
        user: log.userId ? usersMap.get(log.userId) : null,
        patient: patientsMap.get(log.pacienteId),
        org: orgsMap.get(log.organizationId),
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Scale className="h-7 w-7 text-amber-400" />
                    Compliance LGPD
                </h1>
                <p className="text-slate-400">
                    Audit logs de acesso a prontuários e controle de consentimentos
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Consentimentos Ativos",
                        value: totalConsents,
                        color: "text-green-400",
                        icon: ShieldCheck,
                    },
                    {
                        label: "Consentimentos Revogados",
                        value: revokedConsents,
                        color: "text-red-400",
                        icon: AlertCircle,
                    },
                    {
                        label: "Total Audit Logs",
                        value: totalAuditLogs,
                        color: "text-blue-400",
                        icon: Eye,
                    },
                    {
                        label: "Exportações / Exclusões",
                        value: `${exportLogs} / ${deleteLogs}`,
                        color: "text-purple-400",
                        icon: FileDown,
                    },
                ].map((s) => (
                    <Card key={s.label} className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-6 flex items-center gap-4">
                            <s.icon className={`h-7 w-7 ${s.color} flex-shrink-0`} />
                            <div>
                                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info LGPD */}
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200/80">
                    <strong className="text-amber-400">Prazo LGPD:</strong> Solicitações de export, delete
                    ou portabilidade devem ser respondidas em até <strong>15 dias úteis</strong>. Incidentes
                    de segurança com dados pessoais devem ser notificados à ANPD em até{" "}
                    <strong>72 horas</strong>.
                </p>
            </div>

            {/* Audit Log Table */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">
                        Audit Log — Acessos a Prontuários (últimos 50)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Ação</TableHead>
                                <TableHead className="text-slate-400">Paciente</TableHead>
                                <TableHead className="text-slate-400">Clínica</TableHead>
                                <TableHead className="text-slate-400">Usuário / Sistema</TableHead>
                                <TableHead className="text-slate-400">Tipo de Registro</TableHead>
                                <TableHead className="text-slate-400">Quando</TableHead>
                                <TableHead className="text-slate-400">IP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrichedLogs.map((log) => {
                                const config = ACTION_CONFIG[log.action] || {
                                    label: log.action,
                                    icon: Eye,
                                    color: "text-slate-400",
                                }
                                const Icon = config.icon
                                return (
                                    <TableRow
                                        key={log.id}
                                        className="border-slate-800 hover:bg-slate-800/50"
                                    >
                                        <TableCell>
                                            <div className={`flex items-center gap-1.5 ${config.color}`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                <span className="text-xs font-medium">{config.label}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300 text-sm">
                                            {log.patient?.nome || (
                                                <span className="text-slate-600 italic text-xs">
                                                    ID: {log.pacienteId.slice(0, 8)}…
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {log.org?.name || log.organizationId.slice(0, 8) + "…"}
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {log.user ? (
                                                <span>{log.user.name || log.user.email}</span>
                                            ) : (
                                                <span className="text-slate-600 italic text-xs">Sistema</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-slate-800 text-slate-400 text-xs">
                                                {log.recordType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-xs">
                                            {formatDistanceToNow(new Date(log.createdAt), {
                                                addSuffix: true,
                                                locale: ptBR,
                                            })}
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-xs font-mono">
                                            {log.ipAddress || "—"}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {enrichedLogs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-slate-500 py-8"
                                    >
                                        Nenhum log de acesso registrado.
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
