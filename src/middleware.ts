import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-up(.*)', '/sign-in(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();
  const pathname = req.nextUrl.pathname;
  const onBoardingCompleted = sessionClaims?.metadata.onboardingComplete;

  // Landing page is always accessible
  if (pathname === '/') return NextResponse.next();

  // If user is auth, hasn't completed onboarding and tries to access it => Allow it
  if (userId && pathname === '/onboarding') return NextResponse.next();

  // If user is auth and doesn't have onboarding set to true => Redirect to onboarding
  if (userId && !onBoardingCompleted) {
    const onboardingUrl = new URL('/onboarding', req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If user is auth, has completed onboarding and tries to access it => Redirect to dashboard
  if (userId && onBoardingCompleted && pathname === '/onboarding') {
    const onboardingUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If user is auth and route is private => It's OK to see it
  if (userId && !isPublicRoute(req)) return NextResponse.next();

  // Protect private routes
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
