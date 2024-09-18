import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { name, description, icon } = await req.json();

  const badge = await prisma.badge.create({
    data: {
      name,
      description,
      icon,
    },
  });

  return NextResponse.json(badge);
}

export async function PUT(req: Request) {
  const { id, name, description, icon } = await req.json();

  try {
    const updatedBadge = await prisma.badge.update({
      where: { id },
      data: { name, description, icon },
    });

    return NextResponse.json(updatedBadge);
  } catch (error) {
    console.error('Error updating badge:', error);
    return NextResponse.json({ error: 'Failed to update badge' }, { status: 500 });
  }
}

export async function GET() {
  const badges = await prisma.badge.findMany();

  if (badges.length === 0) {
    const defaultBadges = [
      { name: "Early Adopter", description: "You're one of the first 100 users!", icon: "/early-adopter.svg" },
      { name: "First Project", description: "You've created your first project!", icon: "/first-project.svg" },
      { name: "100 Likes", description: "Your projects have received a total of 100 likes!", icon: "/100-likes.svg" },
    ];

    for (const badge of defaultBadges) {
      await prisma.badge.create({ data: { ...badge } });
    }

    const createdBadges = await prisma.badge.findMany();
    return NextResponse.json(createdBadges);
  }

  return NextResponse.json(badges);
}
