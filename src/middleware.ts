import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('legal_vani_session')?.value;
  console.log("Middleware running for:", request.nextUrl.pathname);
  console.log("Session token exists?", !!sessionToken);

  // 1. If going to the Auth page, let them through (unless they are already logged in)
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (sessionToken) {
      console.log("User has token, redirecting away from /auth to /");
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 2. For ALL OTHER PAGES, if they don't have a session, redirect to /auth
  if (!sessionToken) {
    console.log("No token found. Redirecting to /auth");
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
