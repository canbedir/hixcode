import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { repos } = await request.json();

    if (!repos || repos.length === 0) {
      return NextResponse.json({ message: 'Geçersiz veri', error: 'Repolar eksik' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || undefined },
    });

    if (!user) {
      return NextResponse.json({ message: 'Kullanıcı bulunamadı', error: 'Geçersiz kullanıcı' }, { status: 404 });
    }

    // Projeleri kaydet
    for (const repo of repos) {
      await prisma.project.create({
        data: {
          title: repo.name,
          description: repo.description || '',
          githubUrl: repo.html_url,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Projeler başarıyla kaydedildi' });
  } catch (error) {
    console.error('Projeleri kaydederken hata oluştu:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: 'Projeleri kaydetme başarısız oldu', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'Projeleri kaydetme başarısız oldu', error: 'Bilinmeyen hata' }, { status: 500 });
  }
}