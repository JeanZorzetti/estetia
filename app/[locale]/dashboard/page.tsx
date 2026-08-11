import { Metadata } from "next"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { OnboardingWrapper } from "@/components/onboarding/onboarding-wrapper"
import { AnimatedPageContainer } from "@/components/dashboard/animated-page-container"
import { DailyKPIs } from "@/components/dashboard/clinic/daily-kpis"
import { UpcomingAppointments } from "@/components/dashboard/clinic/upcoming-appointments"
import { QuickActions } from "@/components/dashboard/clinic/quick-actions"
import { PendingAnamneses } from "@/components/dashboard/clinic/pending-anamneses"
import { RecallSuggestions } from "@/components/dashboard/clinic/recall-suggestions"
import { ClinicOnboardingChecklist } from "@/components/dashboard/clinic-onboarding-checklist"
import logger from '@/lib/logger'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "dashboard" })
  return { title: `${t("pages.pipeline.title")} - CRM` }
}

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | undefined>>
}) {
  await params // consume to avoid Next.js warning

  try {
    const session = await getSession()

    if (!session?.user?.email) {
      redirect("/login")
    }

    let user
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          organizationId: true,
          orgRole: true,
          phone: true,
          jobTitle: true,
          createdAt: true,
          organization: {
            select: {
              name: true,
              plan: true,
              segment: true,
            },
          },
          onboarding: {
            select: {
              status: true,
              completedSteps: true,
            },
          },
        },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      logger.error({ message }, "[DASHBOARD_PAGE] Falha ao buscar usuário:")
      return (
        <div className="p-8">
          <h1 className="text-xl font-bold text-red-600">Erro ao carregar Dashboard</h1>
        </div>
      )
    }

    if (!user?.organizationId) {
      redirect("/login")
    }

    // Block dashboard only for NEW users (account < 24h) who haven't completed their profile.
    const isNewAccount =
      Date.now() - new Date(user.createdAt).getTime() < 24 * 60 * 60 * 1000
    if (isNewAccount && (!user.phone || !user.jobTitle || !user.organization?.segment)) {
      redirect("/complete-profile")
    }

    const shouldShowOnboarding =
      !user.onboarding || user.onboarding.status === "IN_PROGRESS"

    const checklistSteps = user.onboarding?.completedSteps ?? []
    const checklistAllDone = checklistSteps.length >= 5

    // --- Datas ---
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // --- Sessoes de hoje ---
    const todaysSessions = await prisma.treatmentSession.findMany({
      where: {
        organizationId: user.organizationId,
        dataAgendada: { gte: today, lt: tomorrow },
      },
      include: {
        treatment: {
          include: {
            paciente: true,
          },
        },
        profissional: true,
        sala: true,
      },
      orderBy: { dataAgendada: "asc" },
      take: 10,
    })

    // --- KPIs ---
    const totalToday = todaysSessions.length
    const confirmed = todaysSessions.filter((s) => s.status === "CONFIRMADA").length
    const noShowPredicted = todaysSessions.filter(
      (s) => (s.noShowScore ?? 0) >= 60 && ["AGENDADA", "CONFIRMADA"].includes(s.status)
    ).length
    // valorTotal é do tratamento inteiro; aproximação aceitável para receita prevista do dia
    const revenueExpected = todaysSessions
      .filter((s) => ["AGENDADA", "CONFIRMADA", "REALIZADA"].includes(s.status))
      .reduce((sum, s) => sum + Number(s.treatment.valorTotal ?? 0), 0)
    // Próximo atendimento ativo do dia (para botão Iniciar)
    const nextSession = todaysSessions.find((s) =>
      ["AGENDADA", "CONFIRMADA"].includes(s.status)
    ) ?? null

    // --- Anamneses pendentes ---
    // Anamnesis liga via treatmentId — sessoes de hoje cujo tratamento nao tem anamnese
    const treatmentIdsToday = [...new Set(todaysSessions.map((s) => s.treatmentId))]
    const existingAnamneses =
      treatmentIdsToday.length > 0
        ? await prisma.anamnesis.findMany({
            where: { treatmentId: { in: treatmentIdsToday } },
            select: { treatmentId: true },
          })
        : []
    const anamnesisIds = new Set(existingAnamneses.map((a) => a.treatmentId))
    const pendingAnamneses = todaysSessions.filter(
      (s) => !anamnesisIds.has(s.treatmentId)
    )

    // --- Recall: pacientes com sessao ha mais de 30 dias e sem sessao futura ---
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recallCandidates = await prisma.patient.findMany({
      where: {
        organizationId: user.organizationId,
        treatments: {
          some: {
            sessions: {
              some: {
                dataAgendada: { lt: thirtyDaysAgo },
              },
            },
          },
        },
        NOT: {
          treatments: {
            some: {
              sessions: {
                some: {
                  dataAgendada: { gte: new Date() },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "asc" },
      take: 5,
    })

    // Enrich com data da ultima sessao para exibir "X dias sem visita"
    const recallWithLastSession = await Promise.all(
      recallCandidates.map(async (patient) => {
        const lastSession = await prisma.treatmentSession.findFirst({
          where: {
            organizationId: user.organizationId,
            treatment: { pacienteId: patient.id },
          },
          orderBy: { dataAgendada: "desc" },
          select: { dataAgendada: true },
        })
        return { ...patient, lastSessionAt: lastSession?.dataAgendada ?? null }
      })
    )

    // --- Saudacao ---
    const orgName = user.organization?.name ?? "Clinica"
    const hour = new Date().getHours()
    const greeting =
      hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"
    const firstName = user.name?.split(" ")[0] ?? "Doutor(a)"

    return (
      <OnboardingWrapper
        userId={user.id}
        userName={user.name ?? undefined}
        shouldShowOnboarding={shouldShowOnboarding}
      >
        <AnimatedPageContainer>
          <div className="flex flex-col gap-8 p-4 lg:p-8 relative min-h-screen bg-slate-50/20 text-[#0A1F3D] selection:bg-[#489FB5]/20 overflow-hidden rounded-3xl border border-[#0A1F3D]/5">
            {/* DESIGN SYSTEM BACKGROUND INTEGRATION - DASHBOARD EDITION */}
            {/* Grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px'
            }} />

            {/* Subtle Clinical Halos */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20 blur-[100px]"
                style={{ background: 'radial-gradient(circle, rgba(72,159,181,0.15) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full pointer-events-none z-0 opacity-15 blur-[90px]"
                style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)' }} />

            {/* Header / Hero */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#0A1F3D]/5">
              <div>
                <h1 className="font-serif text-3xl font-extrabold text-[#0A1F3D] leading-tight">
                  {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A1F3D] via-[#C5A059] to-[#0A1F3D]">{firstName}</span>
                </h1>
                <p className="text-[#64748B] text-sm font-semibold mt-1">
                  Seja bem-vindo(a) à sua central de controle operacional
                </p>
              </div>
              <div className="inline-flex items-center gap-2.5 bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-[#C5A059]/15 shadow-sm shadow-[#C5A059]/5 shrink-0 self-start sm:self-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#C5A059]">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-[#0A1F3D]">{orgName}</span>
              </div>
            </div>

            {/* Checklist de onboarding clínico — some depois de completo */}
            <div className="relative z-10">
              {!checklistAllDone && (
                <ClinicOnboardingChecklist initialCompletedSteps={checklistSteps} />
              )}
            </div>

            {/* KPIs */}
            <div className="relative z-10">
              <DailyKPIs
                totalToday={totalToday}
                confirmed={confirmed}
                noShowPredicted={noShowPredicted}
                revenueExpected={revenueExpected}
              />
            </div>

            {/* Grid principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* Proximos atendimentos — 2/3 */}
              <div className="lg:col-span-2">
                <h2 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.25em] mb-4">
                  Próximos atendimentos
                </h2>
                <Suspense>
                  <UpcomingAppointments appointments={todaysSessions} />
                </Suspense>
              </div>

              {/* Coluna lateral — 1/3 */}
              <div className="flex flex-col gap-6">
                {/* Acoes rapidas */}
                <div>
                  <h2 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.25em] mb-4">
                    Ações rápidas
                  </h2>
                  <QuickActions nextSessionId={nextSession?.id ?? null} />
                </div>

                {/* Anamneses pendentes */}
                {pendingAnamneses.length > 0 && (
                  <div>
                    <h2 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.25em] mb-4">
                      Anamneses pendentes
                    </h2>
                    <PendingAnamneses sessions={pendingAnamneses} />
                  </div>
                )}

                {/* Recall */}
                {recallWithLastSession.length > 0 && (
                  <div>
                    <h2 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.25em] mb-4">
                      Recall sugerido
                    </h2>
                    <RecallSuggestions patients={recallWithLastSession} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedPageContainer>
      </OnboardingWrapper>
    )
  } catch (error: unknown) {
    // Next.js redirect() throws internally — must re-throw so it works correctly
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    logger.error({ message }, "[DASHBOARD_PAGE] Erro critico:")
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Erro ao carregar Dashboard
        </h1>
        <div className="bg-red-50 p-4 rounded text-red-800">
          <p className="font-mono text-sm">{message}</p>
        </div>
      </div>
    )
  }
}
