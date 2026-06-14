"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PostActions({ postId }: { postId: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: comment }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "评论失败");
      setLoading(false);
    } else {
      setComment("");
      setLoading(false);
      router.refresh();
    }
  }

  async function handleLike() {
    setLikeLoading(true);
    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    setLikeLoading(false);
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleLike}
        disabled={likeLoading}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        点赞
      </button>

      <form onSubmit={handleComment} className="mt-4">
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-none"
          placeholder="写下你的评论..."
          required
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "提交中..." : "发表评论"}
          </button>
        </div>
      </form>
    </div>
  );
}
