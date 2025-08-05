import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) {
    redirect("/auth")
  }
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`)
  }

  return profile
}

export async function getUserOrganizations(userId: string) {
  const supabase = await createClient()
  const { data: organizations, error } = await supabase
    .from("organization_members")
    .select(`
      role,
      joined_at,
      organizations (
        id,
        name,
        slug,
        created_at
      )
    `)
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to fetch user organizations: ${error.message}`)
  }

  return organizations
}

export async function checkUserRole(userId: string, orgId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_user_org_role", { org_id: orgId })

  if (error) {
    console.error("Error checking user role:", error)
    return null
  }

  return data
}

export async function requireRole(orgId: string, allowedRoles: string[]): Promise<void> {
  const user = await requireAuth()
  const userRole = await checkUserRole(user.id, orgId)

  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect("/unauthorized")
  }
}
