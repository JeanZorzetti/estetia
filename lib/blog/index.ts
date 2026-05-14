import { BlogPost } from '../blog-types'

import { post as spinSellingPost } from './posts/spin-selling-para-clinicas-de-estetica'
import { post as noShowPost } from './posts/como-reduzir-no-show-em-clinicas-de-estetica'
import { post as lgpdPost } from './posts/lgpd-para-clinicas-de-estetica-guia-2026'
import { post as anamnesePost } from './posts/anamnese-digital-clinica-de-estetica'
import { post as kpisPost } from './posts/kpis-essenciais-clinica-de-estetica'

export const blogPosts: BlogPost[] = [
  spinSellingPost,
  noShowPost,
  lgpdPost,
  anamnesePost,
  kpisPost,
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
