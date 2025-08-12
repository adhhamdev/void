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

    // Get pending invitations for the organization
    const { data: invitations, error } = await supabase
      .from("organization_invitations")
      .select(`
        id,
        email,
        role,
        status,
        created_at,
        invited_by:profiles!organization_invitations_invited_by_fkey(
          full_name,
          email
        )
      `)
      .eq("organization_id", params.id)
      .eq("status", "pending")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ invitations })
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

    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 })
    }

    // Check if user has permission to invite (admin or owner)
    const { data: membership } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", params.id)
      .eq("user_id", user.id)
      .single()

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", params.id)
      .eq("email", email)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 })
    }

    // Check if invitation already exists
    const { data: existingInvite } = await supabase
      .from("organization_invitations")
      .select("id")
      .eq("organization_id", params.id)
      .eq("email", email)
      .eq("status", "pending")
      .single()

    if (existingInvite) {
      return NextResponse.json({ error: "Invitation already sent" }, { status: 400 })
    }

    // Create invitation
    const { data: invitation, error } = await supabase
      .from("organization_invitations")
      .insert({
        organization_id: params.id,
        email,
        role,
        invited_by: user.id,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // TODO: Send invitation email
    // This would integrate with your email service (SendGrid, Resend, etc.)

    return NextResponse.json({ invitation }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
