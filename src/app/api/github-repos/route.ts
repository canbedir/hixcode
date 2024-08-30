import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  const response = await fetch('https://api.github.com/user/repos', {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  const repos = await response.json();
  return NextResponse.json(repos);
}