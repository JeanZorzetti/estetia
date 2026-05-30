/**
 * HowTo schemas for tutorial blog posts.
 * Google displays structured steps directly in search results.
 * Reference: https://schema.org/HowTo
 */

interface HowToStep {
  name: string
  text: string
}

interface HowToSchema {
  '@context': 'https://schema.org'
  '@type': 'HowTo'
  name: string
  description: string
  totalTime?: string // ISO 8601 duration: PT10M = 10 minutes
  estimatedCost?: { '@type': 'MonetaryAmount'; currency: string; value: string }
  step: Array<{ '@type': 'HowToStep'; name: string; text: string }>
}

function buildHowTo(
  name: string,
  description: string,
  steps: HowToStep[],
  opts?: { totalTime?: string; cost?: string }
): HowToSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(opts?.totalTime && { totalTime: opts.totalTime }),
    ...(opts?.cost && {
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'BRL', value: opts.cost },
    }),
    step: steps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
  }
}

export const howToSchemas: Record<string, HowToSchema> = {
  'spin-selling-para-clinicas-de-estetica': buildHowTo(
    'Como Aplicar SPIN Selling na Consulta de Avaliação Estética',
    'Guia em 5 passos para usar as 4 perguntas SPIN (Situação, Problema, Implicação, Necessidade) na consulta de avaliação inicial e aumentar a conversão em procedimentos estéticos.',
    [
      { name: 'Prepare-se com o prontuário antes da consulta', text: 'Revise o histórico do paciente no Estetia CRM: procedimentos anteriores, queixas registradas e preferências. Esse contexto alimenta as perguntas de Situação sem precisar perguntar o óbvio.' },
      { name: 'Faça perguntas de Situação para entender o contexto', text: 'Pergunte sobre rotina de skincare, histórico de procedimentos e expectativas: "Você já fez algum tratamento para essa região antes? Como foi a experiência?"' },
      { name: 'Explore Problemas com perguntas abertas', text: 'Identifique o que realmente incomoda o paciente: "O que te faz sentir mais insatisfeita com essa área?", "Isso te afeta no dia a dia de alguma forma?"' },
      { name: 'Amplie com perguntas de Implicação', text: 'Ajude o paciente a perceber o impacto emocional: "Como você se sente quando percebe isso no espelho?", "Isso já afetou sua autoestima em alguma situação específica?"' },
      { name: 'Conduza para a Necessidade e apresente a solução', text: 'Pergunte sobre o resultado ideal: "Qual seria o resultado perfeito para você após o tratamento?" Só depois apresente o procedimento como solução para a necessidade que o próprio paciente articulou.' },
    ],
    { totalTime: 'PT45M', cost: '0' }
  ),

  'como-reduzir-no-show-em-clinicas-de-estetica': buildHowTo(
    'Como Reduzir No-Show em Clínicas de Estética com Confirmação Automática',
    'Passo a passo para configurar um sistema de redução de no-show com 3 camadas: confirmação automática, no-show predictor e lista de espera.',
    [
      { name: 'Configure lembretes automáticos em 3 momentos', text: 'No Estetia CRM, ative: lembrete 48h antes (confirmação via WhatsApp), 24h antes (com opção de cancelamento/reagendamento) e 2h antes (lembrete final). Cada lembrete pode ser personalizado com nome do paciente e procedimento.' },
      { name: 'Ative o no-show predictor por paciente', text: 'O sistema analisa histórico de cancelamentos, tempo de agendamento, tipo de procedimento e horário para calcular um score de risco. Pacientes com score alto recebem abordagem extra (ligação pessoal da recepção).' },
      { name: 'Monte uma lista de espera ativa', text: 'Configure a lista de espera para cada horário. Quando um paciente cancela, o sistema contacta automaticamente o próximo da lista via WhatsApp com um link de confirmação em 1 clique.' },
      { name: 'Defina política clara de sinal para novos pacientes', text: 'Para procedimentos de alto ticket com novos pacientes, exija sinal de 30-50% no agendamento. Informe claramente no momento da marcação — reduz no-show em até 70% nesse perfil.' },
      { name: 'Monitore e ajuste mensalmente', text: 'Acompanhe a taxa de no-show mensal no dashboard do Estetia CRM. Identifique profissional, horário ou tipo de procedimento com maior incidência e ajuste a estratégia de confirmação.' },
    ],
    { totalTime: 'PT20M', cost: '0' }
  ),

  'lgpd-para-clinicas-de-estetica-guia-2026': buildHowTo(
    'Como Adequar sua Clínica de Estética à LGPD em 5 Passos',
    'Roteiro prático de conformidade LGPD para clínicas de estética e dermatologia — foco em dados sensíveis de saúde (Art. 11) sem precisar de consultoria jurídica inicial.',
    [
      { name: 'Mapeie todos os dados coletados da clínica', text: 'Liste onde estão os dados de pacientes: fichas físicas, WhatsApp, planilhas, sistemas, email. Para cada dado, identifique: o que é coletado, onde está armazenado, quem acessa e por quanto tempo é guardado.' },
      { name: 'Colete consentimento específico para dados de saúde', text: 'Crie um termo de consentimento digital para anamneses, fotos antes/depois e histórico clínico. O consentimento deve ser livre, informado e específico — um checkbox genérico não é suficiente para o Art. 11.' },
      { name: 'Publique a Política de Privacidade no site', text: 'Inclua: quais dados são coletados, para que finalidade, como são protegidos, por quanto tempo são guardados e como o paciente pode exercer seus direitos (acesso, exclusão, portabilidade).' },
      { name: 'Configure controles de acesso no sistema', text: 'No Estetia CRM, defina quem pode ver quais dados: recepcionista acessa agenda, técnico acessa prontuário do seu paciente, gestor tem visão geral. O sistema mantém audit trail de todos os acessos.' },
      { name: 'Designe um responsável pela proteção de dados (DPO)', text: 'Para clínicas de pequeno porte, o DPO pode ser o próprio proprietário ou um DPO externo contratado por horas. O responsável cuida de responder solicitações de titulares e comunicar incidentes à ANPD.' },
    ],
    { totalTime: 'PT60M', cost: '0' }
  ),

  'anamnese-digital-clinica-de-estetica': buildHowTo(
    'Como Implementar Anamnese Digital na sua Clínica de Estética',
    'Passo a passo para substituir fichas de papel por anamnese digital — com alertas de contraindicação, assinatura eletrônica e integração com prontuário.',
    [
      { name: 'Crie as fichas de anamnese por procedimento', text: 'No Estetia CRM, configure fichas específicas para cada procedimento: toxina botulínica, preenchimento, laser, microagulhamento, peeling. Cada ficha tem campos obrigatórios e de contraindicação configuráveis.' },
      { name: 'Configure os alertas de contraindicação', text: 'Cadastre as contraindicações de cada procedimento: gravidez (todos os procedimentos), anticoagulantes (microagulhamento, laser), lúpus (IPL), isotretinoína (peeling profundo). O sistema alerta automaticamente.' },
      { name: 'Ative o envio automático pré-consulta', text: 'Configure para enviar o link da anamnese digital via WhatsApp quando o agendamento é confirmado. O paciente preenche pelo celular em qualquer momento antes da consulta.' },
      { name: 'Revise alertas antes do atendimento', text: 'Antes de cada consulta, abra o prontuário no Estetia CRM. Se houver alerta de contraindicação, o sistema exibe em destaque vermelho. O profissional decide se procede, adapta ou cancela o procedimento.' },
      { name: 'Arquivo e acesso seguro ao histórico', text: 'Todas as anamneses ficam no prontuário do paciente com data, hora e assinatura eletrônica. Para consultas futuras, o profissional vê o histórico completo sem preencher tudo novamente — só atualiza o que mudou.' },
    ],
    { totalTime: 'PT30M', cost: '0' }
  ),

  'kpis-essenciais-clinica-de-estetica': buildHowTo(
    'Como Montar um Dashboard de KPIs Clínicos no Estetia CRM',
    'Guia passo a passo para configurar o monitoramento dos 5 KPIs essenciais de clínicas de estética e tomar decisões baseadas em dados.',
    [
      { name: 'Configure a taxa de ocupação da agenda', text: 'No dashboard do Estetia CRM, ative a visualização de taxa de ocupação diária, semanal e mensal. Defina a meta (80-90%) e configure alerta quando cair abaixo de 70% por 3 dias consecutivos.' },
      { name: 'Acompanhe o no-show em tempo real', text: 'O painel mostra no-show do dia, semana e mês por profissional e tipo de procedimento. Identifique padrões: horários com maior índice, procedimentos mais cancelados, perfil de paciente.' },
      { name: 'Calcule a taxa de recompra mensal', text: 'Configure o filtro de "pacientes que retornaram em 90 dias" como KPI fixo no dashboard. A meta saudável é acima de 40%. Abaixo de 25% indica problema de fidelização que requer ação.' },
      { name: 'Monitore o ticket médio por procedimento', text: 'Analise ticket médio por tipo de procedimento, profissional e período. Isso revela quais tratamentos têm maior margem, quais profissionais convertem melhor e sazonalidade da receita.' },
      { name: 'Revise os KPIs semanalmente em reunião de equipe', text: 'Separe 15 minutos por semana para revisar o dashboard com a equipe. Para cada KPI fora da meta: identifique causa, defina ação e responsável, avalie resultado na semana seguinte.' },
    ],
    { totalTime: 'PT25M', cost: '0' }
  ),
}

