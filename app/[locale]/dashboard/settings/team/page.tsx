import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Users, Shield } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RevokeInviteButton, ResendInviteButton } from "./team-actions"
import { RolePermissionsCard, type RoleTemplateRow } from "./role-permissions-card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    assignableRoles,
    getAllRolePermissions,
    ROLE_LABELS,
    CONFIGURABLE_ROLES,
    normalizeRole,
    canManageRole,
} from "@/lib/role-permissions"
import { OrgRole } from "@prisma/client"
import { getComplianceKpis } from "@/lib/equipe-clinica/compliance"
import { ComplianceKpisCard } from "@/components/equipe-clinica/compliance-kpis"
import { ProfissionaisTable } from "@/components/equipe-clinica/profissionais-table"
import { AdminTable } from "@/components/equipe-clinica/admin-table"
import { InviteWizardTrigger } from "./invite-wizard-trigger"
import { ClinicaPageHeader } from "@/components/settings/clinica-page-header"
import type { CargaHorariaInput } from "@/lib/profissionais/schema"
import { cn } from "@/lib/utils"

export const metadata = { title: "Equipe Clínica | Estetia CRM" }

const ROLE_BADGE_STYLES: Record<OrgRole, string> = {
    OWNER: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30',
    GERENTE: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30',
    COORDENADOR: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30',
    SUPERVISOR: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 dark:border-cyan-500/30',
    VENDEDOR: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
    MEMBER: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/30',
}

