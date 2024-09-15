import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

  const body = await req.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json(
      { message: "Comment content is required" },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      projectId,
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          username: true,
        },
      },
      project: {
        select: {
          userId: true,
          title: true,
        },
      },
    },
  });

  if (comment.project.userId !== user.id) {
    await prisma.notification.create({
      data: {
        userId: comment.project.userId,
        content: `<b>${user.name}</b> commented on your project "<b>${comment.project.title}</b>"`,
        type: "comment",
        projectId: projectId,
      },
    });
  }

  return NextResponse.json(comment, { status: 201 });
}

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  const comments = await prisma.comment.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}
