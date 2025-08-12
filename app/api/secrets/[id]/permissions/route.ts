import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get secret permissions with user details
    const { data: permissions, error } = await supabase
      .from("secret_permissions")
      .select(`
        id,
        permission_level,
        granted_at,
        expires_at,
        user:profiles!secret_permissions_user_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        ),
        granted_by_user:profiles!secret_permissions_granted_by_fkey(
          full_name,
          email
        )
      `)
      .eq("secret_id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ permissions })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user_id, permission_level, expires_at } = await request.json()

    if (!user_id || !permission_level) {
      return NextResponse.json({ error: "User ID and permission level are required" }, { status: 400 })
    }

    // Check if user has permission to grant access to this secret
    const { data: secret } = await supabase
      .from("secrets")
      .select(`
        id,
        project:projects!inner(
          organization_id,
          organization_members!inner(
            role,
            user_id
          )
        )
      `)
      .eq("id", params.id)
      .eq("project.organization_members.user_id", user.id)
      .single()

    if (!secret) {
      return NextResponse.json({ error: "Secret not found or insufficient permissions" }, { status: 404 })
    }

    // Check if user is admin/owner or has admin permission on this secret
    const hasOrgPermission = secret.project.organization_members.some(
      (member: any) => member.user_id === user.id && ["owner", "admin"].includes(member.role),
    )

    if (!hasOrgPermission) {
      // Check if user has admin permission on this specific secret
      const { data: secretPermission } = await supabase
        .from("secret_permissions")
        .select("permission_level")
        .eq("secret_id", params.id)
        .eq("user_id", user.id)
        .single()

      if (!secretPermission || secretPermission.permission_level !== "admin") {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }

    // Create or update permission
    const { data: permission, error } = await supabase
      .from("secret_permissions")
      .upsert({
        secret_id: params.id,
        user_id,
        permission_level,
        granted_by: user.id,
        expires_at: expires_at || null,
      })
      .select(`
        id,
        permission_level,
        granted_at,
        expires_at,
        user:profiles!secret_permissions_user_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ permission }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Delete permission
    const { error } = await supabase
      .from("secret_permissions")
      .delete()
      .eq("secret_id", params.id)
      .eq("user_id", userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Permission removed successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
