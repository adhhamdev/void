import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const secretId = params.id

    // Get secret versions with user info
    const { data: versions, error } = await supabase
      .from("secret_versions")
      .select(`
        id,
        version,
        encrypted_value,
        created_at,
        profiles!secret_versions_created_by_fkey (
          full_name,
          email
        )
      `)
      .eq("secret_id", secretId)
      .order("version", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get current secret info
    const { data: currentSecret, error: secretError } = await supabase
      .from("secrets")
      .select(`
        version,
        encrypted_value,
        created_at,
        profiles!secrets_created_by_fkey (
          full_name,
          email
        )
      `)
      .eq("id", secretId)
      .single()

    if (secretError) {
      return NextResponse.json({ error: secretError.message }, { status: 400 })
    }

    // Combine current version with historical versions
    const allVersions = [
      {
        id: `current-${currentSecret.version}`,
        version: currentSecret.version,
        encrypted_value: currentSecret.encrypted_value,
        created_at: currentSecret.created_at,
        profiles: currentSecret.profiles,
        status: "current",
      },
      ...versions.map((v) => ({
        ...v,
        status: "archived",
      })),
    ]

    return NextResponse.json({ versions: allVersions })
  } catch (error: any) {
    console.error("Error fetching secret versions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
