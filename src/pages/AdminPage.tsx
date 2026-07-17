import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { FaArrowLeft, FaCheck, FaKey, FaLock, FaPenFancy, FaPlus, FaSignOutAlt, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {
  addBlogPost,
  changeAdminPassword,
  getAdminEmail,
  getBlogPosts,
  isAdminAuthenticated,
  removeBlogPost,
  setAdminAuthenticated,
  updateBlogPost,
  type BlogPost,
  verifyAdminLogin,
} from '../data/blogStore'

type PostForm = {
  title: string
  excerpt: string
  content: string
  tags: string
  status: 'published' | 'draft'
  imageAlt: string
  imageData: string
}

type CredentialsForm = {
  email: string
  password: string
}

type PasswordForm = {
  email: string
  previousPassword: string
  vehicleNumber: string
  newPassword: string
  confirmPassword: string
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated())
  const [credentials, setCredentials] = useState<CredentialsForm>({ email: getAdminEmail(), password: '' })
  const [posts, setPosts] = useState<BlogPost[]>(() => getBlogPosts())
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [postForm, setPostForm] = useState<PostForm>({
    title: '',
    excerpt: '',
    content: '',
    tags: 'DevOps, Kubernetes',
    status: 'published',
    imageAlt: '',
    imageData: '',
  })
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    email: getAdminEmail(),
    previousPassword: '',
    vehicleNumber: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (authenticated) {
      setPosts(getBlogPosts())
    }
  }, [authenticated])

  const adminEmail = useMemo(() => getAdminEmail(), [])

  const handleLogin = (event: FormEvent) => {
    event.preventDefault()
    if (verifyAdminLogin(credentials.email, credentials.password)) {
      setAdminAuthenticated(true)
      setAuthenticated(true)
      setCredentials((current) => ({ ...current, password: '' }))
      setMessage('Admin login successful.')
      return
    }

    setMessage('Invalid email or password.')
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setPostForm((current) => ({
        ...current,
        imageData: result,
        imageAlt: current.imageAlt || file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      }))
      setMessage('Image encoded and attached to draft post.')
    }
    reader.readAsDataURL(file)
  }

  const resetPostForm = () => {
    setPostForm({
      title: '',
      excerpt: '',
      content: '',
      tags: 'DevOps, Kubernetes',
      status: 'published',
      imageAlt: '',
      imageData: '',
    })
    setEditingId(null)
  }

  const startEditPost = (post: BlogPost) => {
    setEditingId(post.id)
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      status: post.status,
      imageAlt: post.imageAlt ?? '',
      imageData: post.imageData ?? '',
    })
    setMessage(`Editing ${post.title}.`)
  }

  const handleCreatePost = (event: FormEvent) => {
    event.preventDefault()

    const payload = {
      title: postForm.title.trim(),
      excerpt: postForm.excerpt.trim(),
      content: postForm.content.trim(),
      tags: postForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: postForm.status,
      imageAlt: postForm.imageAlt.trim(),
      imageData: postForm.imageData,
    }

    if (editingId) {
      const updatedPost = updateBlogPost(editingId, payload)
      if (updatedPost) {
        setPosts((current) => current.map((item) => (item.id === editingId ? updatedPost : item)))
        setMessage('Blog post updated locally.')
      }
    } else {
      const nextPost = addBlogPost(payload)
      setPosts((current) => [nextPost, ...current])
      setMessage('Blog post saved locally.')
    }

    resetPostForm()
  }

  const handleDeletePost = (id: string) => {
    setPosts(removeBlogPost(id))
    setMessage('Blog post deleted.')
    if (editingId === id) {
      resetPostForm()
    }
  }

  const handleLogout = () => {
    setAdminAuthenticated(false)
    setAuthenticated(false)
    setMessage('Signed out.')
  }

  const handleChangePassword = (event: FormEvent) => {
    event.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New password and confirmation do not match.')
      return
    }

    const result = changeAdminPassword({
      email: passwordForm.email,
      previousPassword: passwordForm.previousPassword,
      vehicleNumber: passwordForm.vehicleNumber,
      newPassword: passwordForm.newPassword,
    })

    setMessage(result.message)
    if (result.ok) {
      setPasswordForm((current) => ({
        ...current,
        previousPassword: '',
        vehicleNumber: '',
        newPassword: '',
        confirmPassword: '',
      }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      <header className="border-b border-white/10 bg-[#0D1117]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-[#C9D1D9] transition hover:border-[#58A6FF]/40 hover:text-[#58A6FF]">
            <FaArrowLeft /> Home
          </Link>
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-[#58A6FF]">
            <FaLock /> Admin Panel
          </div>
          {authenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-[#F85149]/30 bg-[#F85149]/10 px-4 py-2 text-sm font-semibold text-[#F85149] transition hover:bg-[#F85149]/20"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="w-[88px]" />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#F0F6FC] sm:text-5xl">Blog insertion panel</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#8B949E]">
            Protected editor for inserting blog posts into the local blog feed. The admin panel is accessed by URL only.
          </p>
        </section>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#0D1117]/70 p-4 text-sm text-[#8B949E]">
          Admin email: <span className="text-[#58A6FF]">{adminEmail}</span>
          {message ? <span className="ml-4 text-[#3FB950]">{message}</span> : null}
        </div>

        {!authenticated ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <form onSubmit={handleLogin} className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3 text-[#58A6FF]">
                <FaLock />
                <span className="font-mono text-sm uppercase tracking-[0.3em]">Authentication</span>
              </div>
              <label className="block text-sm text-[#8B949E]">
                Email
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                  placeholder="Enter admin email"
                  required
                />
              </label>
              <label className="mt-4 block text-sm text-[#8B949E]">
                Password
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                  placeholder="Enter admin password"
                  required
                />
              </label>
              <button
                type="submit"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-5 py-3 text-sm font-semibold text-[#58A6FF] transition hover:bg-[#58A6FF]/20"
              >
                <FaCheck /> Login
              </button>
            </form>
            <div className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#8B949E]">Access</p>
              <p className="mt-3 text-base leading-8 text-[#C9D1D9]">
                Use the admin email and password to access the panel.
              </p>
              <div className="mt-6 rounded-3xl border border-white/10 bg-[#0D1117]/70 p-5 text-sm leading-8 text-[#8B949E]">
                The panel is protected by local auth and stores posts in browser storage only.
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <form onSubmit={handleCreatePost} className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3 text-[#58A6FF]">
                  <FaPlus />
                  <span className="font-mono text-sm uppercase tracking-[0.3em]">{editingId ? 'Edit Post' : 'New Post'}</span>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm text-[#8B949E]">
                    Title
                    <input
                      value={postForm.title}
                      onChange={(event) => setPostForm((current) => ({ ...current, title: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      required
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Excerpt
                    <textarea
                      value={postForm.excerpt}
                      onChange={(event) => setPostForm((current) => ({ ...current, excerpt: event.target.value }))}
                      className="mt-2 min-h-[96px] w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      required
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Content
                    <textarea
                      value={postForm.content}
                      onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))}
                      className="mt-2 min-h-[180px] w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      required
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Tags, comma separated
                    <input
                      value={postForm.tags}
                      onChange={(event) => setPostForm((current) => ({ ...current, tags: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Post image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#8B949E] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#58A6FF]/10 file:px-4 file:py-2 file:text-[#58A6FF] file:font-semibold hover:border-[#58A6FF]/40"
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Image alt text
                    <input
                      value={postForm.imageAlt}
                      onChange={(event) => setPostForm((current) => ({ ...current, imageAlt: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      placeholder="Describe the image"
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Status
                    <select
                      value={postForm.status}
                      onChange={(event) => setPostForm((current) => ({ ...current, status: event.target.value as 'published' | 'draft' }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                    >
                      <option value="published">published</option>
                      <option value="draft">draft</option>
                    </select>
                  </label>
                </div>

                {postForm.imageData ? (
                  <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0D1117]/70">
                    <img src={postForm.imageData} alt={postForm.imageAlt || 'Blog post preview'} className="h-52 w-full object-cover" />
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#3FB950]/30 bg-[#3FB950]/10 px-5 py-3 text-sm font-semibold text-[#3FB950] transition hover:bg-[#3FB950]/20"
                >
                  <FaPenFancy /> {editingId ? 'Update post' : 'Publish post'}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetPostForm}
                    className="ml-3 mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[#C9D1D9] transition hover:border-[#58A6FF]/40 hover:text-[#58A6FF]"
                  >
                    Cancel edit
                  </button>
                ) : null}
              </form>

              <form onSubmit={handleChangePassword} className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3 text-[#58A6FF]">
                  <FaKey />
                  <span className="font-mono text-sm uppercase tracking-[0.3em]">Change Password</span>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm text-[#8B949E]">
                    Admin email
                    <input
                      type="email"
                      value={passwordForm.email}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, email: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      required
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Previous password
                    <input
                      type="password"
                      value={passwordForm.previousPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, previousPassword: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      required
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Vehicle number
                    <input
                      value={passwordForm.vehicleNumber}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, vehicleNumber: event.target.value.toUpperCase() }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      placeholder="CBU-7547"
                      required
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    New password
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      required
                    />
                  </label>
                  <label className="block text-sm text-[#8B949E]">
                    Confirm new password
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D1117] px-4 py-3 text-[#F0F6FC] outline-none transition focus:border-[#58A6FF]/40"
                      required
                    />
                  </label>
                </div>
                <p className="mt-4 rounded-3xl border border-white/10 bg-[#0D1117]/70 p-4 text-sm leading-7 text-[#8B949E]">
                  Password change requires matching admin email, previous password, and vehicle number validation.
                </p>
                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-5 py-3 text-sm font-semibold text-[#58A6FF] transition hover:bg-[#58A6FF]/20"
                >
                  <FaCheck /> Update password
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
                <p className="text-sm uppercase tracking-[0.35em] text-[#8B949E]">Blogposts</p>
                <p className="mt-3 text-base leading-8 text-[#C9D1D9]">Existing posts are stored locally and listed here for quick management.</p>
              </div>

              {posts.map((post) => (
                <article key={post.id} className="rounded-[2rem] border border-white/10 bg-[#0D1117]/70 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#8B949E]">{post.status}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#F0F6FC]">{post.title}</h2>
                    </div>
                    <span className="rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-3 py-1 text-xs text-[#58A6FF]">{post.publishedAt}</span>
                  </div>

                  {post.imageData ? (
                    <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#161B22]">
                      <img src={post.imageData} alt={post.imageAlt || post.title} className="h-52 w-full object-cover" />
                    </div>
                  ) : null}

                  <p className="mt-4 text-sm leading-8 text-[#8B949E]">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#58A6FF]">{tag}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#F85149]/30 bg-[#F85149]/10 px-4 py-2 text-sm font-semibold text-[#F85149] transition hover:bg-[#F85149]/20"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => startEditPost(post)}
                    className="ml-3 mt-5 inline-flex items-center gap-2 rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-4 py-2 text-sm font-semibold text-[#58A6FF] transition hover:bg-[#58A6FF]/20"
                  >
                    <FaPenFancy /> Edit
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}