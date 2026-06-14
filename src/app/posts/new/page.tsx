"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState("tech");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, categorySlug }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "发布失败");
      setLoading(false);
    } else {
      const post = await res.json();
      router.push(`/posts/${post.id}`);
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">发布帖子</h1>
        <p className="mt-1 text-sm text-gray-500">分享你的想法、提问或资源</p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600 flex items-center gap-2">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">版块</label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 px-4 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none bg-white"
          >
            <option value="tech">💻 技术</option>
            <option value="life">🌈 生活</option>
            <option value="resource">📦 资源</option>
            <option value="qa">💡 问答</option>
            <option value="announcement">📢 公告</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 px-4 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            placeholder="起一个吸引人的标题..."
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-gray-200 p-4 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-none"
            placeholder="写下你想分享的内容..."
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                发布中...
              </span>
            ) : "发布帖子"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";
