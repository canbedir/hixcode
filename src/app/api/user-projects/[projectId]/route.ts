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
    include: { badges: true },
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
          badges: true,
        },
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

  const isEarlyAdopter = user.badges.some(badge => badge.name === "Early Adopter");
  const isFirstProject = await prisma.project.count({ where: { userId: user.id } }) === 1;
  const isEarlyAdopterProject = isEarlyAdopter && isFirstProject;

  return NextResponse.json({
    ...projectWithoutSupports,
    likes,
    dislikes,
    userReaction,
    isEarlyAdopterProject,
    user: {
      ...projectWithoutSupports.user,
      username: projectWithoutSupports.user.username || null,
    },
  });
}
