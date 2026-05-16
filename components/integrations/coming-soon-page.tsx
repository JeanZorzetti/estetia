import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react'
import { IntegrationIcon } from '@/components/integrations/marketplace/integration-icon'
import { BrBadge } from '@/components/integrations/marketplace/br-badge'
import { UpvoteButton } from '@/components/integrations/upvote-button'
import type { IntegrationMeta } from '@/components/integrations/marketplace/integration-registry'

interface Props {
  integration: IntegrationMeta
}

const CATEGORY_LABELS: Record<string, string> = {
  mensageria: 'Mensageria',
  telefonia: 'Telefonia',
  calendarios: 'Calendários',
  'email-marketing': 'E-mail & Marketing',
  anuncios: 'Anúncios',
  pagamentos: 'Pagamentos',
  nfse: 'NF-Se',
  convenios: 'Convênios & TISS',
  telemedicina: 'Telemedicina',
  erp: 'ERP & Operações',
  produtividade: 'Produtividade',
  webhooks: 'Webhooks',
  validacoes: 'Validações',
}

export function ComingSoonPage({ integration }: Props) {
  return (
    <div className="flex-1 space-y-6 p-6 max-w-3xl">
      <Link href="/dashboard/settings/integrations">
        <Button variant="ghost" size="sm" className="gap-2 -ml-3">
          <ArrowLeft className="h-4 w-4" />
          Integrações
        </Button>
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="relative">
            <IntegrationIcon icon={integration.icon} size="lg" />
            <span className="absolute -top-1 -right-1 flex h-5 items-center gap-0.5 rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold text-white shadow-sm">
              <Sparkles className="h-2.5 w-2.5" />
              Em breve
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{integration.name}</h1>
              {integration.isBrazilian && <BrBadge />}
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {integration.shortDescription}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1.5 uppercase tracking-wider font-medium">
              {CATEGORY_LABELS[integration.category]}
            </p>
          </div>
        </div>

        {integration.docsUrl && (
          <a href={integration.docsUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Documentação
            </Button>
          </a>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">O que você poderá fazer</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {getFeatures(integration).map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <UpvoteButton integrationId={integration.id} integrationName={integration.name} />

      <p className="text-xs text-muted-foreground text-center">
        Implementamos as integrações conforme demanda. Sua solicitação é prioridade.
      </p>
    </div>
  )
}

function getFeatures(integration: IntegrationMeta): string[] {
  // Features genéricas por categoria — boas o suficiente para vitrine
  const byCategory: Record<string, string[]> = {
    mensageria: [
      'Envie e receba mensagens diretamente do Chat Center',
      'Notificações automáticas de agendamento e confirmação',
      'Templates de mensagem reutilizáveis',
      'Histórico completo de conversas por paciente',
    ],
    telefonia: [
      'Registre chamadas como atividade no histórico do paciente',
      'Identificação automática do paciente pela ligação',
      'Gravações vinculadas ao prontuário',
      'Métricas de atendimento por profissional',
    ],
    calendarios: [
      'Sincronização bidirecional de agendamentos',
      'Eventos da clínica aparecem no seu calendário pessoal',
      'Detecção automática de conflitos',
      'Convites para pacientes via e-mail',
    ],
    'email-marketing': [
      'Sincronize automaticamente a lista de pacientes',
      'Segmentação por procedimento, idade e frequência',
      'Disparos por gatilhos (aniversário, retorno, recall)',
      'Métricas de engajamento integradas',
    ],
    anuncios: [
      'CAC real por canal e campanha',
      'Atribuição de leads aos anúncios de origem',
      'ROI por procedimento promovido',
      'Otimização automática de orçamento',
    ],
    pagamentos: [
      'Cobrança automática após atendimento',
      'PIX, boleto, cartão e cobrança recorrente',
      'Conciliação automática no financeiro',
      'Lembretes de pagamento via WhatsApp',
    ],
    nfse: [
      'Emissão automática após confirmação de pagamento',
      'Cancelamento e re-emissão em um clique',
      'Cálculo automático de impostos por município',
      'Envio direto para o e-mail do paciente',
    ],
    convenios: [
      'Validação de elegibilidade em tempo real',
      'Geração e envio de guias TISS',
      'Controle de glosas e recursos',
      'Faturamento mensal consolidado',
    ],
    telemedicina: [
      'Link de consulta online direto no agendamento',
      'Prescrição digital válida e assinada',
      'Decisão clínica e protocolos integrados',
      'Histórico unificado presencial + online',
    ],
    erp: [
      'Sincronização de contas a pagar e receber',
      'Conciliação bancária automática',
      'Relatórios financeiros consolidados',
      'Integração com folha de pagamento',
    ],
    produtividade: [
      'Notificações da clínica diretamente nos seus canais',
      'Automatize tarefas operacionais',
      'Compartilhamento facilitado com a equipe',
      'Métricas operacionais consolidadas',
    ],
    webhooks: [
      'Conecte com 5000+ aplicativos sem código',
      'Workflows visuais entre Estetia e outras ferramentas',
      'Triggers para qualquer evento do CRM',
      'Logs e debug de cada execução',
    ],
    validacoes: [
      'Validação automática em lote',
      'Re-validação periódica programada',
      'Alertas para licenças vencendo',
      'Histórico completo de validações',
    ],
  }

  return byCategory[integration.category] ?? [
    'Conexão segura e self-service',
    'Configuração em poucos cliques',
    'Logs e auditoria completos',
    'Suporte dedicado',
  ]
}
