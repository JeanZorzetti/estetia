import type { AnamnesisField, AnamnesisTemplate } from '@/lib/domain/anamnesis'

/**
 * Printable anamnesis forms, one per procedure (/ferramentas/fichas-de-anamnese/[slug]).
 *
 * Each form reuses the AnamnesisTemplate shape of the product (lib/domain/anamnesis.ts), so the
 * same content can later feed the digital form. Paper-only parts (follow-up tables, declaration)
 * live next to the template.
 *
 * Content rules (do not relax without legal review):
 * - Questions only. No page states that a form is legally required, and no field states a
 *   contraindication as a rule.
 * - No client counts, ratings or testimonials.
 * - The PDF and the preview image are generated from the page: after editing a form, run
 *   `node scripts/gerar-fichas.mjs` and commit public/fichas.
 */

export const FICHAS_ATUALIZADO_EM = '2026-09-30'
export const FICHAS_BASE_PATH = '/ferramentas/fichas-de-anamnese'

// Paid step: the same form with the buyer's logo. One-off payment, delivered by hand.
export const FICHA_COM_LOGO = {
  centavos: 1990,
  preco: 'R$ 19,90',
  prazo: '2 dias úteis',
  email: 'contato@roilabs.com.br',
  whatsapp: '5562983443919',
} as const

export interface FichaTabela {
  titulo: string
  colunas: string[]
  /** Number of blank rows, or fixed row labels for the first column. */
  linhas: number | string[]
}

export interface FichaAnamnese {
  slug: string
  /** Full name used in headings: "Ficha de anamnese de podologia". */
  nome: string
  /** Short label for cards and lists: "Podologia". */
  rotulo: string
  /** Head term measured on DataForSEO, Brazil, 2026-09-30. */
  termo: string
  title: string
  description: string
  /** Answer-first paragraph: must stand on its own when quoted out of context. */
  resumo: string
  paraQuem: string
  template: AnamnesisTemplate
  tabelas: FichaTabela[]
  declaracao: string
  notas: { titulo: string; texto: string }[]
  faq: { pergunta: string; resposta: string }[]
}

type Campo = Omit<AnamnesisField, 'section'>

const secao = (section: string, campos: Campo[]): AnamnesisField[] =>
  campos.map((c) => ({ ...c, section }))
const linha = (id: string, label: string, required = false): Campo => ({ id, label, type: 'text', required })
const texto = (id: string, label: string, required = false): Campo => ({ id, label, type: 'textarea', required })
const simNao = (id: string, label: string, required = false): Campo => ({ id, label, type: 'boolean', required })
const data = (id: string, label: string): Campo => ({ id, label, type: 'date', required: false })
const escala = (id: string, label: string): Campo => ({ id, label, type: 'scale', required: false })
const escolha = (id: string, label: string, options: string[]): Campo => ({ id, label, type: 'select', required: false, options })
const marque = (id: string, label: string, options: string[]): Campo => ({ id, label, type: 'multiselect', required: false, options })

const identificacao = (pessoa = 'cliente') =>
  secao('Identificação', [
    linha('nome', 'Nome completo', true),
    data('nascimento', 'Data de nascimento'),
    linha('telefone', 'Telefone / WhatsApp', true),
    linha('profissao', 'Profissão'),
    data('dataAtendimento', 'Data do atendimento'),
    linha('indicacao', `Como a ${pessoa} chegou até você`),
  ])

const assinaturas = (pessoa = 'cliente', profissional = 'profissional') =>
  secao('Assinaturas', [
    { id: 'assinaturaCliente', label: `Assinatura do(a) ${pessoa}`, type: 'signature', required: true },
    { id: 'assinaturaProfissional', label: `Assinatura do(a) ${profissional}`, type: 'signature', required: false },
  ])

const GESTANTE = simNao('gestante', 'Está grávida ou amamentando?', true)
const MEDICAMENTOS = simNao('medicamentos', 'Usa medicamento de uso contínuo?')
const CRONICAS = simNao('doencasCronicas', 'Tem diabetes, pressão alta ou problema de tireoide?')
const ACIDOS = simNao('acidos', 'Usa ácido na pele ou tomou isotretinoína nos últimos 6 meses?')

const DECLARACAO =
  'Declaro que as informações acima são verdadeiras e que fui orientada(o) sobre o procedimento, os cuidados antes e depois e os resultados esperados. Autorizo o uso destes dados somente para o meu atendimento.'

const SESSOES: FichaTabela = {
  titulo: 'Acompanhamento das sessões',
  colunas: ['Data', 'Procedimento realizado', 'Observações', 'Rubrica'],
  linhas: 6,
}

const ficha = (slug: string, fields: AnamnesisField[]): AnamnesisTemplate => ({
  version: '1.0',
  procedimento: slug,
  fields,
})

