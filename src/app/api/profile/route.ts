import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user?.email ?? undefined;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  return NextResponse.json({ bio: user?.bio });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { bio } = await req.json();

  await prisma.user.update({
    where: { email: session.user?.email || undefined },
    data: { bio },
  });

  return NextResponse.json({ message: "Profile settings updated successfully!" });
}