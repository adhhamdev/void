import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { version } = body
    const secretId = params.id

    if (!version) {
      return NextResponse.json({ error: "Version is required" }, { status: 400 })
    }

    // Get the version to restore
    const { data: versionToRestore, error: versionError } = await supabase
      .from("secret_versions")
      .select("encrypted_value, value_hash")
      .eq("secret_id", secretId)
      .eq("version", version)
      .single()

    if (versionError || !versionToRestore) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 })
    }

    // Get current secret to create a backup
    const { data: currentSecret, error: currentError } = await supabase
      .from("secrets")
      .select("version, encrypted_value, value_hash")
      .eq("id", secretId)
      .single()

    if (currentError || !currentSecret) {
      return NextResponse.json({ error: "Secret not found" }, { status: 404 })
    }

    // Create a backup of current version
    await supabase.from("secret_versions").insert({
      secret_id: secretId,
      version: currentSecret.version,
      encrypted_value: currentSecret.encrypted_value,
      value_hash: currentSecret.value_hash,
      created_by: user.id,
    })

    // Update secret with restored version
    const newVersion = (currentSecret.version || 1) + 1
    const { error: updateError } = await supabase
      .from("secrets")
      .update({
        encrypted_value: versionToRestore.encrypted_value,
        value_hash: versionToRestore.value_hash,
        version: newVersion,
      })
      .eq("id", secretId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Log audit event
    const { data: secret } = await supabase.from("secrets").select("name, project_id").eq("id", secretId).single()
    const { data: project } = await supabase
      .from("projects")
      .select("organization_id")
      .eq("id", secret?.project_id)
      .single()

    if (project) {
      await supabase.rpc("log_audit_event", {
        org_id: project.organization_id,
        action_type: "updated",
        resource_type_param: "secret",
        resource_id_param: secretId,
        metadata_param: {
          secret_name: secret?.name,
          action: "restored_version",
          restored_from_version: version,
          new_version: newVersion,
        },
      })
    }

    return NextResponse.json({ success: true, newVersion })
  } catch (error: any) {
    console.error("Error restoring secret version:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
