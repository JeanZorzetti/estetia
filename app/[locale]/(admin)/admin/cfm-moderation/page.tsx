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
import { ClipboardList, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CFMValidateButton } from "./cfm-validate-button"

export const dynamic = "force-dynamic"

export default async function CFMModerationPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const [pendentes, ativos, inativos] = await Promise.all([
        prisma.professional.findMany({
            where: { conselhoStatus: "pendente" },
            orderBy: { createdAt: "asc" },
            include: {
                organization: { select: { id: true, name: true, tier: true } },
                user: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma.professional.count({ where: { conselhoStatus: "ativo" } }),
        prisma.professional.count({ where: { conselhoStatus: "inativo" } }),
    ])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <ClipboardList className="h-7 w-7 text-amber-400" />
                    Moderação CFM / Conselhos
                </h1>
                <p className="text-slate-400">
                    Validação de profissionais com registro em conselho pendente
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 max-w-lg">
                {[
                    { label: "Pendentes", value: pendentes.length, color: "text-red-400", icon: AlertCircle },
                    { label: "Ativos", value: ativos, color: "text-green-400", icon: CheckCircle2 },
                    { label: "Inativos", value: inativos, color: "text-slate-400", icon: ShieldCheck },
                ].map((s) => (
                    <Card key={s.label} className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-5 flex items-center gap-3">
                            <s.icon className={`h-6 w-6 ${s.color} flex-shrink-0`} />
                            <div>
                                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                <p className="text-xs text-slate-500">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {pendentes.length > 0 && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200/80">
                        <strong className="text-red-400">{pendentes.length} profissional(is) pendente(s)</strong>{" "}
                        de validação. Profissionais com conselho não validado não devem ter acesso a
                        prontuários de pacientes.
                    </p>
                </div>
            )}

            {pendentes.length === 0 && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-200/80">
                        <strong className="text-green-400">Fila limpa!</strong> Nenhum profissional aguardando
                        validação no momento.
                    </p>
                </div>
            )}

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">
                        Fila de Validação ({pendentes.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Profissional</TableHead>
                                <TableHead className="text-slate-400">Conselho</TableHead>
                                <TableHead className="text-slate-400">Número</TableHead>
                                <TableHead className="text-slate-400">UF</TableHead>
                                <TableHead className="text-slate-400">Especialidades</TableHead>
                                <TableHead className="text-slate-400">Clínica</TableHead>
                                <TableHead className="text-slate-400">Aguardando</TableHead>
                                <TableHead className="text-slate-400 text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendentes.map((prof) => (
                                <TableRow
                                    key={prof.id}
                                    className="border-slate-800 hover:bg-slate-800/50"
                                >
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{prof.nome}</span>
                                            {prof.user && (
                                                <span className="text-xs text-slate-500">
                                                    {prof.user.email}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {prof.conselho ? (
                                            <Badge className="bg-slate-800 text-slate-300 text-xs">
                                                {prof.conselho}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-600 text-xs">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-300 text-sm font-mono">
                                        {prof.numeroConselho || "—"}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                        {prof.ufConselho || "—"}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-xs">
                                        {prof.especialidades.length > 0
                                            ? prof.especialidades.slice(0, 2).join(", ")
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-200">
                                                {prof.organization.name}
                                            </span>
                                            <Badge
                                                className={`text-xs w-fit mt-0.5 ${
                                                    prof.organization.tier === "BUSINESS"
                                                        ? "bg-amber-500/20 text-amber-400"
                                                        : prof.organization.tier === "PRO"
                                                        ? "bg-purple-500/20 text-purple-400"
                                                        : "bg-slate-700 text-slate-400"
                                                }`}
                                            >
                                                {prof.organization.tier}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-xs">
                                        {formatDistanceToNow(new Date(prof.createdAt), {
                                            addSuffix: true,
                                            locale: ptBR,
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <CFMValidateButton professionalId={prof.id} nome={prof.nome} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pendentes.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-slate-500 py-10"
                                    >
                                        Nenhum profissional pendente de validação.
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
