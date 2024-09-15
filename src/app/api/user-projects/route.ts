import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "stars";
  const limit = parseInt(searchParams.get("limit") || "0");
  const language = searchParams.get("language");
  const topic = searchParams.get("topic");
  const minStars = parseInt(searchParams.get("minStars") || "0");

  try {
    const projects = await prisma.project.findMany({
      where: {
        AND: [
          language && language !== "all"
            ? { mostPopularLanguage: { equals: language, mode: "insensitive" } }
            : {},
          topic && topic !== "all"
            ? { technologies: { has: topic.toLowerCase() } }
            : {},
          { stars: { gte: minStars } },
        ],
      },
      orderBy:
        sort === "lastUpdated" ? { lastUpdated: "desc" } : { stars: "desc" },
      take: limit > 0 ? limit : undefined,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { title, description, githubUrl, username, contributors } =
    await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        userId: user.id,
        mostPopularLanguage: "Unknown",
        lastUpdated: new Date(),
        stars: 0,
        views: 0,
        contributors: {
          create: contributors.map((contributor: any) => ({
            name: contributor.name,
            githubUrl: contributor.githubUrl,
            image: contributor.image,
          })),
        },
      },
      include: {
        contributors: true,
      },
    });


    // First Project badge check
    const userWithProjects = await prisma.user.findUnique({
      where: { username: username },
      include: { badges: true, projects: true },
    });

    const firstProjectBadge = await prisma.badge.findFirst({
      where: { name: "First Project" },
    });

    if (
      userWithProjects &&
      userWithProjects.projects.length > 0 &&
      firstProjectBadge
    ) {
      if (!userWithProjects.badges.some((b) => b.id === firstProjectBadge.id)) {
        await prisma.user.update({
          where: { username: username },
          data: {
            badges: {
              connect: { id: firstProjectBadge.id },
            },
          },
        });
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
