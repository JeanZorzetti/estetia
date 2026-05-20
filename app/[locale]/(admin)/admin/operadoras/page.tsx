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
import { Heart, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function OperadorasPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const operadoras = await prisma.operadora.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" },
        include: {
            organization: { select: { id: true, name: true } },
            _count: { select: { guias: true, convenios: true } },
        },
    })

    const operadoraIds = operadoras.map((o) => o.id)
    const guiaStats = await prisma.guiaTiss.groupBy({
        by: ["operadoraId", "status"],
        where: { operadoraId: { in: operadoraIds } },
        _count: { id: true },
    })

    const statsMap = new Map<string, Record<string, number>>()
    for (const stat of guiaStats) {
        const existing = statsMap.get(stat.operadoraId) || {}
        existing[stat.status] = stat._count.id
        statsMap.set(stat.operadoraId, existing)
    }

    const enriched = operadoras.map((op) => {
        const stats = statsMap.get(op.id) || {}
        const total = Object.values(stats).reduce((a, b) => a + b, 0)
        const glosadas = (stats["GLOSADA"] || 0) + (stats["NEGADA"] || 0)
        const glosaRate = total > 0 ? ((glosadas / total) * 100).toFixed(1) : null
        return { ...op, guiaStats: stats, glosaRate, totalGuias: total }
    })

    const totalGuias = enriched.reduce((a, o) => a + o.totalGuias, 0)
    const totalGlosadas = enriched.reduce((a, o) => {
        const s = statsMap.get(o.id) || {}
        return a + (s["GLOSADA"] || 0) + (s["NEGADA"] || 0)
    }, 0)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Heart className="h-7 w-7 text-amber-400" />
                    Operadoras de Convênio
                </h1>
                <p className="text-slate-400">Visão consolidada de convênios e taxa de glosa TISS</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 max-w-xl">
                {[
                    { label: "Operadoras Ativas", value: operadoras.length, color: "text-white" },
                    { label: "Total Guias TISS", value: totalGuias, color: "text-blue-400" },
                    {
                        label: "Guias Glosadas/Negadas",
                        value: totalGlosadas,
                        color: totalGlosadas > 0 ? "text-red-400" : "text-green-400",
                    },
                ].map((s) => (
                    <Card key={s.label} className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-5">
                            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">
                        Operadoras ({enriched.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Operadora</TableHead>
                                <TableHead className="text-slate-400">Código ANS</TableHead>
                                <TableHead className="text-slate-400">Tipo</TableHead>
                                <TableHead className="text-slate-400">Clínica</TableHead>
                                <TableHead className="text-slate-400 text-right">Convênios</TableHead>
                                <TableHead className="text-slate-400 text-right">Guias</TableHead>
                                <TableHead className="text-slate-400 text-right">Taxa Glosa</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enriched.map((op) => {
                                const glosaNum = op.glosaRate ? parseFloat(op.glosaRate) : 0
                                return (
                                    <TableRow
                                        key={op.id}
                                        className="border-slate-800 hover:bg-slate-800/50"
                                    >
                                        <TableCell>
                                            <div className="font-medium text-white">{op.nome}</div>
                                            {op.cnpj && (
                                                <div className="text-xs text-slate-500 font-mono">
                                                    {op.cnpj}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-400 font-mono text-sm">
                                            {op.codigoAns || "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    op.tipo === "CONVENIO"
                                                        ? "bg-blue-600/20 text-blue-400 text-xs"
                                                        : op.tipo === "PARTICULAR"
                                                        ? "bg-green-600/20 text-green-400 text-xs"
                                                        : "bg-slate-700 text-slate-400 text-xs"
                                                }
                                            >
                                                {op.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {op.organization.name}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-300">
                                            {op._count.convenios}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-300">
                                            {op.totalGuias}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {op.glosaRate !== null ? (
                                                <span
                                                    className={`font-medium text-sm flex items-center justify-end gap-1 ${
                                                        glosaNum > 10
                                                            ? "text-red-400"
                                                            : glosaNum > 5
                                                            ? "text-amber-400"
                                                            : "text-green-400"
                                                    }`}
                                                >
                                                    {glosaNum > 10 && (
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                    )}
                                                    {op.glosaRate}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-600 text-sm">—</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {enriched.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-slate-500 py-8"
                                    >
                                        Nenhuma operadora cadastrada ainda.
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
