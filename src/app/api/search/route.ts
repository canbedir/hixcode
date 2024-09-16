import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Arama sorgusu gerekli" },
      { status: 400 }
    );
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        stars: true,
        mostPopularLanguage: true,
        lastUpdated: true,
        user: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    const projectResults = projects.map((project) => ({
      ...project,
      type: "project" as const,
    }));

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
    });

    const userResults = users.map((user) => ({
      ...user,
      type: "user" as const,
    }));

    const results = [...projectResults, ...userResults];
    return NextResponse.json(results);
  } catch (error) {
    console.error("Arama hatası:", error);
    return NextResponse.json(
      { error: "Arama işlemi başarısız oldu" },
      { status: 500 }
    );
  }
}
