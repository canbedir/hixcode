import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Octokit } from '@octokit/rest';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]/options';

const prisma = new PrismaClient();
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.projectId;
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const [owner, repo] = project.githubUrl.split('/').slice(-2);
    const { data } = await octokit.repos.get({ owner, repo });

    await prisma.project.update({
      where: { id: projectId },
      data: {
        description: data.description,
        stars: data.stargazers_count,
        lastUpdated: data.updated_at,
      },
    });

    return NextResponse.json({ message: 'Project successfully updated' });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
