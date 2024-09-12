import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'stars';
  const limit = parseInt(searchParams.get('limit') || '0');

  try {
    const projects = await prisma.project.findMany({
      orderBy: sort === 'lastUpdated' ? { lastUpdated: 'desc' } : { stars: 'desc' },
      take: limit > 0 ? limit : undefined,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title, description, githubUrl, username } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        userId: user.id,
        mostPopularLanguage: 'Unknown', // Varsayılan bir değer
        lastUpdated: new Date(), // Şu anki tarih
        stars: 0, // Varsayılan değer
        views: 0, // Varsayılan değer
      },
    });

    // First Project rozeti kontrolü
    const userWithProjects = await prisma.user.findUnique({
      where: { username: username },
      include: { badges: true, projects: true },
    });

    const firstProjectBadge = await prisma.badge.findFirst({
      where: { name: "First Project" },
    });

    console.log("User projects length:", userWithProjects?.projects.length);
    console.log("First Project Badge:", firstProjectBadge);
    console.log("User badges:", userWithProjects?.badges);

    if (userWithProjects && userWithProjects.projects.length > 0 && firstProjectBadge) {
      if (!userWithProjects.badges.some(b => b.id === firstProjectBadge.id)) {
        await prisma.user.update({
          where: { username: username },
          data: {
            badges: {
              connect: { id: firstProjectBadge.id },
            },
          },
        });
        console.log("First Project badge assigned to user:", username);
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Failed to create project' }, { status: 500 });
  }
}
