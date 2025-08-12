import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { deleteSecret } from "@/lib/secrets"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { secretIds, orgId } = await request.json()

    if (!secretIds || !Array.isArray(secretIds) || secretIds.length === 0) {
      return NextResponse.json({ error: "Secret IDs are required" }, { status: 400 })
    }

    if (!orgId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 })
    }

    // Delete secrets one by one to ensure proper audit logging and permissions
    const results = []
    const errors = []

    for (const secretId of secretIds) {
      try {
        await deleteSecret(secretId, orgId)
        results.push({ secretId, status: "deleted" })
      } catch (error: any) {
        errors.push({ secretId, error: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      deleted: results.length,
      failed: errors.length,
    })
  } catch (error: any) {
    console.error("Bulk delete error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete secrets" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { secretIds, orgId, operation, data } = await request.json()

    if (!secretIds || !Array.isArray(secretIds) || secretIds.length === 0) {
      return NextResponse.json({ error: "Secret IDs are required" }, { status: 400 })
    }

    if (!orgId || !operation) {
      return NextResponse.json({ error: "Organization ID and operation are required" }, { status: 400 })
    }

    const results = []
    const errors = []

    switch (operation) {
      case "move":
        const { targetType, targetId } = data

        for (const secretId of secretIds) {
          try {
            const updateData: any = {}

            if (targetType === "folder") {
              updateData.folder_id = targetId
            } else if (targetType === "project") {
              updateData.project_id = targetId
              updateData.folder_id = null // Clear folder when moving to project root
            }

            const { error } = await supabase.from("secrets").update(updateData).eq("id", secretId)

            if (error) throw error

            // Log audit event
            await supabase.rpc("log_audit_event", {
              org_id: orgId,
              action_type: "moved",
              resource_type_param: "secret",
              resource_id_param: secretId,
              metadata_param: {
                target_type: targetType,
                target_id: targetId,
              },
            })

            results.push({ secretId, status: "moved" })
          } catch (error: any) {
            errors.push({ secretId, error: error.message })
          }
        }
        break

      case "update_environment":
        const { environment } = data

        for (const secretId of secretIds) {
          try {
            const { error } = await supabase.from("secrets").update({ environment }).eq("id", secretId)

            if (error) throw error

            // Log audit event
            await supabase.rpc("log_audit_event", {
              org_id: orgId,
              action_type: "updated",
              resource_type_param: "secret",
              resource_id_param: secretId,
              metadata_param: {
                updated_fields: ["environment"],
                new_environment: environment,
              },
            })

            results.push({ secretId, status: "updated" })
          } catch (error: any) {
            errors.push({ secretId, error: error.message })
          }
        }
        break

      default:
        return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      processed: results.length,
      failed: errors.length,
    })
  } catch (error: any) {
    console.error("Bulk update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update secrets" }, { status: 500 })
  }
}
