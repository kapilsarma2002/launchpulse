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

  // Find all app owned by this user
  const app = await prisma.app.findMany({
    where: { ownerId: dbUser.id },
  });

  const appId = app.map(a => a.id)[0];

  // Total signups for this app
  const totalSignups = await prisma.appUser.count({
    where: { appId },
  });

  // Total referrals for this app (users with referredBy not null)
  const totalReferrals = await prisma.appUser.count({
    where: { appId, referredBy: { not: null } },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const signupsToday = await prisma.appUser.count({
    where: { appId, createdAt: { gte: today } },
  });
  const referralsToday = await prisma.appUser.count({
    where: {
      appId,
      referredBy: { not: null },
      createdAt: { gte: today },
    },
  });

  const conversionRate =
    totalSignups > 0 ? (totalReferrals / totalSignups) * 100 : 0;

  // Daily growth for last 7 days
  const dailyGrowth = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const signups = await prisma.appUser.count({
      where: { appId, createdAt: { gte: date, lt: nextDate } },
    });
    const referrals = await prisma.appUser.count({
      where: {
        appId,
        referredBy: { not: null },
        createdAt: { gte: date, lt: nextDate },
      },
    });
    dailyGrowth.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      signups,
      referrals,
    });
  }

  // Referral sources for this app
  const directCount = await prisma.appUser.count({
    where: { appId, referredBy: null },
  });
  const referralCount = await prisma.appUser.count({
    where: { appId, referredBy: { not: null } },
  });
  const referralSources = [
    { source: "Direct", count: directCount },
    { source: "Referral", count: referralCount },
  ];

  return NextResponse.json({
    totalSignups,
    totalReferrals,
    signupsToday,
    referralsToday,
    conversionRate,
    dailyGrowth,
    referralSources,
  });
}
