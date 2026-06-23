import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(req: Request, props: { params: Promise<{ projectId: string }> }) {
  const params = await props.params;
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

// Owner-only edit: lets the project creator customize presentation + details.
export async function PATCH(req: Request, props: { params: Promise<{ projectId: string }> }) {
  const params = await props.params;
  const { projectId } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: { select: { email: true } } },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    if (project.user.email !== session.user.email) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Only these fields are owner-editable; stats stay server-owned.
    const data: Record<string, unknown> = {};
    if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
    if (typeof body.description === "string") data.description = body.description;
    if (typeof body.technicalDetails === "string") data.technicalDetails = body.technicalDetails;
    if (typeof body.liveUrl === "string") data.liveUrl = body.liveUrl;
    if (Array.isArray(body.technologies)) {
      data.technologies = body.technologies.filter((t: unknown) => typeof t === "string");
    }
    if (typeof body.coverImage === "string") data.coverImage = body.coverImage || null;
    if (typeof body.headerStyle === "string") data.headerStyle = body.headerStyle || null;
    if (typeof body.headerColor === "string") data.headerColor = body.headerColor || null;

    const updated = await prisma.project.update({
      where: { id: projectId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
