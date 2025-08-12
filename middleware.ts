import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Refresh session if expired - this is important for magic links
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Log authentication status for debugging
  if (process.env.NODE_ENV === "development") {
    console.log("Middleware - User:", user?.email || "Not authenticated")
    console.log("Middleware - Path:", request.nextUrl.pathname)
  }

  // Protected routes
  const protectedPaths = ["/dashboard", "/projects", "/secrets", "/team", "/settings", "/logs", "/folders"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Auth routes that authenticated users shouldn't access
  const authPaths = ["/auth"]
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages (except callback and error pages)
  if (
    isAuthPath &&
    user &&
    !request.nextUrl.pathname.includes("/callback") &&
    !request.nextUrl.pathname.includes("/error")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
