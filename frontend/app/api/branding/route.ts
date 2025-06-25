import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const app = await prisma.app.findFirst();
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    name: app.name,
    description: app.description,
    logoUrl: app.logoUrl,
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  let settings = await prisma.app.findFirst();
  if (settings) {
    settings = await prisma.app.update({ where: { id: settings.id }, data });
  } else {
    settings = await prisma.app.create({ data });
  }
  return NextResponse.json(settings);
} 