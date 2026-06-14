import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "技术", slug: "tech", description: "讨论编程、技术、工具相关内容" },
    { name: "生活", slug: "life", description: "聊聊日常生活和兴趣爱好" },
    { name: "资源", slug: "resource", description: "分享和发现优质资源" },
    { name: "问答", slug: "qa", description: "提问和回答问题" },
    { name: "公告", slug: "announcement", description: "社区公告和规则" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Seed completed: categories created.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