export default async function TeamSettingsPage() {
    const session = await getSession()
    if (!session?.user?.email) return null

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { organization: true }
    })

    if (!currentUser) return <div>Acesso negado</div>

    const isOwner = normalizeRole(currentUser.orgRole) === "OWNER"
    const actorRole = currentUser.orgRole
    const orgId = currentUser.organizationId

    const [members, professionals, invites, allRolePerms, complianceKpis] = await Promise.all([
        prisma.user.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'asc' }
        }),
        prisma.professional.findMany({
            where: { organizationId: orgId, ativo: true },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        orgRole: true,
                        categoria: true,
                        jobTitle: true,
                        pipelineRestricted: true,
                        allowedPipelineIds: true,
                    }
                }
            },
            orderBy: { nome: 'asc' }
        }),
        prisma.invite.findMany({
            where: { organizationId: orgId, accepted: false },
            orderBy: { createdAt: 'desc' }
        }),
        getAllRolePermissions(orgId),
        getComplianceKpis(orgId),
    ])

    const roleTemplate: RoleTemplateRow[] = CONFIGURABLE_ROLES.map((role) => ({
        role,
        label: role === 'VENDEDOR' ? 'Profissional' : ROLE_LABELS[role],
        canAccessAgenda: allRolePerms[role].canAccessAgenda,
        canAccessTasks: allRolePerms[role].canAccessTasks,
        canAccessProntuario: allRolePerms[role].canAccessProntuario,
        canScheduleAppointments: allRolePerms[role].canScheduleAppointments,
        canValidateCouncil: allRolePerms[role].canValidateCouncil,
        canManageProfessionals: allRolePerms[role].canManageProfessionals,
    }))

    // Split members: admin = users without active Professional profile
    const profUserIds = new Set(professionals.map(p => p.userId).filter(Boolean))
    const equipeAdministrativa = members.filter(m =>
        !profUserIds.has(m.id) && normalizeRole(m.orgRole) !== 'OWNER'
    )
    const ownersAndSelf = members.filter(m =>
        normalizeRole(m.orgRole) === 'OWNER'
    )

    const canValidate = normalizeRole(actorRole) === 'OWNER' ||
        allRolePerms[actorRole]?.canValidateCouncil

    const profissionaisData = professionals.map(p => ({
        id: p.id,
        nome: p.nome,
        fotoUrl: p.fotoUrl,
        conselho: p.conselho,
        numeroConselho: p.numeroConselho,
        ufConselho: p.ufConselho,
        conselhoStatus: p.conselhoStatus,
        especialidades: p.especialidades,
        cargaHoraria: p.cargaHoraria as CargaHorariaInput | null,
        procedimentosHabilitadosIds: p.procedimentosHabilitadosIds,
        user: p.user ? {
            id: p.user.id,
            email: p.user.email,
            orgRole: p.user.orgRole,
            jobTitle: p.user.jobTitle,
        } : null,
    }))

    const adminData = [...ownersAndSelf, ...equipeAdministrativa].map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        jobTitle: m.jobTitle,
        orgRole: m.orgRole,
        categoria: m.categoria,
    }))

    return (
        <div className="flex-1 space-y-8 p-6 max-w-5xl">
            {/* Header + Invite button responsive grid */}
            <div className="relative">
                <ClinicaPageHeader
                    title="Equipe Clínica"
                    description="Gerencie os profissionais de saúde, assistentes administrativos, permissões de acesso e convites ativos na sua clínica."
                    icon={Users}
                    iconBg="bg-emerald-500/10"
                    iconColor="text-emerald-500"
                />
                <div className="absolute right-0 bottom-4.5 hidden md:block">
                    <InviteWizardTrigger actorRole={actorRole} />
                </div>
            </div>
            {/* Mobile invitation action */}
            <div className="block md:hidden mt-2">
                <InviteWizardTrigger actorRole={actorRole} />
            </div>

            {/* Compliance CFM */}
            {complianceKpis.total > 0 && (
                <ComplianceKpisCard
                    kpis={complianceKpis}
                    orgId={orgId}
                    canValidate={canValidate}
                />
            )}

            {/* Profissionais Clínicos */}
            <Card className="relative bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/40 shadow-lg backdrop-blur-xl rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl">
                {/* Moldura interna cristalina */}
                <div className="absolute inset-[1px] rounded-[15px] border border-white/40 dark:border-white/[0.02] pointer-events-none" />

                {/* Glow sutil sob hover no card */}
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-emerald-500/5 -z-10 pointer-events-none" />

                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-md">
                            <Users className="h-5 w-5 drop-shadow-sm" />
                        </div>
                        <div>
                            <CardTitle className="font-serif text-base font-bold text-slate-800 dark:text-slate-200">
                                Profissionais Clínicos
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {professionals.length} profissional{professionals.length !== 1 ? 'is' : ''} cadastrado{professionals.length !== 1 ? 's' : ''}
                            </CardDescription>
                        </div>
                    </div>
                    <Link href="/dashboard/settings/profissionais">
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-slate-800/40 hover:bg-[#C5A059]/10 hover:border-[#C5A059]/25 hover:text-[#9A7D42] dark:hover:text-[#E2C799] transition-all duration-300 shadow-sm text-xs font-semibold">
                            Gerenciar profissionais
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-6">
                    <ProfissionaisTable
                        professionals={profissionaisData}
                        actorRole={actorRole}
                    />
                </CardContent>
            </Card>

            {/* Equipe Administrativa */}
            <Card className="relative bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/40 shadow-lg backdrop-blur-xl rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl">
                {/* Moldura interna cristalina */}
                <div className="absolute inset-[1px] rounded-[15px] border border-white/40 dark:border-white/[0.02] pointer-events-none" />

                {/* Glow sutil sob hover no card */}
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-emerald-500/5 -z-10 pointer-events-none" />

                <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-md">
                        <Shield className="h-5 w-5 drop-shadow-sm" />
                    </div>
                    <div>
                        <CardTitle className="font-serif text-base font-bold text-slate-800 dark:text-slate-200">
                            Equipe Administrativa
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Owners, recepção, gestão e outros cargos administrativos com acesso ao sistema
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <AdminTable
                        members={adminData}
                        actorRole={actorRole}
                        actorId={currentUser.id}
                    />
                </CardContent>
            </Card>

            {/* Role Permissions — OWNER only */}
            {isOwner && (
                <section>
                    <RolePermissionsCard initial={roleTemplate} />
                </section>
            )}

            {/* Pending Invites */}
            {invites.length > 0 && (
                <Card className="relative bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/40 shadow-lg backdrop-blur-xl rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl">
                    {/* Moldura interna cristalina */}
                    <div className="absolute inset-[1px] rounded-[15px] border border-white/40 dark:border-white/[0.02] pointer-events-none" />

                    <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#9A7D42] via-[#C5A059] to-[#866B35] text-white shadow-md">
                            <UserPlus className="h-5 w-5 drop-shadow-sm" />
                        </div>
                        <div>
                            <CardTitle className="font-serif text-base font-bold text-slate-800 dark:text-slate-200">
                                Convites Pendentes
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Membros convidados que ainda não concluíram o cadastro no CRM
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-slate-200/30 dark:border-slate-800/30">
                                        <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Função</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Categoria</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Expira em</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invites.map((invite) => {
                                        const inviteRole = invite.role as OrgRole
                                        const canManage = canManageRole(actorRole, inviteRole)
                                        return (
                                            <TableRow key={invite.id} className="border-slate-200/20 dark:border-slate-800/20 hover:bg-slate-500/5 transition-colors">
                                                <TableCell className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                                                    {invite.email}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <Badge variant="outline" className={cn("rounded-lg px-2.5 py-0.5 text-xs font-bold tracking-wide border", ROLE_BADGE_STYLES[inviteRole] ?? ROLE_BADGE_STYLES.MEMBER)}>
                                                        {inviteRole === 'VENDEDOR' ? 'Profissional' : (ROLE_LABELS[inviteRole] ?? inviteRole)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {invite.categoria === 'CLINICO' ? 'Clínico' :
                                                        invite.categoria === 'PROPRIETARIO' ? 'Proprietário' : 'Administrativo'}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {format(invite.expiresAt, "dd MMM yyyy", { locale: ptBR })}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    {canManage && (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <ResendInviteButton inviteId={invite.id} />
                                                            <RevokeInviteButton inviteId={invite.id} />
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
