import { BlogPost } from '../../blog-types'

export const post: BlogPost = {
  slug: 'tiss-tuss-clinica-estetica-convenios',
  title: 'TISS e TUSS para Clínicas de Estética e Dermatologia: Guia de Integração com Convênios [2026]',
  excerpt: 'O que é TISS, o que é TUSS, quais procedimentos o convênio cobre, como montar o lote XML e as 7 causas mais comuns de glosa em clínicas de dermatologia.',
  date: '2026-07-12',
  lastModified: '2026-07-12',
  category: 'Compliance & LGPD',
  image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  imageAlt: 'Faturamento de convênios e guias TISS em clínica de dermatologia — integração com operadoras de saúde',
  author: 'Equipe Estetia',
  relatedSlugs: [
    'software-gestao-dermatologia-guia',
    'prontuario-eletronico-clinica-estetica',
    'lgpd-para-clinicas-de-estetica-guia-2026',
  ],
  content: `
<p>TISS e TUSS são os dois padrões que decidem se a sua clínica recebe ou não do convênio. O TISS define <em>como</em> a informação viaja até a operadora; o TUSS define <em>como cada procedimento se chama</em> nessa conversa. Errar um dos dois significa glosa — a operadora simplesmente não paga. Este guia explica o que são, quais clínicas realmente precisam deles, como funciona o faturamento na prática e o que fazer para não perder dinheiro no caminho.</p>

<div class="callout-warning">
  <strong>A verdade desconfortável primeiro:</strong> procedimento com finalidade <em>exclusivamente estética</em> não é coberto por plano de saúde. A exclusão está na Lei 9.656/1998 (art. 10, inciso II), que retira do plano-referência "procedimentos clínicos ou cirúrgicos para fins estéticos". Ou seja: harmonização facial, botox de rejuvenescimento, preenchimento e criolipólise são <strong>particular</strong>, ponto final. TISS só entra na sua vida se a clínica também faz <strong>dermatologia clínica</strong> ou procedimentos com indicação terapêutica.
</div>

<h2>O que é TISS</h2>

<p>TISS é a sigla de <strong>Troca de Informação em Saúde Suplementar</strong> — o padrão obrigatório definido pela ANS (Agência Nacional de Saúde Suplementar) para a comunicação eletrônica entre prestadores (sua clínica) e operadoras (o convênio). Antes dele, cada operadora tinha seu próprio formulário e seu próprio jeito de receber a conta. O TISS padronizou tudo: as guias, os campos, o formato do arquivo e o protocolo de envio.</p>

<p>Na prática, o TISS é um pacote de quatro componentes:</p>

<ul>
  <li><strong>Componente organizacional</strong> — quais guias existem e quando usar cada uma.</li>
  <li><strong>Componente de conteúdo e estrutura</strong> — as tabelas de domínio (é aqui que mora o TUSS).</li>
  <li><strong>Componente de comunicação</strong> — o XML e o web service pelo qual o lote é transmitido.</li>
  <li><strong>Componente de segurança e privacidade</strong> — o que amarra o TISS à LGPD e ao sigilo do dado de saúde.</li>
</ul>

<p>O padrão é versionado e evolui por Instrução Normativa da ANS. O Estetia opera na versão <strong>4.01.00</strong>, mas a regra de ouro é sempre a mesma: <strong>confirme a versão vigente e a que a operadora aceita antes de gerar o lote</strong>. Enviar em versão errada é rejeição na porta — o arquivo nem chega a ser analisado.</p>

<h2>O que é TUSS (e por que ele é a parte que mais dói)</h2>

<p>TUSS é a <strong>Terminologia Unificada da Saúde Suplementar</strong>: a tabela de códigos que dá nome único a cada procedimento, material, medicamento e taxa. É um <em>componente</em> do TISS, não um padrão concorrente. A tabela mais usada no dia a dia da clínica é a de procedimentos e eventos em saúde.</p>

<p>O TUSS existe porque "exérese de lesão" pode ter dez nomes diferentes em dez clínicas — e a operadora precisa de um só. Quando você digita o código TUSS errado, acontece uma de três coisas: a operadora paga o valor de outro procedimento (menor), glosa por incompatibilidade, ou paga e depois audita e cobra de volta. Nenhuma das três é boa.</p>

<div class="callout-tip">
  <strong>Regra prática:</strong> a codificação TUSS não é trabalho da recepção. É trabalho de quem entende clinicamente o que foi feito. Clínicas que terceirizam a codificação para a secretária "porque ela tem tempo" são as que mais glosam. O sistema deve sugerir o código a partir do procedimento registrado no prontuário — não pedir que alguém o digite de memória.
</div>

<table>
  <thead>
    <tr><th>&nbsp;</th><th>TISS</th><th>TUSS</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>O que é</strong></td><td>O padrão de troca de informação</td><td>A terminologia (tabela de códigos)</td></tr>
    <tr><td><strong>Responde</strong></td><td>Como enviar</td><td>O que foi feito</td></tr>
    <tr><td><strong>Formato</strong></td><td>Guias + XML + web service</td><td>Códigos numéricos padronizados</td></tr>
    <tr><td><strong>Erro típico</strong></td><td>Lote rejeitado (versão/estrutura)</td><td>Glosa por código incompatível</td></tr>
    <tr><td><strong>Relação</strong></td><td>Contém o TUSS</td><td>É um componente do TISS</td></tr>
  </tbody>
</table>

<h2>Sua clínica precisa mesmo de TISS?</h2>

<p>Responda a três perguntas. Se a resposta for "não" para todas, você não precisa de TISS — e implementar faturamento de convênio seria queimar dinheiro para resolver um problema que você não tem.</p>

<ol>
  <li><strong>A clínica tem médico dermatologista (ou outro especialista) atendendo consulta clínica?</strong> Consulta em consultório é o item mais elementar de cobertura.</li>
  <li><strong>A clínica realiza procedimentos com indicação terapêutica</strong> — lesões de pele, cirurgia dermatológica de pequeno porte, biópsia, tratamentos com finalidade médica documentada?</li>
  <li><strong>A clínica é credenciada (ou pretende se credenciar) a alguma operadora?</strong> Sem contrato de credenciamento, não existe faturamento — TISS não é um canal aberto a qualquer prestador.</li>
</ol>

<p>Clínica de estética pura — que faz protocolos faciais e corporais com finalidade estética — responde "não" às três. Nesse caso o caminho é outro: precificação, pacotes e recorrência particular, assunto que tratamos no <a href="/blog/crm-para-clinica-de-estetica-guia-completo">guia de CRM para clínica de estética</a>.</p>

<p>Já a <strong>clínica de dermatologia</strong> — ou a clínica híbrida, que faz dermato clínica no convênio e estética no particular — responde "sim" e precisa levar TISS a sério, porque parte relevante do faturamento passa por ali. Esse cenário híbrido é, aliás, o mais comum no Brasil, e é o que mais gera confusão contábil: o mesmo paciente, na mesma cadeira, pode gerar uma guia de convênio de manhã e uma venda particular à tarde.</p>

<h2>Como funciona o faturamento TISS, do agendamento ao dinheiro na conta</h2>

<p>O ciclo tem sete etapas. Cada uma delas é um ponto onde a receita pode evaporar.</p>

<ol>
  <li><strong>Elegibilidade</strong> — antes do atendimento, verifique se a carteirinha está ativa e o beneficiário tem cobertura. Atender primeiro e descobrir depois que o plano estava suspenso é prejuízo puro.</li>
  <li><strong>Autorização prévia</strong> — procedimentos que exigem senha da operadora precisam dela <em>antes</em> da execução. Autorização retroativa quase nunca é aceita.</li>
  <li><strong>Execução e registro clínico</strong> — o que sustenta a cobrança é o prontuário. Sem descrição do que foi feito e da indicação clínica, a auditoria da operadora glosa.</li>
  <li><strong>Preenchimento da guia</strong> — consulta, SP/SADT (serviço profissional / serviço auxiliar de diagnóstico e terapia) ou a guia adequada ao evento.</li>
  <li><strong>Montagem do lote XML</strong> — as guias do período são agrupadas em um lote no formato TISS e validadas contra o schema.</li>
  <li><strong>Envio e protocolo</strong> — o lote é transmitido e a operadora devolve um protocolo. <strong>Sem protocolo, não existe cobrança</strong> — guarde-o como se fosse dinheiro, porque é.</li>
  <li><strong>Demonstrativo de pagamento e glosa</strong> — a operadora informa o que pagou, o que glosou e por quê. Aqui começa o recurso.</li>
</ol>

<div class="callout-stat">
  <strong>Onde as clínicas perdem sem perceber:</strong> a glosa não é o único custo do convênio. O convênio paga <em>menos</em> por procedimento que o particular e paga <em>mais tarde</em> (o prazo é contratual, e não é curto). Some a isso o custo administrativo de operar o ciclo acima. Uma agenda cheia de convênio pode faturar mais e sobrar menos — quem decide isso é a sua margem, não o seu movimento.
</div>

<p><a href="/register">Teste o Estetia CRM grátis por 14 dias →</a> — geração de guias e lote TISS 4.01.00 a partir do prontuário, sem redigitar nada.</p>

<h2>Glosas: por que a operadora simplesmente não paga</h2>

<p>Glosa é a recusa — total ou parcial — do pagamento de um item já executado. Ela vem em três sabores:</p>

<ul>
  <li><strong>Glosa administrativa</strong> — erro de forma: campo faltando, dado do beneficiário divergente, guia fora do prazo de envio, ausência de autorização.</li>
  <li><strong>Glosa técnica</strong> — a operadora questiona o mérito: procedimento incompatível com o diagnóstico, quantidade acima do previsto, ausência de justificativa clínica.</li>
  <li><strong>Glosa linear</strong> — corte percentual aplicado pela operadora sobre a conta, que precisa ser contestado item a item.</li>
</ul>

<p>As causas mais comuns, na ordem em que aparecem no dia a dia de uma clínica de dermatologia:</p>

<ol>
  <li>Código TUSS incompatível com o procedimento descrito no prontuário.</li>
  <li>Falta de autorização prévia para item que exigia senha.</li>
  <li>Divergência de dados do beneficiário (nome, carteirinha, validade).</li>
  <li>Guia enviada fora do prazo contratual de faturamento.</li>
  <li>Ausência de justificativa clínica para procedimento que exige indicação médica.</li>
  <li>Duplicidade — o mesmo item cobrado duas vezes no lote.</li>
  <li>Divergência entre o que foi autorizado e o que foi efetivamente executado.</li>
</ol>

<div class="callout-warning">
  <strong>Glosa não recorrida é glosa aceita.</strong> A maior perda das clínicas pequenas não é a glosa em si — é a glosa que ninguém contestou porque "dava trabalho". Todo demonstrativo tem prazo de recurso. Se ninguém na clínica é dono desse processo, o dinheiro fica com a operadora por desistência.
</div>

<h2>Como evitar glosa: o checklist que resolve 80% do problema</h2>

<ul>
  <li>Conferir <strong>elegibilidade antes do atendimento</strong>, não depois.</li>
  <li>Pedir autorização prévia para tudo que exige senha — e guardar o número.</li>
  <li>Codificar o TUSS <strong>a partir do prontuário</strong>, nunca de memória.</li>
  <li>Registrar a <strong>indicação clínica</strong> por escrito em todo procedimento terapêutico.</li>
  <li>Validar o XML contra o schema <strong>antes</strong> de enviar (lote rejeitado atrasa o ciclo inteiro).</li>
  <li>Fechar o faturamento em <strong>data fixa</strong> do mês, não "quando der".</li>
  <li>Arquivar todo protocolo de envio e todo demonstrativo.</li>
  <li>Ter <strong>uma pessoa responsável</strong> pelo recurso de glosa, com prazo na agenda.</li>
</ul>

<h2>O prontuário eletrônico é a base do TISS — não um item separado</h2>

<p>Quase toda glosa técnica nasce de uma lacuna no registro clínico. A operadora não glosa porque o procedimento não foi feito; glosa porque <em>não dá para provar</em> que foi feito, com aquela indicação, naquele paciente. É por isso que faturamento de convênio e <a href="/blog/prontuario-eletronico-clinica-estetica">prontuário eletrônico</a> não são dois projetos: são o mesmo projeto.</p>

<p>Quando a guia é gerada a partir do prontuário, três coisas acontecem sozinhas: o procedimento executado vira o código TUSS correto, a justificativa clínica já está escrita, e a data e o profissional executante batem com o registro. Quando a guia é digitada à mão em uma planilha, cada um desses três vira uma chance de erro.</p>

<p>E há o outro lado: dado de saúde é dado pessoal sensível. Trafegar guia por e-mail, WhatsApp ou planilha compartilhada é problema de LGPD, não só de eficiência — o assunto está detalhado no <a href="/blog/lgpd-para-clinicas-de-estetica-guia-2026">guia de LGPD para clínicas</a>.</p>

<h2>Convênio vale a pena? A conta que quase ninguém faz</h2>

<p>Convênio traz <strong>volume</strong>; particular traz <strong>margem</strong>. A decisão não é ideológica — é aritmética. Antes de assinar (ou renovar) um credenciamento, calcule:</p>

<ul>
  <li><strong>Valor líquido por hora de cadeira</strong> no convênio, já descontadas as glosas históricas — e compare com o particular.</li>
  <li><strong>Prazo médio de recebimento</strong> e o efeito dele no capital de giro.</li>
  <li><strong>Custo administrativo</strong> do ciclo TISS (horas/mês de alguém preenchendo, enviando e recorrendo).</li>
  <li><strong>Valor estratégico</strong> do convênio como porta de entrada: o paciente que chega pelo plano para uma consulta dermatológica pode virar paciente particular de estética depois. Para muitas clínicas híbridas, esse é o verdadeiro ROI do convênio — e ele só existe se houver um processo de conversão, não sorte.</li>
</ul>

<p>Se a conta der negativa em todos os itens, credenciar-se é comprar trabalho. Rode os números na <a href="/ferramentas/calculadora-roi">calculadora de ROI</a> antes de decidir.</p>

<h2>Perguntas Frequentes sobre TISS e TUSS</h2>

<h3>O que é TISS?</h3>
<p>TISS (Troca de Informação em Saúde Suplementar) é o padrão da ANS que define como prestadores e operadoras de plano de saúde trocam informação de atendimento e cobrança: quais guias existem, quais campos elas têm, em que formato o arquivo é enviado e como o dado é protegido. É obrigatório para a comunicação eletrônica entre clínica credenciada e convênio.</p>

<h3>Qual a diferença entre TISS e TUSS?</h3>
<p>O TISS é o padrão de troca (como a informação viaja). O TUSS é a terminologia (o nome e o código de cada procedimento, material ou medicamento). O TUSS é um componente do TISS, não um padrão paralelo. Resumindo: o TISS diz <em>como enviar</em>; o TUSS diz <em>o que foi feito</em>.</p>

<h3>Clínica de estética precisa de TISS?</h3>
<p>Clínica de estética pura, não. Procedimentos com finalidade exclusivamente estética são excluídos da cobertura obrigatória pela Lei 9.656/1998 (art. 10, II) — logo, não há convênio para faturar. TISS é necessário para clínicas de dermatologia, clínicas híbridas ou qualquer clínica credenciada que realize atendimento com indicação terapêutica.</p>

<h3>Convênio cobre harmonização facial ou botox?</h3>
<p>Não, quando a finalidade é estética. A mesma substância pode ser coberta em indicação terapêutica documentada (o caso clássico é o uso terapêutico da toxina botulínica em condições específicas), mas aí a cobertura decorre da doença tratada e do rol aplicável — não do procedimento estético. Rejuvenescimento, preenchimento e harmonização são particular.</p>

<h3>O que é glosa e quais são os tipos?</h3>
<p>Glosa é a recusa total ou parcial de pagamento pela operadora. Há três tipos: administrativa (erro de forma — campo faltando, dado divergente, prazo perdido), técnica (a operadora questiona o mérito clínico do que foi cobrado) e linear (corte percentual aplicado sobre a conta, que precisa ser contestado item a item).</p>

<h3>Como evitar glosas no faturamento TISS?</h3>
<p>Cinco medidas resolvem a maior parte: conferir elegibilidade antes do atendimento; obter e registrar autorização prévia quando exigida; codificar o TUSS a partir do prontuário (nunca de memória); registrar a indicação clínica por escrito; e validar o XML contra o schema antes de enviar. Some a isso um responsável nomeado para recorrer de toda glosa dentro do prazo.</p>

<h3>Qual a versão atual do padrão TISS?</h3>
<p>O padrão é versionado e atualizado periodicamente pela ANS por Instrução Normativa — o Estetia opera na versão 4.01.00. Como cada operadora tem seu próprio calendário de adoção, a prática correta é confirmar a versão vigente na ANS e a versão aceita pela operadora antes de gerar o lote. Enviar em versão incorreta causa rejeição do arquivo inteiro.</p>

<h3>O que acontece se eu enviar a guia fora do prazo?</h3>
<p>O prazo de apresentação da conta é contratual, definido no credenciamento. Guia enviada fora dele costuma ser glosada por prazo — e essa é uma das glosas mais difíceis de reverter, porque o erro é da clínica e é objetivo. Por isso o faturamento deve ter data fixa de fechamento no mês, e não depender de sobra de tempo da equipe.</p>

<h3>Preciso de software específico para faturar TISS?</h3>
<p>Precisa de um sistema capaz de gerar a guia e o lote XML no padrão da ANS e validá-lo antes do envio. Fazer isso em planilha é possível na teoria e insustentável na prática: o XML tem estrutura rígida, o padrão muda e o volume de campos torna o erro humano quase inevitável. O ganho real vem quando a guia nasce do prontuário, sem redigitação.</p>

<h3>Clínica híbrida pode atender convênio e particular no mesmo espaço?</h3>
<p>Pode, e é o modelo mais comum em dermatologia. O cuidado é operacional e contábil: separar claramente o que é atendimento coberto (com guia, autorização e prontuário sustentando a cobrança) do que é venda particular (com contrato, política de pagamento e recibo). Misturar os dois fluxos no mesmo registro é a origem de glosa, de erro fiscal e de conflito com o paciente sobre o que ele deve pagar.</p>

<p>Quer gerar guias e lotes TISS 4.01.00 direto do prontuário, com código TUSS sugerido pelo procedimento e controle de glosa por operadora? <a href="/register">Comece seu teste gratuito de 14 dias no Estetia CRM →</a></p>
`,
}
