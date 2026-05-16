import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus } from "lucide-react"
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
import type { CargaHorariaInput } from "@/lib/profissionais/schema"

export const metadata = { title: "Equipe Clínica | Estetia CRM" }

const ROLE_BADGE_STYLES: Record<OrgRole, string> = {
    OWNER: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    GERENTE: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    COORDENADOR: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    SUPERVISOR: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    VENDEDOR: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
    MEMBER: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
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
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/settings">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Button>
                </Link>
            </div>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Equipe Clínica</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Profissionais, equipe administrativa e permissões
                    </p>
                </div>
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
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold">Profissionais Clínicos</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {professionals.length} profissional{professionals.length !== 1 ? 'is' : ''} cadastrado{professionals.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link href="/dashboard/settings/profissionais">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            Gerenciar profissionais
                        </Button>
                    </Link>
                </div>
                <ProfissionaisTable
                    professionals={profissionaisData}
                    actorRole={actorRole}
                />
            </section>

            {/* Equipe Administrativa */}
            <section className="space-y-3">
                <div>
                    <h3 className="text-base font-semibold">Equipe Administrativa</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Owners, recepção, gestão e demais membros
                    </p>
                </div>
                <AdminTable
                    members={adminData}
                    actorRole={actorRole}
                    actorId={currentUser.id}
                />
            </section>

            {/* Role Permissions — OWNER only */}
            {isOwner && (
                <section>
                    <RolePermissionsCard initial={roleTemplate} />
                </section>
            )}

            {/* Pending Invites */}
            {invites.length > 0 && (
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-base">Convites Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                                    <TableHead>Email</TableHead>
                                    <TableHead>Função</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Expira em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invites.map((invite) => {
                                    const inviteRole = invite.role as OrgRole
                                    const canManage = canManageRole(actorRole, inviteRole)
                                    return (
                                        <TableRow key={invite.id} className="border-zinc-100 dark:border-zinc-800">
                                            <TableCell className="font-medium text-zinc-700 dark:text-zinc-300">
                                                {invite.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={ROLE_BADGE_STYLES[inviteRole] ?? ROLE_BADGE_STYLES.MEMBER}>
                                                    {inviteRole === 'VENDEDOR' ? 'Profissional' : (ROLE_LABELS[inviteRole] ?? inviteRole)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {invite.categoria === 'CLINICO' ? 'Clínico' :
                                                    invite.categoria === 'PROPRIETARIO' ? 'Proprietário' : 'Administrativo'}
                                            </TableCell>
                                            <TableCell className="text-zinc-500">
                                                {format(invite.expiresAt, "dd MMM yyyy", { locale: ptBR })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {canManage && (
                                                    <div className="flex items-center justify-end gap-1">
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
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
