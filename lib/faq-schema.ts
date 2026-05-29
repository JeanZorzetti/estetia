/**
 * FAQ Schema Markup Generator for SEO
 * Generates JSON-LD FAQPage schema for Google Featured Snippets
 */

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Strip HTML tags and get plain text for schema markup
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

/**
 * Generate FAQPage JSON-LD schema for a blog post
 */
export function generateFAQSchema(faqs: FAQItem[], url: string) {
  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  }
}

/**
 * FAQ data for homepage — perguntas gerais sobre Estetia CRM
 */
export const estetiaHomepageFAQs: FAQItem[] = [
  {
    question: 'O que é o Estetia CRM?',
    answer: 'O Estetia CRM é um sistema de gestão clínica SaaS desenvolvido para clínicas de estética e dermatologia. Reúne em uma plataforma: agenda inteligente com no-show predictor, prontuário eletrônico LGPD-compliant, recall automático via WhatsApp, integração com convênios TISS/TUSS e dashboard de KPIs clínicos.',
  },
  {
    question: 'O Estetia CRM é aprovado para clínicas de saúde segundo a LGPD?',
    answer: 'Sim. O Estetia CRM foi desenvolvido em conformidade com a LGPD Art. 11, que regula o tratamento de dados sensíveis de saúde. A plataforma utiliza criptografia AES-256, coleta consentimento digital do paciente, mantém audit trail de acessos e permite ao paciente exercer seus direitos LGPD (acesso, portabilidade, exclusão).',
  },
  {
    question: 'O Estetia CRM funciona para dermatologia e estética corporal também?',
    answer: 'Sim. Além de clínicas de estética facial, o Estetia CRM atende dermatologistas, clínicas de estética corporal e redes multi-unidade. Cada especialidade conta com campos de anamnese e prontuário customizados, além de soluções verticais específicas em /solucoes/dermatologia e /solucoes/estetica-corporal.',
  },
  {
    question: 'Como o Estetia CRM reduz no-show em clínicas?',
    answer: 'O Estetia CRM combina 3 camadas: (1) No-show predictor — IA que identifica pacientes com alto risco de cancelamento com base em histórico; (2) Confirmação automática — lembretes via WhatsApp, SMS ou email no prazo ideal para cada paciente; (3) Lista de espera — preenchimento automático de horários vagos. Clínicas que usam as 3 camadas reportam redução de 35-45% nos índices de no-show.',
  },
  {
    question: 'O Estetia CRM integra com convênios (TISS/TUSS)?',
    answer: 'Sim. O plano Business inclui módulo de convênios com suporte ao padrão TISS/TUSS da ANS. Permite emissão de guias de consulta e procedimento, controle de glosas, faturamento eletrônico para operadoras de saúde e relatórios por convênio. Compatível com as principais operadoras do mercado brasileiro.',
  },
  {
    question: 'Quanto custa o Estetia CRM?',
    answer: 'O Estetia CRM tem 3 planos: Starter (R$149/mês) para 1 profissional e até 300 pacientes; Pro (R$349/mês) para até 3 profissionais, 1.500 pacientes e no-show predictor IA; Business (R$799/mês) para profissionais ilimitados, multi-unidade e convênios TISS. Todos os planos incluem período de teste gratuito de 14 dias.',
  },
  {
    question: 'Em quanto tempo consigo configurar o Estetia CRM?',
    answer: 'A maioria das clínicas conclui o setup básico em menos de 2 dias: importação de base de pacientes, configuração da agenda e ativação do WhatsApp. O onboarding guiado inclui checklist passo a passo, vídeos e suporte via chat. Redes multi-unidade têm onboarding dedicado com especialista.',
  },
]

/**
 * FAQ data for SPIN Selling para Clínicas de Estética blog post
 */
