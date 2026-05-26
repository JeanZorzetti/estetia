import { BlogPost } from '../../blog-types'

export const post: BlogPost = {
  slug: 'kpis-essenciais-clinica-de-estetica',
  title: 'Os 7 KPIs Essenciais de Clínicas de Estética: LTV, Retenção, No-Show e Mais',
  excerpt: 'LTV, taxa de retorno em 90 dias, custo de aquisição, receita por hora de cadeira — 7 métricas que a maioria das clínicas não monitora, com benchmarks brasileiros, fórmulas e como melhorar cada uma.',
  date: '2026-05-02',
  lastModified: '2026-05-02',
  category: 'KPIs & Crescimento',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  imageAlt: 'Dashboard com KPIs e métricas de clínica de estética — LTV, taxa de retenção e no-show',
  author: 'Equipe Estetia',
  relatedSlugs: [
    'como-reduzir-no-show-em-clinicas-de-estetica',
    'spin-selling-para-clinicas-de-estetica',
  ],
  content: `
<p>A maioria dos gestores de clínicas de estética sabe seu faturamento mensal. Uma minoria sabe o ticket médio. Quase ninguém sabe o LTV por paciente, a taxa de retorno em 90 dias ou a receita por hora de cadeira. Essa lacuna de dados é o principal motivo pelo qual clínicas crescem devagar — ou não crescem.</p>

<p>Sem métricas, decisões de gestão são baseadas em intuição. Com as métricas certas, você pode identificar em 10 minutos onde está o maior desperdício de receita e qual alavanca mover primeiro.</p>

<div class="callout-stat">
  <strong>Impacto dos dados:</strong> Clínicas que monitoram ativamente 5 ou mais KPIs de negócio crescem em média 28% mais rápido do que clínicas que operam apenas com visão de faturamento, segundo levantamento do setor de saúde privada no Brasil (2025).
</div>

<h2>Os 7 KPIs que Toda Clínica de Estética Deve Monitorar</h2>

<h3>KPI 1: LTV (Lifetime Value) por Paciente</h3>

<p>O LTV é a receita total que um paciente gera para sua clínica durante toda a relação com você. É o KPI mais estratégico porque revela quanto você pode investir para adquirir um novo paciente sem perder dinheiro.</p>

<p><strong>Fórmula:</strong></p>
<blockquote>LTV = Ticket médio por visita × Frequência de visitas por ano × Anos de retenção média</blockquote>

<p><strong>Benchmark brasileiro (2025):</strong></p>
<ul>
  <li>Clínicas de baixo desempenho: LTV de R$ 800-1.500 (1-2 procedimentos e abandono)</li>
  <li>Clínicas de médio desempenho: LTV de R$ 2.000-4.500</li>
  <li>Clínicas de alto desempenho: LTV de R$ 6.000-15.000+</li>
</ul>

<p><strong>Como melhorar:</strong> Programa de fidelização com procedimentos de manutenção periódica (botox a cada 4-6 meses, limpeza de pele a cada 30-45 dias), pacotes de múltiplas sessões, e upsell consultivo de protocolos complementares.</p>

<h3>KPI 2: Taxa de Retorno em 90 Dias</h3>

<p>Dos pacientes que fizeram o primeiro procedimento, qual percentual retornou em até 90 dias? Este KPI mede a qualidade da experiência de primeira consulta e a eficiência do follow-up pós-procedimento.</p>

<p><strong>Fórmula:</strong></p>
<blockquote>Taxa de retorno 90d = (Pacientes com 2ª visita em 90 dias ÷ Total de primeiras visitas) × 100</blockquote>

<p><strong>Benchmark:</strong></p>
<ul>
  <li>Abaixo de 25%: problema crítico de retenção</li>
  <li>25-45%: média do setor</li>
  <li>45-65%: bom desempenho</li>
  <li>Acima de 65%: excelente — clínica com forte programa de fidelização</li>
</ul>

<p><strong>Como melhorar:</strong> Recall automatizado 7 dias após o procedimento ("Como está o resultado?"), agendamento do retorno já na saída da primeira consulta, protocolo de manutenção com data definida.</p>

<h3>KPI 3: Custo de Aquisição por Canal</h3>

<p>Quanto você gasta para conseguir um novo paciente, separado por canal de origem (Instagram, Google Ads, indicação, eventos, etc.)? Sem esse dado, você não sabe onde colocar o próximo real de marketing.</p>

<p><strong>Fórmula:</strong></p>
<blockquote>CAC = Investimento no canal (período) ÷ Novos pacientes originados do canal (período)</blockquote>

<p><strong>Benchmark por canal (estimativa Brasil 2025):</strong></p>

<table>
  <thead>
    <tr>
      <th>Canal</th>
      <th>CAC médio</th>
      <th>LTV/CAC típico</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Indicação (boca a boca)</td>
      <td>R$ 0-50</td>
      <td>40-100x</td>
    </tr>
    <tr>
      <td>Instagram orgânico</td>
      <td>R$ 50-150</td>
      <td>15-40x</td>
    </tr>
    <tr>
      <td>Google Ads</td>
      <td>R$ 80-250</td>
      <td>10-25x</td>
    </tr>
    <tr>
      <td>Instagram Ads</td>
      <td>R$ 100-300</td>
      <td>8-20x</td>
    </tr>
    <tr>
      <td>Influencer/Parceria</td>
      <td>R$ 150-500</td>
      <td>5-15x</td>
    </tr>
  </tbody>
</table>

<p><strong>Como melhorar:</strong> Rastreamento de origem de cada novo paciente no cadastro (campo "como nos conheceu?"), UTM em links de campanha, atribuição de receita por canal.</p>

<h3>KPI 4: Taxa de No-Show por Profissional e Horário</h3>

<p>A taxa de no-show geral esconde padrões. Quando você segmenta por profissional, horário e procedimento, encontra as causas — e as soluções específicas. Para um guia completo de redução de no-show, veja <a href="/pt-BR/blog/como-reduzir-no-show-em-clinicas-de-estetica">nosso artigo dedicado ao tema</a>.</p>

<p><strong>Fórmula:</strong></p>
<blockquote>Taxa de no-show = (Agendamentos com falta ÷ Total de agendamentos) × 100</blockquote>

<p><strong>Benchmark:</strong> Média do setor estético no Brasil: 18-25%. Meta de referência: abaixo de 8%.</p>

<h3>KPI 5: Receita por Hora de Cadeira</h3>

<p>Este é o KPI de produtividade operacional. Mede quanto sua clínica gera de receita para cada hora de atendimento disponível — considerando horários ocupados e horários vazios.</p>

<p><strong>Fórmula:</strong></p>
<blockquote>Receita/hora cadeira = Faturamento do período ÷ (Horas de atendimento disponíveis no período)</blockquote>

<p><strong>Benchmark:</strong></p>
<ul>
  <li>Abaixo de R$ 80/h: ocupação e/ou precificação crítica</li>
  <li>R$ 80-150/h: média do setor</li>
  <li>R$ 150-300/h: boa produtividade</li>
  <li>Acima de R$ 300/h: clínica de alta performance (ticket alto + agenda cheia)</li>
</ul>

<p><strong>Como melhorar:</strong> Redução de no-show, otimização do mix de procedimentos (mais procedimentos de ticket alto), preenchimento de horários de baixo movimento com lista de espera.</p>

<h3>KPI 6: NPS Pós-Procedimento</h3>

<p>O Net Promoter Score mede a lealdade do paciente em uma pergunta: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossa clínica a um amigo ou familiar?" Promotores (9-10), Neutros (7-8), Detratores (0-6).</p>

<p><strong>Fórmula:</strong></p>
<blockquote>NPS = % Promotores − % Detratores</blockquote>

<p><strong>Benchmark:</strong></p>
<ul>
  <li>Abaixo de 30: problema de satisfação</li>
  <li>30-50: zona neutra</li>
  <li>50-70: bom</li>
  <li>Acima de 70: excelente — clínica com forte indicação orgânica</li>
</ul>

<p><strong>Como melhorar:</strong> Envio automático do NPS 48h após o procedimento via WhatsApp, resposta rápida a detratores (resolver o problema antes que virem reviews negativos), reconhecimento de promotores com programa de indicação.</p>

<h3>KPI 7: Margem por Procedimento</h3>

<p>Faturamento não é lucro. Muitas clínicas têm procedimentos de alto volume mas baixa margem que comprometem a rentabilidade total. Calcular a margem por procedimento revela quais tratamentos realmente constroem o negócio.</p>

<p><strong>Fórmula:</strong></p>
<blockquote>Margem % = ((Preço de venda − Custo direto) ÷ Preço de venda) × 100</blockquote>

<p>Custo direto inclui: insumos, comissão do profissional, tempo de uso do equipamento (depreciação).</p>

<p><strong>Benchmark por tipo de procedimento:</strong></p>

<table>
  <thead>
    <tr>
      <th>Procedimento</th>
      <th>Margem típica</th>
      <th>Principal custo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Toxina botulínica</td>
      <td>55-70%</td>
      <td>Insumo (toxina)</td>
    </tr>
    <tr>
      <td>Preenchimento facial</td>
      <td>50-65%</td>
      <td>Insumo (ácido hialurônico)</td>
    </tr>
    <tr>
      <td>Laser (depilação)</td>
      <td>65-80%</td>
      <td>Depreciação do equipamento</td>
    </tr>
    <tr>
      <td>Limpeza de pele</td>
      <td>70-85%</td>
      <td>Tempo do profissional</td>
    </tr>
    <tr>
      <td>Peeling químico</td>
      <td>75-88%</td>
      <td>Insumo (ácido)</td>
    </tr>
  </tbody>
</table>

<h2>Como Monitorar os 7 KPIs sem Virar Analista de Dados</h2>

<p>A maior barreira para o monitoramento de KPIs em clínicas não é a falta de dados — é a falta de sistema. Com dados em papel ou em planilhas desconectadas, calcular LTV por paciente leva horas. Com um sistema integrado, leva segundos.</p>

<p>O <a href="/pt-BR/features/analytics-pro">painel de analytics do Estetia CRM</a> (disponível no plano Pro) calcula automaticamente todos os 7 KPIs acima e os exibe em um dashboard atualizado em tempo real. Você define os benchmarks da sua clínica, e o sistema alerta quando um KPI sai da faixa desejada — sem precisar calcular manualmente.</p>

<div class="callout-tip">
  <strong>Por onde começar:</strong> Se você está começando agora, priorize LTV, taxa de retorno em 90 dias e no-show. São os 3 KPIs com maior impacto imediato na receita e mais fáceis de mover com ações específicas.
</div>

<h2>Perguntas Frequentes</h2>

<h3>Com que frequência devo revisar esses KPIs?</h3>
<p>No-show e taxa de ocupação: semanalmente (são operacionais). LTV, taxa de retorno e NPS: mensalmente. CAC por canal: mensalmente, mas com análise trimestral de tendência. Margem por procedimento: semestralmente ou ao mudar preços/fornecedores. Crie um ritual de revisão — 30 minutos na primeira segunda-feira de cada mês resolve.</p>

<h3>Como calcular LTV se ainda não tenho dados históricos suficientes?</h3>
<p>Comece com o que tem: ticket médio da última consulta × frequência esperada × 2 anos (estimativa conservadora de retenção). Atualize o número a cada trimestre com dados reais. Em 6-12 meses você terá uma base sólida para comparação.</p>

<h3>O NPS de clínica de estética é diferente do NPS de outras empresas?</h3>
<p>O cálculo é o mesmo, mas o benchmark muda. O setor de saúde e beleza tende a ter NPS mais alto (50-70) do que setores como telecomunicações (15-30) porque o serviço é pessoal e o impacto na autoestima é imediato. Se seu NPS está abaixo de 40, investigue os detratores — frequentemente há um problema específico e recorrente que pode ser corrigido.</p>
`,
}
