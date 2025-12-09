import { getStoreSettings } from '@/lib/settings'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BlogPage() {
  const settings = await getStoreSettings()

  if (!settings.showBlog) {
    redirect('/')
  }

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  const primaryColor = settings.primaryColor || '#111827'

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" style={{ color: primaryColor }}>
        Blog
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg">No blog posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: primaryColor }}>
                  {post.title}
                </h2>
                <p className="text-sm opacity-70 mb-4">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="line-clamp-3" style={{ color: primaryColor }}>
                  {post.content.substring(0, 200)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

