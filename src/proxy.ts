import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/session'

const protectedRoutes = ['/admin']
const authRoutes = ['/login', '/register']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.includes(path)

  const cookie = req.cookies.get('session')?.value
  const session = cookie ? await decrypt(cookie) : null

  // 1. Redirect unauthenticated to login for protected routes
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 2. Redirect authenticated away from login/register
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  // 3. Admin role check
  if (path.startsWith('/admin') && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
