import { useEffect, useState } from 'react'
import { FaArrowLeft, FaCalendarAlt, FaCodeBranch, FaPenNib } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getBlogPosts, type BlogPost } from '../data/blogStore'

export function BlogPage() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    getBlogPosts({ publishedOnly: true })
      .then((items) => {
        if (!isMounted) {
          return
        }
        setPosts(items)
        const matchedPost = postId ? items.find((post) => post.id === postId) ?? null : items[0] ?? null
        setSelectedPost(matchedPost)
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [postId])

  useEffect(() => {
    if (loading || !posts.length) {
      return
    }

    if (!postId) {
      if (selectedPost && posts.some((post) => post.id === selectedPost.id)) {
        return
      }

      setSelectedPost(posts[0] ?? null)
      return
    }

    const matchedPost = posts.find((post) => post.id === postId) ?? null
    setSelectedPost(matchedPost)
  }, [loading, posts, postId, selectedPost])

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      <header className="border-b border-white/10 bg-[#0D1117]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-[#C9D1D9] transition hover:border-[#58A6FF]/40 hover:text-[#58A6FF]">
            <FaArrowLeft /> Home
          </Link>
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-[#58A6FF]">
            <FaPenNib /> Blog
          </div>
          <div className="w-[88px]" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#F0F6FC] sm:text-5xl">Engineering notes and published posts</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#8B949E]">
            A simple blog area for platform engineering notes, DevOps lessons, and production reliability write-ups.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-[#0D1117]/70 p-8 text-center text-[#8B949E]">
                Loading posts...
              </div>
            ) : null}
            {posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => {
                  setSelectedPost(post)
                  navigate(`/blog/${post.id}`)
                }}
                className={`w-full rounded-3xl border p-5 text-left transition hover:border-[#58A6FF]/40 ${selectedPost?.id === post.id ? 'border-[#58A6FF]/40 bg-[#161B22]' : 'border-white/10 bg-[#0D1117]/70'}`}
              >
                {post.imageData ? (
                  <div className="mb-4 overflow-hidden rounded-3xl border border-white/10 bg-[#0D1117]">
                    <img src={post.imageData} alt={post.imageAlt || post.title} className="h-44 w-full object-cover" />
                  </div>
                ) : null}
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#8B949E]">
                  <FaCalendarAlt /> {post.publishedAt}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-[#F0F6FC]">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#8B949E]">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#58A6FF]">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#161B22]/70 p-6 sm:p-8">
            {selectedPost ? (
              <article>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8B949E]">Featured article</p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#F0F6FC]">{selectedPost.title}</h2>
                  </div>
                  <FaCodeBranch className="text-2xl text-[#58A6FF]" />
                </div>
                <p className="mt-4 text-base leading-8 text-[#8B949E]">{selectedPost.excerpt}</p>
                {selectedPost.imageData ? (
                  <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0D1117]">
                    <img src={selectedPost.imageData} alt={selectedPost.imageAlt || selectedPost.title} className="h-64 w-full object-cover" />
                  </div>
                ) : null}
                <div className="mt-6 rounded-3xl border border-white/10 bg-[#0D1117]/70 p-5">
                  <p className="whitespace-pre-line text-sm leading-8 text-[#C9D1D9]">{selectedPost.content}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-3 py-1 text-xs text-[#58A6FF]">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#0D1117]/70 p-8 text-center text-[#8B949E]">
                No published posts yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
