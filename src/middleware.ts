
import {NextRequest, NextResponse} from 'next/server';

const BLOCKED_COUNTRIES = [
  'US-NJ', 'US-PA', 'US-CT', 'US-DE', 'US-WV', 'US-MI', 'US-NV',
  'KP', 'IR', 'SY', 'CU', 'SG', 'AE',
];

const PROTECTED_ROUTES = ['/dashboard', '/wallet', '/p2p-betting', '/casino', '/sports-betting', '/review', '/investor'];

export async function middleware(req: NextRequest) {
  const {nextUrl} = req;
  const pathname = nextUrl.pathname;
  
  // --- Geo-blocking Logic ---
  const country = req.geo?.country;
  const region = req.geo?.region;
  const countryRegion = region ? `${country}-${region}` : country;

  if (pathname === '/blocked') {
    return NextResponse.next();
  }

  if (country && (BLOCKED_COUNTRIES.includes(country) || BLOCKED_COUNTRIES.includes(countryRegion ?? ''))) {
    const url = nextUrl.clone();
    url.pathname = '/blocked';
    return NextResponse.rewrite(url);
  }

  // --- Authentication Logic ---
  const sessionCookie = req.cookies.get('firebase-session');
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route) || pathname === '/dashboard');
  
  // Redirect to signin if trying to access a protected route without a session
  if (isProtectedRoute && !sessionCookie) {
    const url = nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }
  
  // If user is logged in, redirect them away from auth pages
  if((pathname === '/signin' || pathname === '/signup') && sessionCookie) {
     const url = nextUrl.clone();
     url.pathname = '/dashboard';
     return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|cards|blocked).*)',
  ],
};
