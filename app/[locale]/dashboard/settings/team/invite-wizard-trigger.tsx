'use client'

import { useState } from 'react'
import { OrgRole } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { InviteWizardDialog } from '@/components/equipe-clinica/invite-wizard/invite-wizard-dialog'
import { assignableRoles } from '@/lib/role-permissions'
import { useRouter } from 'next/navigation'

interface Props {
  actorRole: OrgRole
}

export function InviteWizardTrigger({ actorRole }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const canInvite = assignableRoles(actorRole).length > 0

  if (!canInvite) return null

  return (
    <>
      <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Convidar Membro
      </Button>
      <InviteWizardDialog
        open={open}
        onOpenChange={setOpen}
        actorRole={actorRole}
        onInvited={() => router.refresh()}
      />
    </>
  )
}
