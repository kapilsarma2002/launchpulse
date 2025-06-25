import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json([], { status: 401 });
  }


  // Find the platform user record
  const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
  if (!dbUser) {
    return NextResponse.json([], { status: 404 });
  }

  // Find all SiteSettings (apps) owned by this user
  const app = await prisma.app.findMany({
    where: { ownerId: dbUser.id },
  });

  const appId = app.map(a => a.id);

  console.log("app, appId", app, appId);

  // Find all AppUsers for these apps
  const users = await prisma.appUser.findMany({
    where: { 
      appId: { in: appId },
    },
    select: { id: true, email: true, createdAt: true },
  });
  return NextResponse.json(users);
}
