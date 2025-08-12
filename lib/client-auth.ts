import { supabase } from "@/lib/supabase/client"

export async function createDefaultOrganization(userId: string, userEmail: string) {
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

export async function checkUserHasOrganization(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId)
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error
      throw error
    }

    return !!data
  } catch (error) {
    console.error("Error checking user organization:", error)
    return false
  }
}
