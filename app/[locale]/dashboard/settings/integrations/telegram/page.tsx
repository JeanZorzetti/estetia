import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Send } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { TelegramForm } from '@/components/integrations/forms/telegram-form'

export const metadata = { title: 'Telegram | Estetia CRM' }

export default async function TelegramPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          telegramEnabled: true,
          telegramBotToken: true,
          telegramChatId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Telegram"
        description="Bot para notificações automáticas — gratuito e fácil de configurar"
        icon={Send}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-500"
        docsUrl="https://core.telegram.org/bots"
      />

      <TelegramForm
        initial={{
          enabled: org.telegramEnabled,
          chatId: org.telegramChatId ?? '',
          hasBotToken: !!org.telegramBotToken,
        }}
      />
    </div>
  )
}
