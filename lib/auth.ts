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

  // Use a direct query to avoid RLS recursion issues
  const { data: organizations, error } = await supabase
    .from("organization_members")
    .select(`
      role,
      joined_at,
      organization_id,
      organizations!inner (
        id,
        name,
        slug,
        created_at
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching organizations:", error)
    return []
  }

  return organizations || []
}

export async function checkUserRole(userId: string, orgId: string): Promise<string | null> {
  const supabase = await createClient()

  // Direct query to avoid RLS issues
  const { data, error } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", userId)
    .eq("organization_id", orgId)
    .single()

  if (error) {
    console.error("Error checking user role:", error)
    return null
  }

  return data?.role || null
}

export async function requireRole(orgId: string, allowedRoles: string[]): Promise<void> {
  const user = await requireAuth()
  const userRole = await checkUserRole(user.id, orgId)

  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect("/unauthorized")
  }
}

export async function createDefaultOrganization(userId: string, userEmail: string) {
  const supabase = await createClient()

  try {
    const orgSlug = `${userEmail.split("@")[0]}-org-${Date.now()}`
    const orgName = `${userEmail.split("@")[0]}'s Organization`

    // Generate a simple encryption key (in production, use proper key derivation)
    const encryptionKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    const { data: orgId, error } = await supabase.rpc("create_organization", {
      org_name: orgName,
      org_slug: orgSlug,
      encryption_key_hash: encryptionKey,
    })

    if (error) throw error

    return orgId
  } catch (error) {
    console.error("Error creating default organization:", error)
    throw error
  }
}