export const FICHAS: FichaAnamnese[] = [
  {
    slug: 'estetica',
    nome: 'Ficha de anamnese estética',
    rotulo: 'Estética (geral)',
    termo: 'ficha de anamnese estetica',
    title: 'Ficha de anamnese estética para imprimir (PDF grátis)',
    description:
      'Ficha de anamnese estética em PDF, grátis e sem cadastro: queixa, saúde geral, pele e hábitos, avaliação e acompanhamento das sessões. Baixe e imprima.',
    resumo:
      'A ficha de anamnese estética registra, antes de qualquer procedimento, o que a cliente quer tratar, o histórico de saúde e os hábitos que influenciam a pele. Este modelo serve para atendimento facial e corporal, cabe em uma folha A4 frente e verso e tem espaço para anotar cada sessão.',
    paraQuem: 'Esteticistas e profissionais que atendem mais de um tipo de procedimento.',
    template: ficha('estetica', [
      ...identificacao(),
      ...secao('Queixa e objetivo', [
        texto('queixaPrincipal', 'O que você quer tratar ou melhorar?', true),
        simNao('tratamentoAnterior', 'Já fez algum tratamento estético antes?'),
      ]),
      ...secao('Saúde geral', [
        GESTANTE,
        simNao('alergias', 'Tem alergia a cosméticos, medicamentos ou látex?', true),
        MEDICAMENTOS,
        CRONICAS,
        simNao('cardiaco', 'Tem problema cardíaco ou usa marca-passo?'),
        simNao('protese', 'Tem prótese metálica, pino ou DIU de cobre?'),
        simNao('circulacao', 'Tem varizes, trombose ou problema de circulação?'),
        simNao('epilepsia', 'Tem epilepsia ou já teve convulsão?'),
        simNao('oncologico', 'Está em tratamento oncológico ou já teve câncer?'),
        simNao('cirurgiaRecente', 'Fez cirurgia ou procedimento estético nos últimos 6 meses?'),
      ]),
      ...secao('Pele e hábitos', [
        escolha('tipoPele', 'Tipo de pele', ['Normal', 'Seca', 'Oleosa', 'Mista', 'Sensível']),
        ACIDOS,
        escolha('exposicaoSolar', 'Exposição ao sol', ['Baixa', 'Moderada', 'Alta']),
        simNao('protetor', 'Usa protetor solar todos os dias?'),
        simNao('fuma', 'Fuma?'),
        escolha('agua', 'Água por dia', ['Menos de 1 litro', '1 a 2 litros', 'Mais de 2 litros']),
        simNao('atividadeFisica', 'Pratica atividade física?'),
      ]),
      ...secao('Avaliação da profissional', [texto('avaliacao', 'Avaliação e plano de tratamento')]),
      ...assinaturas(),
    ]),
    tabelas: [SESSOES],
    declaracao: DECLARACAO,
    notas: [
      {
        titulo: 'Uma ficha para o primeiro atendimento',
        texto:
          'A ficha de anamnese estética geral cobre o que quase todo procedimento precisa saber: gravidez, alergias, medicamentos, marca-passo, prótese metálica e circulação. Para procedimentos específicos, como limpeza de pele, depilação ou estética corporal, use a ficha do procedimento, que traz as perguntas próprias de cada um.',
      },
      {
        titulo: 'A queixa vem escrita pela cliente',
        texto:
          'O campo "O que você quer tratar ou melhorar?" fica antes do histórico de saúde de propósito. É a frase da cliente, com as palavras dela, que você compara com o resultado no fim do tratamento.',
      },
    ],
    faq: [
      {
        pergunta: 'Qual a diferença entre a ficha de anamnese estética e a ficha facial ou corporal?',
        resposta:
          'A ficha de anamnese estética geral serve para o primeiro atendimento de qualquer procedimento. As fichas por procedimento acrescentam perguntas próprias: a corporal tem tabela de medidas, a de limpeza de pele pergunta sobre a rotina de cuidados e a de depilação sobre exposição ao sol.',
      },
      {
        pergunta: 'A cliente preenche a ficha de anamnese estética sozinha?',
        resposta:
          'A cliente pode preencher identificação, queixa, saúde e hábitos antes do atendimento. O campo de avaliação e a tabela de sessões são da profissional. Vale reler as respostas com a cliente antes de começar: é nessa conversa que aparecem as informações que ela esqueceu de escrever.',
      },
    ],
  },
  {
    slug: 'sobrancelha',
    nome: 'Ficha de anamnese de sobrancelha',
    rotulo: 'Sobrancelha',
    termo: 'ficha de anamnese para sobrancelha',
    title: 'Ficha de anamnese de sobrancelha para imprimir (PDF grátis)',
    description:
      'Ficha de anamnese para design de sobrancelha, henna e brow lamination em PDF grátis: alergia a tintura, ácidos, pele da região e registro de cada sessão.',
    resumo:
      'A ficha de anamnese de sobrancelha registra o procedimento escolhido (design, henna, tintura ou brow lamination), as reações anteriores a tintura e a produtos químicos e o estado da pele na região. Este modelo cabe em uma folha A4 frente e verso e tem tabela para anotar o produto e a cor usados em cada sessão.',
    paraQuem: 'Designers de sobrancelha que trabalham com pinça, linha, henna, tintura ou brow lamination.',
    template: ficha('sobrancelha', [
      ...identificacao(),
      ...secao('Procedimento', [
        marque('procedimento', 'Procedimento de hoje', ['Design com pinça', 'Design com linha', 'Henna', 'Tintura', 'Brow lamination']),
        simNao('primeiraVez', 'É a primeira vez que faz este procedimento?'),
        linha('preferencia', 'Formato e cor que deseja'),
      ]),
      ...secao('Saúde e pele da região', [
        GESTANTE,
        simNao('reacaoTintura', 'Já teve reação a henna, tintura de cabelo ou produto químico?', true),
        simNao('alergias', 'Tem alergia a cosméticos, medicamentos ou esparadrapo?'),
        ACIDOS,
        simNao('procedimentoRecente', 'Fez peeling, laser ou botox na região nos últimos 15 dias?'),
        simNao('lesaoRegiao', 'Tem dermatite, psoríase, ferida ou espinha inflamada na região?'),
        simNao('micropigmentacao', 'Tem micropigmentação nas sobrancelhas?'),
        simNao('quedaPelos', 'Está em quimioterapia ou notou queda de pelos?'),
        simNao('lentesContato', 'Usa lentes de contato?'),
      ]),
      ...secao('Antes de aplicar (preenchido pela profissional)', [
        data('testeSensibilidade', 'Teste de sensibilidade feito em'),
        linha('resultadoTeste', 'Resultado do teste'),
        texto('observacoes', 'Observações sobre falhas, cicatrizes e assimetria'),
      ]),
      ...assinaturas(),
    ]),
    tabelas: [
      { titulo: 'Acompanhamento das sessões', colunas: ['Data', 'Procedimento', 'Produto e cor', 'Rubrica'], linhas: 6 },
    ],
    declaracao: `${DECLARACAO} Estou ciente de que henna, tintura e brow lamination usam produtos químicos e de que devo avisar sobre qualquer reação depois do procedimento.`,
    notas: [
      {
        titulo: 'Uma ficha para design, henna e brow lamination',
        texto:
          'A ficha de anamnese de sobrancelha começa pelo procedimento do dia. Design com pinça ou linha depende do estado da pele; henna, tintura e brow lamination dependem também do histórico de reação a produto químico. Por isso a pergunta sobre reação a tintura de cabelo é obrigatória neste modelo.',
      },
      {
        titulo: 'O teste de sensibilidade tem data',
        texto:
          'O campo "Teste de sensibilidade feito em" registra quando o teste foi feito e qual foi o resultado. Se a cliente voltar com irritação, a ficha mostra que o teste aconteceu e em que dia.',
      },
    ],
    faq: [
      {
        pergunta: 'A mesma ficha serve para design de sobrancelha e brow lamination?',
        resposta:
          'Serve. A ficha de anamnese de sobrancelha deste modelo tem um campo para marcar o procedimento do dia: design com pinça, design com linha, henna, tintura ou brow lamination. As perguntas sobre reação a produto químico e o registro do teste de sensibilidade valem para os procedimentos com química.',
      },
      {
        pergunta: 'O que anotar na ficha a cada retorno da cliente de sobrancelha?',
        resposta:
          'A tabela de acompanhamento da ficha de anamnese de sobrancelha tem data, procedimento, produto e cor usados e rubrica. Anotar a marca e o tom da henna ou da tintura em cada sessão permite repetir o resultado de que a cliente gostou e evitar o produto que causou reação.',
      },
    ],
  },
  {
    slug: 'corporal',
    nome: 'Ficha de anamnese corporal',
    rotulo: 'Estética corporal',
    termo: 'ficha anamnese corporal',
    title: 'Ficha de anamnese corporal para imprimir (PDF grátis)',
    description:
      'Ficha de anamnese corporal em PDF grátis, sem cadastro: objetivo, saúde, hábitos e tabela de medidas com data para acompanhar a evolução. Baixe e imprima.',
    resumo:
      'A ficha de anamnese corporal registra o objetivo da cliente, as condições de saúde que mudam a escolha do tratamento e os hábitos de alimentação, água e atividade física. Este modelo cabe em uma folha A4 frente e verso e traz uma tabela de medidas com data, para comparar peso e circunferências a cada avaliação.',
    paraQuem: 'Esteticistas e massoterapeutas que fazem drenagem, massagem modeladora e tratamentos de gordura localizada, celulite e flacidez.',
    template: ficha('corporal', [
      ...identificacao(),
      ...secao('Objetivo', [
        marque('queixa', 'O que quer tratar', ['Gordura localizada', 'Celulite', 'Flacidez', 'Estrias', 'Retenção de líquido', 'Dor ou tensão muscular']),
        linha('regioes', 'Regiões do corpo'),
        simNao('tratamentoAnterior', 'Já fez tratamento corporal antes?'),
      ]),
      ...secao('Saúde geral', [
        GESTANTE,
        simNao('alergias', 'Tem alergia a cosméticos, medicamentos ou látex?', true),
        MEDICAMENTOS,
        CRONICAS,
        simNao('circulacao', 'Tem varizes, trombose ou problema de circulação?', true),
        simNao('cardiaco', 'Tem problema cardíaco ou usa marca-passo?'),
        simNao('protese', 'Tem prótese metálica, pino ou DIU de cobre?'),
        simNao('renal', 'Tem problema nos rins ou no fígado?'),
        simNao('oncologico', 'Está em tratamento oncológico ou já teve câncer?'),
        simNao('cirurgiaRecente', 'Fez cirurgia nos últimos 6 meses?'),
        simNao('hormonio', 'Usa anticoncepcional ou faz reposição hormonal?'),
      ]),
      ...secao('Hábitos', [
        escolha('agua', 'Água por dia', ['Menos de 1 litro', '1 a 2 litros', 'Mais de 2 litros']),
        escolha('intestino', 'Intestino', ['Regular', 'Preso', 'Solto']),
        simNao('atividadeFisica', 'Pratica atividade física?'),
        simNao('fuma', 'Fuma?'),
        escolha('alimentacao', 'Alimentação', ['Equilibrada', 'Muito doce', 'Muito sal', 'Muita fritura']),
        escolha('rotina', 'Passa a maior parte do dia', ['Sentada', 'Em pé', 'Em movimento']),
      ]),
      ...secao('Avaliação da profissional', [
        linha('altura', 'Altura'),
        texto('avaliacao', 'Avaliação e plano de tratamento'),
      ]),
      ...assinaturas(),
    ]),
    tabelas: [
      {
        titulo: 'Medidas de acompanhamento',
        colunas: ['Data', 'Peso', 'Cintura', 'Abdômen', 'Quadril', 'Coxa D / E', 'Braço D / E'],
        linhas: 6,
      },
    ],
    declaracao: `${DECLARACAO} Estou ciente de que o resultado depende também dos meus hábitos e da frequência das sessões.`,
    notas: [
      {
        titulo: 'Medidas com data, no mesmo papel',
        texto:
          'A ficha de anamnese corporal deste modelo tem uma tabela de medidas com data: peso, cintura, abdômen, quadril, coxas e braços. Medir nos mesmos pontos e anotar o dia de cada avaliação é o que permite mostrar à cliente a evolução do tratamento.',
      },
      {
        titulo: 'Circulação e marca-passo antes do objetivo estético',
        texto:
          'Varizes, trombose, problema cardíaco, marca-passo e prótese metálica aparecem na ficha de anamnese corporal porque mudam a escolha entre massagem, drenagem e aparelhos. A decisão é da profissional; a ficha garante que a pergunta foi feita.',
      },
    ],
    faq: [
      {
        pergunta: 'A ficha de anamnese corporal tem tabela de medidas?',
        resposta:
          'Tem. A ficha de anamnese corporal deste modelo traz uma tabela com data, peso, cintura, abdômen, quadril, coxa direita e esquerda e braço direito e esquerdo, com seis linhas. Cada linha é uma avaliação, para comparar as medidas ao longo do tratamento.',
      },
      {
        pergunta: 'Serve para drenagem linfática e massagem modeladora?',
        resposta:
          'Serve. A ficha de anamnese corporal cobre drenagem linfática, massagem modeladora e tratamentos de gordura localizada, celulite e flacidez. O campo de objetivo permite marcar retenção de líquido e dor ou tensão muscular, e as perguntas de saúde incluem circulação, rins e cirurgia recente.',
      },
    ],
  },
  {
    slug: 'cilios',
    nome: 'Ficha de anamnese de cílios',
    rotulo: 'Cílios',
    termo: 'ficha de anamnese extensão de cilios',
    title: 'Ficha de anamnese de cílios para imprimir (PDF grátis)',
    description:
      'Ficha de anamnese para extensão de cílios e lash lifting em PDF grátis: saúde dos olhos, alergia a cola, hábitos e registro de curvatura, espessura e tamanho.',
    resumo:
      'A ficha de anamnese de cílios registra a saúde dos olhos, o histórico de reação a cola ou a produtos de lash lifting e os hábitos que afetam a duração dos fios. Este modelo serve para extensão de cílios e lash lifting, cabe em uma folha A4 frente e verso e tem tabela para anotar técnica, curvatura, espessura e tamanho.',
    paraQuem: 'Lash designers que fazem extensão fio a fio, volume, manutenção e lash lifting.',
    template: ficha('cilios', [
      ...identificacao(),
      ...secao('Procedimento', [
        marque('procedimento', 'Procedimento de hoje', ['Extensão fio a fio', 'Volume', 'Manutenção', 'Remoção', 'Lash lifting', 'Tintura']),
        escolha('efeito', 'Efeito desejado', ['Natural', 'Clássico', 'Gatinho', 'Boneca', 'Volumoso']),
        simNao('primeiraVez', 'É a primeira vez que faz este procedimento?'),
      ]),
      ...secao('Saúde dos olhos', [
        GESTANTE,
        simNao('reacaoAnterior', 'Já teve reação a extensão de cílios, cola ou lash lifting?', true),
        simNao('alergias', 'Tem alergia a cola, esparadrapo, látex ou cosméticos?', true),
        simNao('lentesContato', 'Usa lentes de contato?'),
        simNao('infeccaoRecente', 'Teve conjuntivite, terçol ou blefarite nos últimos 30 dias?'),
        simNao('olhoSeco', 'Tem olho seco, lacrimejamento ou sensibilidade à luz?'),
        simNao('cirurgiaOcular', 'Fez cirurgia nos olhos nos últimos 6 meses?'),
        simNao('glaucoma', 'Tem glaucoma ou usa colírio todos os dias?'),
        simNao('quedaCilios', 'Está em quimioterapia ou notou queda de cílios?'),
      ]),
      ...secao('Hábitos', [
        escolha('posicaoDormir', 'Dorme', ['De lado', 'De bruços', 'De barriga para cima']),
        simNao('cocaOlhos', 'Costuma coçar ou esfregar os olhos?'),
        simNao('rimel', 'Usa rímel à prova d\'água ou demaquilante oleoso?'),
        simNao('piscina', 'Frequenta piscina, sauna ou praia toda semana?'),
        simNao('olhosFechados', 'Consegue ficar de olhos fechados durante todo o procedimento?'),
      ]),
      ...secao('Observações da profissional', [texto('observacoes', 'Estado dos fios naturais e observações')]),
      ...assinaturas(),
    ]),
    tabelas: [
      {
        titulo: 'Acompanhamento das aplicações',
        colunas: ['Data', 'Técnica', 'Curvatura', 'Espessura', 'Tamanhos', 'Rubrica'],
        linhas: 6,
      },
    ],
    declaracao: `${DECLARACAO} Estou ciente dos cuidados nas primeiras 24 horas e de que devo procurar a profissional se tiver ardência, vermelhidão ou inchaço.`,
    notas: [
      {
        titulo: 'Extensão e lash lifting na mesma ficha',
        texto:
          'A ficha de anamnese de cílios deste modelo serve para extensão fio a fio, volume, manutenção, remoção e lash lifting. O que muda de um procedimento para o outro é o produto; as perguntas sobre saúde dos olhos e reação anterior valem para todos.',
      },
      {
        titulo: 'Curvatura, espessura e tamanho por data',
        texto:
          'A tabela de acompanhamento registra a técnica e o mapeamento de cada aplicação. Na manutenção, a profissional consulta a linha anterior e repete a curvatura, a espessura e os tamanhos sem depender da memória.',
      },
    ],
    faq: [
      {
        pergunta: 'A ficha de anamnese de cílios serve para lash lifting?',
        resposta:
          'Serve. A ficha de anamnese de cílios deste modelo tem um campo para marcar extensão fio a fio, volume, manutenção, remoção, lash lifting ou tintura. As perguntas sobre saúde dos olhos, lentes de contato e reação anterior a cola ou a produtos se aplicam à extensão e ao lash lifting.',
      },
      {
        pergunta: 'Por que a ficha de cílios pergunta como a cliente dorme?',
        resposta:
          'A ficha de anamnese de cílios pergunta a posição de dormir, o hábito de coçar os olhos e o uso de rímel à prova d\'água porque são hábitos que influenciam a duração dos fios. Com essas respostas a profissional ajusta a orientação de cuidados e a expectativa de manutenção.',
      },
    ],
  },
  {
    slug: 'depilacao',
    nome: 'Ficha de anamnese de depilação',
    rotulo: 'Depilação',
    termo: 'ficha de anamnese depilação',
    title: 'Ficha de anamnese de depilação para imprimir (PDF grátis)',
    description:
      'Ficha de anamnese de depilação com cera e a laser em PDF grátis: pele, exposição ao sol, medicamentos, fototipo e registro de região e método por sessão.',
    resumo:
      'A ficha de anamnese de depilação registra o método (cera, linha, laser ou luz pulsada), as regiões, o estado da pele e a exposição recente ao sol. Este modelo cabe em uma folha A4 frente e verso, tem um bloco próprio para laser, com fototipo e cor do pelo, e uma tabela para anotar região e método de cada sessão.',
    paraQuem: 'Depiladoras e profissionais de depilação a laser e luz pulsada.',
    template: ficha('depilacao', [
      ...identificacao(),
      ...secao('Procedimento', [
        marque('metodo', 'Método', ['Cera quente', 'Cera fria ou roll-on', 'Linha', 'Laser', 'Luz pulsada']),
        linha('regioes', 'Regiões a depilar'),
        escolha('metodoAtual', 'Como costuma se depilar', ['Lâmina', 'Cera', 'Creme', 'Aparelho elétrico', 'Laser']),
      ]),
      ...secao('Saúde e pele', [
        GESTANTE,
        simNao('alergias', 'Tem alergia a cera, cosméticos ou medicamentos?', true),
        ACIDOS,
        simNao('sol', 'Tomou sol ou fez bronzeamento nos últimos 15 dias?', true),
        MEDICAMENTOS,
        CRONICAS,
        simNao('circulacao', 'Tem varizes ou problema de circulação na região?'),
        simNao('herpes', 'Tem ou já teve herpes na região?'),
        simNao('foliculite', 'Tem foliculite ou pelos encravados com frequência?'),
        simNao('lesaoRegiao', 'Tem ferida, mancha, verruga ou sinal na região?'),
        simNao('queloide', 'Tem vitiligo ou tendência a queloide?'),
      ]),
      ...secao('Laser e luz pulsada', [
        escolha('fototipo', 'Fototipo (preenchido pela profissional)', ['I', 'II', 'III', 'IV', 'V', 'VI']),
        escolha('corPelo', 'Cor do pelo', ['Preto', 'Castanho', 'Loiro', 'Ruivo', 'Branco']),
        simNao('arrancouPelo', 'Usou cera, pinça ou linha na região nos últimos 30 dias?'),
        simNao('fotossensibilizante', 'Tomou antibiótico ou outro medicamento novo nos últimos 15 dias?'),
        simNao('tatuagem', 'Tem tatuagem ou micropigmentação na região?'),
      ]),
      ...assinaturas(),
    ]),
    tabelas: [
      { titulo: 'Acompanhamento das sessões', colunas: ['Data', 'Região', 'Método e parâmetros', 'Reação da pele', 'Rubrica'], linhas: 6 },
    ],
    declaracao: `${DECLARACAO} Estou ciente dos cuidados depois da depilação e de que devo avisar sobre exposição ao sol e medicamentos novos antes de cada sessão.`,
    notas: [
      {
        titulo: 'Cera e laser pedem perguntas diferentes',
        texto:
          'A ficha de anamnese de depilação deste modelo tem uma parte comum, sobre pele, sol e medicamentos, e um bloco só para laser e luz pulsada, com fototipo, cor do pelo e tatuagem na região. Quem trabalha só com cera deixa o bloco de laser em branco.',
      },
      {
        titulo: 'O sol dos últimos 15 dias',
        texto:
          'A pergunta sobre sol e bronzeamento recentes é obrigatória na ficha de anamnese de depilação porque a resposta muda a cada sessão. A tabela de acompanhamento tem uma coluna para a reação da pele, que ajuda a ajustar o método na visita seguinte.',
      },
    ],
    faq: [
      {
        pergunta: 'A ficha de anamnese de depilação serve para cera e para laser?',
        resposta:
          'Serve para os dois. A ficha de anamnese de depilação deste modelo tem um campo para marcar cera quente, cera fria, linha, laser ou luz pulsada, e um bloco separado para laser e luz pulsada com fototipo, cor do pelo, uso recente de cera ou pinça e tatuagem na região.',
      },
      {
        pergunta: 'Preciso preencher uma ficha nova a cada sessão de depilação?',
        resposta:
          'Não precisa. A ficha de anamnese de depilação é preenchida no primeiro atendimento, e cada sessão vira uma linha na tabela de acompanhamento, com data, região, método e reação da pele. Vale repetir a cada visita as perguntas sobre sol recente e medicamentos novos.',
      },
    ],
  },
  {
    slug: 'podologia',
    nome: 'Ficha de anamnese de podologia',
    rotulo: 'Podologia',
    termo: 'ficha de anamnese para podologia',
    title: 'Ficha de anamnese de podologia para imprimir (PDF grátis)',
    description:
      'Ficha de anamnese para podologia em PDF grátis, sem cadastro: queixa, diabetes e circulação, hábitos, avaliação dos pés e acompanhamento por sessão.',
    resumo:
      'A ficha de anamnese de podologia registra a queixa nos pés, as condições de saúde que mudam o cuidado (diabetes, circulação, sensibilidade e cicatrização), os hábitos de calçado e a avaliação de pele e unhas feita pelo podólogo. Este modelo cabe em uma folha A4 frente e verso e tem tabela de acompanhamento por sessão.',
    paraQuem: 'Podólogas e podólogos, em consultório próprio ou atendimento domiciliar.',
    template: ficha('podologia', [
      ...identificacao('pessoa'),
      ...secao('Queixa', [
        marque('queixa', 'O que incomoda', ['Unha encravada', 'Calo', 'Calosidade', 'Fissura (rachadura)', 'Micose de unha', 'Frieira', 'Verruga plantar', 'Dor ao pisar']),
        linha('haQuantoTempo', 'Há quanto tempo'),
        simNao('tratamentoAnterior', 'Já tratou esse problema antes?'),
      ]),
      ...secao('Saúde geral', [
        simNao('diabetes', 'Tem diabetes?', true),
        simNao('circulacao', 'Tem varizes, trombose ou problema de circulação?', true),
        simNao('sensibilidade', 'Sente formigamento, dormência ou perda de sensibilidade nos pés?', true),
        simNao('cicatrizacao', 'Demora a cicatrizar quando se machuca?'),
        simNao('anticoagulante', 'Usa anticoagulante ou AAS todos os dias?'),
        simNao('pressao', 'Tem pressão alta ou problema cardíaco?'),
        simNao('alergias', 'Tem alergia a esparadrapo, látex ou medicamentos?', true),
        simNao('articulacoes', 'Tem artrite, artrose, gota ou osteoporose?'),
        simNao('cirurgiaPes', 'Fez cirurgia nos pés ou nas pernas?'),
        simNao('gestante', 'Está grávida?'),
      ]),
      ...secao('Hábitos', [
        escolha('calcado', 'Calçado que mais usa', ['Fechado', 'Aberto', 'Salto', 'Tênis', 'Bota de trabalho']),
        linha('numeracao', 'Numeração'),
        escolha('rotina', 'Passa a maior parte do dia', ['Sentada(o)', 'Em pé', 'Caminhando']),
        escolha('corteUnhas', 'Corta as unhas', ['Retas', 'Arredondadas', 'Não corta sozinha(o)']),
        simNao('esporte', 'Pratica esporte ou caminhada?'),
      ]),
      ...secao('Avaliação (preenchida pelo podólogo)', [
        marque('pele', 'Pele', ['Normal', 'Seca', 'Úmida', 'Com fissuras', 'Com calosidades', 'Com odor']),
        marque('unhas', 'Unhas', ['Normais', 'Espessas', 'Encravadas', 'Descoladas', 'Com manchas', 'Quebradiças']),
        escolha('tipoPe', 'Tipo de pé', ['Normal', 'Plano', 'Cavo']),
        texto('achados', 'Pé direito e pé esquerdo: achados e conduta'),
      ]),
      ...assinaturas('cliente', 'podólogo(a)'),
    ]),
    tabelas: [
      { titulo: 'Acompanhamento das sessões', colunas: ['Data', 'Procedimento realizado', 'Orientações e produtos', 'Rubrica'], linhas: 6 },
    ],
    declaracao: `${DECLARACAO} Estou ciente de que devo procurar atendimento médico se houver sinais de infecção ou se o podólogo assim orientar.`,
    notas: [
      {
        titulo: 'Diabetes, circulação e sensibilidade vêm primeiro',
        texto:
          'Na ficha de anamnese de podologia, as três primeiras perguntas de saúde são obrigatórias: diabetes, circulação e sensibilidade nos pés. São as respostas que mudam o cuidado com corte e instrumentos e que indicam quando encaminhar ao médico.',
      },
      {
        titulo: 'Metade da ficha é do podólogo',
        texto:
          'Este modelo separa o que a pessoa responde (queixa, saúde e hábitos) do que o podólogo avalia: pele, unhas, tipo de pé e os achados em cada pé. A tabela de acompanhamento registra o procedimento e as orientações de cada sessão.',
      },
    ],
    faq: [
      {
        pergunta: 'O que não pode faltar na ficha de anamnese de podologia?',
        resposta:
          'Uma ficha de anamnese de podologia completa registra a queixa, se a pessoa tem diabetes, problema de circulação ou perda de sensibilidade nos pés, alergias, uso de anticoagulante e a avaliação de pele e unhas. Este modelo inclui esses pontos, os hábitos de calçado e uma tabela de acompanhamento por sessão.',
      },
      {
        pergunta: 'A ficha de anamnese de podologia serve para atendimento domiciliar?',
        resposta:
          'Serve. A ficha de anamnese de podologia é uma folha A4 frente e verso que você imprime e leva ao atendimento. A pessoa responde queixa, saúde e hábitos, você preenche a avaliação dos pés e, nas visitas seguintes, anota cada sessão na tabela de acompanhamento.',
      },
    ],
  },
  {
    slug: 'limpeza-de-pele',
    nome: 'Ficha de anamnese de limpeza de pele',
    rotulo: 'Limpeza de pele',
    termo: 'ficha de anamnese limpeza de pele',
    title: 'Ficha de anamnese de limpeza de pele para imprimir (PDF)',
    description:
      'Ficha de anamnese para limpeza de pele em PDF grátis: saúde, ácidos e medicamentos, rotina de cuidados, avaliação da pele e sessões. Baixe e imprima.',
    resumo:
      'A ficha de anamnese de limpeza de pele registra as condições de saúde, o uso de ácidos e medicamentos, os procedimentos recentes no rosto e a rotina de cuidados da cliente. Este modelo cabe em uma folha A4 frente e verso e tem um bloco de avaliação da pele, com tipo, fototipo e o que foi observado, além da tabela de sessões.',
    paraQuem: 'Esteticistas e cosmetólogas que fazem limpeza de pele e tratamentos faciais.',
    template: ficha('limpeza-de-pele', [
      ...identificacao(),
      ...secao('Queixa', [
        texto('queixaPrincipal', 'O que mais incomoda na sua pele?', true),
        escolha('frequencia', 'Faz limpeza de pele', ['É a primeira vez', 'Uma vez por mês', 'A cada 2 ou 3 meses', 'Raramente']),
      ]),
      ...secao('Saúde', [
        GESTANTE,
        simNao('alergias', 'Tem alergia a cosméticos, ácidos ou medicamentos?', true),
        ACIDOS,
        simNao('corticoide', 'Usa antibiótico, corticoide ou anticoagulante?'),
        simNao('herpes', 'Tem herpes labial com frequência?'),
        simNao('doencaPele', 'Tem rosácea, dermatite ou psoríase?'),
        CRONICAS,
        simNao('queloide', 'Tem tendência a queloide ou manchas depois de machucados?'),
        simNao('procedimentoRecente', 'Fez peeling, laser, botox ou preenchimento nos últimos 15 dias?'),
        simNao('hormonio', 'Usa anticoncepcional ou faz reposição hormonal?'),
      ]),
      ...secao('Rotina de cuidados', [
        marque('produtos', 'Usa em casa', ['Sabonete facial', 'Tônico', 'Hidratante', 'Protetor solar', 'Ácido', 'Esfoliante']),
        escolha('exposicaoSolar', 'Exposição ao sol', ['Baixa', 'Moderada', 'Alta']),
        simNao('espreme', 'Costuma espremer cravos e espinhas?'),
        simNao('maquiagem', 'Usa maquiagem todos os dias?'),
      ]),
      ...secao('Avaliação da pele (preenchida pela profissional)', [
        escolha('tipoPele', 'Tipo de pele', ['Normal', 'Seca', 'Oleosa', 'Mista', 'Sensível']),
        escolha('fototipo', 'Fototipo', ['I', 'II', 'III', 'IV', 'V', 'VI']),
        marque('observado', 'Observado', ['Cravos', 'Espinhas', 'Milium', 'Manchas', 'Poros dilatados', 'Desidratação', 'Vasinhos', 'Flacidez']),
        texto('plano', 'Plano de tratamento e orientações para casa'),
      ]),
      ...assinaturas(),
    ]),
    tabelas: [
      { titulo: 'Acompanhamento das sessões', colunas: ['Data', 'Procedimento e produtos', 'Reação e observações', 'Rubrica'], linhas: 6 },
    ],
    declaracao: `${DECLARACAO} Estou ciente de que a pele pode ficar vermelha depois da extração e dos cuidados com sol e maquiagem nas primeiras horas.`,
    notas: [
      {
        titulo: 'Ácidos, isotretinoína e procedimentos recentes',
        texto:
          'A ficha de anamnese de limpeza de pele pergunta sobre ácidos, isotretinoína e peeling, laser, botox ou preenchimento nos últimos 15 dias porque são respostas que mudam a escolha de produtos e a intensidade da extração. A decisão é da profissional; a ficha registra que a pergunta foi feita.',
      },
      {
        titulo: 'A rotina de casa explica a pele',
        texto:
          'O bloco de rotina de cuidados mostra o que a cliente usa em casa e se costuma espremer cravos e espinhas. Com essas respostas, a orientação para casa deixa de ser genérica e vai anotada no plano de tratamento.',
      },
    ],
    faq: [
      {
        pergunta: 'O que perguntar na anamnese antes da limpeza de pele?',
        resposta:
          'A anamnese de limpeza de pele pergunta sobre gravidez, alergias, uso de ácidos e isotretinoína, medicamentos como antibiótico e corticoide, herpes labial, rosácea ou dermatite, procedimentos recentes no rosto e a rotina de cuidados em casa. Este modelo traz essas perguntas e um bloco de avaliação da pele.',
      },
      {
        pergunta: 'A ficha de limpeza de pele serve para outros tratamentos faciais?',
        resposta:
          'Serve como base. A ficha de anamnese de limpeza de pele cobre saúde, rotina de cuidados e avaliação da pele, que valem para hidratação, peeling superficial e outros tratamentos faciais. Anote o procedimento e os produtos de cada visita na tabela de acompanhamento das sessões.',
      },
    ],
  },
  {
    slug: 'auriculoterapia',
    nome: 'Ficha de anamnese de auriculoterapia',
    rotulo: 'Auriculoterapia',
    termo: 'ficha de anamnese auriculoterapia',
    title: 'Ficha de anamnese de auriculoterapia para imprimir (PDF)',
    description:
      'Ficha de anamnese para auriculoterapia em PDF grátis: queixa com escala de 0 a 10, saúde, hábitos e registro dos pontos aplicados em cada sessão. Sem cadastro.',
    resumo:
      'A ficha de anamnese de auriculoterapia registra a queixa principal com uma escala de intensidade de 0 a 10, o histórico de saúde, os hábitos de sono e alimentação e o estado da orelha. Este modelo cabe em uma folha A4 frente e verso e tem tabela para anotar os pontos aplicados, o material e a evolução em cada sessão.',
    paraQuem: 'Terapeutas que aplicam auriculoterapia com sementes, cristais, esferas ou agulhas.',
    template: ficha('auriculoterapia', [
      ...identificacao('pessoa'),
      ...secao('Queixa', [
        texto('queixaPrincipal', 'Queixa principal', true),
        linha('haQuantoTempo', 'Há quanto tempo'),
        escala('intensidade', 'Intensidade hoje (0 = nada, 10 = insuportável)'),
        marque('outrasQueixas', 'Também sente', ['Ansiedade', 'Insônia', 'Dor de cabeça', 'Dor nas costas', 'Estresse', 'Compulsão alimentar', 'Cólica ou TPM', 'Vontade de fumar']),
      ]),
      ...secao('Saúde', [
        GESTANTE,
        simNao('tratamentoMedico', 'Faz tratamento médico ou psicológico?'),
        MEDICAMENTOS,
        CRONICAS,
        simNao('alergias', 'Tem alergia a esparadrapo, micropore ou metais (níquel)?', true),
        simNao('coagulacao', 'Tem problema de coagulação ou usa anticoagulante?'),
        simNao('marcapasso', 'Usa marca-passo?'),
        simNao('epilepsia', 'Tem epilepsia ou já teve convulsão?'),
        simNao('lesaoOrelha', 'Tem ferida, inflamação ou piercing na orelha?', true),
      ]),
      ...secao('Hábitos', [
        escolha('sono', 'Sono', ['Bom', 'Demora a dormir', 'Acorda à noite', 'Acorda cansada(o)']),
        escolha('intestino', 'Intestino', ['Regular', 'Preso', 'Solto']),
        escolha('apetite', 'Apetite', ['Normal', 'Aumentado', 'Diminuído']),
        simNao('atividadeFisica', 'Pratica atividade física?'),
        simNao('fuma', 'Fuma ou bebe com frequência?'),
        linha('emocao', 'Emoção que mais aparece no dia a dia'),
      ]),
      ...assinaturas('cliente', 'terapeuta'),
    ]),
    tabelas: [
      {
        titulo: 'Acompanhamento das sessões',
        colunas: ['Data', 'Pontos aplicados', 'Orelha', 'Material', 'Intensidade (0 a 10)', 'Rubrica'],
        linhas: 8,
      },
    ],
    declaracao: `${DECLARACAO} Estou ciente de que a auriculoterapia é uma prática complementar e não substitui diagnóstico nem tratamento médico.`,
    notas: [
      {
        titulo: 'A queixa tem número',
        texto:
          'A ficha de anamnese de auriculoterapia registra a intensidade da queixa numa escala de 0 a 10 no primeiro atendimento e repete a nota em cada sessão, na tabela de acompanhamento. Comparar os números é a forma mais simples de mostrar a evolução.',
      },
      {
        titulo: 'Pontos, orelha e material por sessão',
        texto:
          'A tabela de acompanhamento tem colunas para os pontos aplicados, a orelha (direita ou esquerda) e o material: sementes, cristais, esferas ou agulhas. As perguntas sobre alergia a esparadrapo e a metais e sobre lesão na orelha são obrigatórias neste modelo.',
      },
    ],
    faq: [
      {
        pergunta: 'O que anotar na ficha de anamnese de auriculoterapia a cada sessão?',
        resposta:
          'A cada sessão de auriculoterapia anote a data, os pontos aplicados, a orelha (direita ou esquerda), o material usado e a intensidade da queixa de 0 a 10. A ficha de anamnese de auriculoterapia deste modelo tem uma tabela com essas colunas e oito linhas.',
      },
      {
        pergunta: 'A ficha de auriculoterapia substitui avaliação médica?',
        resposta:
          'Não substitui. A ficha de anamnese de auriculoterapia registra a queixa, o histórico e os hábitos para orientar a aplicação. A declaração que a pessoa assina neste modelo diz que a auriculoterapia é uma prática complementar e não substitui diagnóstico nem tratamento médico.',
      },
    ],
  },
  {
    slug: 'manicure-e-pedicure',
    nome: 'Ficha de anamnese de manicure e pedicure',
    rotulo: 'Manicure e pedicure',
    termo: 'ficha de anamnese manicure e pedicure',
    title: 'Ficha de anamnese de manicure e pedicure para imprimir (PDF)',
    description:
      'Ficha de anamnese para manicure, pedicure e alongamento de unhas em PDF grátis: saúde, alergia a esmalte e gel, estado das unhas e registro por atendimento.',
    resumo:
      'A ficha de anamnese de manicure e pedicure registra o serviço do dia, as condições de saúde que pedem mais cuidado com alicate e lixa (diabetes, circulação, anticoagulante) e o histórico de reação a esmalte, gel ou acrílico. Este modelo serve também para alongamento de unhas e cabe em uma folha A4 frente e verso.',
    paraQuem: 'Manicures, pedicures e nail designers que fazem esmaltação em gel e alongamento.',
    template: ficha('manicure-e-pedicure', [
      ...identificacao(),
      ...secao('Serviço', [
        marque('servico', 'Serviço de hoje', ['Manicure', 'Pedicure', 'Esmaltação em gel', 'Alongamento', 'Manutenção', 'Remoção', 'Spa dos pés', 'Plástica dos pés']),
        escolha('formato', 'Formato', ['Quadrado', 'Redondo', 'Oval', 'Amendoado', 'Bailarina', 'Stiletto']),
        escolha('cuticula', 'Cutícula', ['Retirar', 'Só empurrar', 'Não mexer']),
      ]),
      ...secao('Saúde', [
        simNao('diabetes', 'Tem diabetes?', true),
        simNao('circulacao', 'Tem varizes ou problema de circulação?'),
        simNao('anticoagulante', 'Usa anticoagulante ou AAS todos os dias?'),
        simNao('alergias', 'Tem alergia a esmalte, acetona, gel, acrílico ou látex?', true),
        simNao('reacaoAnterior', 'Já teve reação a alongamento ou esmaltação em gel?', true),
        simNao('micose', 'Tem ou teve micose de unha ou frieira?'),
        simNao('unhaEncravada', 'Tem unha encravada?'),
        simNao('doencaPele', 'Tem psoríase ou dermatite nas mãos ou nos pés?'),
        simNao('gestante', 'Está grávida?'),
        simNao('quimioterapia', 'Está em quimioterapia?'),
      ]),
      ...secao('Hábitos', [
        simNao('roiUnhas', 'Rói as unhas ou tira a cutícula?'),
        simNao('maosNaAgua', 'Fica com as mãos na água ou em produtos de limpeza?'),
        simNao('luvas', 'Usa luvas para limpar a casa?'),
        simNao('esporte', 'Pratica esporte que força as unhas ou os pés?'),
      ]),
      ...secao('Avaliação (preenchida pela profissional)', [
        marque('estadoUnhas', 'Unhas', ['Normais', 'Fracas', 'Descamando', 'Com manchas', 'Onduladas', 'Descoladas']),
        texto('observacoes', 'Observações'),
      ]),
      ...assinaturas(),
    ]),
    tabelas: [
      { titulo: 'Acompanhamento dos atendimentos', colunas: ['Data', 'Serviço', 'Material e cor', 'Observações', 'Rubrica'], linhas: 8 },
    ],
    declaracao: `${DECLARACAO} Estou ciente de que devo avisar a profissional se notar dor, descolamento ou mudança de cor nas unhas depois do atendimento.`,
    notas: [
      {
        titulo: 'Diabetes e anticoagulante mudam o uso do alicate',
        texto:
          'A ficha de anamnese de manicure e pedicure pergunta sobre diabetes, circulação e anticoagulante porque um pequeno corte tem outro peso nesses casos. A resposta orienta a decisão de retirar, só empurrar ou não mexer na cutícula, que também fica registrada.',
      },
      {
        titulo: 'Reação a gel e acrílico',
        texto:
          'Para alongamento e esmaltação em gel, a ficha registra alergias e reações anteriores a esmalte, gel e acrílico. A tabela de atendimentos guarda o material e a cor usados em cada data, o que ajuda a identificar o produto se a cliente tiver reação.',
      },
    ],
    faq: [
      {
        pergunta: 'Manicure precisa de ficha de anamnese?',
        resposta:
          'A ficha de anamnese de manicure e pedicure registra o que a cliente informou antes do atendimento: diabetes, uso de anticoagulante, alergia a esmalte ou gel e micose de unha. A exigência formal depende da vigilância sanitária do seu município; a utilidade é ter por escrito o que orienta o cuidado com alicate e produtos.',
      },
      {
        pergunta: 'A ficha serve para alongamento de unhas em gel ou fibra?',
        resposta:
          'Serve. A ficha de anamnese de manicure e pedicure deste modelo inclui alongamento, manutenção, remoção e esmaltação em gel entre os serviços, pergunta sobre reação anterior a gel e acrílico e tem campos de formato e de estado das unhas, além da tabela de material e cor por atendimento.',
      },
    ],
  },
  {
    slug: 'micropigmentacao',
    nome: 'Ficha de anamnese de micropigmentação',
    rotulo: 'Micropigmentação',
    termo: 'ficha de anamnese micropigmentação',
    title: 'Ficha de anamnese de micropigmentação para imprimir (PDF)',
    description:
      'Ficha de anamnese para micropigmentação de sobrancelhas, lábios e olhos em PDF grátis: saúde, cicatrização, alergias e registro de pigmento, agulha e lote.',
    resumo:
      'A ficha de anamnese de micropigmentação registra a região e a técnica, as condições de saúde ligadas a cicatrização e coagulação, as alergias a pigmento e anestésico e a aprovação do desenho pela cliente. Este modelo cabe em uma folha A4 frente e verso e tem tabela para anotar pigmento, agulha e lote em cada sessão.',
    paraQuem: 'Micropigmentadoras de sobrancelhas, lábios e olhos, incluindo microblading e retoque.',
    template: ficha('micropigmentacao', [
      ...identificacao(),
      ...secao('Procedimento', [
        marque('regiao', 'Região e técnica', ['Sobrancelhas fio a fio', 'Sobrancelhas sombreadas', 'Lábios', 'Delineado dos olhos', 'Retoque', 'Correção ou remoção']),
        simNao('micropigmentacaoAnterior', 'Já tem micropigmentação na região?'),
        linha('corDesejada', 'Cor e formato que deseja'),
      ]),
      ...secao('Saúde', [
        GESTANTE,
        simNao('diabetes', 'Tem diabetes ou pressão alta?', true),
        simNao('coagulacao', 'Tem problema de coagulação ou usa anticoagulante ou AAS?', true),
        simNao('queloide', 'Tem tendência a queloide?', true),
        simNao('alergias', 'Tem alergia a pigmento, anestésico, níquel ou cosméticos?', true),
        simNao('herpes', 'Tem ou já teve herpes labial?'),
        simNao('autoimune', 'Tem doença autoimune, como lúpus ou vitiligo?'),
        simNao('oncologico', 'Está em quimioterapia ou radioterapia?'),
        simNao('epilepsia', 'Tem epilepsia ou já teve convulsão?'),
        ACIDOS,
        simNao('procedimentoRecente', 'Fez botox, preenchimento, peeling ou laser na região nos últimos 30 dias?'),
        simNao('doencaPele', 'Tem dermatite, psoríase ou ferida na região?'),
        simNao('olhos', 'Para olhos: tem glaucoma, usa lentes ou fez cirurgia ocular?'),
      ]),
      ...secao('Antes de começar (preenchido pela profissional)', [
        simNao('desenhoAprovado', 'A cliente viu e aprovou o desenho no espelho?', true),
        linha('anestesico', 'Anestésico usado'),
        texto('observacoes', 'Observações sobre pele, cicatrizes e assimetria'),
      ]),
      ...assinaturas(),
    ]),
    tabelas: [
      {
        titulo: 'Registro das sessões',
        colunas: ['Data', 'Sessão', 'Pigmento (marca, cor e lote)', 'Agulha ou lâmina (lote)', 'Rubrica'],
        linhas: 4,
      },
    ],
    declaracao: `${DECLARACAO} Aprovei o desenho e a cor antes do início, estou ciente de que a cor muda durante a cicatrização e de que o retoque faz parte do procedimento.`,
    notas: [
      {
        titulo: 'Cicatrização e coagulação são obrigatórias',
        texto:
          'Na ficha de anamnese de micropigmentação, as perguntas sobre diabetes, coagulação, queloide e alergia a pigmento ou anestésico são obrigatórias. São as respostas que a profissional precisa ter por escrito antes de um procedimento que perfura a pele.',
      },
      {
        titulo: 'Desenho aprovado e lote anotado',
        texto:
          'Este modelo registra que a cliente viu e aprovou o desenho no espelho, e a declaração repete a aprovação com a assinatura dela. A tabela de sessões guarda marca, cor e lote do pigmento e o lote da agulha ou lâmina.',
      },
    ],
    faq: [
      {
        pergunta: 'O que a ficha de anamnese de micropigmentação precisa ter?',
        resposta:
          'Uma ficha de anamnese de micropigmentação completa registra a região e a técnica, gravidez, diabetes, problema de coagulação, tendência a queloide, alergia a pigmento e anestésico, herpes labial, uso de ácidos e procedimentos recentes na região. Este modelo inclui também a aprovação do desenho e o registro de pigmento e lote.',
      },
      {
        pergunta: 'A ficha de micropigmentação serve para lábios e olhos?',
        resposta:
          'Serve. A ficha de anamnese de micropigmentação deste modelo tem campo para marcar sobrancelhas fio a fio, sobrancelhas sombreadas, lábios, delineado dos olhos, retoque e correção. Há uma pergunta sobre herpes labial, para lábios, e outra sobre glaucoma, lentes e cirurgia ocular, para olhos.',
      },
    ],
  },
  {
    slug: 'nutricional',
    nome: 'Ficha de anamnese nutricional',
    rotulo: 'Nutricional',
    termo: 'anamnese nutricional',
    title: 'Ficha de anamnese nutricional para imprimir (PDF grátis)',
    description:
      'Ficha de anamnese nutricional em PDF grátis, sem cadastro: objetivo, história clínica, hábitos, recordatório de 24 horas e medidas com data. Baixe e imprima.',
    resumo:
      'A ficha de anamnese nutricional registra o objetivo do paciente, a história clínica e familiar, os hábitos alimentares e um recordatório de 24 horas. Este modelo cabe em uma folha A4 frente e verso e traz duas tabelas: o recordatório por refeição e as medidas de acompanhamento, com data, peso, cintura e quadril.',
    paraQuem: 'Nutricionistas e estudantes de nutrição, em consultório ou atendimento domiciliar.',
    template: ficha('nutricional', [
      ...identificacao('pessoa'),
      ...secao('Objetivo', [
        marque('objetivo', 'Objetivo da consulta', ['Emagrecimento', 'Ganho de massa', 'Reeducação alimentar', 'Controle de doença', 'Desempenho esportivo', 'Gestação']),
        simNao('dietaAnterior', 'Já fez dieta ou acompanhamento nutricional antes?'),
      ]),
      ...secao('História clínica', [
        simNao('doencas', 'Tem doença diagnosticada (diabetes, pressão alta, colesterol, tireoide)?', true),
        marque('historicoFamiliar', 'Na família há casos de', ['Diabetes', 'Pressão alta', 'Obesidade', 'Doença do coração', 'Câncer']),
        simNao('medicamentos', 'Usa medicamento ou suplemento?', true),
        simNao('alergias', 'Tem alergia ou intolerância alimentar?', true),
        simNao('cirurgia', 'Fez cirurgia, inclusive bariátrica?'),
        simNao('gestante', 'Está grávida ou amamentando?'),
        escolha('intestino', 'Intestino', ['Todos os dias', 'A cada 2 ou 3 dias', 'Mais de 3 dias sem ir']),
        escolha('sono', 'Sono', ['Bom', 'Irregular', 'Ruim']),
        linha('exames', 'Data dos últimos exames de sangue'),
      ]),
      ...secao('Hábitos', [
        escolha('refeicoes', 'Refeições por dia', ['1 ou 2', '3', '4 ou 5', '6 ou mais']),
        escolha('quemPrepara', 'Quem prepara a comida', ['Eu', 'Outra pessoa da casa', 'Como fora', 'Marmita ou delivery']),
        escolha('agua', 'Água por dia', ['Menos de 1 litro', '1 a 2 litros', 'Mais de 2 litros']),
        simNao('belisca', 'Belisca entre as refeições?'),
        simNao('alcool', 'Consome bebida alcoólica?'),
        simNao('fuma', 'Fuma?'),
        simNao('atividadeFisica', 'Pratica atividade física?'),
        linha('naoGosta', 'Alimentos de que não gosta'),
        linha('horarioFome', 'Horário de mais fome'),
      ]),
      ...secao('Avaliação (preenchida pelo nutricionista)', [
        linha('altura', 'Altura'),
        texto('conduta', 'Diagnóstico nutricional e conduta'),
      ]),
      ...assinaturas('paciente', 'nutricionista'),
    ]),
    tabelas: [
      {
        titulo: 'Recordatório de 24 horas',
        colunas: ['Refeição', 'Horário', 'Alimentos e quantidades'],
        linhas: ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia'],
      },
      {
        titulo: 'Medidas de acompanhamento',
        colunas: ['Data', 'Peso', 'IMC', 'Cintura', 'Quadril', '% de gordura'],
        linhas: 5,
      },
    ],
    declaracao:
      'Declaro que as informações acima são verdadeiras. Autorizo o uso destes dados somente para o meu acompanhamento nutricional.',
    notas: [
      {
        titulo: 'Recordatório de 24 horas na própria ficha',
        texto:
          'A ficha de anamnese nutricional deste modelo traz o recordatório de 24 horas em tabela, com seis refeições, horário e espaço para alimentos e quantidades. Preencher junto com o paciente, na consulta, costuma dar um retrato mais fiel do que pedir que ele escreva sozinho.',
      },
      {
        titulo: 'Medidas com data para o retorno',
        texto:
          'A tabela de medidas de acompanhamento tem data, peso, IMC, cintura, quadril e percentual de gordura, com cinco linhas. Cada retorno ocupa uma linha, e a evolução fica na mesma folha da primeira consulta.',
      },
    ],
    faq: [
      {
        pergunta: 'O que entra em uma ficha de anamnese nutricional?',
        resposta:
          'A ficha de anamnese nutricional reúne identificação, objetivo da consulta, história clínica e familiar, medicamentos e suplementos, alergias e intolerâncias, funcionamento do intestino, sono, hábitos alimentares, atividade física, um recordatório de 24 horas e as medidas de acompanhamento com data.',
      },
      {
        pergunta: 'A ficha de anamnese nutricional serve para estudantes de nutrição?',
        resposta:
          'Serve. A ficha de anamnese nutricional deste modelo é um roteiro de primeira consulta em uma folha A4 frente e verso, útil para estágio e prática supervisionada. O campo de diagnóstico nutricional e conduta é preenchido pelo nutricionista responsável pelo atendimento.',
      },
    ],
  },
]

