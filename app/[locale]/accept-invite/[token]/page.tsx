import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AcceptInvitePageClient } from '@/components/equipe-clinica/accept-invite-wizard/accept-invite-page-client'
import { UserCategoria } from '@prisma/client'

export const metadata = { title: 'Aceitar Convite | Estetia CRM' }

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string; locale: string }>
}) {
  const { token } = await params

  const invite = await prisma.invite.findUnique({
    where: { token },
    select: {
      email: true,
      accepted: true,
      expiresAt: true,
      categoria: true,
      prefilledData: true,
    },
  })

  if (!invite || invite.accepted || invite.expiresAt < new Date()) {
    notFound()
  }

  return (
    <AcceptInvitePageClient
      token={token}
      invite={{
        email: invite.email,
        categoria: invite.categoria as UserCategoria,
        prefilledData: invite.prefilledData as Record<string, unknown> | null,
      }}
    />
  )
}
