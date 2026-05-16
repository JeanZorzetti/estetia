'use client'

import { OrgRole, UserCategoria } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Users, UserMinus } from 'lucide-react'
import { RoleSelect } from '@/app/[locale]/dashboard/settings/team/role-select'
import { CategoriaBadge } from './categoria-badge'
import { ROLE_LABELS, assignableRoles } from '@/lib/role-permissions'
import { removeMember } from '@/app/[locale]/dashboard/settings/team/actions'
import { toast } from 'sonner'

interface AdminMember {
  id: string
  name: string | null
  email: string
  jobTitle: string | null
  orgRole: OrgRole
  categoria: UserCategoria
}

interface Props {
  members: AdminMember[]
  actorRole: OrgRole
  actorId: string
}

export function AdminTable({ members, actorRole, actorId }: Props) {
  const canAssign = assignableRoles(actorRole)

  const roleLabels: Record<string, string> = { ...ROLE_LABELS }

  async function handleRemove(userId: string) {
    try {
      await removeMember(userId)
      toast.success('Membro removido')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover membro')
    }
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-border/50 rounded-xl bg-muted/20">
        <Users className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">Nenhum membro administrativo</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Membro</th>
            <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Cargo</th>
            <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Categoria</th>
            <th className="py-2.5 px-4 text-left text-xs font-medium text-muted-foreground">Função</th>
            <th className="py-2.5 px-4 text-right text-xs font-medium text-muted-foreground">Ações</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-150">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-muted font-medium">
                      {(member.name ?? member.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{member.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className="text-xs text-muted-foreground">{member.jobTitle ?? '—'}</span>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <CategoriaBadge categoria={member.categoria} />
              </td>
              <td className="py-3 px-4">
                <RoleSelect
                  userId={member.id}
                  currentRole={member.orgRole}
                  assignableRoles={canAssign}
                  roleLabels={roleLabels}
                  disabled={member.id === actorId || (actorRole !== 'OWNER' && actorRole !== 'GERENTE')}
                />
              </td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      disabled={member.id === actorId}
                      onClick={() => handleRemove(member.id)}
                    >
                      <UserMinus className="h-3.5 w-3.5 mr-2" />
                      Remover acesso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
