import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true }
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.user.email !== session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { isPinned: !project.isPinned },
    });

    return NextResponse.json({ 
      message: updatedProject.isPinned ? 'Project pinned successfully' : 'Project unpinned successfully',
      isPinned: updatedProject.isPinned
    });
  } catch (error) {
    console.error('Error updating project pin status:', error);
    return NextResponse.json({ error: 'Failed to update project pin status' }, { status: 500 });
  }
}