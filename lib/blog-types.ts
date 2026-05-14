export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  lastModified?: string
  category: string
  image: string
  author: string
  relatedSlugs?: string[]
  // Set to true to preserve SEO juice while hiding from listing pages
  archived?: boolean
  // EN variants — if absent, /en/blog/[slug] gets noindex
  titleEn?: string
  excerptEn?: string
  contentEn?: string
  keywordsEn?: string[]
}
