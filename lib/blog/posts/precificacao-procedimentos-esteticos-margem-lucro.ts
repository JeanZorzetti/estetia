import { BlogPost } from '../../blog-types'

export const post: BlogPost = {
  slug: 'precificacao-procedimentos-esteticos-margem-lucro',
  title: 'Precificação de Procedimentos Estéticos: Como Calcular Preço com Margem Real em 2026',
  excerpt: 'Como calcular o preço correto de procedimentos estéticos: fórmula custo + overhead + margem, diferença entre markup e margem, e por que precificar por concorrência destrói o negócio.',
  date: '2026-06-01',
  lastModified: '2026-06-01',
  category: 'KPIs & Crescimento',
  image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80',
  imageAlt: 'Gestora de clínica de estética calculando precificação de procedimentos com calculadora e planilha de custos',
  author: 'Equipe Estetia',
  relatedSlugs: [
    'fluxo-de-caixa-clinica-estetica-gestao-financeira',
    'comissao-profissionais-clinica-estetica-modelos',
    'gestao-estoque-produtos-clinica-estetica',
  ],
  content: `
<p>A precificação incorreta de procedimentos estéticos é a causa mais silenciosa de fechamento de clínicas no Brasil. Clínicas de estética com boa organização financeira, precificação estratégica e fidelização de clientes podem alcançar margens de lucro de 30% a 60%, segundo dados de contabilidade especializada no setor (GG Contabilidade, 2024). No entanto, a maioria das clínicas precifica por concorrência — copia o preço do vizinho — sem saber se esse preço cobre sequer os próprios custos. O resultado é uma clínica cheia de pacientes e no vermelho. Este guia apresenta a fórmula correta de precificação que todo gestor de clínica de estética precisa dominar.</p>

<div class="callout-stat">
  <strong>A referência do Sebrae:</strong> Para serviços, o Sebrae recomenda que a margem de lucro represente aproximadamente 20% do total das vendas como ponto de partida saudável. Para o setor de estética especificamente, com custos de insumos variáveis e alto overhead de equipamentos, clínicas bem geridas operam com margens entre 25% e 45% sobre o faturamento, segundo dados de contabilidade para o setor. Abaixo de 20%, a clínica está em território perigoso.
</div>

<h2>Por Que Precificar por Concorrência É Um Erro Fatal</h2>

<p>O raciocínio parece lógico: "cobro o mesmo que a clínica ao lado". O problema é que você não sabe qual é o custo da clínica ao lado. Ela pode ter:</p>
<ul>
  <li>Imóvel próprio (sem aluguel) vs. você pagando R$ 4.000/mês</li>
  <li>Equipamentos quitados vs. você pagando parcelas de R$ 3.000/mês</li>
  <li>Proprietário que não se paga (trabalho gratuito do dono) vs. pró-labore de R$ 6.000</li>
  <li>Profissionais em parceria (sem encargo) vs. equipe CLT</li>
</ul>
<p>O mesmo preço cobrado por duas clínicas com estruturas de custo completamente diferentes resulta em lucro para uma e prejuízo para outra. Você precisa saber se o seu preço é suficiente para a sua estrutura — não para a estrutura da concorrência.</p>

<h2>Os 3 Componentes do Preço Correto</h2>

<h3>Componente 1: Custo Direto do Procedimento</h3>
<p>Tudo que você consome especificamente naquele procedimento:</p>
<ul>
  <li>Produto/insumo principal (toxina, ácido hialurônico, creme de peeling, etc.)</li>
  <li>Materiais descartáveis (agulhas, seringas, luvas, campo, curativo)</li>
  <li>Consumíveis de aparelho (gel, cartucho de HIFU, filme de criolipólise)</li>
  <li>Energia elétrica proporcional (relevante para aparelhos de alto consumo)</li>
</ul>

<h3>Componente 2: Overhead (Custo Fixo Alocado)</h3>
<p>Sua parcela dos custos fixos da clínica por hora de atendimento. O cálculo:</p>
<ol>
  <li>Some todas as despesas fixas mensais: aluguel + folha + pró-labore + contador + software + internet + manutenção prevista</li>
  <li>Divida pelo número de horas produtivas mensais (horas de atendimento efetivo, não horas que a clínica está aberta)</li>
  <li>Multiplique pela duração do procedimento em horas</li>
</ol>

<p>Exemplo: Despesas fixas mensais = R$ 18.000 / 160 horas produtivas = R$ 112,50/hora. Procedimento de 45 minutos = R$ 84,37 de overhead.</p>

<h3>Componente 3: Custo do Profissional</h3>
<p>O custo real do profissional que executa o procedimento, não apenas o salário:</p>
<ul>
  <li>CLT: salário + INSS patronal (20%) + FGTS (8%) + férias (1/12) + 13º (1/12) + outros benefícios ≈ salário × 1,45 a 1,65</li>
  <li>Parceria/comissão: percentual combinado sobre o faturamento do procedimento</li>
</ul>

<h2>A Fórmula da Precificação Correta</h2>

<p><strong>Preço Mínimo = Custo Direto + Overhead Alocado + Custo do Profissional</strong></p>
<p><strong>Preço de Venda = Preço Mínimo ÷ (1 − Margem de Lucro Desejada)</strong></p>

<h3>Exemplo Prático: Toxina Botulínica (Glabela)</h3>

<table>
  <thead>
    <tr>
      <th>Componente</th>
      <th>Cálculo</th>
      <th>Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Custo do produto (toxina)</td>
      <td>Frasco R$600 ÷ 4 aplicações</td>
      <td>R$ 150</td>
    </tr>
    <tr>
      <td>Materiais descartáveis</td>
      <td>Agulhas + luvas + curativo</td>
      <td>R$ 18</td>
    </tr>
    <tr>
      <td>Overhead (30 min de sala)</td>
      <td>R$ 112,50/h × 0,5h</td>
      <td>R$ 56</td>
    </tr>
    <tr>
      <td>Custo do profissional (30 min)</td>
      <td>Profissional CLT R$5.000/160h × 0,5h × 1,5 encargos</td>
      <td>R$ 23</td>
    </tr>
    <tr>
      <td><strong>Custo Total (Preço Mínimo)</strong></td>
      <td></td>
      <td><strong>R$ 247</strong></td>
    </tr>
    <tr>
      <td><strong>Preço de Venda (margem 35%)</strong></td>
      <td>R$ 247 ÷ (1 − 0,35)</td>
      <td><strong>R$ 380</strong></td>
    </tr>
    <tr>
      <td><strong>Preço de Venda (margem 45%)</strong></td>
      <td>R$ 247 ÷ (1 − 0,45)</td>
      <td><strong>R$ 449</strong></td>
    </tr>
  </tbody>
</table>

<p>Se você cobra R$ 300 por esse procedimento achando que é competitivo, está gerando prejuízo de R$ 53 em cada aplicação — dinheiro que sai da sua reserva de capital, não que entra.</p>

<div class="callout-warning">
  <strong>Markup vs. Margem: a confusão que custa caro:</strong> Muitos gestores calculam o preço adicionando uma porcentagem ao custo (markup) e chamam isso de "margem". Não é a mesma coisa. Markup de 50% sobre um custo de R$200 = preço de R$300. Margem sobre esse preço = R$100 ÷ R$300 = 33%, não 50%. Para ter 50% de margem sobre o preço de venda, o markup sobre o custo precisa ser 100% (dobrar o custo).
</div>

<h2>Ponto de Equilíbrio: Quantos Procedimentos Preciso Fazer para Não Ter Prejuízo</h2>

<p>O ponto de equilíbrio responde: qual o faturamento mínimo mensal para cobrir todos os custos sem lucro?</p>

<p><strong>Ponto de Equilíbrio = Custos Fixos Totais ÷ Margem de Contribuição Média</strong></p>

<p>Onde Margem de Contribuição = (Preço de Venda − Custos Variáveis do Procedimento) ÷ Preço de Venda</p>

<p>Exemplo: Custos fixos = R$18.000/mês. Margem de contribuição média = 55%. Ponto de equilíbrio = R$18.000 ÷ 0,55 = <strong>R$32.727 de faturamento mínimo mensal</strong>. Abaixo desse número, a clínica opera no prejuízo independente de quanto trabalhe.</p>

<h2>Ajustando o Preço para o Mercado Sem Sacrificar a Margem</h2>

<p>Depois de calcular o preço com a margem desejada, verifique se ele é compatível com o mercado local. Se o preço calculado ficar acima do mercado, você tem 3 opções:</p>

<ol>
  <li><strong>Reduzir custos</strong>: negociar melhores condições com fornecedores, otimizar o uso de materiais, aumentar a produtividade por hora</li>
  <li><strong>Aceitar margem menor</strong>: para procedimentos de entrada/captação, aceitar margem menor sabendo que o LTV do paciente justifica</li>
  <li><strong>Reposicionar</strong>: cobrar mais do que o mercado com justificativa (especialização, resultado comprovado, experiência diferenciada, localização premium)</li>
</ol>

<p>O que <strong>não</strong> deve fazer: reduzir o preço abaixo do seu custo para "competir". Isso é rota direta para o fechamento.</p>

<div class="callout-tip">
  <strong>No Estetia CRM:</strong> O módulo de estoque calcula automaticamente o custo de insumo por procedimento com base nos produtos registrados. Combinado com o módulo financeiro, você tem o custo direto real de cada atendimento para calcular sua margem corretamente. <a href="/pt-BR/register">Testar grátis →</a>
</div>

<h2>Revisão de Preços: Quando e Como Reajustar</h2>

<p>Os custos mudam ao longo do tempo — fornecedores reajustam, aluguel sobe, encargos trabalhistas se alteram. Revisar os preços uma vez por ano é o mínimo. Os gatilhos para revisão antecipada:</p>
<ul>
  <li>Aumento de custo de insumo principal acima de 10%</li>
  <li>Reajuste salarial da categoria (convenção coletiva)</li>
  <li>Reajuste de aluguel (índice contratual, geralmente IGP-M ou IPCA)</li>
  <li>Queda de margem abaixo do mínimo desejado por 2+ meses consecutivos</li>
</ul>

<h2>Perguntas Frequentes sobre Precificação em Clínica de Estética</h2>

<h3>Qual a margem de lucro ideal para procedimentos em clínica de estética?</h3>
<p>Para clínicas de estética com boa gestão, a margem de lucro líquida saudável fica entre 20% e 45% sobre o faturamento, dependendo do mix de procedimentos. Procedimentos com baixo custo de insumo e alto valor percebido (como consultas de avaliação ou peelings superficiais) podem ter margens acima de 60%. Procedimentos com alto custo de insumo (injetáveis importados) têm margens menores — mas o ticket maior compensa. O ponto de atenção é que a margem média ponderada do mix completo precisa ser saudável.</p>

<h3>Como calcular o overhead de uma clínica de estética?</h3>
<p>Some todas as despesas fixas mensais (aluguel, folha sem produtividade, pró-labore, contador, software, utilities) e divida pelo número de horas produtivas mensais (número de salas × horas de atendimento por dia × dias úteis × taxa de ocupação). Esse é o custo por hora de overhead. Para cada procedimento, multiplique pela duração em horas. Revisar o overhead semestralmente garante que mudanças nos custos fixos sejam refletidas nos preços.</p>

<h3>Devo cobrar o mesmo preço que a concorrência?</h3>
<p>Não necessariamente. O preço da concorrência é uma referência de mercado, não uma obrigação. Se o seu custo é maior (aluguel em localização premium, equipe mais experiente, equipamentos superiores), seu preço pode e deve ser maior — com a justificativa correspondente de valor entregue. Se o seu custo é menor, você pode cobrar igual e ter margem maior. O que não pode fazer é cobrar abaixo do seu custo de produção.</p>

<h3>Como comunicar aumento de preço para pacientes fiéis?</h3>
<p>Com antecedência e transparência. Avise com 30–45 dias de antecedência, explique o contexto (reajuste de insumos, atualização de equipamentos, melhoria na estrutura) e ofereça condições especiais para pacientes que agendarem antes do reajuste. Pacientes fiéis que confiam na clínica geralmente aceitam reajustes bem comunicados — o que não aceitam é descobrir na hora do pagamento que o preço subiu sem aviso.</p>

<p>Quer calcular automaticamente o custo de insumo por procedimento e monitorar a margem real da sua clínica? <a href="/pt-BR/register">Comece seu teste gratuito de 14 dias no Estetia CRM →</a></p>
`,
}
