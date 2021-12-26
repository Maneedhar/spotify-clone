import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // token will exist if user is logged in
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith('https://') ??
      !!process.env.VERCEL_URL,
  });

  const { pathname } = req.nextUrl;

  if (token && pathname === '/login') return NextResponse.redirect('/');

  // allow requests if
  // 1. token exists
  // 2. if it's a request for next-auth session
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }

  // redirect to login if there's no token and are requesting a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login');
  }
}
