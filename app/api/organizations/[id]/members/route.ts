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

    // Get organization members
    const { data: members, error } = await supabase
      .from("organization_members")
      .select(`
        id,
        role,
        joined_at,
        last_active,
        user:profiles!organization_members_user_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("organization_id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get secrets access count for each member
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const { count } = await supabase
          .from("secrets")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", params.id)
          .eq("created_by", member.user.id)

        return {
          ...member,
          secretsAccess: count || 0,
        }
      }),
    )

    return NextResponse.json({ members: membersWithStats })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
