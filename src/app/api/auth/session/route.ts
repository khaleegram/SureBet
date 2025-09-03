
import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';

const FIREBASE_SESSION_COOKIE_NAME = 'firebase-session';
const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  const {idToken} = await request.json();

  if (!idToken) {
    return NextResponse.json(
      {error: 'idToken is required.'},
      {
        status: 400,
      }
    );
  }

  cookies().set(FIREBASE_SESSION_COOKIE_NAME, idToken, {
    maxAge: SEVEN_DAYS_IN_SECONDS,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return NextResponse.json({message: 'Session created successfully.'});
}

export async function DELETE() {
  cookies().delete(FIREBASE_SESSION_COOKIE_NAME);
  return NextResponse.json({message: 'Session deleted successfully.'});
}
