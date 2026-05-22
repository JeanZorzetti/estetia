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
      <Button 
        size="sm" 
        className="gap-2 shrink-0 rounded-xl bg-gradient-to-r from-[#9A7D42] to-[#C5A059] hover:from-[#866B35] hover:to-[#B48F47] text-white border border-[#C5A059]/30 transition-all duration-300 shadow-md hover:shadow-lg font-bold px-4 h-10 select-none overflow-hidden relative" 
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        <UserPlus className="h-4 w-4 drop-shadow-sm" />
        <span className="text-xs tracking-wide">Convidar Membro</span>
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
