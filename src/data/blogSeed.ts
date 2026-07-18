import type { BlogPost } from '../types/blog'

export const seedPosts: BlogPost[] = [
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
