import { NextRequest, NextResponse } from 'next/server'
import { acceptInvite } from '@/lib/equipe-clinica/invite-wizard'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json()

  try {
    const result = await acceptInvite(token, body)
    return NextResponse.json({ success: true, userId: result.user.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao aceitar convite'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
