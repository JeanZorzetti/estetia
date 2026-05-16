import { OrgRole, UserCategoria } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { InviteEmail } from '@/emails/templates/invite'
import { randomBytes } from 'crypto'

export interface InviteWizardData {
  email: string
  role: OrgRole
  jobTitle?: string
  categoria: UserCategoria
  prefilledData?: {
    nome?: string
    conselho?: string
    numeroConselho?: string
    ufConselho?: string
    especialidades?: string[]
  }
}

export async function createInviteWithPrefill(
  actorId: string,
  organizationId: string,
  actorName: string | null,
  orgName: string,
  data: InviteWizardData
) {
  // Remove existing pending invite if any
  await prisma.invite.deleteMany({
    where: { email: data.email, organizationId, accepted: false },
  })

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const invite = await prisma.invite.create({
    data: {
      email: data.email,
      token,
      role: data.role,
      organizationId,
      expiresAt,
      categoria: data.categoria,
      prefilledData: (data.prefilledData ?? null) as never,
    },
  })

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://estetiacrm.com.br'}/accept-invite/${token}`
  const inviterName = actorName ?? 'Um colega'
  await sendEmail({
    to: data.email,
    subject: `${inviterName} convidou você para o ${orgName}`,
    react: InviteEmail({
      inviterName,
      organizationName: orgName,
      inviteUrl,
      locale: 'pt-BR',
    }),
  })

  return invite
}

export async function acceptInvite(
  token: string,
  formData: {
    name: string
    password: string
    phone?: string
    jobTitle?: string
    professionalData?: {
      conselho?: string
      numeroConselho?: string
      ufConselho?: string
      especialidades?: string[]
      bio?: string
      cargaHoraria?: unknown
      procedimentosHabilitadosIds?: string[]
    }
  }
) {
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { organization: true },
  })

  if (!invite) throw new Error('Convite não encontrado ou inválido')
  if (invite.accepted) throw new Error('Este convite já foi utilizado')
  if (invite.expiresAt < new Date()) throw new Error('Este convite expirou')

  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash(formData.password, 12)

  // Atomic transaction: User + Professional (if CLINICO)
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: invite.email,
        name: formData.name,
        password: hashedPassword,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        orgRole: invite.role,
        categoria: invite.categoria,
        organizationId: invite.organizationId,
      },
    })

    let professional = null
    if (invite.categoria === 'CLINICO' && formData.professionalData) {
      const pd = invite.prefilledData as Record<string, unknown> | null
      professional = await tx.professional.create({
        data: {
          organizationId: invite.organizationId,
          userId: user.id,
          nome: formData.name,
          conselho: (formData.professionalData.conselho ?? (pd?.conselho as string | undefined)) as never,
          numeroConselho: formData.professionalData.numeroConselho ?? (pd?.numeroConselho as string | undefined),
          ufConselho: formData.professionalData.ufConselho ?? (pd?.ufConselho as string | undefined),
          especialidades: formData.professionalData.especialidades ?? (pd?.especialidades as string[] | undefined) ?? [],
          bio: formData.professionalData.bio,
          cargaHoraria: formData.professionalData.cargaHoraria as never,
          procedimentosHabilitadosIds: formData.professionalData.procedimentosHabilitadosIds ?? [],
        },
      })
    }

    await tx.invite.update({
      where: { id: invite.id },
      data: { accepted: true, acceptedAt: new Date() },
    })

    return { user, professional }
  })

  return result
}
