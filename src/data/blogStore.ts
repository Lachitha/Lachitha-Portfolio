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

const POSTS_KEY = 'lachitha-blog-posts'
const ADMIN_AUTH_KEY = 'lachitha-blog-admin-auth'
const ADMIN_PASSWORD_KEY = 'lachitha-blog-admin-password'
const ADMIN_EMAIL = 'lachisenarath576@gmail.com'
const DEFAULT_ADMIN_PASSWORD = 'Lachi@45221++'
const ADMIN_VEHICLE_NUMBER = 'CBU-7547'

const seedPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'kubernetes-observability-that-actually-scales',
    title: 'Kubernetes observability that actually scales',
    excerpt: 'How I think about alerts, traces, metrics, and storage when the cluster starts to grow.',
    content:
      'Observability should reduce uncertainty, not create noise. In practice that means clean signal routing, sane retention, and dashboards that answer real operational questions. I prefer designing around alert intent, not tool count.',
    tags: ['Kubernetes', 'Observability', 'Prometheus'],
    imageAlt: 'Observability dashboard illustration',
    publishedAt: '2026-07-10',
    status: 'published',
  },
  {
    id: '2',
    slug: 'gitops-for-production-teams',
    title: 'GitOps for production teams',
    excerpt: 'Why declarative delivery gives platform teams safer releases and cleaner ownership.',
    content:
      'GitOps works best when the repository is treated as the source of truth and the deployment path is boring on purpose. That means predictable syncs, reviewable changes, and clear rollback points. Simplicity wins over cleverness.',
    tags: ['GitOps', 'FluxCD', 'Deployment'],
    imageAlt: 'GitOps delivery pipeline illustration',
    publishedAt: '2026-06-28',
    status: 'published',
  },
]

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getBlogPosts() {
  if (!canUseStorage()) {
    return seedPosts
  }

  const raw = window.localStorage.getItem(POSTS_KEY)
  if (!raw) {
    window.localStorage.setItem(POSTS_KEY, JSON.stringify(seedPosts))
    return seedPosts
  }

  try {
    const parsed = JSON.parse(raw) as BlogPost[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedPosts
  } catch {
    return seedPosts
  }
}

export function saveBlogPosts(posts: BlogPost[]) {
  if (!canUseStorage()) {
    return
  }
  window.localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export function addBlogPost(post: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>) {
  const posts = getBlogPosts()
  const nextPost: BlogPost = {
    ...post,
    id: crypto.randomUUID(),
    slug: createSlug(post.title),
    publishedAt: new Date().toISOString().slice(0, 10),
  }
  const nextPosts = [nextPost, ...posts]
  saveBlogPosts(nextPosts)
  return nextPost
}

export function updateBlogPost(id: string, post: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>) {
  const posts = getBlogPosts()
  const nextPosts = posts.map((item) => {
    if (item.id !== id) {
      return item
    }

    return {
      ...item,
      ...post,
      slug: createSlug(post.title),
    }
  })

  saveBlogPosts(nextPosts)
  return nextPosts.find((item) => item.id === id) ?? null
}

export function removeBlogPost(id: string) {
  const posts = getBlogPosts().filter((post) => post.id !== id)
  saveBlogPosts(posts)
  return posts
}

export function isAdminAuthenticated() {
  if (!canUseStorage()) {
    return false
  }
  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
}

export function setAdminAuthenticated(value: boolean) {
  if (!canUseStorage()) {
    return
  }
  window.localStorage.setItem(ADMIN_AUTH_KEY, String(value))
}

export function getAdminEmail() {
  return ADMIN_EMAIL
}

export function getAdminPassword() {
  if (!canUseStorage()) {
    return DEFAULT_ADMIN_PASSWORD
  }

  const stored = window.localStorage.getItem(ADMIN_PASSWORD_KEY)
  if (stored) {
    return stored
  }

  window.localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD)
  return DEFAULT_ADMIN_PASSWORD
}

export function verifyAdminLogin(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === getAdminPassword()
}

export function changeAdminPassword(input: {
  email: string
  previousPassword: string
  vehicleNumber: string
  newPassword: string
}) {
  if (input.email.trim().toLowerCase() !== ADMIN_EMAIL) {
    return { ok: false, message: 'Invalid admin email.' }
  }

  if (input.previousPassword !== getAdminPassword()) {
    return { ok: false, message: 'Previous password is incorrect.' }
  }

  if (input.vehicleNumber.trim().toUpperCase() !== ADMIN_VEHICLE_NUMBER) {
    return { ok: false, message: 'Vehicle number validation failed.' }
  }

  if (!input.newPassword.trim() || input.newPassword.trim().length < 8) {
    return { ok: false, message: 'New password must be at least 8 characters.' }
  }

  if (!canUseStorage()) {
    return { ok: false, message: 'Storage unavailable.' }
  }

  window.localStorage.setItem(ADMIN_PASSWORD_KEY, input.newPassword.trim())
  return { ok: true, message: 'Password updated successfully.' }
}

export function getAdminVehicleNumber() {
  return ADMIN_VEHICLE_NUMBER
}
