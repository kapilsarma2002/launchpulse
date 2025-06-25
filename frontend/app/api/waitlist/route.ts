import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const appName = searchParams.get('appName');

  if (!appName) {
    return NextResponse.json({ error: 'App name is required' }, { status: 400 });
  }

  try {
    const branding = await prisma.app.findFirst({
      where: { 
        name: {
          equals: appName,
          mode: 'insensitive'
        }
      }
    });
    
    if (!branding) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    const userCount = await prisma.appUser.count({
        where: { appId: branding.id }
    });

    return NextResponse.json({ branding, userCount });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch waitlist data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, appName } = await req.json();

    if (!email || !appName) {
      return NextResponse.json({ error: 'Email and app name are required' }, { status: 400 });
    }

    const app = await prisma.app.findFirst({
      where: { 
        name: {
          equals: appName,
          mode: 'insensitive'
        }
      }
    });

    if (!app) {
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    const existingUser = await prisma.appUser.findFirst({ where: { email, appId: app.id } });
    if (existingUser) {
      return NextResponse.json({ error: 'This email is already on the waitlist for this app.' }, { status: 409 });
    }

    const newUser = await prisma.appUser.create({
      data: {
        email,
        appId: app.id,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add user to waitlist' }, { status: 500 });
  }
} 