import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const response = NextResponse.next();

  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://humane-starfish-17.clerk.accounts.dev https://js.stripe.com https://checkout.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://humane-starfish-17.clerk.accounts.dev https://jewwyqibqseunzipxdcj.supabase.co https://api.stripe.com",
      "frame-src 'self' https://humane-starfish-17.clerk.accounts.dev https://js.stripe.com https://checkout.stripe.com",
    ].join('; ')
  );

  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|[^?]*\\.[^?]*$).*)",
    "/(api|trpc)(.*)",
  ],
};