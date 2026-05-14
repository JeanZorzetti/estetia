/**
 * Niche config for ultra-targeted estética/dermatologia positioning.
 * Used across landing pages, SEO programático, and GTM copy.
 */

export interface EsteticaNicheData {
  slug: string
  title: string
  subtitle: string
  heroTagline: string
  painPoints: string[]
  jargon: {
    paciente: string
    sessao: string
    procedimento: string
    agendamento: string
    retorno: string
    faturamento: string
  }
  benefits: Array<{ title: string; description: string; icon: string }>
  testimonial: { quote: string; author: string; role: string; clinic: string; city: string }
  faq: Array<{ question: string; answer: string }>
  seo: { title: string; description: string; keywords: string[] }
  color: { primary: string; accent: string }
  procedures: string[]
}

export const ESTETICA_NICHES: EsteticaNicheData[] = [
  {
    slug: 'clinica-estetica',
    title: 'CRM para Clínicas de Estética',
    subtitle: 'A agenda, o prontuário e o WhatsApp da sua clínica — em um só lugar',
    heroTagline: 'Reduza no-show em até 40% e aumente a recompra sem lembrar de nada',
    painPoints: [
      'Clientes que somem após o primeiro procedimento',
      'Agenda lotada de fura-fila e no-shows de última hora',
      'Anamnese em papel que ninguém acha depois',
      'WhatsApp no celular pessoal misturando profissional com pessoal',
      'Dificuldade de saber quais procedimentos dão mais lucro',
    ],
    jargon: {
      paciente: 'Paciente',
      sessao: 'Sessão',
      procedimento: 'Procedimento',
      agendamento: 'Agendamento',
      retorno: 'Retorno',
      faturamento: 'Faturamento',
    },
    benefits: [
      {
        title: 'Agenda inteligente',
        description: 'Visão semanal por profissional e sala. Evita conflitos e detecta horários de alto risco de no-show automaticamente.',
        icon: 'Calendar',
      },
      {
        title: 'WhatsApp automático',
        description: 'Confirmação 48h antes, pré-cuidados 24h antes, pós-cuidados no dia — sem você digitar uma palavra.',
        icon: 'MessageCircle',
      },
      {
        title: 'Prontuário & anamnese digital',
        description: 'Formulários customizáveis por procedimento. Assinatura digital. Armazenamento criptografado (LGPD Art. 11).',
        icon: 'FileText',
      },
      {
        title: 'Recall automático de recompra',
        description: 'O sistema lembra sua paciente quando é hora de manter o resultado — Botox, preenchimento, laser, peeling.',
        icon: 'RefreshCw',
      },
      {
        title: 'Controle de convênios e NFS-e',
        description: 'Gestão de guias TISS, operadoras de saúde e emissão automática de NFS-e ao concluir tratamento.',
        icon: 'Building2',
      },
      {
        title: 'Dashboard de resultados',
        description: 'Faturamento por procedimento, taxa de recompra, NPS das pacientes, ranking de profissionais — tudo em tempo real.',
        icon: 'BarChart3',
      },
    ],
    testimonial: {
      quote: 'Antes eu perdia pelo menos 8 pacientes por mês por não-retorno. Agora o sistema manda o recall automático e elas voltam sozinhas. Meu faturamento cresceu 32% em 3 meses.',
      author: 'Dra. Fernanda Costa',
      role: 'Proprietária',
      clinic: 'Clínica Bella',
      city: 'São Paulo, SP',
    },
    faq: [
      {
        question: 'Preciso instalar algum software?',
        answer: 'Não. O sistema é 100% online, funciona em qualquer dispositivo — celular, tablet ou computador. Sua equipe acessa pelo navegador.',
      },
      {
        question: 'Como funciona o envio automático de WhatsApp?',
        answer: 'Você conecta seu número ao sistema uma única vez. A partir daí, as confirmações, lembretes e recalls saem automaticamente com o nome da paciente e detalhes do procedimento.',
      },
      {
        question: 'O prontuário é adequado para médicos e biomédicos?',
        answer: 'Sim. O sistema suporta profissionais com registro no CRM, CRO, CRBM, CRF e COREN. A validação é feita automaticamente.',
      },
      {
        question: 'Atende clínicas com convênio?',
        answer: 'Sim. O plano Business inclui gestão de guias TISS, cadastro de operadoras e emissão automática de NFS-e médica.',
      },
      {
        question: 'Meus dados e os dados das pacientes ficam seguros?',
        answer: 'Sim. Todos os dados sensíveis (anamnese, CPF, fotos clínicas) são criptografados com AES-256. O sistema é 100% compatível com a LGPD Art. 11 (dados de saúde).',
      },
      {
        question: 'Posso migrar minha agenda atual?',
        answer: 'Sim. Oferecemos importação via CSV e suporte guiado de onboarding. A maioria das clínicas está operacional em menos de 2 dias.',
      },
    ],
    seo: {
      title: 'CRM para Clínicas de Estética | Agenda, WhatsApp e Prontuário Digital',
      description: 'Software completo para clínicas de estética: agenda inteligente, prontuário LGPD, WhatsApp automático e recall de recompra. Reduza no-show em 40%. Teste grátis 14 dias.',
      keywords: [
        'crm para clinica de estetica',
        'software clinica estetica',
        'agenda clinica estetica',
        'prontuario digital estetica',
        'whatsapp automatico clinica',
        'sistema gestao clinica estetica',
        'recall automatico clinica',
        'software para esteticista',
        'crm dermatologia',
        'gestao clinica estetica',
      ],
    },
    color: { primary: 'rose', accent: 'pink' },
    procedures: ['Botox', 'Preenchimento labial', 'Harmonização facial', 'Laser CO2', 'Peeling químico', 'Microagulhamento', 'Criolipólise', 'Limpeza de pele', 'HIFU', 'Fios de PDO'],
  },
  {
    slug: 'dermatologia',
    title: 'CRM para Consultórios de Dermatologia',
    subtitle: 'Gestão clínica completa para dermatologistas — prontuário, TISS e agenda em um lugar',
    heroTagline: 'Dedique mais tempo aos pacientes, menos ao administrativo',
    painPoints: [
      'Prontuários físicos difíceis de localizar e vulneráveis à LGPD',
      'Gestão manual de guias TISS e convênios',
      'Agendamento por telefone que consome horas da recepção',
      'Falta de controle sobre quais tratamentos geram mais receita',
      'Dificuldade de manter histórico fotográfico dos casos',
    ],
    jargon: {
      paciente: 'Paciente',
      sessao: 'Consulta',
      procedimento: 'Procedimento dermatológico',
      agendamento: 'Consulta agendada',
      retorno: 'Retorno',
      faturamento: 'Faturamento clínico',
    },
    benefits: [
      {
        title: 'Prontuário digital LGPD',
        description: 'Histórico completo do paciente com fotos clínicas criptografadas, anamnese estruturada e acesso controlado por perfil.',
        icon: 'Shield',
      },
      {
        title: 'Guias TISS simplificadas',
        description: 'Geração e envio de guias de consulta e SADT para as principais operadoras. Controle de glosas e pagamentos.',
        icon: 'FileCheck',
      },
      {
        title: 'Agenda por médico',
        description: 'Visão de agenda por profissional com tempo de consulta configurável por procedimento. Confirmação automática por WhatsApp.',
        icon: 'Calendar',
      },
      {
        title: 'NFS-e automática',
        description: 'Emissão automática de nota fiscal de serviço ao concluir o atendimento. Suporte multi-municipal.',
        icon: 'Receipt',
      },
      {
        title: 'Validação CFM',
        description: 'Verificação automática de inscrição ativa no CRM para todos os médicos da clínica.',
        icon: 'BadgeCheck',
      },
      {
        title: 'Análise de receita por CID',
        description: 'Dashboard financeiro segmentado por tipo de procedimento, operadora e profissional.',
        icon: 'BarChart3',
      },
    ],
    testimonial: {
      quote: 'A gestão de convênios era o meu maior problema. Com o sistema, as guias TISS saem em 2 cliques e o controle de glosas melhorou muito. Recuperei mais de R$ 8.000 em glosas no primeiro mês.',
      author: 'Dr. Ricardo Almeida',
      role: 'Dermatologista CRM-SP',
      clinic: 'Clínica Derma Plus',
      city: 'Campinas, SP',
    },
    faq: [
      {
        question: 'O sistema é homologado pela ANS?',
        answer: 'O gerador de XML TISS segue o padrão TISS 4.01.00 da ANS. As guias são geradas conforme o formato exigido pelas operadoras.',
      },
      {
        question: 'Quais operadoras são suportadas?',
        answer: 'Inicialmente Bradesco Saúde, Amil e SulAmérica. Novas operadoras são adicionadas conforme demanda.',
      },
      {
        question: 'Funciona para clínicas com vários médicos?',
        answer: 'Sim. Cada profissional tem agenda, prontuário e validação CFM independentes. Você vê tudo consolidado no dashboard.',
      },
    ],
    seo: {
      title: 'CRM para Dermatologia | Prontuário Digital, TISS e Agenda Médica',
      description: 'Software de gestão para consultórios de dermatologia: prontuário LGPD, guias TISS, NFS-e automática e agenda por médico. Teste grátis.',
      keywords: [
        'crm para dermatologia',
        'software consultorio dermatologia',
        'prontuario digital dermatologista',
        'tiss dermatologia',
        'agenda medica dermatologia',
        'sistema gestao dermatologia',
      ],
    },
    color: { primary: 'violet', accent: 'purple' },
    procedures: ['Consulta dermatológica', 'Biópsia de pele', 'Crioterapia', 'Eletrocirurgia', 'Peelings médicos', 'Laser fracionado', 'PDT', 'Toxina botulínica', 'Preenchimento', 'Cirurgia dermatológica'],
  },
  {
    slug: 'harmonizacao-facial',
    title: 'CRM para Harmonização Facial',
    subtitle: 'Do agendamento ao recall — gestão completa para especialistas em harmonização',
    heroTagline: 'Suas pacientes voltam. Você só precisa lembrar delas na hora certa.',
    painPoints: [
      'Pacientes que fazem a primeira sessão e desaparecem',
      'Controle manual de quais produtos foram usados em cada sessão',
      'Antes/depois guardados no celular pessoal — sem organização',
      'Sem follow-up estruturado para recompra de toxina e preenchimento',
      'Dificuldade de provar resultados para captar novas pacientes',
    ],
    jargon: {
      paciente: 'Paciente',
      sessao: 'Sessão de harmonização',
      procedimento: 'Protocolo',
      agendamento: 'Agendamento',
      retorno: 'Retoque / Manutenção',
      faturamento: 'Faturamento',
    },
    benefits: [
      {
        title: 'Recall inteligente de retoque',
        description: 'O sistema calcula automaticamente quando cada paciente precisa de manutenção (botox 4-6 meses, preenchimento 12-18 meses) e envia WhatsApp.',
        icon: 'RefreshCw',
      },
      {
        title: 'Rastreabilidade de produtos',
        description: 'Registro de marca, lote e validade de cada toxina e ácido aplicado. Conformidade com ANVISA para rastreabilidade.',
        icon: 'Package',
      },
      {
        title: 'Galeria antes/depois segura',
        description: 'Fotos clínicas criptografadas por paciente. Compartilhamento com consentimento assinado digitalmente.',
        icon: 'Image',
      },
      {
        title: 'Anamnese específica',
        description: 'Formulários personalizados por protocolo: botox, preenchimento labial, rinomodelação, mandíbula, etc.',
        icon: 'ClipboardList',
      },
      {
        title: 'Agendamento pelo paciente',
        description: 'Link público de agendamento. A paciente escolhe profissional, protocolo e horário sem precisar ligar.',
        icon: 'Globe',
      },
      {
        title: 'NPS pós-procedimento',
        description: 'WhatsApp automático 30 dias após a sessão com foto follow-up e NPS. Coleta depoimentos para marketing.',
        icon: 'Star',
      },
    ],
    testimonial: {
      quote: 'Minha taxa de recompra era de 35%. Com os recalls automáticos, subiu para 68% em 4 meses. O sistema se pagou no primeiro mês.',
      author: 'Dra. Camila Torres',
      role: 'Especialista em Harmonização Facial',
      clinic: 'Studio Facial Camila Torres',
      city: 'Florianópolis, SC',
    },
    faq: [
      {
        question: 'Funciona para profissionais que trabalham em clínica e em casa?',
        answer: 'Sim. Você acessa de qualquer dispositivo. O agendamento público funciona mesmo para atendimento em consultório domiciliar.',
      },
      {
        question: 'Como o recall automático sabe quando chamar a paciente?',
        answer: 'Você configura o intervalo por procedimento (ex: Botox = 4 meses). O sistema agenda o WhatsApp automaticamente na data certa.',
      },
    ],
    seo: {
      title: 'CRM para Harmonização Facial | Recall, Anamnese e Agendamento Online',
      description: 'Software para especialistas em harmonização facial: recall automático de recompra, anamnese digital, antes/depois seguro e agendamento online. Aumente sua taxa de retorno.',
      keywords: [
        'crm harmonizacao facial',
        'software harmonizacao facial',
        'agenda harmonizacao facial',
        'recall automatico botox',
        'sistema gestao harmonizacao',
        'anamnese harmonizacao facial',
      ],
    },
    color: { primary: 'amber', accent: 'orange' },
    procedures: ['Toxina botulínica', 'Preenchimento labial', 'Preenchimento de mandíbula', 'Rinomodelação', 'Bichectomia química', 'Fios de PDO', 'Bioestimuladores', 'Skinbooster', 'Lifting facial'],
  },
  {
    slug: 'medicina-estetica',
    title: 'CRM para Medicina Estética',
    subtitle: 'Plataforma clínica completa para médicos estetas',
    heroTagline: 'Compliance clínico + automação comercial. Para médicos que querem mais.',
    painPoints: [
      'Dupla jornada: atender bem e ainda gerir a clínica',
      'Conformidade com CFM, LGPD e ANS ao mesmo tempo',
      'Falta de dados para tomar decisões de expansão',
      'Gestão de convênios consumindo tempo de consulta',
      'Dificuldade de fidelizar no mercado de alta concorrência',
    ],
    jargon: {
      paciente: 'Paciente',
      sessao: 'Consulta / Procedimento',
      procedimento: 'Procedimento médico',
      agendamento: 'Consulta agendada',
      retorno: 'Retorno / Manutenção',
      faturamento: 'Faturamento clínico',
    },
    benefits: [
      {
        title: 'Validação CFM automática',
        description: 'Verificação de inscrição ativa para todos os médicos da equipe. Atualização a cada 30 dias.',
        icon: 'BadgeCheck',
      },
      {
        title: 'Prontuário médico completo',
        description: 'Histórico clínico, anamnese, evolução, prescrições simples e fotos — tudo auditado e criptografado.',
        icon: 'Stethoscope',
      },
      {
        title: 'Convênios e TISS',
        description: 'Guias de consulta e SADT, controle de glosas, emissão NFS-e. Para clínicas que atendem planos de saúde.',
        icon: 'CreditCard',
      },
      {
        title: 'Dashboard médico-financeiro',
        description: 'Produtividade por médico, faturamento por convênio, taxa de retorno e NPS — em tempo real.',
        icon: 'BarChart3',
      },
      {
        title: 'Termos de consentimento digitais',
        description: 'Biblioteca de TCLEs para procedimentos de médica estética. Assinatura digital com hash criptográfico.',
        icon: 'FileSignature',
      },
      {
        title: 'Multi-unidade',
        description: 'Gerencie várias unidades da clínica com um único login. Dashboard consolidado ou por unidade.',
        icon: 'Network',
      },
    ],
    testimonial: {
      quote: 'Finalmente uma plataforma que entende que sou médico e não só dono de negócio. O prontuário está de acordo com o CFM, a LGPD está coberta e ainda tenho o CRM comercial integrado.',
      author: 'Dr. Marcelo Viana',
      role: 'Médico Esteta CRM-RJ',
      clinic: 'Instituto Viana',
      city: 'Rio de Janeiro, RJ',
    },
    faq: [
      {
        question: 'O prontuário atende as exigências do CFM?',
        answer: 'O sistema registra todos os dados exigidos pelo CFM para prontuário médico eletrônico, incluindo autoria, data/hora, e impossibilidade de exclusão.',
      },
      {
        question: 'Como funciona a multi-unidade?',
        answer: 'Cada unidade tem sua agenda, equipe e financeiro independentes. O administrador vê tudo consolidado num dashboard único.',
      },
    ],
    seo: {
      title: 'CRM para Medicina Estética | CFM, LGPD, TISS e Prontuário Digital',
      description: 'Plataforma completa para médicos estetas: prontuário CFM-compliant, LGPD Art. 11, convênios TISS e dashboard financeiro. Multi-unidade.',
      keywords: [
        'crm medicina estetica',
        'software medico estetica',
        'prontuario medico estetica',
        'crm cfm lgpd',
        'sistema gestao medicina estetica',
        'tiss medicina estetica',
      ],
    },
    color: { primary: 'blue', accent: 'cyan' },
    procedures: ['Toxina botulínica (médica)', 'Bioestimuladores de colágeno', 'Fios de sustentação', 'Lipólise por injeção', 'Ultrassom microfocado (HIFU)', 'Radiofrequência', 'Laser fracionado ablativo', 'Preenchimentos dérmicos', 'Exossomos e PRP', 'Cirurgia plástica menor'],
  },
]

export function getEsteticaNiche(slug: string): EsteticaNicheData | undefined {
  return ESTETICA_NICHES.find(n => n.slug === slug)
}

export const PRIMARY_NICHE = ESTETICA_NICHES[0]
