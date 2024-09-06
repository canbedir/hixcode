import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');

  try {
    let projects;
    if (limit === 'all') {
      projects = await prisma.project.findMany({
        orderBy: { lastUpdated: "desc" },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    } else {
      projects = await prisma.project.findMany({
        orderBy: { lastUpdated: "desc" },
        take: 6,
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch user projects" },
      { status: 500 }
    );
  }
}
