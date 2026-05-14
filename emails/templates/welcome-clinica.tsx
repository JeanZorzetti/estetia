import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Link, Preview,
} from '@react-email/components'

// ─── Props ────────────────────────────────────────────────────────────────────

interface WelcomeClinicaEmailProps {
  ownerName: string
  clinicName: string
  emailDay: number // 1-14 (onboarding day)
  dashboardUrl?: string
  setupUrl?: string
}

// ─── Email day content ────────────────────────────────────────────────────────

interface DayContent {
  subject: string
  preview: string
  headline: string
  body: string
  ctaLabel: string
  ctaTarget: 'dashboard' | 'setup'
  tip?: string
}

const DAY_CONTENT: Record<number, DayContent> = {
  1: {
    subject: 'Bem-vinda ao Estetia 🌹 — vamos configurar sua clínica',
    preview: 'Sua conta está pronta. 3 passos para começar a usar hoje.',
    headline: 'Sua clínica começa a se transformar hoje.',
    body: `Olá {ownerName}, bem-vinda ao Estetia!

Você está a 3 passos de ter a gestão da sua clínica funcionando:

1. Cadastre seus profissionais e defina os procedimentos que você oferece
2. Configure seu número de WhatsApp
3. Compartilhe o link de agendamento no seu Instagram

Esses 3 passos levam menos de 30 minutos. E quando concluir, sua agenda já estará recebendo marcações automaticamente.`,
    ctaLabel: 'Configurar minha clínica agora',
    ctaTarget: 'setup',
    tip: 'Dica: comece pelos procedimentos mais solicitados. Você pode adicionar mais depois.',
  },
  3: {
    subject: 'Sua agenda já está funcionando? Aqui está como ativar o WhatsApp',
    preview: 'O WhatsApp automático é o feature que mais impacta no-show.',
    headline: 'O recurso que reduz no-show em 40%.',
    body: `Olá {ownerName},

O recurso mais impactante do Estetia é o WhatsApp automático — e leva menos de 5 minutos para configurar.

Quando ativado, ele envia automaticamente:
• Confirmação 48h antes da sessão
• Pré-cuidados específicos do procedimento 24h antes
• Pós-cuidados no dia da sessão
• NPS + foto follow-up 30 dias depois
• Recall de recompra na janela certa (Botox = 4 meses, etc.)

Nenhuma mensagem precisa ser digitada por você ou pela recepção.`,
    ctaLabel: 'Configurar WhatsApp automático',
    ctaTarget: 'setup',
    tip: 'Dica: teste enviando uma sessão para você mesma primeiro — assim você vê exatamente o que sua paciente recebe.',
  },
  5: {
    subject: 'Prontuário digital: como está a sua anamnese?',
    preview: 'Anamnese em papel é passado. Configure seu formulário em 10 minutos.',
    headline: 'Anamnese digital — protegida por lei.',
    body: `Olá {ownerName},

A anamnese digital do Estetia é 100% configurável por procedimento.

Você cria perguntas específicas para Botox, preenchimento, peeling — cada protocolo tem seu formulário. A paciente preenche no celular antes de entrar na sala, com assinatura digital.

Tudo criptografado conforme a LGPD Art. 11 (dados de saúde). Sem papel. Sem risco de perda. Sem processo trabalhoso no DPO.

Leva uns 10 minutos criar o primeiro template.`,
    ctaLabel: 'Criar meu primeiro template de anamnese',
    ctaTarget: 'setup',
    tip: 'Dica: se você usa papel hoje, tire foto das suas fichas atuais para usar como referência na hora de criar o template.',
  },
  7: {
    subject: 'Tem 50 pacientes na planilha? Veja como importar',
    preview: 'Importação CSV em 3 cliques. Seus pacientes entram prontos.',
    headline: 'Importe seus pacientes da planilha.',
    body: `Olá {ownerName},

Se você tem pacientes em planilha, no Google Contatos ou em outro sistema, você pode importá-los para o Estetia em 3 cliques via CSV.

O que acontece depois da importação:
• Cada paciente entra como "Paciente ativo" com histórico limpo
• Você pode começar a agendar sessões imediatamente
• O recall automático já começa a calcular as janelas de recompra

Sem precisar redigitar nada manualmente.`,
    ctaLabel: 'Importar meus pacientes',
    ctaTarget: 'dashboard',
    tip: 'Dica: o arquivo CSV precisa ter pelo menos: nome, telefone. Email é opcional.',
  },
  10: {
    subject: 'Sua clínica depois de 10 dias de Estetia 📊',
    preview: 'Veja o que já aconteceu na sua conta essa semana.',
    headline: 'Como está indo?',
    body: `Olá {ownerName},

Chegamos à metade do seu período de teste.

Agora é um bom momento para checar:
• Sua agenda está recebendo agendamentos?
• Os lembretes de WhatsApp estão sendo enviados?
• Você já registrou alguma sessão como realizada?

Se ainda tiver qualquer dúvida na configuração, responda este email — nossa equipe responde em até 2 horas.

E se tudo estiver funcionando bem: ótimo. Faltam 4 dias para o fim do teste. Escolha seu plano antes de 14 de outubro para não perder o acesso.`,
    ctaLabel: 'Ver meu dashboard',
    ctaTarget: 'dashboard',
  },
  14: {
    subject: 'Seu teste acaba amanhã — não perca o acesso 🌹',
    preview: 'Escolha seu plano e mantenha tudo funcionando.',
    headline: 'Último dia do teste.',
    body: `Olá {ownerName},

Seu período de 14 dias acaba amanhã.

Tudo que você configurou — agenda, anamnese, WhatsApp, pacientes — continua intacto quando você escolher um plano.

Nossos planos:
• Starter — R$ 149/mês: 1 profissional, 300 pacientes
• Pro — R$ 349/mês: 3 profissionais, 1.500 pacientes, NFS-e, no-show IA
• Business — R$ 799/mês: ilimitado, TISS/convênios, multi-unidade

Se você ainda tiver dúvidas, responda este email ou chame no WhatsApp. Temos suporte humano, em português.`,
    ctaLabel: 'Escolher meu plano',
    ctaTarget: 'setup',
    tip: 'Desconto de 20% pagando 12 meses à vista. Pergunte no chat.',
  },
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  body: {
    backgroundColor: '#fafafa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '12px',
    margin: '32px auto',
    maxWidth: '560px',
    padding: 0,
    overflow: 'hidden' as const,
  },
  header: {
    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    padding: '28px 32px',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    margin: '4px 0 0',
  },
  dayBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '999px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '12px',
    padding: '4px 12px',
  },
  content: {
    padding: '32px',
  },
  heading: {
    color: '#18181b',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 16px',
    lineHeight: '1.3',
  },
  body: {
    color: '#52525b',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 24px',
    whiteSpace: 'pre-wrap' as const,
  },
  cta: {
    backgroundColor: '#f43f5e',
    borderRadius: '10px',
    color: '#ffffff',
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    padding: '14px 28px',
    textAlign: 'center' as const,
    textDecoration: 'none',
  },
  tip: {
    backgroundColor: '#fef3c7',
    borderLeft: '3px solid #f59e0b',
    borderRadius: '0 8px 8px 0',
    color: '#78350f',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '20px 0 0',
    padding: '12px 16px',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #f4f4f5',
    margin: '24px 0',
  },
  footer: {
    color: '#a1a1aa',
    fontSize: '12px',
    lineHeight: '1.6',
    padding: '0 32px 32px',
    textAlign: 'center' as const,
  },
  footerLink: {
    color: '#a1a1aa',
    textDecoration: 'underline',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WelcomeClinicaEmail({
  ownerName,
  clinicName,
  emailDay = 1,
  dashboardUrl = 'https://estetiacrm.com.br/dashboard',
  setupUrl = 'https://estetiacrm.com.br/dashboard/setup',
}: WelcomeClinicaEmailProps) {
  const day = DAY_CONTENT[emailDay] ?? DAY_CONTENT[1]
  const targetUrl = day.ctaTarget === 'dashboard' ? dashboardUrl : setupUrl
  const bodyText = day.body
    .replace('{ownerName}', ownerName)
    .replace('{clinicName}', clinicName)

  return (
    <Html>
      <Head />
      <Preview>{day.preview}</Preview>
      <Body style={styles.body as React.CSSProperties}>
        <Container style={styles.container}>

          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>Estetia</Text>
            <Text style={styles.tagline}>CRM para clínicas de estética</Text>
            {emailDay > 1 && (
              <Text style={styles.dayBadge}>Dia {emailDay} do seu teste</Text>
            )}
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Heading style={styles.heading}>{day.headline}</Heading>
            <Text style={styles.body as React.CSSProperties}>{bodyText}</Text>

            <Button href={targetUrl} style={styles.cta}>
              {day.ctaLabel} →
            </Button>

            {day.tip && (
              <Section style={styles.tip}>
                <Text style={{ margin: 0 }}>💡 {day.tip}</Text>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Hr style={styles.hr} />
          <Section style={styles.footer as React.CSSProperties}>
            <Text style={{ margin: '0 0 8px' }}>
              Você está recebendo este email porque criou uma conta no{' '}
              <Link href="https://estetiacrm.com.br" style={styles.footerLink}>Estetia</Link>
              {' '}para a clínica <strong>{clinicName}</strong>.
            </Text>
            <Text style={{ margin: 0 }}>
              <Link href={`${dashboardUrl}/settings/notifications`} style={styles.footerLink}>
                Cancelar inscrição
              </Link>
              {' · '}
              <Link href="https://estetiacrm.com.br/privacy" style={styles.footerLink}>
                Privacidade
              </Link>
              {' · '}ROI Labs LTDA
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeClinicaEmail
