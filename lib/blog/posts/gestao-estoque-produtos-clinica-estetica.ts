import { BlogPost } from '../../blog-types'

export const post: BlogPost = {
  slug: 'gestao-estoque-produtos-clinica-estetica',
  title: 'Gestão de Estoque em Clínica de Estética: Como Controlar Produtos, Validade e Custos em 2026',
  excerpt: 'Como controlar estoque de injetáveis e cosméticos em clínica de estética: validade, temperatura, rastreabilidade ANVISA, custo por procedimento e alertas automáticos de reposição.',
  date: '2026-05-31',
  lastModified: '2026-05-31',
  category: 'Gestão Clínica',
  image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80',
  imageAlt: 'Estoque organizado de produtos cosméticos e injetáveis em clínica de estética com controle de temperatura e validade',
  author: 'Equipe Estetia',
  relatedSlugs: [
    'prontuario-eletronico-clinica-estetica',
    'lgpd-para-clinicas-de-estetica-guia-2026',
    'kpis-essenciais-clinica-de-estetica',
  ],
  content: `
<p>A gestão de estoque é um dos pontos cegos mais custosos de clínicas de estética no Brasil. Durante operação de fiscalização da ANVISA em 2025, agentes encontraram em diversas clínicas: toxinas botulínicas e anestésicos com prazo de validade vencido, produtos injetáveis estéreis abertos para reutilização, e equipamentos sem certificação vigente (ANVISA/APM, 2025). Além do risco sanitário e das multas, o impacto financeiro do controle inadequado de estoque é silencioso mas significativo: produtos vencidos representam prejuízo direto; ausência de controle de custo por procedimento inviabiliza a precificação correta; pedidos de reposição em urgência aumentam o custo de compra. Este guia apresenta o sistema de controle de estoque que toda clínica de estética precisaria ter — e que as melhores já têm.</p>

<div class="callout-warning">
  <strong>ANVISA fiscaliza e multa:</strong> A ANVISA (Nota Técnica nº 2/2024/GGTES) estabelece exigências específicas para serviços de estética: produtos com registro válido, armazenagem conforme temperatura indicada pelo fabricante, controle de validade e lote, rastreabilidade de injetáveis. Em 2025, operação nacional de fiscalização encontrou irregularidades em grande parte das clínicas inspecionadas. Regularidade no estoque não é burocracia — é proteção do paciente e do negócio.
</div>

<h2>Os 4 Tipos de Produto que Precisam de Controle Diferenciado</h2>

<h3>1. Injetáveis (Toxinas, Preenchedores, Bioestimuladores, Enzimas)</h3>
<p>Exigem atenção máxima: prazo de validade curto (geralmente 18–36 meses), temperatura de armazenamento específica (toxina botulínica: 2–8°C; alguns preenchedores: temperatura ambiente controlada), rastreabilidade por lote obrigatória, e uso restrito à dose indicada por aplicação (sem reutilização de produto já aberto). O controle de lote é essencial para rastreabilidade em caso de evento adverso.</p>

<h3>2. Materiais Descartáveis por Procedimento</h3>
<p>Agulhas, seringas, luvas, campos cirúrgicos — consumo proporcional ao número de procedimentos. O controle deve ser por procedimento: "cada toxina usa X agulhas e Y seringas". Isso permite calcular o custo por procedimento com precisão e planejar a reposição por volume de agenda.</p>

<h3>3. Cosméticos e Ativos de Procedimento</h3>
<p>Peelings, ácidos, soros para drug delivery, produtos de microagulhamento — vida útil variável (3 meses a 2 anos), armazenamento em local fresco e sem exposição à luz. Controlar por frasco aberto vs. fechado, porque o prazo de validade muda após abertura (geralmente 6–12 meses após aberto).</p>

<h3>4. Produtos de Aparelho e Consumíveis de Equipamento</h3>
<p>Cartuchos de HIFU, géis condutores de radiofrequência, filtros de equipamentos de laser — consumo por sessão, custo variável por tipo de aparelho. Inclua no custo do procedimento para não comprometer a margem.</p>

<h2>O Sistema de Controle: 5 Processos Básicos</h2>

<h3>Processo 1: Registro de Entrada com Lote e Validade</h3>
<p>Cada produto que entra no estoque deve ser registrado com: produto, fornecedor, número de lote (consta na embalagem), data de validade, quantidade, data de entrada e nota fiscal. Esse registro é a base da rastreabilidade exigida pela ANVISA e permite recuperar informações em caso de recall de produto pelo fabricante.</p>

<h3>Processo 2: Controle de Temperatura e Condições de Armazenamento</h3>
<p>Para produtos refrigerados (principalmente toxina botulínica), a ANVISA exige câmara refrigerada com registro diário de temperatura. A faixa correta (2–8°C para toxina) deve ser verificada e registrada diariamente pela responsável técnica. Um termômetro digital com alarme de temperatura custa R$ 80–200 e evita perda de todo o estoque refrigerado em caso de falha do equipamento.</p>

<table>
  <thead>
    <tr>
      <th>Tipo de Produto</th>
      <th>Temperatura de Armazenamento</th>
      <th>Ação em Caso de Desvio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Toxina botulínica</td>
      <td>2–8°C (refrigerador)</td>
      <td>Não usar — contactar fabricante para orientação</td>
    </tr>
    <tr>
      <td>Preenchedores AH</td>
      <td>Temperatura ambiente 15–25°C (maioria)</td>
      <td>Verificar bula de cada produto</td>
    </tr>
    <tr>
      <td>Peelings e ácidos</td>
      <td>Local fresco, sem exposição ao sol</td>
      <td>Descartar se houver alteração de cor/consistência</td>
    </tr>
    <tr>
      <td>Descartáveis (agulhas, seringas)</td>
      <td>Temperatura ambiente, local seco</td>
      <td>Verificar integridade da embalagem antes do uso</td>
    </tr>
  </tbody>
</table>

<h3>Processo 3: Controle de Validade com Alerta Antecipado</h3>
<p>Nunca esperar o produto vencer para perceber. Configure alerta de 90 dias antes do vencimento: o produto com vencimento próximo deve ser usado prioritariamente (sistema FEFO — First Expired, First Out) e não pode ser mais solicitado em grandes quantidades. Estoque muito alto de produto próximo ao vencimento = prejuízo certo.</p>

<h3>Processo 4: Custo por Procedimento</h3>
<p>Para cada procedimento, defina o custo padrão de insumo: "uma sessão de toxina de glabela consome X unidades de toxina (R$ Y) + 2 agulhas (R$ Z) + luvas (R$ W) = custo de insumo R$ total". Esse número é o piso da precificação — o procedimento não pode ser vendido abaixo desse custo mais o overhead da sala e do profissional.</p>

<h3>Processo 5: Ponto de Reposição Automático</h3>
<p>Para cada produto, defina o estoque mínimo (ponto de reposição). Quando o estoque atingir esse nível, o pedido de reposição deve ser disparado automaticamente — sem depender de alguém perceber que o produto acabou. Para toxina botulínica especificamente, o ponto de reposição deve considerar o prazo de entrega do fornecedor (geralmente 2–5 dias) mais uma margem de segurança de 1 semana de consumo.</p>

<div class="callout-tip">
  <strong>No Estetia CRM:</strong> O módulo de estoque registra produtos por lote e validade, alerta sobre vencimentos próximos, calcula o custo de insumo por procedimento automaticamente e dispara notificação quando o estoque atinge o ponto de reposição configurado. <a href="/register">Testar grátis →</a>
</div>

<h2>Rastreabilidade por Lote: Por Que É Obrigatória</h2>

<p>A rastreabilidade de injetáveis por lote permite que, em caso de evento adverso com um paciente, você consiga identificar: qual produto foi usado, de qual lote, e quantos outros pacientes receberam produto do mesmo lote. Isso é exigido pela ANVISA e é clinicamente fundamental para gestão de incidentes.</p>

<p>Na prática, cada prontuário de paciente que recebeu injetável deve registrar: produto utilizado, número de lote, data de validade e quantidade. Com o registro vinculado ao prontuário, uma busca por lote retorna todos os pacientes que receberam aquele produto — informação crítica em caso de recall do fabricante.</p>

<h2>Inventário Periódico: Como Fazer sem Parar a Clínica</h2>

<p>Inventário não precisa ser o processo temido que toma um dia inteiro da operação. Com controle digital contínuo, o inventário mensal é uma conferência rápida:</p>

<ol>
  <li>Gerar relatório de saldo atual no sistema</li>
  <li>Contar fisicamente os produtos de maior valor (injetáveis) — 15–20 minutos</li>
  <li>Identificar divergências (quebras, perdas, uso não registrado)</li>
  <li>Corrigir o saldo e investigar a causa das divergências</li>
</ol>

<p>Divergências frequentes entre o saldo do sistema e o físico indicam que os registros de uso não estão sendo feitos corretamente — o que compromete o cálculo de custo por procedimento e a rastreabilidade.</p>

<h2>Métricas de Gestão de Estoque</h2>

<ul>
  <li><strong>Giro de estoque</strong>: velocidade com que cada produto é consumido. Produto parado por mais de 60 dias é capital imobilizado sem necessidade.</li>
  <li><strong>Taxa de perda por vencimento</strong>: valor de produtos descartados por vencimento / valor total de compras. Meta: abaixo de 1%.</li>
  <li><strong>Custo de insumo / faturamento</strong>: meta saudável para estética: 15–25% do faturamento. Acima disso, revisar precificação ou gestão de compras.</li>
  <li><strong>Tempo médio sem estoque</strong>: horas em que a clínica ficou sem produto para realizar um procedimento agendado (indica falha no ponto de reposição).</li>
</ul>

<h2>Perguntas Frequentes sobre Gestão de Estoque em Clínica de Estética</h2>

<h3>A ANVISA exige controle de estoque para clínicas de estética?</h3>
<p>Sim. A Nota Técnica nº 2/2024/GGTES/ANVISA estabelece exigências específicas para serviços de estética, incluindo: produtos com registro válido na ANVISA, armazenagem conforme temperatura indicada, controle de validade e lote, e rastreabilidade de injetáveis. Em operação de fiscalização de 2025, a ANVISA encontrou irregularidades recorrentes como produtos vencidos e injetáveis reutilizados — o que resultou em multas e interdições.</p>

<h3>Como controlar a validade de toxina botulínica corretamente?</h3>
<p>A toxina botulínica requer refrigeração entre 2–8°C, com registro diário de temperatura. O controle de validade deve ser por lote, usando o sistema FEFO (First Expired, First Out) — produto com vencimento mais próximo é usado primeiro. Configure alerta de 90 dias antes do vencimento para não ser surpreendido. Uma vez aberto o frasco, a toxina deve ser usada dentro do prazo indicado pelo fabricante (geralmente no mesmo dia, em algumas formulações até 48h).</p>

<h3>Como calcular o custo de insumo de um procedimento estético?</h3>
<p>Some todos os materiais consumidos no procedimento: produto principal (valor do frasco ÷ número de aplicações por frasco), materiais descartáveis (agulhas, seringas, luvas), consumíveis de equipamento (géis, cartuchos) e materiais de assepsia. Esse é o custo direto de insumo. Para a precificação, adicione overhead de sala (aluguel/hora), custo do profissional (salário + encargos ÷ horas produtivas) e margem de lucro desejada.</p>

<h3>Qual é o custo médio de insumos como percentual do faturamento em clínicas de estética?</h3>
<p>O parâmetro saudável é de 15–25% do faturamento em insumos, dependendo do mix de procedimentos. Clínicas com alto volume de injetáveis (toxina, preenchimento, bioestimuladores) tendem para a faixa de 20–25%; clínicas com foco em aparelhos (RF, HIFU, laser) tendem para 10–18%, pois o custo direto é menor (principalmente descartáveis e consumíveis de aparelho). Custos de insumo acima de 30% indicam precificação abaixo do custo ou perdas de estoque significativas.</p>

<p>Quer controlar estoque por lote e validade, calcular custo por procedimento automaticamente e receber alertas de reposição? <a href="/register">Comece seu teste gratuito de 14 dias no Estetia CRM →</a></p>
`,
}
