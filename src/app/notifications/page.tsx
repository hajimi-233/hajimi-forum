import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { markAllRead } from "./actions";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = (session.user as any).id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeIcons: Record<string, string> = {
    reply: "💬",
    like: "❤️",
    system: "📢",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知</h1>
          {unreadCount > 0 && (
            <p className="mt-0.5 text-sm text-gray-400">{unreadCount} 条未读</p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200">
              全部标为已读
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-3 text-3xl">🔔</div>
          <h3 className="text-lg font-semibold text-gray-900">暂无通知</h3>
          <p className="mt-1 text-sm text-gray-400">当有人回复或点赞你的帖子时，你会收到通知</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border bg-white p-4 transition ${
                !notification.read
                  ? "border-indigo-100 bg-indigo-50/30"
                  : "border-gray-100"
              }`}
            >
              {notification.link ? (
                <Link href={notification.link} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">
                    {typeIcons[notification.type] || "📌"}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-medium text-gray-900" : "text-gray-500"}`}>
                      {notification.message}
                    </p>
                    <span className="mt-1 text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  {!notification.read && (
                    <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </Link>
              ) : (
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">
                    {typeIcons[notification.type] || "📌"}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-medium text-gray-900" : "text-gray-500"}`}>
                      {notification.message}
                    </p>
                    <span className="mt-1 text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  {!notification.read && (
                    <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
