import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ message: 'Invalid data', error: 'Project ID is missing' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || undefined },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found', error: 'Invalid user' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.support.deleteMany({ where: { projectId } }),
      prisma.comment.deleteMany({ where: { projectId } }),
      prisma.contributor.deleteMany({ where: { projectId } }),
      prisma.notification.deleteMany({ where: { projectId } }),
      prisma.project.delete({ where: { id: projectId, userId: user.id } })
    ]);

    return NextResponse.json({ success: true, message: 'Project has been successfully removed' });
  } catch (error) {
    console.error('Error removing project:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: 'Failed to remove project', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'Failed to remove project', error: 'Unknown error' }, { status: 500 });
  }
}