export const spinSellingClinicaFAQs: FAQItem[] = [
  {
    question: 'SPIN Selling funciona para clínicas de estética?',
    answer: 'Sim. SPIN Selling foi adaptado para consultas de avaliação estética — onde o profissional precisa entender a necessidade real do paciente antes de apresentar um procedimento. Em vez de fazer um pitch do tratamento, o profissional usa perguntas de Situação, Problema, Implicação e Necessidade para que o próprio paciente identifique e verbalize a solução ideal.',
  },
  {
    question: 'Como usar SPIN Selling na consulta de avaliação inicial?',
    answer: 'Na consulta de avaliação: (1) Situação — entenda a rotina de skincare e histórico de procedimentos do paciente; (2) Problema — explore o que incomoda o paciente (manchas, flacidez, acne); (3) Implicação — ajude o paciente a perceber o impacto emocional e social do problema; (4) Necessidade — pergunte qual seria o resultado ideal para ele. A conversão acontece porque o paciente chegou à conclusão, não porque o profissional vendeu.',
  },
  {
    question: 'Qual a taxa de conversão com SPIN Selling em clínicas de estética?',
    answer: 'Clínicas que treinam a equipe em SPIN Selling para avaliações reportam aumento de 25-40% na taxa de conversão de avaliações em procedimentos. O maior impacto ocorre em procedimentos de alto ticket (acima de R$500) onde o paciente precisa de mais confiança antes de decidir. O SPIN reduz objeções como "vou pensar" porque o paciente chegou à decisão pelo próprio raciocínio.',
  },
  {
    question: 'Como o Estetia CRM ajuda na aplicação do SPIN Selling?',
    answer: 'O Estetia CRM mantém o histórico completo de consultas anteriores, procedimentos realizados e observações de cada paciente. Antes de uma avaliação, o profissional revisa o prontuário e já chega com informações para as perguntas de Situação (procedimentos passados, queixas anteriores). O CRM também registra as perguntas-chave e respostas do paciente para uso futuro.',
  },
  {
    question: 'SPIN Selling é adequado para procedimentos de alta complexidade como laser?',
    answer: 'Especialmente para eles. Procedimentos de alta complexidade (laser CO2, peeling profundo, radiofrequência) têm maior ticket médio e maior hesitação de compra. O SPIN Selling é mais eficaz exatamente nesses casos, pois ajuda o paciente a compreender as implicações do problema (fotoenvelhecimento progressivo, perda de colágeno) antes de apresentar a solução.',
  },
  {
    question: 'Como treinar a equipe em SPIN Selling para avaliações?',
    answer: 'Processo em 3 fases: (1) Workshop prático de 2h com role-playing de consultas — distribuir o roteiro das 12 perguntas SPIN adaptadas para estética; (2) Shadowing — profissional sênior acompanha as primeiras 5 avaliações e dá feedback; (3) Revisão semanal nos primeiros 30 dias com análise de taxa de conversão por profissional no dashboard do Estetia CRM.',
  },
  {
    question: 'SPIN Selling viola a ética médica/estética na consulta?',
    answer: 'Não. O SPIN Selling não é uma técnica de pressão — é um framework de escuta ativa. Todas as perguntas têm como objetivo entender melhor a necessidade do paciente, não manipulá-lo. O método é compatível com os princípios de boas práticas clínicas e com o Código de Ética dos Conselhos profissionais de medicina e biomedicina.',
  },
]

/**
 * FAQ data for No-Show em Clínicas de Estética blog post
 */
export const noShowClinicaFAQs: FAQItem[] = [
  {
    question: 'Qual o índice médio de no-show em clínicas de estética?',
    answer: 'O índice médio de no-show em clínicas de estética no Brasil varia entre 15% e 30% das consultas agendadas, dependendo do tipo de procedimento e do perfil de clientela. Procedimentos de avaliação gratuita têm os maiores índices (25-35%). Clínicas sem sistema de confirmação automática ficam na faixa superior desse intervalo.',
  },
  {
    question: 'Como o lembretes automáticos reduzem no-show em clínicas?',
    answer: 'Lembretes automáticos reduzem no-show porque eliminam o principal motivo de cancelamento: esquecimento. O timing ideal é: 48h antes (confirmação inicial), 24h antes (lembrete com opção de cancelamento) e 2h antes (lembrete final). Clínicas que usam os 3 lembretes via WhatsApp reduzem no-show em 35-45% sem aumentar carga operacional.',
  },
  {
    question: 'Lista de espera resolve o problema de no-show em clínicas?',
    answer: 'A lista de espera não evita o no-show, mas minimiza o impacto financeiro. Quando um paciente cancela, o sistema contacta automaticamente o próximo da lista de espera para preencher o horário. Com Estetia CRM, o processo é automático: o paciente da lista recebe mensagem via WhatsApp e pode confirmar com 1 clique. Clínicas com lista de espera ativa recuperam 60-70% dos horários vagos.',
  },
  {
    question: 'Qual o custo financeiro real do no-show para uma clínica de estética?',
    answer: 'Para uma clínica com ticket médio de R$300 e 20% de no-show em 100 consultas/semana: 20 consultas perdidas × R$300 = R$6.000/semana em receita não realizada. Em um mês, isso representa R$24.000. Além da receita, há custo de oportunidade (profissional parado), custo de insumos preparados e custo administrativo de remarcação. Use a Calculadora No-Show do Estetia em /ferramentas/calculadora-no-show para calcular o impacto na sua clínica.',
  },
  {
    question: 'Como o no-show predictor de IA do Estetia CRM funciona?',
    answer: 'O no-show predictor analisa o histórico de comportamento de cada paciente: frequência de cancelamentos anteriores, tempo médio entre agendamento e consulta, canal de comunicação preferido, tipo de procedimento e horário preferencial. Com base nesses padrões, o sistema atribui um score de risco a cada agendamento e adapta automaticamente a estratégia de confirmação para pacientes de alto risco.',
  },
  {
    question: 'Devo cobrar taxa de no-show em clínicas de estética?',
    answer: 'A cobrança de taxa de no-show é legalmente permitida no Brasil desde que informada no momento do agendamento e aceita pelo paciente. O impacto na relação com o paciente depende da forma como é comunicada. A melhor prática é exigir sinal (30-50% do valor) para procedimentos de alto ticket ou novos pacientes, e usar lembretes automáticos como primeira linha de defesa antes de implementar penalidades.',
  },
]

/**
 * FAQ data for LGPD para Clínicas de Estética blog post
 */
