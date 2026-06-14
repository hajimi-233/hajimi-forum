"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAllRead() {
  const session = await auth();
  if (!session?.user) return;

  await prisma.notification.updateMany({
    where: { userId: (session.user as any).id, read: false },
    data: { read: true },
  });

  revalidatePath("/notifications");
}
