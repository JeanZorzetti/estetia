import { BlogPost } from '../blog-types'

import { post as comparasSistemaPost } from './posts/comparar-sistema-gestao-clinica-estetica'
import { post as migrarCrmPost } from './posts/como-migrar-crm-clinica-estetica'
import { post as quantoCustaCrmPost } from './posts/quanto-custa-crm-clinica-estetica'
import { post as roiCrmPost } from './posts/roi-crm-clinica-estetica-faturamento'
import { post as melhorCrmPost } from './posts/melhor-crm-clinica-estetica-2026'
import { post as spinSellingPost } from './posts/spin-selling-para-clinicas-de-estetica'
import { post as noShowPost } from './posts/como-reduzir-no-show-em-clinicas-de-estetica'
import { post as lgpdPost } from './posts/lgpd-para-clinicas-de-estetica-guia-2026'
import { post as anamnesePost } from './posts/anamnese-digital-clinica-de-estetica'
import { post as kpisPost } from './posts/kpis-essenciais-clinica-de-estetica'
import { post as crmGuiaPost } from './posts/crm-para-clinica-de-estetica-guia-completo'
import { post as softwareDermatologiaPost } from './posts/software-gestao-dermatologia-guia'
import { post as prontuarioEletronicoPost } from './posts/prontuario-eletronico-clinica-estetica'
import { post as agendamentoOnlinePost } from './posts/agendamento-online-clinica-estetica'
import { post as whatsappBusinessPost } from './posts/whatsapp-business-clinica-estetica-automacao'
import { post as toxinaBotulinicaPost } from './posts/gestao-toxina-botulinica-clinica-estetica'
import { post as preenchimentoAhPost } from './posts/preenchimento-acido-hialuronico-captacao-pacientes'
import { post as harmonizacaoFacialPost } from './posts/harmonizacao-facial-precificacao-avaliacao'
import { post as depilacaoLaserPost } from './posts/depilacao-laser-pacotes-recorrencia'
import { post as limpezaPelePost } from './posts/limpeza-de-pele-protocolos-fidelizacao'
import { post as bioestimuladoresPost } from './posts/bioestimuladores-colageno-clinica-estetica'
import { post as criolipolisePost } from './posts/criolipolise-gordura-localizada-pacotes'
import { post as microagulhamentoPost } from './posts/microagulhamento-protocolos-fidelizacao'
import { post as peelingQuimicoPost } from './posts/peeling-quimico-captacao-jornada-paciente'
import { post as fiosPdoPost } from './posts/fios-pdo-lifting-avaliacao-ticket-alto'
import { post as enzimasPapadaPost } from './posts/enzimas-papada-gordura-submentual-captacao'
import { post as radiofrequenciaPost } from './posts/radiofrequencia-ultrassom-microfocado-pacotes'
import { post as micropigmentacaoPost } from './posts/micropigmentacao-sobrancelha-recorrencia-retoque'
import { post as tratamentoCapilarPost } from './posts/tratamento-capilar-calvicie-protocolos-fidelizacao'
import { post as drenagemLinfaticaPost } from './posts/drenagem-linfatica-pos-operatorio-recorrencia'
import { post as contratarRecepcionistaPost } from './posts/contratar-treinar-recepcionista-clinica-estetica'
import { post as comissaoProfissionaisPost } from './posts/comissao-profissionais-clinica-estetica-modelos'
import { post as gestaoEstoquePost } from './posts/gestao-estoque-produtos-clinica-estetica'
import { post as produtividadeEquipePost } from './posts/produtividade-equipe-clinica-estetica-indicadores'
import { post as gestaoSalasPost } from './posts/gestao-salas-agenda-equipe-clinica-estetica'
import { post as fluxoCaixaPost } from './posts/fluxo-de-caixa-clinica-estetica-gestao-financeira'
import { post as precificacaoPost } from './posts/precificacao-procedimentos-esteticos-margem-lucro'
import { post as inadimplenciaPost } from './posts/inadimplencia-parcelamento-clinica-estetica'
import { post as expansaoPost } from './posts/expansao-segunda-unidade-clinica-estetica'
import { post as capitalGiroPost } from './posts/capital-de-giro-saude-financeira-clinica-estetica'
import { post as tissTussPost } from './posts/tiss-tuss-clinica-estetica-convenios'

export const blogPosts: BlogPost[] = [
  tissTussPost,
  comparasSistemaPost,
  migrarCrmPost,
  quantoCustaCrmPost,
  roiCrmPost,
  melhorCrmPost,
  spinSellingPost,
  noShowPost,
  lgpdPost,
  anamnesePost,
  kpisPost,
  crmGuiaPost,
  softwareDermatologiaPost,
  prontuarioEletronicoPost,
  agendamentoOnlinePost,
  whatsappBusinessPost,
  toxinaBotulinicaPost,
  preenchimentoAhPost,
  harmonizacaoFacialPost,
  depilacaoLaserPost,
  limpezaPelePost,
  bioestimuladoresPost,
  criolipolisePost,
  microagulhamentoPost,
  peelingQuimicoPost,
  fiosPdoPost,
  enzimasPapadaPost,
  radiofrequenciaPost,
  micropigmentacaoPost,
  tratamentoCapilarPost,
  drenagemLinfaticaPost,
  contratarRecepcionistaPost,
  comissaoProfissionaisPost,
  gestaoEstoquePost,
  produtividadeEquipePost,
  gestaoSalasPost,
  fluxoCaixaPost,
  precificacaoPost,
  inadimplenciaPost,
  expansaoPost,
  capitalGiroPost,
]

export const CATEGORY_COLORS: Record<string, string> = {
  'Gestão Clínica': '#0A1F3D',
  'Marketing & Captação': '#489FB5',
  'Compliance & LGPD': '#E05A4E',
  'Tecnologia & IA': '#489FB5',
  'KPIs & Crescimento': '#C5A059',
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#0A1F3D'
}

/**
 * Slugify a category name for URL usage.
 * "Vendas" → "vendas", "Gestão" → "gestao", "ROI e Estratégia" → "roi-e-estrategia"
 */
export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')    // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '')        // trim leading/trailing hyphens
}

/**
 * Get all unique categories from blog posts.
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map(post => post.category)))
}

/**
 * Get posts filtered by category name (exact match).
 * Returns posts sorted by date (most recent first).
 */
export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts
    .filter(post => post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Find the original category name from its slug.
 * Returns undefined if not found.
 */
export function getCategoryFromSlug(slug: string): string | undefined {
  const categories = getAllCategories()
  return categories.find(cat => slugifyCategory(cat) === slug)
}
