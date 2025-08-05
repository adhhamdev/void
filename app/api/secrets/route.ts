import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { OrganizationCrypto } from "@/lib/crypto"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { projectId, folderId, name, value, description, secretType, environment, orgId } = body

    // Validate required fields
    if (!projectId || !name || !value || !environment || !orgId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user has access to the project
    const { data: projectAccess } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", orgId)
      .single()

    if (!projectAccess || !["owner", "admin", "developer"].includes(projectAccess.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get organization encryption key
    const { data: org } = await supabase.from("organizations").select("encryption_key_hash").eq("id", orgId).single()

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Encrypt the secret
    const crypto = new OrganizationCrypto(org.encryption_key_hash, orgId)
    const { encryptedValue, valueHash } = crypto.encryptSecret(value)

    // Insert the secret
    const { data: secret, error: insertError } = await supabase
      .from("secrets")
      .insert({
        project_id: projectId,
        folder_id: folderId || null,
        name,
        description: description || null,
        encrypted_value: encryptedValue,
        value_hash: valueHash,
        secret_type: secretType,
        environment,
        created_by: user.id,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    // Log audit event
    await supabase.rpc("log_audit_event", {
      org_id: orgId,
      action_type: "created",
      resource_type_param: "secret",
      resource_id_param: secret.id,
      metadata_param: { secret_name: name },
    })

    return NextResponse.json({ success: true, secret })
  } catch (error: any) {
    console.error("Error creating secret:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
