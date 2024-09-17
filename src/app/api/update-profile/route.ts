import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";
import { Octokit } from "@octokit/rest";

const prisma = new PrismaClient();
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.githubId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: githubUser } = await octokit.users.getByUsername({
      username: user.username || "",
    });

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: githubUser.name || user.name,
        image: githubUser.avatar_url || user.image,
        username: githubUser.login.toLowerCase(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
