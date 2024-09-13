import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { Octokit } from "@octokit/rest";

const prisma = new PrismaClient();
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
      include: { projects: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    for (const project of user.projects) {
      const [owner, repo] = project.githubUrl.split("/").slice(-2);
      const { data } = await octokit.repos.get({ owner, repo });

      await prisma.project.update({
        where: { id: project.id },
        data: {
          description: data.description,
          stars: data.stargazers_count,
          lastUpdated: data.updated_at,
        },
      });
    }

    return NextResponse.json({ message: "All projects updated successfully" });
  } catch (error) {
    console.error("Error updating projects:", error);
    return NextResponse.json(
      { error: "Failed to update projects" },
      { status: 500 }
    );
  }
}
