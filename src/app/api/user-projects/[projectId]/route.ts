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
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user?.email;
  const user = await prisma.user.findUnique({
    where: { email: userEmail || "" },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          username: true,
        }
      },
      supports: true,
    },
  });

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const userReaction = project.supports.find(s => s.userId === user.id)?.type || null;

  const { supports, ...projectWithoutSupports } = project;
  const likes = supports.filter(s => s.type === 'like').length;
  const dislikes = supports.filter(s => s.type === 'dislike').length;

  return NextResponse.json({
    ...projectWithoutSupports,
    likes,
    dislikes,
    userReaction,
    user: {
      ...projectWithoutSupports.user,
      username: projectWithoutSupports.user.username || null,
    },
  });
}
