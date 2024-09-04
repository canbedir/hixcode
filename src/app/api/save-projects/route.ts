import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function fetchRepoLanguages(repoUrl: string, accessToken: string) {
  const response = await fetch(`${repoUrl}/languages`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch languages for repo: ${repoUrl}`);
  }

  const languages = await response.json();
  return languages;
}

function getMostPopularLanguage(languages: Record<string, number>) {
  let maxLanguage = '';
  let maxSize = 0;

  for (const [language, size] of Object.entries(languages)) {
    if (size > maxSize) {
      maxLanguage = language;
      maxSize = size;
    }
  }

  return maxLanguage;
}

async function fetchRepoDetails(repoUrl: string, accessToken: string) {
  const response = await fetch(repoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repo data: ${repoUrl}`);
  }

  const repoData = await response.json();
  return {
    stars: repoData.stargazers_count,
    lastUpdated: repoData.pushed_at,
  };
}

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

    const accessToken = session.accessToken as string;

    for (const repo of repos) {
      const languages = await fetchRepoLanguages(repo.url, accessToken);
      const mostPopularLanguage = getMostPopularLanguage(languages);
      const repoDetails = await fetchRepoDetails(repo.url, accessToken);

      await prisma.project.create({
        data: {
          title: repo.name,
          description: repo.description || '',
          githubUrl: repo.html_url,
          image: repo.image || null,
          userId: user.id,
          mostPopularLanguage,
          stars: repoDetails.stars,
          lastUpdated: repoDetails.lastUpdated,
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
