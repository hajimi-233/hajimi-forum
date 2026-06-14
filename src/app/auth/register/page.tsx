"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "注册失败");
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  }

  return (
    <div className="flex min-h-[80vh]">
      {/* 左侧表单 */}
      <div className="flex w-full items-center justify-center bg-white px-4 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">注册</h1>
            <p className="mt-1 text-sm text-gray-500">加入 Hajimi，开启社区之旅</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600 flex items-center gap-2">
              <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">用户名</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  placeholder="你的名字"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">邮箱</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">密码</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  placeholder="至少 6 位密码"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  注册中...
                </span>
              ) : "注册"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            已有账号？{" "}
            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              立即登录 &rarr;
            </Link>
          </p>
        </div>
      </div>

      {/* 右侧装饰 */}
      <div className="hidden w-1/2 lg:flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-400">
        <div className="text-center text-white px-12">
          <div className="mb-4 text-6xl">✨</div>
          <h2 className="text-3xl font-bold">加入我们</h2>
          <p className="mt-3 text-base text-white/80">
            在 Hajimi 分享你的故事，发现更多有趣的人和事。
          </p>
        </div>
      </div>
    </div>
  );
}
