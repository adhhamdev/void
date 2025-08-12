import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user preferences
    const { data: preferences, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If no preferences exist, create default ones
    if (!preferences) {
      const { data: newPreferences, error: createError } = await supabase
        .from("user_preferences")
        .insert({
          user_id: user.id,
          theme: "system",
          email_notifications: true,
          slack_notifications: false,
          notification_events: {
            secret_accessed: true,
            secret_modified: true,
            team_member_added: true,
            failed_login: true,
            api_key_usage: true,
          },
          two_factor_enabled: false,
          session_timeout: 30,
          timezone: "UTC",
          date_format: "MM/DD/YYYY",
          time_format: "12h",
          api_rate_limit: 1000,
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      return NextResponse.json({ preferences: newPreferences })
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    // Update user preferences
    const { data: preferences, error } = await supabase
      .from("user_preferences")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
