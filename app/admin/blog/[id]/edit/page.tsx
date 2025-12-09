import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdmin()

  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Blog Post</h1>
      <BlogPostForm post={post} />
    </div>
  )
}

