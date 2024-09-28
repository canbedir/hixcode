import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            username: true,
            badges: true,
          },
        },
        supports: true,
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const { supports, ...projectWithoutSupports } = project;
    const likes = supports.filter(s => s.type === 'like').length;
    const dislikes = supports.filter(s => s.type === 'dislike').length;

    return NextResponse.json({
      ...projectWithoutSupports,
      likes,
      dislikes,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