export const lgpdClinicaFAQs: FAQItem[] = [
  {
    question: 'A LGPD se aplica a clínicas de estética?',
    answer: 'Sim. Clínicas de estética e dermatologia tratam dados sensíveis de saúde (Art. 11 da LGPD), que têm regime mais rigoroso do que dados pessoais comuns. Isso inclui: anamneses, prontuários, fotos de procedimentos, histórico de tratamentos, informações sobre condições de saúde e resultados de exames. O descumprimento pode gerar multas de até 2% do faturamento anual, limitado a R$50 milhões por infração.',
  },
  {
    question: 'Quais dados de pacientes são considerados sensíveis pela LGPD?',
    answer: 'Pela LGPD Art. 5 e Art. 11, são dados sensíveis de saúde: histórico de doenças e condições clínicas, resultados de exames laboratoriais e de imagem, medicamentos em uso, alergias, procedimentos realizados, fotos de antes/depois de tratamentos estéticos, informações de saúde mental, dados genéticos e biométricos. Todos esses dados requerem consentimento específico e explícito do paciente.',
  },
  {
    question: 'Posso usar fotos de pacientes para divulgação da clínica?',
    answer: 'Somente com consentimento livre, informado, específico e inequívoco do paciente (LGPD Art. 11). O consentimento precisa descrever claramente: quais fotos serão usadas, em quais canais (Instagram, site, material impresso), por quanto tempo e que o paciente pode revogar a qualquer momento. O Estetia CRM gera e armazena esse termo de consentimento digital com assinatura eletrônica.',
  },
  {
    question: 'Por quanto tempo posso guardar o prontuário de pacientes?',
    answer: 'O CFM (Conselho Federal de Medicina) estabelece guarda mínima de 20 anos para prontuários médicos. O CFB (Conselho Federal de Biomedicina) e os Conselhos de Enfermagem têm normas similares. Para clínicas de estética não médicas, a recomendação é guardar pelo menos 5 anos após o último atendimento. O Estetia CRM mantém prontuários por tempo configurável com backup automático criptografado.',
  },
  {
    question: 'O que é o DPO e clínicas de estética precisam ter um?',
    answer: 'DPO (Data Protection Officer / Encarregado de Dados) é o responsável pela proteção de dados da organização. A LGPD torna o DPO obrigatório para operadores e controladores que tratam dados em larga escala. Para clínicas pequenas e médias, o DPO pode ser externo (contratado por hora). O Estetia CRM oferece relatórios de conformidade que facilitam o trabalho do DPO.',
  },
  {
    question: 'Como implementar LGPD na prática em uma clínica de estética?',
    answer: 'Os passos fundamentais são: (1) Mapeamento de dados — listar todos os dados coletados e onde são armazenados; (2) Base legal — definir a base legal para cada tratamento (consentimento, obrigação legal, legítimo interesse); (3) Termo de consentimento — criar e coletar consentimento digitalmente; (4) Política de privacidade — publicar no site e exibir no momento do agendamento; (5) Procedimentos de resposta — definir como responder a solicitações de titulares (acesso, exclusão, portabilidade). O Estetia CRM automatiza os passos 3, 4 e 5.',
  },
]

/**
 * FAQ data for Anamnese Digital em Clínicas de Estética blog post
 */
export const anamneseDigitalFAQs: FAQItem[] = [
  {
    question: 'O que é anamnese digital em clínicas de estética?',
    answer: 'Anamnese digital é a versão eletrônica da ficha de anamnese — o questionário clínico preenchido pelo paciente antes do procedimento. Em vez de papel, o paciente preenche pelo celular ou tablet, e as respostas são armazenadas automaticamente no prontuário eletrônico. Inclui: histórico de saúde, alergias, medicamentos, contraindicações ao procedimento e consentimento informado com assinatura digital.',
  },
  {
    question: 'Quais são as vantagens da anamnese digital sobre o papel?',
    answer: 'As principais vantagens são: (1) Disponibilidade — o paciente pode preencher antes de chegar à clínica, reduzindo tempo de espera; (2) Legibilidade — sem caligrafia ilegível ou campos em branco; (3) Alertas automáticos — o sistema avisa quando há contraindicações (gravidez, anticoagulantes, lúpus); (4) Histórico acessível — profissionais acessam anamneses anteriores em segundos; (5) LGPD — assinatura digital e armazenamento criptografado.',
  },
  {
    question: 'A anamnese digital tem validade legal e jurídica?',
    answer: 'Sim, desde que coletada com certificação adequada. A Lei 14.063/2020 regulamenta o uso de assinaturas eletrônicas em saúde no Brasil. Assinaturas digitais com certificação ICP-Brasil têm a mesma validade jurídica que assinaturas físicas. O Estetia CRM utiliza assinatura eletrônica simples (aceita para ficha clínica) com registro de IP, data/hora e hash do documento para comprovação de autenticidade.',
  },
  {
    question: 'Como configurar alertas de contraindicação na anamnese digital?',
    answer: 'No Estetia CRM, cada procedimento pode ter uma lista de contraindicações configuradas. Quando o paciente preenche a anamnese e indica uma condição contraindicada (ex: gravidez para laser IPL, anticoagulantes para microagulhamento), o sistema gera um alerta vermelho visível para o profissional antes da consulta. Isso evita intercorrências e demonstra due diligence em caso de questionamentos legais.',
  },
  {
    question: 'O paciente pode preencher a anamnese antes de chegar à clínica?',
    answer: 'Sim. Com o Estetia CRM, o link da anamnese digital é enviado automaticamente via WhatsApp quando o paciente é agendado. O paciente preenche pelo celular em qualquer momento antes da consulta. Ao chegar à clínica, o profissional já tem a ficha completa e o atendimento começa diretamente no procedimento, sem preencher papéis na recepção.',
  },
  {
    question: 'Quantos procedimentos diferentes posso ter na anamnese digital?',
    answer: 'O Estetia CRM permite criar fichas de anamnese personalizadas por procedimento ou grupo de procedimentos. Uma clínica pode ter fichas específicas para: toxina botulínica, preenchimento com AH, laser, microagulhamento, tratamentos faciais (limpeza, peelings), estética corporal, procedimentos para convênio. Cada ficha pode ter campos obrigatórios e opcionais configuráveis pela gestão.',
  },
]

