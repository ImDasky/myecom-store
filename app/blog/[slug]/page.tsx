import { getStoreSettings } from '@/lib/settings'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const settings = await getStoreSettings()

  if (!settings.showBlog) {
    notFound()
  }

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    notFound()
  }

  const primaryColor = settings.primaryColor || '#111827'

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" style={{ color: primaryColor }}>
          {post.title}
        </h1>
        <p className="text-sm opacity-70 mb-8">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div 
          className="prose max-w-none"
          style={{ color: primaryColor }}
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />
      </article>
    </div>
  )
}

