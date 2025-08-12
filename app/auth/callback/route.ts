import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const error_description = searchParams.get("error_description")

  // Handle error cases
  if (error_description) {
    console.error("Auth callback error:", error_description)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error_description)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Successful authentication
      console.log("User authenticated successfully:", data.user.email)

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error("Auth exchange error:", error)
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent(error?.message || "Authentication failed")}`,
      )
    }
  }

  // No code provided
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=${encodeURIComponent("No authentication code provided")}`,
  )
}