/** Returns the HowTo schema for a slug, or null if not defined */
export function getHowToSchema(slug: string): HowToSchema | null {
  return howToSchemas[slug] ?? null
}

// Adicionar HowTo schemas para os novos posts
Object.assign(howToSchemas, {
  'prontuario-eletronico-clinica-estetica': buildHowTo(
    'Como Implementar Prontuário Eletrônico na Clínica de Estética',
    'Passo a passo para substituir fichas físicas por prontuário eletrônico — com fotodocumentação, assinatura digital e conformidade LGPD.',
    [
      { name: 'Configure os templates de prontuário por procedimento', text: 'Crie templates específicos para cada procedimento realizado na clínica: toxina botulínica, preenchimento, laser, microagulhamento, limpeza de pele. Cada template tem campos obrigatórios configurados — garantindo completude dos registros sem esforço adicional do profissional.' },
      { name: 'Ative a anamnese digital pré-consulta', text: 'Configure o envio automático do link de anamnese digital via WhatsApp quando um agendamento é confirmado. O paciente preenche antes de chegar à clínica — e os dados já estão no prontuário eletrônico quando o profissional abre o sistema.' },
      { name: 'Configure consentimento digital para fotodocumentação', text: 'Crie e ative o termo de consentimento específico para fotodocumentação clínica. O paciente assina digitalmente antes da primeira foto — com registro de data/hora e hash do documento para validade jurídica. Inclua finalidades separadas: uso clínico interno e divulgação externa (se autorizado).' },
      { name: 'Treine a equipe em 2 horas', text: 'Realize um treinamento prático de 2 horas cobrindo: abrir prontuário do paciente, registrar um procedimento, fotografar corretamente com os guias de enquadramento do sistema, e assinar digitalmente uma anamnese. Enfatize o protocolo de fotografia padronizado — fundo neutro, iluminação uniforme, ângulo consistente por região tratada.' },
      { name: 'Migre o histórico gradualmente', text: 'Não tente digitalizar todo o histórico em papel de uma vez. Adote a regra "migrar quando o paciente retornar": na próxima consulta, digitalize o histórico relevante. Em 3-6 meses, a maioria dos pacientes ativos terá prontuário digital completo sem nenhum esforço concentrado de migração.' },
    ],
    { totalTime: 'PT180M', cost: '0' }
  ),

  'agendamento-online-clinica-estetica': buildHowTo(
    'Como Configurar Agendamento Online para Clínica de Estética em 7 Dias',
    'Passo a passo para implementar agendamento online com confirmação automática, lista de espera e integração com WhatsApp na sua clínica de estética.',
    [
      { name: 'Configure a agenda por profissional e procedimento', text: 'Cadastre os profissionais, configure os tipos de procedimento com duração e intervalo de preparação entre consultas, defina os horários de atendimento por profissional e bloqueie feriados e folgas. Cada procedimento pode ter duração, sala e profissionais específicos configurados independentemente.' },
      { name: 'Conecte o WhatsApp Business API', text: 'Acesse Configurações > Integrações > WhatsApp no Estetia CRM. Conecte o número da clínica via Meta Business Manager. Configure os templates de mensagem para confirmação, lembrete 48h, lembrete 2h e follow-up pós-procedimento. A aprovação dos templates pela Meta leva até 24 horas.' },
      { name: 'Ative a lista de espera', text: 'Ative a lista de espera por procedimento nas configurações da agenda. Configure o tempo de resposta esperado (ex: 30 minutos para o paciente confirmar antes do horário ser oferecido ao próximo). Defina quais procedimentos têm lista de espera ativa.' },
      { name: 'Gere e distribua o link de agendamento', text: 'Crie o link público de agendamento da clínica e adicione ao: bio do Instagram, site da clínica, assinatura do WhatsApp Business e Google Business Profile. O link mostra automaticamente os procedimentos disponíveis, profissionais e horários livres.' },
      { name: 'Monitore e otimize a taxa de ocupação', text: 'No dashboard do Estetia CRM, acompanhe semanalmente: taxa de ocupação da agenda, taxa de no-show, taxa de preenchimento da lista de espera e taxa de confirmação via WhatsApp. Ajuste timings de lembrete e configurações de lista de espera com base nos dados das primeiras semanas.' },
    ],
    { totalTime: 'PT240M', cost: '0' }
  ),

  'whatsapp-business-clinica-estetica-automacao': buildHowTo(
    'Como Configurar WhatsApp Business API para Automação em Clínica de Estética',
    'Passo a passo para integrar WhatsApp Business API ao Estetia CRM e automatizar confirmações, recalls e anamneses sem risco de bloqueio do número.',
    [
      { name: 'Crie conta no Meta Business Manager', text: 'Acesse business.facebook.com e crie uma conta Business Manager com os dados da clínica. É necessário ter uma página do Facebook da clínica. Adicione o número de telefone dedicado da clínica ao WhatsApp Business — o número não pode estar ativo em outro WhatsApp.' },
      { name: 'Gere o token de acesso da API', text: 'No Meta Business Manager, acesse WhatsApp > Configuração da API e gere o token de acesso permanente. Guarde esse token com segurança — ele é necessário para conectar qualquer sistema ao WhatsApp da clínica.' },
      { name: 'Conecte ao Estetia CRM', text: 'No painel do Estetia CRM, acesse Configurações > Integrações > WhatsApp Business API. Cole o token de acesso e o número de telefone. Clique em Salvar e faça um envio de teste para confirmar que a conexão está funcionando. O processo leva menos de 5 minutos.' },
      { name: 'Crie e submeta os templates de mensagem', text: 'Crie os templates para cada tipo de automação: confirmação de agendamento, lembrete 48h, lembrete 2h, follow-up pós-procedimento e recall por procedimento. Submeta para aprovação da Meta (até 24h). O Estetia CRM tem templates pré-prontos em português que aceleram o processo.' },
      { name: 'Configure as automações e o recall por procedimento', text: 'Ative as automações: confirmação imediata ao agendar, lembretes 48h e 2h antes, follow-up 48h após procedimento. Configure o recall por procedimento: toxina botulínica em 90 dias, limpeza de pele em 30 dias, laser em 45 dias. Cada recall é enviado automaticamente no timing configurado, sem esforço manual.' },
    ],
    { totalTime: 'PT60M', cost: '0' }
  ),

  'como-migrar-crm-clinica-estetica': buildHowTo(
    'Como Migrar para um Novo CRM Clínico sem Perder Dados em 7 Dias',
    'Roteiro completo para migrar uma clínica de estética para um novo CRM sem downtime operacional, perda de histórico de pacientes ou sobrecarga da equipe.',
    [
      { name: 'Exporte todos os dados do sistema atual', text: 'Exporte todos os dados em CSV ou Excel do sistema atual: cadastro de pacientes, histórico de agendamentos, prontuários digitais e configurações. Salve em 3 locais: disco local, Google Drive e pendrive físico. Essa exportação é sua rede de segurança — não avance para o próximo passo sem ela.' },
      { name: 'Configure o novo sistema antes de importar dados', text: 'No novo CRM, cadastre todos os profissionais com horários de atendimento, configure tipos de procedimento com duração e intervalo, defina perfis de acesso por função e conecte o WhatsApp Business API. Configure as anamneses por procedimento e os templates de mensagem. Teste o fluxo completo de agendamento com dados fictícios.' },
      { name: 'Importe a base de pacientes com validação por amostra', text: 'Formate o CSV exportado para o padrão do novo sistema. Faça primeiro uma importação de teste com 20-30 pacientes. Confira manualmente 5-10 registros importados: nome, telefone, email, histórico. Se a amostra estiver correta, execute a importação completa. Busque 5 pacientes aleatórios por nome após a importação completa para verificar integridade.' },
      { name: 'Opere os dois sistemas em paralelo por 48-72 horas', text: 'Novos agendamentos no novo sistema; verifique agendamentos dos próximos 7 dias em ambos os sistemas para garantir que a importação pegou tudo. Qualquer discrepância é corrigida manualmente. Esse período de paralelo é a proteção mais importante contra perda de dados.' },
      { name: 'Treine a equipe com fluxos reais e desative o sistema antigo', text: 'Realize 2-4 horas de treinamento prático com casos reais para cada função (recepcionista, profissional, gestor). Crie um guia de 1 página por função com os 5 fluxos mais comuns. Após confirmar que todos os agendamentos futuros estão no novo sistema, cancele o sistema antigo — mas mantenha acesso somente leitura por 30 dias para referência histórica.' },
    ],
    { totalTime: 'PT420M', cost: '0' }
  ),

  'melhor-crm-clinica-estetica-2026': buildHowTo(
    'Como Avaliar e Escolher o Melhor CRM para Clínica de Estética',
    'Processo estruturado para avaliar, comparar e escolher o CRM clínico certo para sua clínica de estética usando um checklist de 12 critérios e trial com a equipe.',
    [
      { name: 'Defina os critérios inegociáveis antes de avaliar', text: 'Liste os 5 critérios eliminatórios: (1) WhatsApp Business API oficial, não ferramentas informais; (2) Prontuário eletrônico com assinatura digital; (3) Conformidade LGPD Art. 11 documentada; (4) Exportação gratuita de dados; (5) Suporte em português em tempo real. Sistemas que não passam em qualquer um desses 5 critérios são eliminados independentemente do preço.' },
      { name: 'Selecione 2-3 sistemas finalistas', text: 'Com base nos critérios eliminatórios, selecione 2-3 sistemas para trial comparativo. Priorize sistemas construídos especificamente para clínicas de estética/dermatologia — não CRMs genéricos adaptados. Verifique o changelog público e a comunidade de usuários para avaliar estabilidade e evolução do produto.' },
      { name: 'Execute o trial com fluxos reais, não demos de vendas', text: 'Acesse o trial sem a demo de vendas primeiro. Tente executar os 3 fluxos mais críticos sem ajuda: agendar uma consulta, registrar um procedimento no prontuário e configurar um recall automático. O que você não consegue fazer sozinho em menos de 10 minutos indica problema de usabilidade que afetará a equipe.' },
      { name: 'Envolva toda a equipe na avaliação', text: 'A recepcionista que vai usar o sistema 8 horas por dia deve testar e avaliar. Peça feedback específico após 5-7 dias de uso real: quais fluxos ficaram mais rápidos? O que ainda parece confuso? Qual o tempo médio para agendar e registrar uma consulta? A avaliação coletiva é mais confiável que a do gestor sozinho.' },
      { name: 'Compare o custo total de propriedade, não só a mensalidade', text: 'Calcule o TCO para 2 anos incluindo: assinatura mensal, add-ons obrigatórios (WhatsApp, prontuário, recall), taxa de setup, custo da API WhatsApp Meta e custo de tempo de onboarding. O sistema mais transparente na precificação frequentemente é mais barato no longo prazo — mesmo que a mensalidade anunciada seja maior.' },
    ],
    { totalTime: 'PT120M', cost: '0' }
  ),
})
