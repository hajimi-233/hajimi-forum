import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { postId, content } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: (session.user as any).id,
      },
    });

    // Notify post author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, title: true },
    });

    if (post && post.userId !== (session.user as any).id) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: "reply",
          message: `${session.user.name} 评论了你的帖子「${post.title}」`,
          link: `/posts/${postId}`,
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "评论失败" }, { status: 500 });
  }
}
