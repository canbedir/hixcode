import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  try {
    const contributors = await prisma.contributor.findMany({
      where: { projectId },
    });

    return NextResponse.json(contributors);
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return NextResponse.json(
      { message: "Failed to fetch contributors" },
      { status: 500 }
    );
  }
}
