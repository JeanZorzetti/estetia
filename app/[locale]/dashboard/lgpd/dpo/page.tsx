import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, UserCheck, ShieldCheck, MessageSquare, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DpoForm } from '@/components/lgpd/dpo/dpo-form'

export const dynamic = 'force-dynamic'

const RESPONSABILIDADES = [
  {
    icon: MessageSquare,
    title: 'Receber comunicações',
    description: 'Receber reclamações e comunicações dos titulares, prestar esclarecimentos e adotar providências.',
  },
  {
    icon: Building2,
    title: 'Interlocução com ANPD',
    description: 'Atuar como ponto de contato entre a clínica e a Autoridade Nacional de Proteção de Dados.',
  },
  {
    icon: UserCheck,
    title: 'Orientar funcionários',
    description: 'Orientar funcionários e contratados sobre as práticas a serem tomadas em relação à proteção de dados pessoais.',
  },
  {
    icon: ShieldCheck,
    title: 'Executar atribuições da ANPD',
    description: 'Executar demais atribuições determinadas pelo controlador ou estabelecidas em normas complementares.',
  },
]

export default async function DpoPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: { dpoName: true, dpoEmail: true, dpoPhone: true, dpoCpf: true },
  })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <div>
        <Link
          href="/dashboard/lgpd"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          LGPD & Compliance
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Encarregado de Dados (DPO)</h1>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed max-w-2xl">
          A LGPD (Art. 41) exige que o controlador indique um encarregado pelo tratamento de dados pessoais.
          O contato do DPO deve ser divulgado publicamente para que titulares possam exercer seus direitos.
        </p>
      </div>

      <DpoForm initialData={org as any} />

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Responsabilidades do DPO</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Conforme LGPD Art. 41, §2º, o encarregado tem como atribuições:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESPONSABILIDADES.map(r => (
              <div key={r.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
