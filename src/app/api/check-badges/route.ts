import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { badges: true, projects: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const firstProjectBadge = await prisma.badge.findFirst({
      where: { name: "First Project" },
    });

    const newBadges = [];

    if (user.projects.length > 0 && firstProjectBadge && !user.badges.some(b => b.id === firstProjectBadge.id)) {
      await prisma.user.update({
        where: { email },
        data: {
          badges: {
            connect: { id: firstProjectBadge.id },
          },
        },
      });
      newBadges.push(firstProjectBadge);
    }

    return NextResponse.json({ newBadges });
  } catch (error) {
    console.error('Error checking badges:', error);
    return NextResponse.json({ message: 'Failed to check badges' }, { status: 500 });
  }
}