/**
 * FAQ data for KPIs Essenciais para Clínicas de Estética blog post
 */
export const kpisClinicaFAQs: FAQItem[] = [
  {
    question: 'Quais são os KPIs mais importantes para clínicas de estética?',
    answer: 'Os 5 KPIs prioritários para clínicas de estética são: (1) Taxa de ocupação da agenda — percentual de horários preenchidos; (2) Taxa de no-show — percentual de consultas que não comparecem; (3) Taxa de recompra — pacientes que retornam em até 90 dias; (4) LTV do paciente (Lifetime Value) — receita total gerada por paciente no tempo de relacionamento; (5) Ticket médio por procedimento. Esses 5 indicadores cobrem ocupação, retenção e rentabilidade.',
  },
  {
    question: 'O que é taxa de recompra em clínicas de estética e como calcular?',
    answer: 'Taxa de recompra é o percentual de pacientes que retornam para novos procedimentos após a primeira consulta. Cálculo: (pacientes que fizeram 2+ procedimentos nos últimos 90 dias ÷ total de pacientes únicos atendidos no período) × 100. Uma taxa saudável para clínicas de estética é acima de 40%. Taxas abaixo de 25% indicam problema de fidelização — revisar qualidade do atendimento, recall e programas de fidelidade.',
  },
  {
    question: 'Como calcular o LTV (Lifetime Value) de paciente em clínica de estética?',
    answer: 'Fórmula básica: LTV = Ticket Médio × Frequência de Procedimentos por Ano × Anos de Relacionamento. Exemplo: paciente com ticket médio de R$400, 6 procedimentos/ano (a cada 2 meses) e relacionamento médio de 3 anos → LTV = R$400 × 6 × 3 = R$7.200. Esse valor ajuda a definir quanto investir em captação (CAC) e em programas de retenção. Use a Calculadora LTV em /ferramentas/calculadora-ltv.',
  },
  {
    question: 'Qual deve ser a taxa de ocupação ideal de uma clínica de estética?',
    answer: 'A taxa de ocupação saudável para clínicas de estética varia por modelo: clínicas focadas em procedimentos longos (laser, 1h+) funcionam bem com 70-80% de ocupação. Clínicas com mix de procedimentos rápidos e longos buscam 80-90%. Acima de 90% consistentemente indica necessidade de expansão de capacidade (mais profissionais ou horários). Abaixo de 60% por mais de 30 dias indica problema de captação ou no-show.',
  },
  {
    question: 'Com que frequência analisar os KPIs de uma clínica de estética?',
    answer: 'KPIs operacionais (taxa de ocupação, no-show do dia, confirmações) devem ser verificados diariamente — o dashboard do Estetia CRM exibe esses dados em tempo real. KPIs táticos (taxa de recompra mensal, ticket médio, receita por profissional) são analisados semanalmente. KPIs estratégicos (LTV, CAC, crescimento de base de pacientes) são revisados mensalmente para decisões de investimento.',
  },
  {
    question: 'Como o Estetia CRM ajuda a monitorar KPIs clínicos?',
    answer: 'O dashboard do Estetia CRM exibe em tempo real: taxa de ocupação da agenda, alertas de pacientes em risco de churn, receita do dia/semana/mês, procedimentos mais realizados e taxa de recompra por período. Relatórios automáticos semanais são enviados por email para a gestão. Todos os KPIs podem ser filtrados por profissional, procedimento, período e unidade (em plano multi-unidade).',
  },
]

/**
 * FAQ data for CRM para Clínica de Estética blog post
 */
