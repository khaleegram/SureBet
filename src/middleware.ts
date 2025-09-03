
import {NextRequest, NextResponse} from 'next/server';
import {get} from '@vercel/edge-config';

// List of blocked countries (ISO 3166-1 alpha-2 codes)
// In a real app, this would likely be managed in a CMS or a feature flag system.
const BLOCKED_COUNTRIES = [
  'US-NJ', // New Jersey
  'US-PA', // Pennsylvania
  'US-CT', // Connecticut
  'US-DE', // Delaware
  'US-WV', // West Virginia
  'US-MI', // Michigan
  'US-NV', // Nevada (example of state with specific regulations)
  'KP', // North Korea
  'IR', // Iran
  'SY', // Syria
  'CU', // Cuba
  'SG', // Singapore
  'AE', // United Arab Emirates
];

export async function middleware(req: NextRequest) {
  const {nextUrl} = req;
  const country = req.geo?.country;
  const city = req.geo?.city;
  const region = req.geo?.region; // Provides state/province code for some countries like US and CA

  const countryRegion = region ? `${country}-${region}` : country;

  // Allow access to the blocked page itself
  if (nextUrl.pathname === '/blocked') {
    return NextResponse.next();
  }

  // We are checking for blocked countries and US states.
  if (country && (BLOCKED_COUNTRIES.includes(country) || BLOCKED_COUNTRIES.includes(countryRegion ?? ''))) {
    // Clone the URL and change its pathname to point to the /blocked page
    const url = nextUrl.clone();
    url.pathname = '/blocked';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Apply the middleware to all routes except for static assets and API routes.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|cards|blocked).*)',
  ],
};
