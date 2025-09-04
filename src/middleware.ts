
import {NextRequest, NextResponse} from 'next/server';

const BLOCKED_COUNTRIES = [
  'US-NJ', 'US-PA', 'US-CT', 'US-DE', 'US-WV', 'US-MI', 'US-NV',
  'KP', 'IR', 'SY', 'CU', 'SG', 'AE',
];

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

  // Client-side logic in AuthProvider now handles auth-based redirects.
  // The session cookie is still used for server-side actions or potential future API route protection,
  // but it's no longer used here for page-level redirects.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|cards|blocked).*)',
  ],
};