export const crmClinicaEsteticaFAQs: FAQItem[] = [
  {
    question: 'O que é CRM para clínica de estética?',
    answer: 'CRM para clínica de estética é um sistema de gestão que centraliza o relacionamento com pacientes: histórico de procedimentos, agenda inteligente com confirmação automática, prontuário eletrônico, recall automático de recompra e dashboard de KPIs clínicos. Diferencia-se de um software de agendamento genérico por incluir funcionalidades específicas do setor clínico: anamnese digital com alertas de contraindicação, no-show predictor com IA e conformidade LGPD para dados sensíveis de saúde.',
  },
  {
    question: 'Qual o melhor CRM para clínica de estética?',
    answer: 'O melhor CRM para clínica de estética é o especializado no setor clínico — não um CRM genérico adaptado. Os critérios de avaliação são: prontuário eletrônico com fotodocumentação, anamnese digital com alertas de contraindicação, integração com WhatsApp Business API oficial, no-show predictor com IA, recall automático por procedimento, conformidade LGPD Art. 11 e suporte em português. O Estetia CRM foi desenvolvido especificamente para clínicas de estética e dermatologia no Brasil.',
  },
  {
    question: 'CRM é diferente de software de agendamento para clínicas?',
    answer: 'Sim. Software de agendamento organiza horários. CRM clínico gerencia o relacionamento completo com o paciente: histórico de procedimentos, comunicação automatizada, prontuário eletrônico, recall de recompra, KPIs e LGPD compliance. Um CRM clínico inclui agendamento, mas vai muito além — aumenta o LTV do paciente e reduz o no-show de forma sistemática.',
  },
  {
    question: 'Vale a pena CRM para clínica de estética pequena (1-2 profissionais)?',
    answer: 'Sim. Para clínicas pequenas, o CRM resolve os gargalos de crescimento: tempo gasto em confirmações manuais, falta de recall sistemático e ausência de dados para decisões. Uma clínica solo com 80 pacientes ativos e ticket médio de R$400 pode recuperar R$5.600/mês combinando redução de no-show com recall automático — sobre investimento de R$149/mês. O ROI se paga em menos de 30 dias.',
  },
  {
    question: 'CRM funciona com WhatsApp para clínicas de estética?',
    answer: 'Sim. O Estetia CRM integra com WhatsApp Business API oficial (não ferramentas não homologadas que causam bloqueio de número). Isso permite envio automático de confirmações, lembretes, links de anamnese e recalls de recompra — tudo personalizado por paciente e procedimento, sem esforço da recepção.',
  },
  {
    question: 'Quanto custa um CRM para clínica de estética?',
    answer: 'O custo varia de R$100 a R$1.200/mês dependendo do porte e funcionalidades. O Estetia CRM tem planos a partir de R$149/mês para clínicas com 1 profissional e até 300 pacientes. O plano Pro (R$349/mês) inclui no-show predictor IA e recall automático para até 3 profissionais. Todos os planos têm 14 dias de teste gratuito sem cartão de crédito.',
  },
  {
    question: 'Em quanto tempo vejo resultado com CRM para clínica de estética?',
    answer: 'Confirmações automáticas têm impacto imediato — redução de no-show visível na primeira semana. Recall automático começa a gerar retorno em 30-45 dias (tempo mínimo para o primeiro ciclo de recall). Dashboard de KPIs com dados confiáveis: 60-90 dias de uso. ROI positivo na maioria das clínicas: antes de 30 dias, com base na redução de no-show isolada.',
  },
  {
    question: 'CRM para clínica de estética é obrigatório para conformidade com LGPD?',
    answer: 'A LGPD não exige especificamente um CRM, mas exige controles que são praticamente impossíveis sem sistema adequado: criptografia de prontuários, audit trail de acessos, coleta de consentimento digital específico e mecanismos para resposta a solicitações de titulares. Um CRM clínico LGPD-compliant é o caminho prático para atender esses requisitos sem contratar consultoria jurídica custosa.',
  },
  {
    question: 'Como migrar para CRM sem perder o histórico de pacientes?',
    answer: 'A migração é feita em 3 etapas: (1) importação da base de pacientes via planilha CSV, que leva 1-2 dias; (2) operação paralela de 2-4 semanas onde novos agendamentos entram no CRM enquanto o sistema antigo fica em modo leitura; (3) transição completa após validar que os dados críticos foram migrados. O Estetia CRM oferece suporte de migração assistida para clínicas com histórico extenso.',
  },
]

/**
 * FAQ data for Software de Gestão para Dermatologia blog post
 */
