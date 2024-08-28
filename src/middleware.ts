import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const url = request.nextUrl.clone();

  // Giriş yapmamış kullanıcıları korunan sayfalara yönlendir
  if (!token) {
    if (url.pathname.startsWith('/settings') || url.pathname.startsWith('/profile')) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } else {
    // Giriş yapmış kullanıcıları OAuth'a yönlendirme
    if (url.pathname.startsWith('/api/auth/signin')) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/settings/:path*', '/profile/:path*', '/api/auth/signin'],
};
