import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { IncomingMessage } from 'node:http'
import { BlobNotFoundError, get, put } from '@vercel/blob'
import type { BlogPost, BlogPostInput } from '../src/types/blog'

interface ApiRequest extends IncomingMessage {
  body?: unknown
  query?: Record<string, string | string[]>
}

interface ApiResponse {
  status(code: number): ApiResponse
  json(body: unknown): void
  setHeader(name: string, value: string | string[]): void
  end(): void
}

interface BlogStoreData {
  posts: BlogPost[]
  adminPassword: string
  adminSessionToken: string
  adminSessionIssuedAt: number
}

const STORE_PATHNAME = 'blog/blog-store.json'
const LOCAL_STORE_PATH = join(process.cwd(), '.data', 'blog-store.json')
const ADMIN_EMAIL = process.env.BLOG_ADMIN_EMAIL ?? 'lachisenarath576@gmail.com'
const DEFAULT_ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD ?? 'Lachi@45221++'
const ADMIN_VEHICLE_NUMBER = process.env.BLOG_ADMIN_VEHICLE_NUMBER ?? 'CBU-7547'
const SESSION_COOKIE = 'lachitha_blog_admin'
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

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createDefaultStore(): BlogStoreData {
  return {
    posts: seedPosts,
    adminPassword: DEFAULT_ADMIN_PASSWORD,
    adminSessionToken: '',
    adminSessionIssuedAt: 0,
  }
}

function canUseBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function getStorageMode() {
  return canUseBlob() ? 'vercel-blob' : 'local-dev-file'
}

async function readStream(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text()
}

async function readStore(): Promise<BlogStoreData> {
  if (canUseBlob()) {
    try {
      const result = await get(STORE_PATHNAME, { access: 'private', useCache: false })
      if (!result || result.statusCode !== 200) {
        return createDefaultStore()
      }

      const text = await readStream(result.stream)
      return normalizeStore(JSON.parse(text))
    } catch (error) {
      if (error instanceof BlobNotFoundError) {
        return createDefaultStore()
      }

      throw error
    }
  }

  try {
    const text = await readFile(LOCAL_STORE_PATH, 'utf8')
    return normalizeStore(JSON.parse(text))
  } catch {
    return createDefaultStore()
  }
}

async function writeStore(store: BlogStoreData) {
  const body = JSON.stringify(store, null, 2)

  if (canUseBlob()) {
    await put(STORE_PATHNAME, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    })
    return
  }

  await mkdir(dirname(LOCAL_STORE_PATH), { recursive: true })
  await writeFile(LOCAL_STORE_PATH, body)
}

function normalizeStore(input: unknown): BlogStoreData {
  if (!input || typeof input !== 'object') {
    return createDefaultStore()
  }

  const candidate = input as Partial<BlogStoreData>
  return {
    posts: Array.isArray(candidate.posts) ? candidate.posts : seedPosts,
    adminPassword: typeof candidate.adminPassword === 'string' && candidate.adminPassword ? candidate.adminPassword : DEFAULT_ADMIN_PASSWORD,
    adminSessionToken: typeof candidate.adminSessionToken === 'string' ? candidate.adminSessionToken : '',
    adminSessionIssuedAt: typeof candidate.adminSessionIssuedAt === 'number' ? candidate.adminSessionIssuedAt : 0,
  }
}

function getBodyValue<T extends Record<string, unknown>>(body: unknown) {
  return body && typeof body === 'object' ? (body as T) : ({} as T)
}