export const softwareDermatologiaFAQs: FAQItem[] = [
  {
    question: 'Software de gestão para dermatologia é diferente de software para clínica de estética?',
    answer: 'Sim. Software para dermatologia precisa ter campos específicos para diagnósticos dermatológicos (CID-10 de dermato), mapeamento de lesões com diagrama corporal, controle de biopsias e laudos anatomopatológicos, fototerapia com controle de dose acumulada e integração TISS/TUSS para convênios. Clínicas de estética focam em procedimentos estéticos sem necessidade de diagnóstico clínico. Sistemas como o Estetia CRM atendem ambos com módulos configuráveis por especialidade.',
  },
  {
    question: 'Software de dermatologia precisa de integração TISS?',
    answer: 'Depende do perfil de atendimento. Se a clínica atende convênios de saúde, o padrão TISS (Troca de Informações em Saúde Suplementar) da ANS é obrigatório para faturamento eletrônico. Clínicas 100% particulares não precisam do módulo TISS. O Estetia CRM oferece o módulo TISS/TUSS no plano Business, com suporte para emissão de guias, controle de glosas e faturamento eletrônico às operadoras.',
  },
  {
    question: 'Como funciona o prontuário eletrônico para dermatologia?',
    answer: 'O prontuário dermatológico eletrônico inclui: diagrama corporal clicável para mapeamento de lesões, fotodocumentação por região com comparação temporal (before/after por data), CID-10 de dermatologia com busca rápida, registro de biopsias e laudos, controle de retorno por condição clínica e histórico de fototerapia com dose acumulada. Todos os dados são criptografados e acessíveis com controle de permissão por perfil de profissional.',
  },
  {
    question: 'Dermatologista pode usar CRM genérico (Salesforce, HubSpot)?',
    answer: 'Pode, mas com lacunas críticas. CRMs genéricos não têm prontuário eletrônico, mapeamento de lesões, anamnese com alertas de contraindicação, controle de biopsias ou módulo TISS. Adaptar um CRM genérico para uso clínico gera retrabalho manual, riscos de conformidade (LGPD Art. 11) e ausência de funcionalidades específicas que impactam a qualidade clínica. CRM especializado para dermato é o caminho mais seguro e eficiente.',
  },
  {
    question: 'Software de dermato funciona para convênio e particular no mesmo sistema?',
    answer: 'Sim. O Estetia CRM gerencia os dois fluxos no mesmo sistema: consultas cobertas por convênio (com TISS, CID-10 e guia eletrônica) e procedimentos particulares de estética (com anamnese por procedimento, fotodocumentação e recall). O prontuário do paciente é unificado, mas o faturamento é separado por tipo de atendimento, facilitando a contabilidade e os relatórios por convênio.',
  },
  {
    question: 'Quanto tempo leva para implementar software de gestão de dermatologia?',
    answer: 'Configuração básica (cadastros, agenda, confirmações automáticas): 2-3 dias. Operação plena com prontuário eletrônico: 2-3 semanas para a equipe se adaptar completamente. Módulo TISS com convênios: 1-2 semanas adicionais para configurar guias e testar envio às operadoras. Total esperado para operação 100% digital: 30 dias. O Estetia CRM tem onboarding guiado e suporte via chat para acelerar o processo.',
  },
  {
    question: 'Como migrar prontuários físicos para sistema digital de dermato?',
    answer: 'A migração é feita gradualmente para não travar a operação: (1) dados cadastrais são importados via planilha CSV; (2) prontuários históricos em papel são digitalizados quando o paciente retorna — na próxima consulta, a recepção digitaliza o histórico relevante; (3) em 3-6 meses, a maioria dos pacientes ativos tem prontuário digital completo. Para clínicas com volume alto de histórico em papel, o Estetia CRM oferece serviço de migração assistida.',
  },
  {
    question: 'O sistema de gestão para dermato é compatível com receituário digital?',
    answer: 'Sim. O Estetia CRM gera receituário digital com assinatura eletrônica válida via certificado digital ICP-Brasil. O paciente recebe o receituário por WhatsApp ou email com autenticidade verificável. A validade jurídica é garantida pelo CFM Resolução 2.299/2021, que homologou o receituário digital para médicos. Para biomédicos e enfermeiros, a assinatura eletrônica simples (Lei 14.063/2020) é suficiente para documentos clínicos.',
  },
]

/**
 * FAQ data for Prontuário Eletrônico para Clínica de Estética blog post
 */
export const prontuarioEletronicoFAQs: FAQItem[] = [
  {
    question: 'O que é prontuário eletrônico para clínica de estética?',
    answer: 'Prontuário eletrônico é o registro digital completo do paciente na clínica: anamneses realizadas, procedimentos executados, fotos de evolução (before/after), termos de consentimento assinados digitalmente, observações clínicas e histórico de retornos. Substitui as fichas físicas em papel e tem validade jurídica garantida pela Lei 14.063/2020. É acessível de qualquer dispositivo da clínica com controle de acesso por perfil de profissional.',
  },
  {
    question: 'Prontuário eletrônico é obrigatório por lei para clínicas de estética?',
    answer: 'Para procedimentos realizados por médicos, sim — o CFM exige prontuário para todo atendimento médico (Res. 1.638/2002). Para biomédicos e enfermeiros, os respectivos Conselhos têm obrigação equivalente. Para esteticistas, não há obrigação formal, mas a LGPD exige controles de dados de saúde (criptografia, consentimento, audit trail) que são inviáveis sem sistema digital. Na prática, toda clínica que coleta dados de saúde deve ter documentação estruturada.',
  },
  {
    question: 'Qual a diferença entre anamnese e prontuário eletrônico?',
    answer: 'A anamnese é o questionário de saúde preenchido pelo paciente antes do procedimento: histórico clínico, alergias, medicamentos, contraindicações e consentimento informado. O prontuário é o registro completo do que foi feito na clínica: procedimentos realizados, materiais usados, fotos de evolução, intercorrências, orientações pós-procedimento. A anamnese é o primeiro documento do prontuário — ela se torna parte do histórico do paciente.',
  },
  {
    question: 'Prontuário eletrônico vale como prova jurídica em caso de processo?',
    answer: 'Sim. Prontuários eletrônicos com assinatura eletrônica têm validade jurídica plena pela Lei 14.063/2020. O documento precisa ter: registro de data/hora (timestamp), identificação de quem preencheu, hash do conteúdo (detecta alterações posteriores) e assinatura do paciente para consentimentos. O Estetia CRM registra automaticamente todos esses elementos, garantindo que o prontuário seja prova robusta em caso de questionamento judicial.',
  },
  {
    question: 'Por quanto tempo guardar prontuário de clínica de estética?',
    answer: 'O prazo mínimo recomendado é 20 anos após o último atendimento (padrão CFM para médicos). Para biomédicos: mínimo 5 anos (CFBio). Para esteticistas: recomendação de 5 anos mínimo com base em jurisprudência civil. Adotar 20 anos como padrão para toda a clínica é a decisão mais segura — o custo de armazenamento digital é irrisório comparado ao risco de descarte precoce em caso de ação judicial tardia.',
  },
  {
    question: 'Como armazenar fotos de pacientes em conformidade com a LGPD?',
    answer: 'Fotos de procedimentos estéticos são dados sensíveis de saúde pela LGPD Art. 11. Devem ser armazenadas em sistema com: criptografia AES-256 em repouso, acesso restrito por perfil, consentimento específico do paciente para cada finalidade (prontuário clínico vs. divulgação em redes sociais), e audit trail de todos os acessos. WhatsApp pessoal, Google Drive sem criptografia e armazenamento local sem backup não são conformes com a LGPD.',
  },
  {
    question: 'É possível implementar prontuário eletrônico sem parar a operação da clínica?',
    answer: 'Sim, com migração gradual. A estratégia mais segura é: (1) novos pacientes entram diretamente no sistema digital; (2) pacientes existentes têm o histórico digitalizado na próxima consulta; (3) em 3-6 meses, a maioria dos ativos tem prontuário digital completo. O sistema antigo (papel ou sistema legado) fica em modo leitura para consultas de histórico durante a transição. O treinamento da equipe leva menos de 2 horas para sistemas bem desenhados.',
  },
  {
    question: 'Como funciona a fotodocumentação clínica no prontuário eletrônico?',
    answer: 'A fotodocumentação no Estetia CRM é organizada por data e procedimento com comparação temporal (before/after lado a lado). O sistema tem guias de enquadramento por procedimento para garantir padronização. O paciente deve assinar consentimento digital específico para fotodocumentação antes de qualquer registro fotográfico. As fotos são armazenadas com criptografia e acesso controlado — não saem do sistema para WhatsApp ou drives externos.',
  },
]

