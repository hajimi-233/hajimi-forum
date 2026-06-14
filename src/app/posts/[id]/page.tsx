import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostActions } from "./PostActions";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>

      <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href={`/categories/${post.category.slug}`}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
            >
              {post.category.name}
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
              {post.author.name?.[0] || "?"}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">{post.author.name}</div>
              <div className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" · "}
                {post._count.likes} 点赞
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-50 px-6 py-4">
          <PostActions postId={post.id} />
        </div>
      </article>

      {/* Comments */}
      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          评论
          <span className="text-sm font-normal text-gray-400">({post.comments.length})</span>
        </h2>

        {post.comments.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            还没有评论，来做第一个评论的人吧
          </div>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-xs font-bold text-gray-600">
                  {comment.author.name?.[0] || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-gray-800">{comment.author.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