async function readJsonBody(request: ApiRequest) {
  if (request.body && typeof request.body === 'object') {
    return request.body
  }

  const chunks: Uint8Array[] = []
  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function createSessionCookie(token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${secure}`
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
}

function parseCookies(cookieHeader: string | undefined) {
  return Object.fromEntries(
    (cookieHeader ?? '')
      .split(';')
      .map((cookie) => cookie.trim().split('='))
      .filter(([name, value]) => name && value)
      .map(([name, ...value]) => [name, value.join('=')]),
  )
}

function isAuthenticated(request: ApiRequest, store: BlogStoreData) {
  const cookie = parseCookies(request.headers.cookie)[SESSION_COOKIE]
  if (!cookie || !store.adminSessionToken) {
    return false
  }

  const sessionAge = Date.now() - store.adminSessionIssuedAt
  if (sessionAge < 0 || sessionAge > 86_400_000) {
    return false
  }

  return cookie === store.adminSessionToken
}

function requireAuth(request: ApiRequest, response: ApiResponse, store: BlogStoreData) {
  if (isAuthenticated(request, store)) {
    return true
  }

  response.status(401).json({ message: 'Authentication required.' })
  return false
}

function createPost(input: BlogPostInput): BlogPost {
  return {
    ...input,
    id: randomUUID(),
    slug: createSlug(input.title),
    publishedAt: new Date().toISOString().slice(0, 10),
  }
}

function normalizePostInput(input: unknown): BlogPostInput {
  const body = getBodyValue<Record<string, unknown>>(input)
  return {
    title: String(body.title ?? '').trim(),
    excerpt: String(body.excerpt ?? '').trim(),
    content: String(body.content ?? '').trim(),
    tags: Array.isArray(body.tags) ? body.tags.map(String).map((tag) => tag.trim()).filter(Boolean) : [],
    status: body.status === 'draft' ? 'draft' : 'published',
    imageAlt: String(body.imageAlt ?? '').trim(),
    imageData: typeof body.imageData === 'string' ? body.imageData : '',
  }
}

function validatePostInput(input: BlogPostInput) {
  return Boolean(input.title && input.excerpt && input.content)
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  try {
    if (request.method === 'GET') {
      const store = await readStore()
      if (request.query?.health === 'true') {
        response.status(200).json({
          ok: true,
          message: 'Blog storage is reachable.',
          storage: getStorageMode(),
          posts: store.posts.length,
          adminEmailConfigured: Boolean(ADMIN_EMAIL),
          blobTokenConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        })
        return
      }

      const publishedOnly = request.query?.published === 'true'
      response.status(200).json({
        posts: publishedOnly ? store.posts.filter((post) => post.status === 'published') : store.posts,
        adminEmail: ADMIN_EMAIL,
        authenticated: isAuthenticated(request, store),
        storage: getStorageMode(),
      })
      return
    }

    const body = await readJsonBody(request)
    const action = getBodyValue<{ action?: unknown }>(body).action

    if (request.method === 'POST' && action === 'health') {
      const store = await readStore()
      response.status(200).json({
        ok: true,
        message: 'Blog backend is reachable.',
        storage: getStorageMode(),
        posts: store.posts.length,
        adminEmailConfigured: Boolean(ADMIN_EMAIL),
        blobTokenConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      })
      return
    }

    if (request.method === 'POST' && action === 'login') {
      const store = await readStore()
      const credentials = getBodyValue<{ email?: unknown; password?: unknown }>(body)
      const email = String(credentials.email ?? '').trim().toLowerCase()
      const password = String(credentials.password ?? '')

      if (email === ADMIN_EMAIL && password === store.adminPassword) {
        const token = randomUUID()
        await writeStore({
          ...store,
          adminSessionToken: token,
          adminSessionIssuedAt: Date.now(),
        })
        response.setHeader('Set-Cookie', createSessionCookie(token))
        response.status(200).json({ ok: true, message: 'Admin login successful.', adminEmail: ADMIN_EMAIL })
        return
      }

      response.status(401).json({ ok: false, message: 'Invalid email or password.' })
      return
    }

    if (request.method === 'POST' && action === 'logout') {
      const store = await readStore()
      await writeStore({
        ...store,
        adminSessionToken: '',
        adminSessionIssuedAt: 0,
      })
      response.setHeader('Set-Cookie', clearSessionCookie())
      response.status(200).json({ ok: true, message: 'Signed out.' })
      return
    }

    if (request.method === 'POST' && action === 'change-password') {
      const store = await readStore()
      if (!requireAuth(request, response, store)) {
        return
      }
      const input = getBodyValue<Record<string, unknown>>(body)
      const email = String(input.email ?? '').trim().toLowerCase()
      const previousPassword = String(input.previousPassword ?? '')
      const vehicleNumber = String(input.vehicleNumber ?? '').trim().toUpperCase()
      const newPassword = String(input.newPassword ?? '').trim()

      if (email !== ADMIN_EMAIL) {
        response.status(400).json({ ok: false, message: 'Invalid admin email.' })
        return
      }

      if (previousPassword !== store.adminPassword) {
        response.status(400).json({ ok: false, message: 'Previous password is incorrect.' })
        return
      }

      if (vehicleNumber !== ADMIN_VEHICLE_NUMBER) {
        response.status(400).json({ ok: false, message: 'Vehicle number validation failed.' })
        return
      }

      if (newPassword.length < 8) {
        response.status(400).json({ ok: false, message: 'New password must be at least 8 characters.' })
        return
      }

      await writeStore({ ...store, adminPassword: newPassword })
      response.status(200).json({ ok: true, message: 'Password updated successfully.' })
      return
    }

    const store = await readStore()

    if (!requireAuth(request, response, store)) {
      return
    }

    if (request.method === 'POST') {
      const input = normalizePostInput(body)
      if (!validatePostInput(input)) {
        response.status(400).json({ message: 'Title, excerpt, and content are required.' })
        return
      }

      const post = createPost(input)
      await writeStore({ ...store, posts: [post, ...store.posts] })
      response.status(201).json({ post })
      return
    }

    if (request.method === 'PUT') {
      const input = getBodyValue<Record<string, unknown>>(body)
      const id = String(input.id ?? '')
      const postInput = normalizePostInput(input)

      if (!id || !validatePostInput(postInput)) {
        response.status(400).json({ message: 'Post id, title, excerpt, and content are required.' })
        return
      }

      let updatedPost: BlogPost | null = null
      const posts = store.posts.map((post) => {
        if (post.id !== id) {
          return post
        }

        updatedPost = { ...post, ...postInput, slug: createSlug(postInput.title) }
        return updatedPost
      })

      if (!updatedPost) {
        response.status(404).json({ message: 'Post not found.' })
        return
      }

      await writeStore({ ...store, posts })
      response.status(200).json({ post: updatedPost })
      return
    }

    if (request.method === 'DELETE') {
      const idParam = request.query?.id
      const id = Array.isArray(idParam) ? idParam[0] : idParam
      if (!id) {
        response.status(400).json({ message: 'Post id is required.' })
        return
      }

      const posts = store.posts.filter((post) => post.id !== id)
      await writeStore({ ...store, posts })
      response.status(200).json({ posts })
      return
    }

    response.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    response.status(405).json({ message: 'Method not allowed.' })
  } catch (error) {
    response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected server error.',
      storage: getStorageMode(),
      blobTokenConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      hint: canUseBlob()
        ? 'Check the connected Vercel Blob store and BLOB_READ_WRITE_TOKEN.'
        : 'BLOB_READ_WRITE_TOKEN is missing, so the API can only use local development fallback.',
    })
  }
}
