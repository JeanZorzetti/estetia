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
        <Card className="relative bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/40 shadow-lg backdrop-blur-xl rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl">
            {/* Moldura interna cristalina */}
            <div className="absolute inset-[1px] rounded-[15px] border border-white/40 dark:border-white/[0.02] pointer-events-none" />

            {/* Glow sutil sob hover no card */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-indigo-500/5 -z-10 pointer-events-none" />

            <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 text-white shadow-md">
                    <Shield className="h-5 w-5 drop-shadow-sm" />
                </div>
                <div>
                    <CardTitle className="font-serif text-base font-bold text-slate-800 dark:text-slate-200">
                        Permissões por Função
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Configure quais módulos cada função pode acessar. Inclui permissões clínicas (Prontuário, CFM).
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
                <div className="overflow-x-auto rounded-xl border border-slate-200/30 dark:border-slate-800/30 bg-white/55 dark:bg-slate-950/20">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200/30 dark:border-slate-800/30">
                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="px-5 py-4 font-bold sticky left-0 bg-slate-100 dark:bg-slate-900 z-10 border-r border-slate-200/30 dark:border-slate-800/30">Função</th>
                                {COLUMNS.map(col => (
                                    <th key={col.key} className="px-4 py-4 font-bold text-center border-r border-slate-200/30 dark:border-slate-800/30 last:border-r-0">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="text-indigo-500 dark:text-indigo-400 shrink-0">
                                                {col.icon}
                                            </div>
                                            <span className="whitespace-nowrap font-bold text-xs tracking-wide">{col.label}</span>
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
                                        'border-b border-slate-200/20 dark:border-slate-800/20 last:border-b-0 hover:bg-slate-500/5 transition-colors',
                                        pendingRole === row.role && 'bg-indigo-500/5 dark:bg-indigo-500/10'
                                    )}
                                >
                                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200 sticky left-0 bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/30 dark:border-slate-800/30 shadow-[4px_0_8px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold tracking-wide">{row.label}</span>
                                            {pendingRole === row.role && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C5A059]" />}
                                        </div>
                                    </td>
                                    {COLUMNS.map(col => (
                                        <td key={col.key} className="px-4 py-4 text-center border-r border-slate-200/30 dark:border-slate-800/30 last:border-r-0">
                                            <div className="flex items-center justify-center">
                                                <Checkbox
                                                    checked={row[col.key] as boolean}
                                                    onCheckedChange={(v) => toggle(row.role, col.key, !!v)}
                                                    disabled={pendingRole === row.role}
                                                    className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-[#C5A059] focus:ring-[#C5A059]/40 data-[state=checked]:bg-[#C5A059] data-[state=checked]:border-[#C5A059] transition-all"
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-[#C5A059] opacity-80 shrink-0" />
                    O OWNER sempre tem acesso completo a todas as features. As alterações são aplicadas imediatamente.
                </p>
            </CardContent>
        </Card>
    )
}
