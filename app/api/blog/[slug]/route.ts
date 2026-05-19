import { NextRequest, NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-data'

function htmlToMarkdown(html: string): string {
  return html
    // Headings
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '\n# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '\n### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '\n#### $1\n')
    // Callout divs (schema.org/clinic-specific)
    .replace(/<div[^>]*class="callout-stat"[^>]*>([\s\S]*?)<\/div>/gi, '\n> **Estatística:** $1\n')
    .replace(/<div[^>]*class="callout-tip"[^>]*>([\s\S]*?)<\/div>/gi, '\n> **Dica:** $1\n')
    .replace(/<div[^>]*class="callout-success"[^>]*>([\s\S]*?)<\/div>/gi, '\n> **Resultado:** $1\n')
    .replace(/<div[^>]*class="callout-warning"[^>]*>([\s\S]*?)<\/div>/gi, '\n> **Atenção:** $1\n')
    .replace(/<div[^>]*class="callout-questions"[^>]*>([\s\S]*?)<\/div>/gi, '\n> **Perguntas:** $1\n')
    // Remaining divs (dark CTAs, etc.)
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '\n$1\n')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
    // Inline formatting
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gis, '`$1`')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, '[$2]($1)')
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    // Tables
    .replace(/<thead[^>]*>([\s\S]*?)<\/thead>/gi, '$1')
    .replace(/<tbody[^>]*>([\s\S]*?)<\/tbody>/gi, '$1')
    .replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, inner) => {
      const cells = inner.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || []
      return '| ' + cells.map((c: string) => c.replace(/<\/?t[hd][^>]*>/gi, '').trim()).join(' | ') + ' |\n'
    })
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse excessive blank lines (max 2)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const baseUrl = 'https://estetiacrm.com.br'
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`

  const frontmatter = [
    '---',
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"`,
    `author: "${post.author}"`,
    `date: "${post.date}"`,
    post.lastModified ? `lastModified: "${post.lastModified}"` : null,
    `category: "${post.category}"`,
    `canonicalUrl: "${canonicalUrl}"`,
    `image: "${imageUrl}"`,
    post.relatedSlugs?.length
      ? `relatedPosts:\n${post.relatedSlugs.map((s) => `  - "${baseUrl}/blog/${s}"`).join('\n')}`
      : null,
    '---',
  ]
    .filter(Boolean)
    .join('\n')

  const body = htmlToMarkdown(post.content)
  const markdown = `${frontmatter}\n\n# ${post.title}\n\n${body}`

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Source': 'estetiacrm.com.br',
    },
  })
}
