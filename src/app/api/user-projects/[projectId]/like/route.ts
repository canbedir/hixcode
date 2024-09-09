import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Oturum bilgilerini almak için ekliyoruz
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

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
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const existingSupport = await prisma.support.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId,
      },
    },
  });

  if (existingSupport) {
    if (existingSupport.type === "like") {
      await prisma.support.delete({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId,
          },
        },
      });
      await prisma.project.update({
        where: { id: projectId },
        data: {
          likes: { decrement: 1 },
        },
      });
      return NextResponse.json({ message: "Like removed" });
    }

    if (existingSupport.type === "dislike") {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          dislikes: { decrement: 1 },
        },
      });
    }
  }

  await prisma.support.upsert({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId,
      },
    },
    update: {
      type: "like",
    },
    create: {
      userId: user.id,
      projectId,
      type: "like",
    },
  });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      likes: { increment: 1 },
    },
  });

  const updatedProject = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      likes: true,
      dislikes: true,
    },
  });

  return NextResponse.json(updatedProject);
}

