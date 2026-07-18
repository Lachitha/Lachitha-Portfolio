export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  imageData?: string
  imageAlt?: string
  publishedAt: string
  status: 'published' | 'draft'
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>