/**
 * FAQ data for Agendamento Online para Clínica de Estética blog post
 */
export const agendamentoOnlineFAQs: FAQItem[] = [
  {
    question: 'Agendamento online reduz no-show em clínicas de estética?',
    answer: 'Sim, diretamente. O agendamento online com confirmação automática via WhatsApp em 3 momentos (48h, 24h, 2h antes) elimina o principal motivo de no-show: esquecimento. Clínicas que implementam esse sistema reportam redução de 35-45% no no-show nos primeiros 60 dias. A lista de espera automática complementa: mesmo quando o no-show ocorre, 55-70% dos horários cancelados são preenchidos automaticamente por pacientes da lista.',
  },
  {
    question: 'O paciente pode agendar pelo WhatsApp sem falar com a recepcionista?',
    answer: 'Sim. Com o Estetia CRM integrado à WhatsApp Business API, o paciente envia uma mensagem para o WhatsApp da clínica e recebe automaticamente um menu interativo com os procedimentos disponíveis, profissionais e horários livres. O agendamento é confirmado sem nenhuma intervenção da recepcionista — ela só é acionada se o paciente tiver uma dúvida específica.',
  },
  {
    question: 'Lista de espera automática realmente funciona para preencher horários vagos?',
    answer: 'Sim, com alta taxa de conversão. Quando um cancelamento ocorre, o sistema notifica imediatamente os pacientes na lista de espera para aquele procedimento via WhatsApp. Como a mensagem chega em tempo real e exige apenas 1 clique para confirmar, a taxa de aceite é de 55-70% nos primeiros 30 minutos. É muito mais eficiente do que a recepcionista ligar manualmente — e funciona 24/7, inclusive para cancelamentos de última hora.',
  },
  {
    question: 'O agendamento online integra com Google Agenda do profissional?',
    answer: 'Sim. O Estetia CRM sincroniza bidirecionalmente com Google Calendar: todo agendamento feito no sistema aparece automaticamente na agenda Google do profissional, e bloqueios no Google Calendar (reunião pessoal, horário reservado) travam automaticamente a disponibilidade no sistema da clínica. Funciona também com Apple Calendar via iCloud. A sincronização é em tempo real — sem delay.',
  },
  {
    question: 'Como calcular a taxa de ocupação de uma clínica de estética?',
    answer: 'Taxa de ocupação = (Horários preenchidos ÷ Total de horários disponíveis no período) × 100. A meta saudável varia por modelo: clínicas com procedimentos curtos (30min) buscam 80-90%, clínicas com procedimentos longos (1h+) operam bem com 70-80%. Abaixo de 60% por mais de 30 dias indica problema de captação ou no-show que precisa de ação. O dashboard do Estetia CRM exibe essa taxa em tempo real com alertas configuráveis.',
  },
  {
    question: 'Posso personalizar os horários disponíveis por tipo de procedimento?',
    answer: 'Sim. No Estetia CRM, cada procedimento tem configuração independente: duração do atendimento, intervalo de preparação entre consultas, quais profissionais realizam e em quais horários ficam disponíveis. Uma limpeza de pele de 60 minutos não ocupa o mesmo slot que um botox de 30 minutos. Procedimentos que exigem sala específica (laser, por exemplo) só aparecem quando aquela sala está livre.',
  },
  {
    question: 'Quanto tempo leva para configurar o agendamento online na clínica?',
    answer: 'Com o Estetia CRM, a configuração básica leva 2-3 horas: cadastrar profissionais, configurar procedimentos com duração e intervalo, definir horários de atendimento e conectar o WhatsApp Business. Em seguida, gerar o link de agendamento e adicioná-lo ao Instagram, site e Google Business Profile. A lista de espera é ativada com 1 toggle. Em menos de 1 dia útil, a clínica já está recebendo agendamentos automáticos.',
  },
  {
    question: 'O agendamento online funciona para clínicas com múltiplos profissionais e salas?',
    answer: 'Sim. O Estetia CRM gerencia múltiplos profissionais e salas simultaneamente. Cada profissional tem sua agenda própria com disponibilidades configuradas independentemente. Salas e equipamentos podem ser associados a procedimentos específicos — o sistema bloqueia automaticamente quando um recurso já está ocupado. Perfeito para clínicas com 2-10 profissionais e múltiplas salas de procedimento.',
  },
]

