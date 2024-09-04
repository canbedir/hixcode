import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Octokit } from "@octokit/rest";

const prisma = new PrismaClient();
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export async function POST() {
  try {
    const projects = await prisma.project.findMany();

    for (const project of projects) {
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

    return NextResponse.json({ message: 'Projeler başarıyla güncellendi' });
  } catch (error) {
    console.error('Projeler güncellenirken hata oluştu:', error);
    return NextResponse.json({ error: 'Projeler güncellenemedi' }, { status: 500 });
  }
}
