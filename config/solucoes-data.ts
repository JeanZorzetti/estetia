// TODO: migrar para messages/{locale}/marketing.json quando EN for traduzido
import {
  Calendar,
  Camera,
  MessageSquare,
  RefreshCw,
  CreditCard,
  Heart,
  Microscope,
  FileImage,
  FileText,
  Receipt,
  Activity,
  Shield,
  Building2,
  BarChart3,
  Users,
  Zap,
  CheckCircle,
  Clock,
  Star,
  Layers,
  TrendingUp,
  Package,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'

export type SolucaoBenefit = {
  icon: LucideIcon
  title: string
  text: string
}

export type SolucaoUseCase = {
  persona: string
  scenario: string
  outcome: string
}

export type SolucaoStep = {
  number: string
  title: string
  text: string
}

export type SolucaoFaq = {
  q: string
  a: string
}

export type SolucaoFeatureLink = {
  slug: string
  label: string
  description: string
}

export type SolucaoData = {
  slug: string
  emoji: string
  label: string
  color: string
  colorLight: string
  badge?: string
  hero: {
    badge: string
    headline: string
    subheadline: string
  }
  benefits: SolucaoBenefit[]
  useCases: SolucaoUseCase[]
  workflow: SolucaoStep[]
  features: SolucaoFeatureLink[]
  testimonial: {
    quote: string
    name: string
    role: string
    clinic: string
  }
  faq: SolucaoFaq[]
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export const SOLUCOES: SolucaoData[] = [
  {
    slug: 'estetica',
    emoji: '✨',
    label: 'Estética',
    color: '#489FB5',
    colorLight: '#489FB520',
    badge: 'Mais popular',
    hero: {
      badge: 'Para clínicas de estética',
      headline: 'O CRM que sua clínica de estética sempre quis',
      subheadline:
        'Agenda inteligente, recall automático por WhatsApp, prontuário digital e fidelização de clientes — tudo integrado para que você foque no que importa: transformar vidas.',
    },
    benefits: [
      {
        icon: Calendar,
        title: 'Agenda 24h com confirmação automática',
        text: 'Clientes agendam online pelo link personalizado a qualquer hora. Confirmação e lembrete automáticos reduzem faltas em até 67%.',
      },
      {
        icon: FileText,
        title: 'Anamnese digital antes da consulta',
        text: 'Formulário enviado por WhatsApp antes do atendimento. Você chega preparado com histórico, alergias e objetivos do cliente já documentados.',
      },
      {
        icon: RefreshCw,
        title: 'Recall inteligente por WhatsApp',
        text: 'O sistema identifica clientes que não retornam há X dias e envia mensagens personalizadas automaticamente. Taxa de reativação média de 34%.',
      },
      {
        icon: CreditCard,
        title: 'Controle de comissões sem planilhas',
        text: 'Cada procedimento registrado gera comissão automaticamente para o profissional responsável. Relatório mensal pronto com um clique.',
      },
      {
        icon: Package,
        title: 'Gestão de pacotes e sessões',
        text: 'Venda pacotes de 10 sessões, controle o saldo de cada cliente e receba alerta automático quando estiver próximo do fim.',
      },
      {
        icon: Heart,
        title: 'Programa de fidelidade integrado',
        text: 'Pontos acumulados a cada procedimento, resgates automáticos e campanhas de aniversário que aumentam o ticket médio e a retenção.',
      },
    ],
    useCases: [
      {
        persona: 'Esteticista autônoma',
        scenario: 'Trabalhava com agenda manual no WhatsApp, esquecia confirmações e perdia 4-5 clientes por mês por falta de recall.',
        outcome: 'Após 60 dias com Estetia: 89% de taxa de ocupação da agenda, zero faltas sem aviso e receita 31% maior.',
      },
      {
        persona: 'Clínica com 3 cabines',
        scenario: 'Dificuldade para controlar comissões de 4 profissionais, clientes reclamavam de espera e não havia histórico de procedimentos.',
        outcome: 'Redução de 2h/semana em gestão administrativa, NPS subiu de 62 para 91 e retenção de clientes aumentou 44%.',
      },
      {
        persona: 'Studio de micropigmentação',
        scenario: 'Clientes chegavam sem preencher anamnese, retoque marcado errado e sem controle de quando cada procedimento estava vencendo.',
        outcome: 'Anamnese 100% digital antes da sessão, recall de retoque automático e zero procedimentos sem documentação.',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Cliente agenda online',
        text: 'Link personalizado da sua clínica disponível 24h. O cliente escolhe serviço, profissional e horário sem ligação.',
      },
      {
        number: '02',
        title: 'Anamnese enviada automaticamente',
        text: 'WhatsApp envia o formulário digital 24h antes. Você recebe as respostas consolidadas no prontuário.',
      },
      {
        number: '03',
        title: 'Atendimento documentado',
        text: 'Registre fotos antes/depois, evolução e próximos passos diretamente no prontuário digital durante o atendimento.',
      },
      {
        number: '04',
        title: 'Recall e fidelização automáticos',
        text: 'O sistema agenda follow-up, envia lembretes de retorno e acumula pontos de fidelidade sem nenhuma ação manual sua.',
      },
    ],
    features: [
      {
        slug: 'agenda-inteligente',
        label: 'Agenda Inteligente',
        description: 'Agendamento online 24h, confirmações e lembretes automáticos',
      },
      {
        slug: 'anamnese-digital',
        label: 'Anamnese Digital',
        description: 'Formulário pré-atendimento enviado por WhatsApp',
      },
      {
        slug: 'recall-automatico',
        label: 'Recall Automático',
        description: 'Reativação de clientes inativos por WhatsApp',
      },
      {
        slug: 'whatsapp-business',
        label: 'WhatsApp Business',
        description: 'Comunicação centralizada com automações',
      },
      {
        slug: 'financeiro-tiss',
        label: 'Financeiro',
        description: 'Comissões, pacotes e relatórios automáticos',
      },
      {
        slug: 'mobile-app',
        label: 'App Mobile',
        description: 'Gestão completa pelo celular, em qualquer lugar',
      },
    ],
    testimonial: {
      quote:
        'Em 3 meses com o Estetia, minha taxa de retorno subiu de 52% para 79%. O recall automático por WhatsApp faz um trabalho que eu nunca conseguiria fazer sozinha.',
      name: 'Juliana Ferreira',
      role: 'Proprietária',
      clinic: 'Studio Bella Vita — São Paulo, SP',
    },
    faq: [
      {
        q: 'Preciso de conhecimento técnico para usar o Estetia?',
        a: 'Não. O sistema foi projetado para profissionais de estética, não para técnicos de TI. Onboarding guiado, suporte por WhatsApp e treinamento em vídeo incluídos em todos os planos.',
      },
      {
        q: 'Como funciona a agenda online para meus clientes?',
        a: 'Você recebe um link personalizado (ex: estetiacrm.com.br/sua-clinica) que pode compartilhar no Instagram, WhatsApp e Google. O cliente escolhe serviço e horário sem precisar ligar.',
      },
      {
        q: 'O recall por WhatsApp usa meu número pessoal?',
        a: 'Não. O Estetia usa número dedicado da API oficial do WhatsApp Business. Suas mensagens saem com o nome da sua clínica, sem expor seu número pessoal.',
      },
      {
        q: 'Consigo controlar pacotes de sessões (ex: 10 sessões de laser)?',
        a: 'Sim. Você cria pacotes com quantidade de sessões e valor, o sistema debita automaticamente a cada uso e avisa quando o pacote está acabando — para você oferecer a renovação no momento certo.',
      },
      {
        q: 'Posso migrar minha agenda atual para o Estetia?',
        a: 'Sim. Nossa equipe oferece migração assistida de planilhas, Google Agenda e outros sistemas. O processo leva em média 2 dias úteis sem interrupção do seu atendimento.',
      },
    ],
    seo: {
      title: 'CRM para Clínicas de Estética | Agenda, Recall e Fidelização | Estetia',
      description:
        'Software completo para clínicas de estética: agenda online 24h, anamnese digital, recall automático por WhatsApp, controle de comissões e programa de fidelidade.',
      keywords: [
        'crm clinica estetica',
        'software clinica estetica',
        'agenda online estetica',
        'sistema clinica estetica',
        'recall automatico whatsapp estetica',
        'gestao clinica estetica',
      ],
    },
  },

  {
    slug: 'dermatologia',
    emoji: '🩺',
    label: 'Dermatologia',
    color: '#0A1F3D',
    colorLight: '#0A1F3D15',
    hero: {
      badge: 'Sistema para dermatologistas e clínicas dermatológicas',
      headline: 'Software de gestão para dermatologia: prontuário, TISS e fotos evolutivas',
      subheadline:
        'Sistema completo para dermatologistas — mapeamento corporal, fotos evolutivas integradas, prescrição digital e conformidade TISS. Desenvolvido para as exigências da dermatologia clínica e estética no Brasil.',
    },
    benefits: [
      {
        icon: FileImage,
        title: 'Mapeamento corporal com fotos evolutivas',
        text: 'Documente lesões, nevos e tratamentos com fotos georeferenciadas no corpo do paciente. Compare antes e depois com controle de data e iluminação padronizada.',
      },
      {
        icon: FileText,
        title: 'Prontuário eletrônico completo',
        text: 'Histórico médico estruturado com CID-10, medicamentos em uso, alergias, antecedentes familiares e evolução clínica por consulta. Assinatura digital integrada.',
      },
      {
        icon: Receipt,
        title: 'Conformidade TISS e operadoras',
        text: 'Emissão de guias TISS, controle de glosas e integração com os principais planos de saúde. Faturamento correto sem retrabalho manual.',
      },
      {
        icon: Zap,
        title: 'Prescrição e receituário digital',
        text: 'Prescreva diretamente no sistema com busca por princípio ativo, posologia e orientações. Receituário azul com certificado digital A3/A1.',
      },
      {
        icon: FileText,
        title: 'Atestados e declarações automáticos',
        text: 'Modelos configuráveis de atestado, declaração de comparecimento e relatórios médicos. Assinatura digital com validade jurídica.',
      },
      {
        icon: Shield,
        title: 'LGPD e segurança de dados clínicos',
        text: 'Dados criptografados em repouso e em trânsito, log de acesso por profissional, controle de visibilidade por perfil e conformidade total com a LGPD e CFM.',
      },
    ],
    useCases: [
      {
        persona: 'Dermatologista clínico',
        scenario: 'Prontuário em papel, fotos no celular pessoal e dificuldade para comparar evolução de tratamentos como psoríase e melasma ao longo dos meses.',
        outcome: 'Prontuário 100% digital, fotos comparativas lado a lado com 6 meses de evolução e 40% menos tempo por consulta com templates pré-configurados.',
      },
      {
        persona: 'Clínica dermatológica com plano de saúde',
        scenario: 'Glosas frequentes por erros de codificação TISS, faturamento manual e sem visibilidade do que estava sendo pago ou rejeitado pelas operadoras.',
        outcome: 'Redução de 78% nas glosas após 90 dias, faturamento TISS integrado e controle de recebíveis por operadora em tempo real.',
      },
      {
        persona: 'Dermatologista estética',
        scenario: 'Sem controle de quantas sessões de laser cada paciente havia feito, sem follow-up estruturado e pacientes com resultado insatisfatório por protocolo incompleto.',
        outcome: 'Protocolo de sessões com alerta de descontinuidade, recall automático 30 dias após última sessão e NPS de 94 em tratamentos de laser.',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Primeira consulta digitalizada',
        text: 'Anamnese dermatológica completa preenchida digitalmente, fotos de lesões mapeadas no corpo e CID-10 registrado na abertura.',
      },
      {
        number: '02',
        title: 'Evolução e prescrição integradas',
        text: 'Cada retorno atualiza o prontuário com novas fotos comparativas, evolução do quadro e prescrição emitida digitalmente no mesmo fluxo.',
      },
      {
        number: '03',
        title: 'Faturamento TISS automatizado',
        text: 'Procedimentos codificados geram guias TISS automaticamente. Sistema valida antes de enviar para evitar glosas por erro de código.',
      },
      {
        number: '04',
        title: 'Acompanhamento pós-tratamento',
        text: 'Recall automático programado por protocolo (ex: 30, 60, 90 dias) com mensagem personalizada para garantir adesão e resultado clínico.',
      },
    ],
    features: [
      {
        slug: 'evolucao-fotos',
        label: 'Evolução com Fotos',
        description: 'Mapeamento corporal e comparativo evolutivo',
      },
      {
        slug: 'prontuario-eletronico',
        label: 'Prontuário Eletrônico',
        description: 'Histórico clínico completo com assinatura digital',
      },
      {
        slug: 'financeiro-tiss',
        label: 'Financeiro & TISS',
        description: 'Faturamento de planos e controle de glosas',
      },
      {
        slug: 'lgpd-seguranca',
        label: 'LGPD & Segurança',
        description: 'Conformidade total com dados clínicos',
      },
      {
        slug: 'agenda-inteligente',
        label: 'Agenda Inteligente',
        description: 'Agendamento com controle de tipo de consulta',
      },
      {
        slug: 'recall-automatico',
        label: 'Recall Automático',
        description: 'Follow-up programado por protocolo clínico',
      },
    ],
    testimonial: {
      quote:
        'O controle de fotos evolutivas mudou completamente minha prática clínica. Mostrar ao paciente a evolução real do tratamento aumentou a adesão e os resultados. Nunca mais voltaria ao papel.',
      name: 'Dra. Camila Rocha',
      role: 'Dermatologista CRM-SP',
      clinic: 'Clínica Derma Saúde — Campinas, SP',
    },
    faq: [
      {
        q: 'O Estetia tem conformidade com as normas do CFM para prontuário eletrônico?',
        a: 'Sim. O sistema segue a Resolução CFM 1.821/2007 e atualização de 2023, com assinatura digital certificada ICP-Brasil, log imutável de alterações e arquivamento por 20 anos.',
      },
      {
        q: 'Funciona com os principais planos de saúde para faturamento TISS?',
        a: 'Sim. Integração com Unimed, Bradesco Saúde, Amil, SulAmérica, Porto Seguro e mais 40 operadoras via padrão TISS 3.05. Validação automática antes do envio.',
      },
      {
        q: 'Como funciona o receituário digital com certificado A3?',
        a: 'Você conecta seu certificado digital A3 ou A1 ao sistema. Ao finalizar a prescrição, assina digitalmente com um clique. O PDF gerado tem validade jurídica plena.',
      },
      {
        q: 'Posso ter acesso diferenciado para médico e secretária?',
        a: 'Sim. O sistema tem 5 perfis de acesso configuráveis: Médico (acesso total), Técnico de Enfermagem (sem prescrição), Secretária (agenda e financeiro), Gestor (relatórios) e Recepção (check-in).',
      },
      {
        q: 'Os dados dos pacientes ficam no Brasil?',
        a: 'Sim. Infraestrutura 100% em data centers brasileiros (AWS São Paulo), em conformidade com a LGPD. Criptografia AES-256 em repouso e TLS 1.3 em trânsito.',
      },
    ],
    seo: {
      title: 'Sistema para Dermatologia | Software de Gestão para Dermatologistas | Estetia',
      description:
        'Sistema para dermatologia e software de gestão para dermatologistas: prontuário eletrônico CFM-compliant, mapeamento de lesões com fotos evolutivas, prescrição digital, faturamento TISS/TUSS e conformidade LGPD. Específico para dermatologistas e clínicas dermatológicas no Brasil.',
      keywords: [
        'sistema para dermatologia',
        'sistema para dermatologista',
        'software para dermatologia',
        'software para dermatologista',
        'crm dermatologia',
        'prontuario eletronico dermatologia',
        'sistema clinica dermatologica',
        'tiss dermatologia',
        'gestao clinica dermatologica',
      ],
    },
  },

  {
    slug: 'estetica-corporal',
    emoji: '💪',
    label: 'Estética Corporal',
    color: '#C5A059',
    colorLight: '#C5A05918',
    hero: {
      badge: 'Para especialistas em estética corporal',
      headline: 'Gestão completa para procedimentos corporais e modelagem',
      subheadline:
        'Avaliação postural digital, fotos comparativas, protocolos personalizados por biótipo e controle de sessões — a plataforma que profissionaliza cada etapa do tratamento corporal.',
    },
    benefits: [
      {
        icon: Activity,
        title: 'Avaliação postural e medidas digitais',
        text: 'Registre peso, medidas, percentual de gordura e postura com fotos comparativas. Compare a evolução em qualquer período com gráficos automáticos.',
      },
      {
        icon: Camera,
        title: 'Fotos comparativas antes/depois',
        text: 'Padronize ângulos e iluminação para comparações precisas. Clientes visualizam seu progresso real — aumenta a percepção de resultado e a retenção.',
      },
      {
        icon: Layers,
        title: 'Protocolos personalizados por biótipo',
        text: 'Monte protocolos completos (ex: drenagem + radiofrequência + ultrassom) por objetivo e biótipo. Siga o protocolo com checklist em cada sessão.',
      },
      {
        icon: Package,
        title: 'Controle de sessões e pacotes',
        text: 'Cada pacote tem número de sessões, intervalo mínimo e alerta de vencimento. O sistema avisa quando o cliente está há muito tempo sem vir.',
      },
      {
        icon: Microscope,
        title: 'Bioimpedância e composição corporal',
        text: 'Integre dados de bioimpedância ao prontuário. Acompanhe evolução de gordura visceral, massa muscular e hidratação ao longo do tratamento.',
      },
      {
        icon: TrendingUp,
        title: 'Evolução visual do cliente',
        text: 'Relatório de evolução automático para mostrar ao cliente após cada ciclo: fotos, medidas, perdas e ganhos. Ferramenta poderosa de retenção e indicação.',
      },
    ],
    useCases: [
      {
        persona: 'Profissional de drenagem e massagem',
        scenario: 'Sem controle de quantas sessões cada cliente tinha feito, sem registro de medidas e sem follow-up após término do pacote.',
        outcome: 'Taxa de renovação de pacotes subiu de 38% para 71% após mostrar evolução de medidas de forma visual ao cliente.',
      },
      {
        persona: 'Studio de modelagem corporal',
        scenario: 'Protocolos diferentes para cada profissional, sem padronização e clientes com resultados inconsistentes entre sessões.',
        outcome: 'Protocolos unificados com checklist por sessão, resultado padronizado e redução de retrabalho de 60%.',
      },
      {
        persona: 'Clínica de tratamentos corporais',
        scenario: 'Dificuldade para vender pacotes mais caros sem conseguir mostrar evolução concreta ao cliente em tempo real.',
        outcome: 'Ticket médio aumentou 43% após implementar relatório visual de evolução com fotos e medidas comparativas.',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Avaliação inicial completa',
        text: 'Anamnese corporal, medidas, fotos de referência e definição de objetivos. Tudo documentado digitalmente antes da primeira sessão.',
      },
      {
        number: '02',
        title: 'Protocolo personalizado criado',
        text: 'Com base na avaliação, monte o protocolo específico: quais técnicas, quantas sessões, intervalos e evolução esperada.',
      },
      {
        number: '03',
        title: 'Sessões registradas e monitoradas',
        text: 'Cada sessão registra o que foi feito, observações e novas medidas. Alerta automático se intervalo entre sessões for longo demais.',
      },
      {
        number: '04',
        title: 'Relatório de evolução gerado',
        text: 'Ao final do ciclo, relatório automático com fotos comparativas, redução de medidas e próximos passos. Ideal para mostrar resultado e renovar pacote.',
      },
    ],
    features: [
      {
        slug: 'evolucao-fotos',
        label: 'Evolução com Fotos',
        description: 'Comparativo antes/depois com medidas e composição corporal',
      },
      {
        slug: 'anamnese-digital',
        label: 'Anamnese Digital',
        description: 'Avaliação corporal completa com biótipo e objetivos',
      },
      {
        slug: 'prontuario-eletronico',
        label: 'Prontuário Eletrônico',
        description: 'Histórico completo de procedimentos e evolução',
      },
      {
        slug: 'agenda-inteligente',
        label: 'Agenda Inteligente',
        description: 'Controle de sessões com intervalo mínimo configurável',
      },
      {
        slug: 'recall-automatico',
        label: 'Recall Automático',
        description: 'Alerta de inatividade e oferta de renovação de pacote',
      },
      {
        slug: 'mobile-app',
        label: 'App Mobile',
        description: 'Registre sessões e fotos diretamente pelo celular',
      },
    ],
    testimonial: {
      quote:
        'Mostrar a evolução de medidas em gráfico para a cliente durante a sessão dobrou minha taxa de renovação de pacotes. As clientes visualizam o resultado e pedem para continuar.',
      name: 'Priscila Alves',
      role: 'Especialista em Estética Corporal',
      clinic: 'Body Care Studio — Belo Horizonte, MG',
    },
    faq: [
      {
        q: 'Consigo registrar medidas como circunferência, peso e percentual de gordura?',
        a: 'Sim. O sistema tem campos configuráveis para todas as medidas corporais: peso, IMC, circunferências (cintura, quadril, braços, coxas), percentual de gordura e hidratação. Gráfico de evolução automático.',
      },
      {
        q: 'Como funciona o controle de protocolo por sessão?',
        a: 'Você cria o protocolo uma vez (ex: 10 sessões de drenagem + ultrassom, 2x/semana). Cada sessão exibe o checklist do que deve ser feito. O sistema alerta se a cliente ficar mais de 7 dias sem vir.',
      },
      {
        q: 'As fotos são armazenadas com segurança?',
        a: 'Sim. Fotos são armazenadas criptografadas em nuvem brasileira com backup diário. Somente profissionais autorizados da sua clínica têm acesso. Conformidade total com LGPD.',
      },
      {
        q: 'Funciona para massagem, drenagem linfática e tratamentos específicos?',
        a: 'Sim. O sistema é agnóstico de técnica — você cadastra seus procedimentos, cria os protocolos como preferir e usa os campos de evolução para qualquer tipo de tratamento corporal.',
      },
      {
        q: 'Posso gerar um relatório de evolução para entregar para a cliente?',
        a: 'Sim. O relatório de evolução em PDF inclui fotos comparativas antes/depois, tabela de medidas por data, percentual de redução e os próximos passos recomendados.',
      },
    ],
    seo: {
      title: 'CRM para Estética Corporal | Protocolos, Medidas e Evolução | Estetia',
      description:
        'Software para estética corporal: avaliação postural, fotos comparativas, protocolos personalizados, controle de sessões e relatório de evolução para seus clientes.',
      keywords: [
        'crm estetica corporal',
        'software drenagem linfatica',
        'sistema clinica corporal',
        'controle sessoes estetica',
        'software modelagem corporal',
        'gestao clinica estetica corporal',
      ],
    },
  },

  {
    slug: 'multi-unidade',
    emoji: '🏢',
    label: 'Multi-unidade',
    color: '#1A7A5E',
    colorLight: '#1A7A5E15',
    hero: {
      badge: 'Para redes e franquias de clínicas',
      headline: 'Gestão centralizada para redes de clínicas de estética',
      subheadline:
        'Dashboard consolidado, permissões por unidade, estoque distribuído e relatórios comparativos entre filiais — a plataforma que escala com sua rede sem perder o controle.',
    },
    benefits: [
      {
        icon: BarChart3,
        title: 'Dashboard consolidado de todas as unidades',
        text: 'Visualize receita, ocupação, NPS e ticket médio de todas as filiais em uma única tela. Identifique a unidade com melhor desempenho e replique o modelo.',
      },
      {
        icon: Users,
        title: 'Permissões granulares por unidade',
        text: 'Cada gerente vê somente sua unidade. A franqueadora vê tudo. Profissionais têm acesso apenas aos seus atendimentos. Controle total sem confusão de dados.',
      },
      {
        icon: CreditCard,
        title: 'Comissões centralizadas e transparentes',
        text: 'Regras de comissão configuradas uma vez valem para todas as unidades. Relatório por profissional, por unidade ou consolidado da rede com um clique.',
      },
      {
        icon: Package,
        title: 'Estoque por filial com transferência',
        text: 'Cada unidade tem seu estoque independente. Solicite transferência entre filiais pelo sistema com aprovação do gestor central. Alerta de estoque mínimo por unidade.',
      },
      {
        icon: TrendingUp,
        title: 'Relatórios comparativos entre filiais',
        text: 'Compare desempenho de qualquer métrica entre unidades: receita, ocupação, retenção, NPS, ticket médio. Identifique gargalos e boas práticas rapidamente.',
      },
      {
        icon: Star,
        title: 'Marca única, experiência consistente',
        text: 'Templates de mensagem, anamneses e protocolos padronizados para toda a rede. O cliente tem a mesma experiência em qualquer unidade que visitar.',
      },
    ],
    useCases: [
      {
        persona: 'Franqueador de rede de estética',
        scenario: 'Cada franqueado usava um sistema diferente, dados em Excel, sem visibilidade de receita total e sem como comparar desempenho entre unidades.',
        outcome: 'Dashboard unificado em 30 dias, identifica unidade com menor ocupação e implementa ação corretiva 2 semanas antes que virasse problema.',
      },
      {
        persona: 'Clínica com 4 filiais próprias',
        scenario: 'Gestora passava 1 dia por semana consolidando relatórios de cada unidade manualmente. Sem tempo para análise estratégica.',
        outcome: 'Consolidação automática libera 1 dia por semana da gestora. Primeiro uso deste tempo: identificou que 1 filial tinha NPS 20 pontos menor e corrigiu o problema.',
      },
      {
        persona: 'Rede em expansão (8ª unidade)',
        scenario: 'Sem processo padronizado para onboarding de nova unidade: cadastros duplicados, treinamento demorado e experiência inconsistente do cliente.',
        outcome: 'Nova unidade operacional em 3 dias com templates, produtos e protocolos da rede já configurados. Franqueado treinado em 4h.',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Configuração centralizada da rede',
        text: 'Cadastre produtos, procedimentos, comissões e templates de mensagem uma vez. Propague para todas as unidades automaticamente.',
      },
      {
        number: '02',
        title: 'Onboarding ágil de nova unidade',
        text: 'Nova filial herda toda a configuração da rede. Adicione endereço, profissionais e horários. Operacional em menos de um dia.',
      },
      {
        number: '03',
        title: 'Operação independente por unidade',
        text: 'Cada unidade opera de forma autônoma com seus profissionais, agenda e atendimentos. Sem interferência entre filiais.',
      },
      {
        number: '04',
        title: 'Visão consolidada para o gestor',
        text: 'Dashboard em tempo real com métricas de todas as unidades. Alertas automáticos para quedas de desempenho. Relatório mensal da rede pronto para a reunião.',
      },
    ],
    features: [
      {
        slug: 'multi-unidade',
        label: 'Multi-unidade',
        description: 'Dashboard consolidado e gestão centralizada de rede',
      },
      {
        slug: 'analytics-pro',
        label: 'Analytics PRO',
        description: 'Comparativos entre filiais e métricas de rede',
      },
      {
        slug: 'financeiro-tiss',
        label: 'Financeiro',
        description: 'Comissões centralizadas e faturamento por unidade',
      },
      {
        slug: 'lgpd-seguranca',
        label: 'LGPD & Segurança',
        description: 'Permissões granulares e auditoria de acesso',
      },
      {
        slug: 'whatsapp-business',
        label: 'WhatsApp Business',
        description: 'Comunicação padronizada com identidade da rede',
      },
      {
        slug: 'recall-automatico',
        label: 'Recall Automático',
        description: 'Campanhas de reativação uniformes em todas as filiais',
      },
    ],
    testimonial: {
      quote:
        'Antes do Estetia, eu sabia o que estava acontecendo nas filiais só no final do mês. Agora vejo em tempo real qual unidade precisa de atenção e já resolvo antes que vire problema.',
      name: 'Ricardo Mendes',
      role: 'Diretor de Operações',
      clinic: 'Rede Belle Clinic — 6 unidades, Rio de Janeiro, RJ',
    },
    faq: [
      {
        q: 'Quantas unidades posso gerenciar no plano Multi-unidade?',
        a: 'O plano Multi-unidade comporta de 2 a 50 unidades. Redes maiores têm contrato Enterprise com SLA dedicado, servidor exclusivo e gerente de sucesso. Fale com nosso time.',
      },
      {
        q: 'Clientes podem usar serviços em qualquer unidade da rede?',
        a: 'Sim. O cadastro do cliente é único e compartilhado entre unidades (com controle de permissão). Pacotes comprados em uma filial podem ser utilizados em qualquer outra da rede.',
      },
      {
        q: 'Como funciona o controle de estoque entre filiais?',
        a: 'Cada filial tem estoque independente. A filial A pode solicitar transferência de produto para a filial B. O gestor central aprova e o sistema registra a movimentação. Alerta de estoque mínimo por unidade.',
      },
      {
        q: 'É possível ter campanhas de WhatsApp diferentes por unidade?',
        a: 'Sim. Você pode ter templates globais da rede e templates específicos por unidade. O gestor central define quais mensagens são obrigatórias e quais podem ser customizadas localmente.',
      },
      {
        q: 'Como é o processo de implantação para uma rede existente?',
        a: 'Nossa equipe de implantação configura a rede completa: cadastra todas as unidades, importa dados dos sistemas anteriores, treina os gestores e acompanha os primeiros 30 dias de operação. SLA de implantação de 5 dias úteis para redes de até 10 unidades.',
      },
    ],
    seo: {
      title: 'CRM Multi-unidade para Redes de Clínicas | Estetia',
      description:
        'Gestão centralizada para redes e franquias de clínicas de estética: dashboard consolidado, permissões por filial, estoque distribuído e relatórios comparativos.',
      keywords: [
        'crm multi-unidade clinica estetica',
        'software rede clinica estetica',
        'sistema franquia estetica',
        'gestao multiplas filiais estetica',
        'software rede clinicas',
        'crm franquia clinica',
      ],
    },
  },
]

export function getSolucaoBySlug(slug: string): SolucaoData | undefined {
  return SOLUCOES.find((s) => s.slug === slug)
}

export function getAllSolucaoSlugs(): string[] {
  return SOLUCOES.map((s) => s.slug)
}
