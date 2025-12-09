import { requireAdmin } from '@/lib/auth'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default async function NewBlogPostPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">New Blog Post</h1>
      <BlogPostForm />
    </div>
  )
}

