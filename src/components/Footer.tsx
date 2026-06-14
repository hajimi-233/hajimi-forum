import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                H
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">Hajimi</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">一个简约、友好的社区论坛。分享知识，连接彼此。</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">版块</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/categories/tech" className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200">技术</Link>
              <Link href="/categories/life" className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200">生活</Link>
              <Link href="/categories/resource" className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200">资源</Link>
              <Link href="/categories/qa" className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200">问答</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">关于</h3>
            <p className="text-xs text-gray-400">
              Next.js + TypeScript + Prisma + SQLite 全栈项目。从零学习，亲手搭建。
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-50 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Hajimi. 用 ❤️ 和代码搭建。
        </div>
      </div>
    </footer>
  );
}
