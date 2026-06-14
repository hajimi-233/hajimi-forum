import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function Header() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  let unreadCount = 0;
  if (userId) {
    unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });
  }

  const categories = await prisma.category.findMany({ take: 6 });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
              H
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Hajimi
            </span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              首页
            </Link>
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href="/posts/new"
                className="flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                发帖
              </Link>
              <Link
                href="/notifications"
                className="relative rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white">
                  {session.user.name?.[0] || "?"}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 md:block">
                  {session.user.name}
                </span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-lg px-2 py-1.5 text-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                  退出
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
