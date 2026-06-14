import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-lg font-semibold text-gray-900">版块不存在</h2>
        <p className="mt-1 text-sm text-gray-400">请检查链接是否正确</p>
        <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  const icons: Record<string, string> = {
    tech: "💻", life: "🌈", resource: "📦", qa: "💡", announcement: "📢",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="mb-3 inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icons[category.slug] || "📌"}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="mt-0.5 text-sm text-gray-500">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mb-3 text-3xl">📭</div>
          <h3 className="text-lg font-semibold text-gray-900">该版块暂无帖子</h3>
          <p className="mt-1 text-sm text-gray-400">抢个沙发，成为第一个发帖的人</p>
          <Link
            href="/posts/new"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            发布帖子
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="card-hover group block rounded-xl border border-gray-100 bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-sm font-bold text-indigo-600">
                  {post.author.name?.[0] || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{post.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{post.author.name}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
                    <span>{post._count.comments} 评论</span>
                    <span>{post._count.likes} 点赞</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
