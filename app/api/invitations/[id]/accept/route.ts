import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from("organization_invitations")
      .select("*")
      .eq("id", params.id)
      .eq("status", "pending")
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Check if the invitation is for the current user's email
    const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single()

    if (profile?.email !== invitation.email) {
      return NextResponse.json({ error: "Invitation not for this user" }, { status: 403 })
    }

    // Start transaction: Add member and update invitation
    const { error: memberError } = await supabase.from("organization_members").insert({
      organization_id: invitation.organization_id,
      user_id: user.id,
      role: invitation.role,
      joined_at: new Date().toISOString(),
    })

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from("organization_invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Invitation accepted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
