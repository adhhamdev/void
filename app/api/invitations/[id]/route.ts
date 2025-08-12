import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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

    // Get invitation to check permissions
    const { data: invitation, error: inviteError } = await supabase
      .from("organization_invitations")
      .select("organization_id, invited_by")
      .eq("id", params.id)
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Check if user has permission to cancel (admin/owner or the person who sent it)
    const { data: membership } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", invitation.organization_id)
      .eq("user_id", user.id)
      .single()

    const canCancel = invitation.invited_by === user.id || (membership && ["owner", "admin"].includes(membership.role))

    if (!canCancel) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Cancel invitation
    const { error } = await supabase
      .from("organization_invitations")
      .update({ status: "cancelled" })
      .eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Invitation cancelled successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
