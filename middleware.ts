import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const pathname = req.nextUrl.pathname

    const isAuthRoute = ["/login", "/register"].includes(pathname)
    const isProtectedRoute = [
      "/dashboard",
      "/transactions",
      "/goals",
      "/reports",
      "/account",
    ].some((route) => pathname.startsWith(route))

    if (pathname === "/") {
      return session
        ? NextResponse.redirect(new URL("/dashboard", req.url))
        : NextResponse.redirect(new URL("/login", req.url))
    }

    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/transactions/:path*',
    '/goals/:path*',
    '/reports/:path*',
    '/account/:path*',
  ],
}
