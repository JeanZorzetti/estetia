'use client'

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, CheckSquare, Loader2, Shield, FileText, ClipboardList, ShieldCheck, Users } from "lucide-react"
import { OrgRole } from "@prisma/client"
import { updateRolePermissions } from "./actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface RoleTemplateRow {
    role: OrgRole
    label: string
    canAccessAgenda: boolean
    canAccessTasks: boolean
    canAccessProntuario: boolean
    canScheduleAppointments: boolean
    canValidateCouncil: boolean
    canManageProfessionals: boolean
}

type PermKey = keyof Omit<RoleTemplateRow, 'role' | 'label'>

interface RolePermissionsCardProps {
    initial: RoleTemplateRow[]
}

const COLUMNS: { key: PermKey; icon: React.ReactNode; label: string }[] = [
    { key: 'canAccessAgenda', icon: <Calendar className="h-3.5 w-3.5" />, label: 'Agenda' },
    { key: 'canAccessTasks', icon: <CheckSquare className="h-3.5 w-3.5" />, label: 'Tarefas' },
    { key: 'canAccessProntuario', icon: <FileText className="h-3.5 w-3.5" />, label: 'Prontuário' },
    { key: 'canScheduleAppointments', icon: <ClipboardList className="h-3.5 w-3.5" />, label: 'Agendar' },
    { key: 'canValidateCouncil', icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'Validar CFM' },
    { key: 'canManageProfessionals', icon: <Users className="h-3.5 w-3.5" />, label: 'Gerenciar Prof.' },
]

export function RolePermissionsCard({ initial }: RolePermissionsCardProps) {
    const [rows, setRows] = useState<RoleTemplateRow[]>(initial)
    const [pendingRole, setPendingRole] = useState<OrgRole | null>(null)
    const [, startTransition] = useTransition()

    function toggle(role: OrgRole, key: PermKey, next: boolean) {
        const row = rows.find((r) => r.role === role)
        if (!row) return

        const updated = { ...row, [key]: next }
        setRows((prev) => prev.map((r) => (r.role === role ? updated : r)))
        setPendingRole(role)

        startTransition(async () => {
            try {
                await updateRolePermissions(role, {
                    canAccessAgenda: updated.canAccessAgenda,
                    canAccessTasks: updated.canAccessTasks,
                    canAccessProntuario: updated.canAccessProntuario,
                    canScheduleAppointments: updated.canScheduleAppointments,
                    canValidateCouncil: updated.canValidateCouncil,
                    canManageProfessionals: updated.canManageProfessionals,
                })
                toast.success(`Permissões de ${row.label} atualizadas`)
            } catch (e: unknown) {
                setRows((prev) => prev.map((r) => (r.role === role ? row : r)))
                toast.error(e instanceof Error ? e.message : 'Falha ao atualizar permissões')
            } finally {
                setPendingRole((p) => (p === role ? null : p))
            }
        })
    }

    return (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                        <Shield className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Permissões por Função</CardTitle>
                        <CardDescription>
                            Configure quais módulos cada função pode acessar. Inclui permissões clínicas (Prontuário, CFM).
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/40">
                            <tr className="text-left text-xs uppercase tracking-wider text-zinc-500">
                                <th className="px-4 py-3 font-semibold sticky left-0 bg-zinc-50 dark:bg-zinc-800/40">Função</th>
                                {COLUMNS.map(col => (
                                    <th key={col.key} className="px-3 py-3 font-semibold text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {col.icon}
                                            <span className="whitespace-nowrap">{col.label}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.role}
                                    className={cn(
                                        'border-t border-zinc-100 dark:border-zinc-800 transition-colors',
                                        pendingRole === row.role && 'bg-zinc-50 dark:bg-zinc-800/20'
                                    )}
                                >
                                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200 sticky left-0 bg-white dark:bg-zinc-900">
                                        <div className="flex items-center gap-2">
                                            {row.label}
                                            {pendingRole === row.role && <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />}
                                        </div>
                                    </td>
                                    {COLUMNS.map(col => (
                                        <td key={col.key} className="px-3 py-3 text-center">
                                            <Checkbox
                                                checked={row[col.key] as boolean}
                                                onCheckedChange={(v) => toggle(row.role, col.key, !!v)}
                                                disabled={pendingRole === row.role}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                    O OWNER sempre tem acesso completo a todas as features. As alterações são aplicadas imediatamente.
                </p>
            </CardContent>
        </Card>
    )
}
