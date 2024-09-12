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
  const { badgeId, projectId, userId } = await req.json();

  if (projectId) {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        badges: {
          connect: { id: badgeId },
        },
      },
    });
  }

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        badges: {
          connect: { id: badgeId },
        },
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const badges = await prisma.badge.findMany();
  console.log("All badges:", badges);

  if (badges.length === 0) {
    // Eğer rozet yoksa, varsayılan rozetleri oluştur
    const defaultBadges = [
      { name: "First Project", description: "İlk projenizi oluşturdunuz!", icon: "🏆" },
      { name: "Early Adopter", description: "İlk 100 kullanıcıdan birisiniz!", icon: "🚀" },
      { name: "100 Likes", description: "Projeleriniz toplamda 100 beğeni aldı!", icon: "💯" },
    ];

    for (const badge of defaultBadges) {
      await prisma.badge.create({ data: { ...badge } });
    }

    const createdBadges = await prisma.badge.findMany();
    console.log("Created default badges:", createdBadges);
    return NextResponse.json(createdBadges);
  }

  return NextResponse.json(badges);
}
