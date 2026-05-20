import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiError } from '@/lib/api-error'
import { ERR } from '@/lib/error-messages'

export async function GET() {
  const session = await getSession()
  if (!session?.user?.email) return await apiError(ERR.UNAUTHORIZED, 401)

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, onboarding: { select: { completedSteps: true } } },
  })

  if (!user) return await apiError(ERR.USER_NOT_FOUND, 404)

  return NextResponse.json({
    completedSteps: user.onboarding?.completedSteps ?? [],
  })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return await apiError(ERR.UNAUTHORIZED, 401, { req: request })

  const { stepId } = await request.json()
  if (!stepId || typeof stepId !== 'string') {
    return NextResponse.json({ error: 'stepId obrigatório' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, onboarding: { select: { completedSteps: true } } },
  })

  if (!user) return await apiError(ERR.USER_NOT_FOUND, 404, { req: request })

  const current = user.onboarding?.completedSteps ?? []
  if (current.includes(stepId)) return NextResponse.json({ completedSteps: current })

  const updatedSteps = [...current, stepId]

  await prisma.onboardingProgress.upsert({
    where: { userId: user.id },
    update: { completedSteps: updatedSteps },
    create: {
      userId: user.id,
      organizationId: user.organizationId,
      completedSteps: updatedSteps,
    },
  })

  return NextResponse.json({ completedSteps: updatedSteps })
}
