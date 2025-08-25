import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default async function middleware(request: NextRequest) {
  const token = (await cookies()).get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware: Pathname -', pathname);
  console.log('Middleware: Token -', token ? 'Present' : 'Not Present');

  const protectedPaths = [
    '/marcas',
    '/marcas/nueva-marca',
    '/marcas/nueva-marca-w',
    '/marcas/[brandId]',
  ];

  const publicAuthPaths = [
    '/auth/login',
    '/auth/registro',
  ];

  const isProtectedPath = protectedPaths.some(path => {
    const regexPath = path.replace(/\[.*?\]/g, '.*');
    return new RegExp(`^${regexPath}$`).test(pathname);
  });

  const isPublicAuthPath = publicAuthPaths.includes(pathname);

  if (!token && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (token && isPublicAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/marcas';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/marcas',
    '/marcas/nueva-marca',
    '/marcas/nueva-marca-w',
    '/marcas/[brandId]',
    '/auth/login',
    '/auth/registro',
  ],
};
