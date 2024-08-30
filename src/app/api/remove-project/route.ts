import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { githubUrl } = await request.json();

    if (!githubUrl) {
      return NextResponse.json({ message: 'Invalid data', error: 'GitHub URL is missing' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || undefined },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found', error: 'Invalid user' }, { status: 404 });
    }

    const deletedProject = await prisma.project.deleteMany({
      where: {
        userId: user.id,
        githubUrl: githubUrl,
      },
    });

    if (deletedProject.count === 0) {
      return NextResponse.json({ message: 'Project not found', error: 'Project does not exist or does not belong to the user' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project has been successfully removed' });
  } catch (error) {
    console.error('Error removing project:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: 'Failed to remove project', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'Failed to remove project', error: 'Unknown error' }, { status: 500 });
  }
}
