import { seedPosts } from './blogSeed'
import type { BlogPost, BlogPostInput } from '../types/blog'

const API_PATH = '/api/blog-posts'

type ApiResult<T> = T & {
  message?: string
  ok?: boolean
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const text = await response.text()
  let payload: ApiResult<T>

  try {
    payload = text ? (JSON.parse(text) as ApiResult<T>) : ({} as ApiResult<T>)
  } catch {
    payload = { message: text || `Request failed with status ${response.status}.` } as ApiResult<T>
  }

  if (!response.ok) {
    const details = 'hint' in payload && typeof payload.hint === 'string' ? ` ${payload.hint}` : ''
    throw new Error(`${payload.message ?? 'Request failed.'}${details}`)
  }

  return payload
}

export function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getBlogPosts(options: { publishedOnly?: boolean } = {}) {
  try {
    const query = options.publishedOnly ? '?published=true' : ''
    const result = await requestJson<{ posts: BlogPost[] }>(`${API_PATH}${query}`)
    return result.posts
  } catch {
    return options.publishedOnly ? seedPosts.filter((post) => post.status === 'published') : seedPosts
  }
}

export async function getAdminState() {
  return requestJson<{ adminEmail: string; authenticated: boolean; storage: string }>(API_PATH)
}

export async function addBlogPost(post: BlogPostInput) {
  const result = await requestJson<{ post: BlogPost }>(API_PATH, {
    method: 'POST',
    body: JSON.stringify(post),
  })
  return result.post
}

export async function updateBlogPost(id: string, post: BlogPostInput) {
  const result = await requestJson<{ post: BlogPost }>(API_PATH, {
    method: 'PUT',
    body: JSON.stringify({ id, ...post }),
  })
  return result.post
}

export async function removeBlogPost(id: string) {
  const result = await requestJson<{ posts: BlogPost[] }>(`${API_PATH}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return result.posts
}

export async function verifyAdminLogin(email: string, password: string) {
  return requestJson<{ ok: boolean; message: string; adminEmail: string }>(API_PATH, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password }),
  })
}

export async function logoutAdmin() {
  return requestJson<{ ok: boolean; message: string }>(API_PATH, {
    method: 'POST',
    body: JSON.stringify({ action: 'logout' }),
  })
}

export async function changeAdminPassword(input: {
  email: string
  previousPassword: string
  vehicleNumber: string
  newPassword: string
}) {
  return requestJson<{ ok: boolean; message: string }>(API_PATH, {
    method: 'POST',
    body: JSON.stringify({ action: 'change-password', ...input }),
  })
}

export type { BlogPost, BlogPostInput }
