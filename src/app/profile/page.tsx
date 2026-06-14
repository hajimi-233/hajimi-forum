import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, createdAt: true },
  });

  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true, slug: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  const totalLikes = posts.reduce((sum, p) => sum + p._count.likes, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-500 text-2xl font-bold text-white shadow-sm">
              {user?.name?.[0] || "?"}
            </div>
            <div className="mb-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{posts.length}</div>
              <div className="text-xs text-gray-400">帖子</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{totalLikes}</div>
              <div className="text-xs text-gray-400">获赞</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">
                注册于 {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("zh-CN") : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="mt-8 mb-4 text-lg font-bold text-gray-900">我的帖子</h2>
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-3 text-3xl">📝</div>
          <h3 className="text-lg font-semibold text-gray-900">还没有发过帖子</h3>
          <p className="mt-1 text-sm text-gray-400">分享你的第一条内容吧</p>
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
                  {post.category.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-500">
                      {post.category.name}
                    </span>
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
