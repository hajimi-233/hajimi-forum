import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { title, content, categorySlug } = await req.json();

    if (!title || !content || !categorySlug) {
      return NextResponse.json({ error: "请填写所有字段" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return NextResponse.json({ error: "版块不存在" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: (session.user as any).id,
        categoryId: category.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}
