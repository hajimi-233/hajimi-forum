import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  const categories = await prisma.category.findMany();
  const totalPosts = await prisma.post.count();
  const totalUsers = await prisma.user.count();
  const totalComments = await prisma.comment.count();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-400/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            欢迎来到 <span className="text-gradient">Hajimi</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            一个简约、友好的社区论坛。分享知识，发现灵感，连接彼此。
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/posts/new"
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-gray-800 hover:shadow-gray-900/20"
            >
              开始发帖
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
            >
              加入社区
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
              <div>用户</div>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
              <div>帖子</div>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalComments}</div>
              <div>评论</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories + Posts */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="mb-5 text-lg font-bold text-gray-900">探索版块</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => {
              const icons: Record<string, string> = {
                tech: "💻",
                life: "🌈",
                resource: "📦",
                qa: "💡",
                announcement: "📢",
              };
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="card-hover group rounded-xl border border-gray-100 bg-white p-5"
                >
                  <div className="mb-2 text-2xl">{icons[cat.slug] || "📌"}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                    {cat.description || `${cat.name}相关内容`}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Posts List */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">最新帖子</h2>
          <Link
            href="/posts/new"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            发布帖子
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
            <div className="mb-3 text-3xl">📝</div>
            <h3 className="text-lg font-semibold text-gray-900">还没有帖子</h3>
            <p className="mt-1 text-sm text-gray-400">成为第一个发帖的人，开启社区讨论吧！</p>
            <Link
              href="/posts/new"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
            >
              发布第一篇帖子
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
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                        {post.category.name}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{post.content}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                      <span className="font-medium text-gray-600">{post.author.name}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post._count.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post._count.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
