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
