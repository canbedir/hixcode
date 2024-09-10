import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Oturum bilgilerini almak için ekliyoruz
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  // Session kontrolü
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Proje bulunuyor mu kontrolü
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  // Views artırılıyor
  await prisma.project.update({
    where: { id: projectId },
    data: {
      views: { increment: 1 },
    },
  });

  return NextResponse.json({ message: "View updated successfully" }, { status: 200 });
}
