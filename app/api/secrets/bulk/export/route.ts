import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSecret } from "@/lib/secrets"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { secretIds, orgId, format = "json" } = await request.json()

    if (!secretIds || !Array.isArray(secretIds) || secretIds.length === 0) {
      return NextResponse.json({ error: "Secret IDs are required" }, { status: 400 })
    }

    if (!orgId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 })
    }

    // Get all secrets with decrypted values
    const exportData = []
    const errors = []

    for (const secretId of secretIds) {
      try {
        const { secret, decryptedValue } = await getSecret(secretId, orgId)

        exportData.push({
          id: secret.id,
          name: secret.name,
          value: decryptedValue,
          description: secret.description,
          type: secret.secret_type,
          environment: secret.environment,
          created_at: secret.created_at,
          updated_at: secret.updated_at,
        })

        // Log export event
        await supabase.rpc("log_audit_event", {
          org_id: orgId,
          action_type: "exported",
          resource_type_param: "secret",
          resource_id_param: secretId,
          metadata_param: {
            secret_name: secret.name,
            export_format: format,
          },
        })
      } catch (error: any) {
        errors.push({ secretId, error: error.message })
      }
    }

    if (exportData.length === 0) {
      return NextResponse.json({ error: "No secrets could be exported" }, { status: 400 })
    }

    let responseData: string
    let contentType: string
    let filename: string

    switch (format) {
      case "env":
        responseData = exportData.map((secret) => `${secret.name}=${secret.value}`).join("\n")
        contentType = "text/plain"
        filename = "secrets.env"
        break

      case "csv":
        const csvHeader = "Name,Value,Description,Type,Environment,Created,Updated\n"
        const csvRows = exportData
          .map((secret) =>
            [
              secret.name,
              secret.value,
              secret.description || "",
              secret.type,
              secret.environment,
              secret.created_at,
              secret.updated_at,
            ]
              .map((field) => `"${String(field).replace(/"/g, '""')}"`)
              .join(","),
          )
          .join("\n")
        responseData = csvHeader + csvRows
        contentType = "text/csv"
        filename = "secrets.csv"
        break

      case "json":
      default:
        responseData = JSON.stringify(
          {
            exported_at: new Date().toISOString(),
            secrets: exportData,
            metadata: {
              total_exported: exportData.length,
              total_failed: errors.length,
              errors: errors.length > 0 ? errors : undefined,
            },
          },
          null,
          2,
        )
        contentType = "application/json"
        filename = "secrets.json"
        break
    }

    return new NextResponse(responseData, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error: any) {
    console.error("Bulk export error:", error)
    return NextResponse.json({ error: error.message || "Failed to export secrets" }, { status: 500 })
  }
}
