import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');

  try {
    let projects;
    if (limit === 'all') {
      projects = await prisma.project.findMany({
        orderBy: { stars: 'desc' },
      });
    } else {
      projects = await prisma.project.findMany({
        orderBy: { stars: 'desc' },
        take: 5,
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Failed to fetch projects' }, { status: 500 });
  }
}
