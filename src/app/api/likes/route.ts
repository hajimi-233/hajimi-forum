import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { postId } = await req.json();
    const userId = (session.user as any).id;

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({ data: { userId, postId } });

    // Notify post author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, title: true },
    });

    if (post && post.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: "like",
          message: `${session.user.name} 赞了你的帖子「${post.title}」`,
          link: `/posts/${postId}`,
        },
      });
    }

    return NextResponse.json({ liked: true });
  } catch (error) {
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