export const whatsappFicha = (texto: string) =>
  `https://wa.me/${FICHA_COM_LOGO.whatsapp}?text=${encodeURIComponent(texto)}`

export function getFicha(slug: string): FichaAnamnese | undefined {
  return FICHAS.find((f) => f.slug === slug)
}

export const fichaPath = (slug: string) => `${FICHAS_BASE_PATH}/${slug}`
export const fichaPdf = (slug: string) => `/fichas/ficha-de-anamnese-${slug}.pdf`
export const fichaImagem = (slug: string) => `/fichas/ficha-de-anamnese-${slug}.webp`

/** Questions every form page answers, phrased with the form's own name so each page is unique. */
export function faqComum(f: FichaAnamnese): FichaAnamnese['faq'] {
  const nome = f.nome.toLowerCase()
  return [
    {
      pergunta: `A ${nome} é obrigatória?`,
      resposta: `Depende de onde você atende e da sua categoria profissional. A vigilância sanitária do município e os conselhos profissionais podem ter regras próprias sobre o registro do atendimento: confira a norma local. Com ou sem exigência, a ${nome} preenchida e assinada é o registro do que foi informado antes do atendimento.`,
    },
    {
      pergunta: `Posso mudar as perguntas da ${nome}?`,
      resposta: `Pode. Este modelo de ${nome} é um ponto de partida: risque o que não se aplica ao seu atendimento e acrescente à mão o que faltar. Se preferir receber a ficha com a logo e o nome do seu negócio, a versão personalizada custa ${FICHA_COM_LOGO.preco}, em pagamento único.`,
    },
    {
      pergunta: `A ${nome} substitui o termo de consentimento?`,
      resposta: `Não substitui. A ${nome} registra histórico, hábitos e avaliação. O termo de consentimento trata dos riscos e dos cuidados de um procedimento específico e é um documento à parte. Este modelo é um roteiro para adaptar ao seu atendimento, não um protocolo clínico.`,
    },
  ]
}
