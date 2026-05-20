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
      console.error("[DASHBOARD_PAGE] Falha ao buscar usuário:", message)
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
          <div className="flex flex-col gap-6 p-4 lg:p-6">
            {/* Hero */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {greeting}, {firstName}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                · {orgName}
              </p>
            </div>

            {/* Checklist de onboarding clínico — some depois de completo */}
            {!checklistAllDone && (
              <ClinicOnboardingChecklist initialCompletedSteps={checklistSteps} />
            )}

            {/* KPIs */}
            <DailyKPIs
              totalToday={totalToday}
              confirmed={confirmed}
              noShowPredicted={0}
              revenueExpected={0}
            />

            {/* Grid principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Proximos atendimentos — 2/3 */}
              <div className="lg:col-span-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Proximos atendimentos
                </h2>
                <Suspense>
                  <UpcomingAppointments appointments={todaysSessions} />
                </Suspense>
              </div>

              {/* Coluna lateral — 1/3 */}
              <div className="flex flex-col gap-5">
                {/* Acoes rapidas */}
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Acoes rapidas
                  </h2>
                  <QuickActions />
                </div>

                {/* Anamneses pendentes */}
                {pendingAnamneses.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Anamneses pendentes
                    </h2>
                    <PendingAnamneses sessions={pendingAnamneses} />
                  </div>
                )}

                {/* Recall */}
                {recallWithLastSession.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
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
    console.error("[DASHBOARD_PAGE] Erro critico:", message)
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
