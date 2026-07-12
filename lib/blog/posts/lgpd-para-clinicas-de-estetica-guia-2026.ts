import { BlogPost } from '../../blog-types'

export const post: BlogPost = {
  slug: 'lgpd-para-clinicas-de-estetica-guia-2026',
  title: 'LGPD para Clínicas de Estética: Guia Prático 2026 (Checklist + Templates)',
  excerpt: 'A ANPD pode multar clínicas em até 2% do faturamento. Guia completo com 6 pontos críticos, checklist de conformidade e templates prontos para fotos antes/depois, prontuários e gestão de consentimento.',
  date: '2026-05-06',
  lastModified: '2026-06-05',
  category: 'Compliance & LGPD',
  image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&q=80',
  imageAlt: 'Proteção de dados e conformidade LGPD em clínicas de estética — guia prático 2026',
  author: 'Equipe Estetia',
  relatedSlugs: [
    'anamnese-digital-clinica-de-estetica',
    'kpis-essenciais-clinica-de-estetica',
  ],
  content: `
<p>A Lei Geral de Proteção de Dados (Lei 13.709/2018) não foi feita pensando em clínicas de estética — mas se aplica a elas com força total. Prontuários, fotos antes/depois, dados de saúde, histórico de procedimentos: tudo isso é dado sensível nos termos da LGPD, sujeito às exigências mais rígidas da lei. E o não-cumprimento pode custar caro.</p>

<div class="callout-stat">
  <strong>Risco financeiro:</strong> A ANPD (Autoridade Nacional de Proteção de Dados) pode aplicar multas de até 2% do faturamento bruto da empresa, limitadas a R$ 50 milhões por infração. Para uma clínica com R$ 50.000/mês de faturamento, isso representa até R$ 12.000 de multa por ocorrência.
</div>

<p>Além da multa, o dano à reputação de uma clínica que vaza fotos antes/depois de pacientes é incalculável. Este guia cobre os 6 pontos críticos de conformidade específicos para o setor estético — com orientações práticas que você pode implementar sem advogado.</p>

<h2>Por que Clínicas de Estética Têm Exposição Especial à LGPD</h2>

<p>A LGPD distingue entre dados pessoais comuns (nome, e-mail, telefone) e dados pessoais sensíveis. Clínicas de estética trabalham predominantemente com dados da segunda categoria:</p>

<ul>
  <li><strong>Dados de saúde:</strong> histórico de doenças, alergias, medicamentos em uso</li>
  <li><strong>Dados biométricos:</strong> fotos faciais para análise de resultados (entram como biometria)</li>
  <li><strong>Dados genéticos:</strong> laudos de exames em alguns tratamentos dermatológicos</li>
  <li><strong>Dados sobre origem étnica/racial:</strong> relevante em protocolos de harmonização</li>
</ul>

<p>Para dados sensíveis, a LGPD exige consentimento específico, livre, informado e inequívoco. Um formulário de anamnese genérico com "autorizo o uso dos meus dados" não é suficiente.</p>

<h2>Os 6 Pontos Críticos de Conformidade para Clínicas</h2>

<h3>1. Consentimento Explícito para Fotos e Vídeos Antes/Depois</h3>

<p>Fotos para documentação interna têm base legal no legítimo interesse clínico. Mas o uso dessas fotos para marketing (redes sociais, site, portfólio) exige consentimento específico e destacado, separado do consentimento clínico.</p>

<div class="callout-warning">
  <strong>Erro comum:</strong> Incluir autorização de uso de imagem no mesmo documento que o termo de consentimento do procedimento. A LGPD exige que consentimentos para finalidades distintas sejam separados e que a recusa de um não impeça o outro.
</div>

<p><strong>Template de autorização de uso de imagem:</strong></p>

<blockquote>
  <em>"Autorizo a [Nome da Clínica], inscrita no CNPJ [XX], a utilizar fotos e vídeos produzidos durante meu atendimento para as seguintes finalidades: [ ] Documentação interna do prontuário [ ] Publicação em redes sociais [ ] Publicação no site da clínica [ ] Material de treinamento. Esta autorização é revogável a qualquer momento mediante comunicação escrita e não afeta a realização do procedimento."</em>
</blockquote>

<h3>2. Bases Legais para Guarda do Histórico Clínico</h3>

<p>A CFM (Conselho Federal de Medicina) e o CFF (Conselho Federal de Farmácia) determinam o prazo mínimo de guarda de prontuários em 20 anos após o último atendimento (CFM Resolução 1.821/2007). A LGPD respeita obrigações legais — você <em>deve</em> guardar os prontuários por 20 anos, mesmo que o paciente solicite a exclusão dos dados.</p>

<p>A base legal para tratamento de dados de saúde em prontuários é a <strong>obrigação legal</strong> (art. 7º, II da LGPD) e o <strong>exercício regular de direito</strong> (art. 7º, VI) — não o consentimento. Isso é importante porque significa que você pode manter o prontuário mesmo se o paciente revogar o consentimento para marketing.</p>

<h3>3. Política de Retenção e Descarte</h3>

<p>Você precisa ter documentado, para cada tipo de dado que coleta:</p>

<table>
  <thead>
    <tr>
      <th>Tipo de Dado</th>
      <th>Prazo de Retenção</th>
      <th>Base Legal</th>
      <th>Descarte</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Prontuário clínico</td>
      <td>20 anos após último atendimento</td>
      <td>CFM Res. 1.821/2007</td>
      <td>Eliminação segura com registro</td>
    </tr>
    <tr>
      <td>Fotos para prontuário</td>
      <td>20 anos (vinculado ao prontuário)</td>
      <td>Legítimo interesse + obrigação legal</td>
      <td>Com o prontuário</td>
    </tr>
    <tr>
      <td>Fotos para marketing</td>
      <td>Enquanto autorização vigente</td>
      <td>Consentimento</td>
      <td>Imediato após revogação</td>
    </tr>
    <tr>
      <td>Dados de contato (marketing)</td>
      <td>Até revogação de consentimento</td>
      <td>Consentimento</td>
      <td>Em até 15 dias após solicitação</td>
    </tr>
    <tr>
      <td>Dados financeiros</td>
      <td>5 anos (obrigação fiscal)</td>
      <td>Código Tributário Nacional</td>
      <td>Após vencimento do prazo fiscal</td>
    </tr>
  </tbody>
</table>

<h3>4. Direito ao Esquecimento vs. Registro Médico-Legal</h3>

<p>Pacientes têm direito de solicitar a eliminação de seus dados (art. 18, IV da LGPD). Mas esse direito não é absoluto — ele cede quando há obrigação legal de retenção. A resposta correta para um pedido de eliminação de prontuário é:</p>

<div class="callout-tip">
  <strong>Script de resposta:</strong> "Conforme a Resolução CFM 1.821/2007, somos obrigados a manter seu prontuário clínico pelo prazo de 20 anos após o último atendimento. Seus dados de saúde não podem ser eliminados neste período, mas podemos excluir seus dados de contato de nossas listas de comunicação de marketing. Você gostaria que fizéssemos isso?"
</div>

<p>Esse script transforma um pedido potencialmente conflituoso em uma oportunidade de demonstrar transparência e compliance.</p>

<h3>5. Segurança Técnica: Os Requisitos Mínimos</h3>

<p>A LGPD exige "medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados". Para clínicas de estética, os requisitos mínimos são:</p>

<ul>
  <li><strong>Criptografia em trânsito:</strong> HTTPS em todos os sistemas que lidam com dados de pacientes</li>
  <li><strong>Criptografia em repouso:</strong> Banco de dados de pacientes criptografado</li>
  <li><strong>Controle de acesso por perfil:</strong> Recepcionista não acessa prontuário; profissional não acessa dados financeiros</li>
  <li><strong>Log de auditoria:</strong> Registro de quem acessou, editou ou exportou dados de pacientes</li>
  <li><strong>Senhas robustas + 2FA:</strong> Para sistemas com dados sensíveis</li>
  <li><strong>Backup criptografado:</strong> Em local físico separado do servidor principal</li>
</ul>

<h3>6. Protocolo de Resposta a Vazamento</h3>

<p>Se ocorrer um incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a LGPD exige comunicação à ANPD e ao titular em prazo razoável — interpretado pelo regulador como <strong>72 horas</strong> (alinhado ao GDPR europeu).</p>

<p>O protocolo básico para clínicas:</p>

<ol>
  <li><strong>Contenção imediata:</strong> Isolar o sistema afetado, revogar acessos comprometidos</li>
  <li><strong>Avaliação do impacto:</strong> Quais dados foram expostos? De quantos titulares?</li>
  <li><strong>Comunicação interna:</strong> Responsável pela proteção de dados (DPO ou gestor designado)</li>
  <li><strong>Comunicação à ANPD:</strong> Via portal gov.br/anpd, com descrição do incidente, dados afetados e medidas tomadas</li>
  <li><strong>Comunicação aos titulares:</strong> Pacientes afetados, com orientações sobre riscos e medidas de proteção</li>
  <li><strong>Documentação:</strong> Registro completo do incidente, ações tomadas e aprendizados</li>
</ol>

<h2>Checklist de Conformidade LGPD para Clínicas</h2>

<div class="callout-tip">
  <strong>Checklist prático — marque o que já está implementado:</strong>
  <br /><br />
  [ ] Mapeamento de todos os dados pessoais coletados (ex: anamnese, fotos, dados financeiros)
  <br />
  [ ] Consentimento específico para fotos de antes/depois (separado do consentimento clínico)
  [ ] Política de privacidade publicada no site e disponível na clínica
  <br />
  [ ] Política de retenção de dados documentada por tipo de dado
  <br />
  [ ] Controle de acesso por perfil no sistema de prontuários
  <br />
  [ ] Log de auditoria ativado no sistema de gestão
  <br />
  [ ] Canal de atendimento para solicitações de titulares (e-mail ou formulário)
  <br />
  [ ] Contrato de processamento de dados com fornecedores (softwares, laboratórios)
  <br />
  [ ] Protocolo de resposta a incidentes documentado
  <br />
  [ ] Treinamento básico de LGPD para toda a equipe
</div>

<h2>Como o Estetia CRM Suporta a Conformidade LGPD</h2>

<p>O <a href="/pt-BR/features/prontuario-digital">prontuário digital do Estetia</a> foi desenvolvido com compliance LGPD nativo: log de auditoria completo, controle de acesso por perfil (recepcionista, profissional, gestor), criptografia de dados e gestão de consentimentos integrada ao fluxo de anamnese. O plano Business inclui relatório de auditoria exportável para demonstrar conformidade em inspeções.</p>

<div class="callout-warning">
  <strong>Atenção:</strong> Este guia é informativo e não substitui assessoria jurídica especializada. Para situações específicas, consulte um advogado com experiência em LGPD na área de saúde.
</div>

<h2>Perguntas Frequentes</h2>

<h3>Clínicas de estética precisam ter um DPO (Encarregado de Proteção de Dados)?</h3>
<p>A LGPD exige DPO formalmente para agentes de tratamento de grande porte ou que realizem tratamento de dados sensíveis em larga escala. Para clínicas pequenas e médias, a ANPD indica que um responsável interno designado (mesmo sem título formal de DPO) já atende à exigência — desde que haja canal de contato para titulares e que ele esteja preparado para responder a solicitações.</p>

<h3>WhatsApp é seguro para enviar dados de pacientes?</h3>
<p>O WhatsApp tem criptografia end-to-end, mas não é certificado para dados de saúde. Para comunicações clínicas sensíveis (laudos, prescrições, fotos antes/depois), use plataformas certificadas. Para confirmações de agendamento e informações gerais, WhatsApp é aceitável desde que o paciente tenha consentido com esse canal de comunicação.</p>

<h3>Posso usar fotos de antes/depois de pacientes antigos (anteriores à LGPD) no marketing?</h3>
<p>Não sem consentimento atualizado. A LGPD se aplica a todos os tratamentos de dados em curso, independente de quando os dados foram coletados. Se você tem uma biblioteca de fotos antigas sem autorização explícita de uso para marketing, precisa ou obter o consentimento retroativo ou parar de usar as imagens.</p>
`,
}
