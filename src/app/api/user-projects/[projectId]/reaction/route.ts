import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { checkAndAssignBadges } from '@/lib/badgeUtils';

export async function POST(
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

  const { type } = await req.json();

  const existingReaction = await prisma.support.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId,
      },
    },
  });

  if (existingReaction) {
    if (existingReaction.type === type || type === null) {
      await prisma.support.delete({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId,
          },
        },
      });
    } else {
      await prisma.support.update({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId,
          },
        },
        data: { type },
      });
    }
  } else if (type) {
    await prisma.support.create({
      data: {
        userId: user.id,
        projectId,
        type,
      },
    });
  }
  console.log(user, "userrrrr");
  console.log("User's current badges:", user.badges || []);

  const updatedProject = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      supports: true,
    },
  });

  if (!updatedProject) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const likes = updatedProject.supports.filter((s) => s.type === "like").length;
  const dislikes = updatedProject.supports.filter(
    (s) => s.type === "dislike"
  ).length;

  await prisma.project.update({
    where: { id: projectId },
    data: { likes, dislikes },
  });

  const totalLikes = await prisma.project.aggregate({
    where: { userId: user.id },
    _sum: { likes: true }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { totalLikes: totalLikes._sum.likes || 0 },
  });

  const updatedUser = await prisma.user.findUnique({
    where: { username: user.username },
    include: { badges: true },
  });
  console.log("Updated user badges after assignment:", updatedUser?.badges);

  return NextResponse.json({
    likes,
    dislikes,
    userReaction: type,
  });
}