/**
 * FAQ data for WhatsApp Business para Clínicas de Estética blog post
 */
export const whatsappBusinessClinicaFAQs: FAQItem[] = [
  {
    question: 'WhatsApp Business é diferente do WhatsApp pessoal para clínicas?',
    answer: 'Sim. O WhatsApp Business App tem funcionalidades adicionais para empresas: perfil com informações da clínica, catálogo de serviços, respostas rápidas e mensagens de ausência. Mas a diferença mais importante é a WhatsApp Business API — a versão para automação real em escala, que permite integração com sistemas de gestão como o Estetia CRM para envio automático de confirmações, recalls e anamneses sem risco de bloqueio do número.',
  },
  {
    question: 'Posso usar WhatsApp para recall automático de pacientes?',
    answer: 'Sim, e é a melhor prática para clínicas de estética. Recall enviado por WhatsApp tem taxa de abertura de 95-98% versus 8-15% por email. A base legal pela LGPD é execução de contrato (Art. 7, V) — recalls de procedimentos já realizados não exigem consentimento adicional. O Estetia CRM configura o timing automático por procedimento: toxina botulínica com recall em 90 dias, limpeza de pele em 30 dias, laser em 45 dias.',
  },
  {
    question: 'LGPD permite enviar mensagens automáticas por WhatsApp para pacientes?',
    answer: 'Sim, com base legal adequada. Confirmações de agendamento e recalls de procedimentos realizados têm base legal em execução de contrato (LGPD Art. 7, V), sem necessidade de consentimento adicional. Mensagens promocionais (descontos, novidades, lançamentos) exigem opt-in explícito prévio. Todo envio automático deve incluir opção de opt-out ("Responda PARAR para não receber mais mensagens"), e o sistema deve honrá-la imediatamente.',
  },
  {
    question: 'Como configurar mensagens automáticas no WhatsApp para clínica de estética?',
    answer: 'O caminho correto é via WhatsApp Business API (Cloud API da Meta) integrada a um sistema de gestão clínica como o Estetia CRM. O processo: (1) criar conta no Meta Business Manager; (2) registrar o número da clínica na API; (3) conectar ao Estetia CRM em Configurações > Integrações > WhatsApp; (4) criar e submeter templates de mensagem para aprovação Meta (até 24h); (5) ativar as automações de confirmação, lembrete e recall. Total: menos de 30 minutos de configuração.',
  },
  {
    question: 'Quais ferramentas de automação de WhatsApp são seguras para clínicas?',
    answer: 'Apenas ferramentas que usam a WhatsApp Business API oficial (Cloud API da Meta) são seguras. Ferramentas que usam emulação (Evolution API, whatsapp-web.js, ferramentas de "disparo em massa") violam os Termos de Serviço do WhatsApp e resultam em bloqueio permanente do número. Perder o número WhatsApp da clínica significa perder o histórico de conversas e o acesso a pacientes — prejuízo muito maior que o custo da API oficial.',
  },
  {
    question: 'Qual o custo do WhatsApp Business API para uma clínica de estética?',
    answer: 'A API é gratuita para conversas iniciadas pelo paciente. Conversas iniciadas pela clínica (confirmações, recalls — chamadas utility conversations) custam entre R$ 0,05 e R$ 0,15 por conversa de 24 horas, independentemente do número de mensagens nessa janela. Uma clínica com 100 consultas/semana e 200 recalls/mês pagaria R$ 40-80/mês de custo de API — irrisório comparado ao retorno da redução de no-show e aumento de recompra.',
  },
  {
    question: 'Como o WhatsApp Business ajuda a reduzir no-show em clínicas?',
    answer: 'Com confirmações automáticas em 3 momentos: 48h antes (confirmação inicial com opção de cancelar), 24h antes (lembrete com link para reagendar) e 2h antes (lembrete final). Cada mensagem tem botão de confirmação ou cancelamento em 1 clique. Quando o paciente cancela, o sistema ativa automaticamente a lista de espera e oferece o horário a quem está aguardando — via WhatsApp. Clínicas com essa configuração reduzem no-show em 35-45%.',
  },
  {
    question: 'O WhatsApp Business da clínica pode ser usado por múltiplos atendentes?',
    answer: 'Sim, via WhatsApp Business API. Com a API integrada ao Estetia CRM, múltiplos atendentes podem ver e responder mensagens de pacientes na caixa compartilhada do sistema — cada um com seu login, sem precisar compartilhar o telefone físico. As automações (confirmações, recalls) funcionam independente de qual atendente está online. É a solução correta para clínicas com mais de 1 pessoa na recepção.',
  },
]
