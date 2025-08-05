import { createClient } from "@/lib/supabase/server"
import { OrganizationCrypto } from "@/lib/crypto"
import type { Database } from "@/lib/supabase/types"

type Secret = Database["public"]["Tables"]["secrets"]["Row"]
type SecretInsert = Database["public"]["Tables"]["secrets"]["Insert"]

export async function getOrganizationKey(orgId: string): Promise<string> {
  const supabase = await createClient()
  const { data: org, error } = await supabase
    .from("organizations")
    .select("encryption_key_hash")
    .eq("id", orgId)
    .single()

  if (error || !org) {
    throw new Error("Failed to fetch organization encryption key")
  }

  // In production, this would involve secure key derivation
  // For now, we'll use the hash as the key (not recommended for production)
  return org.encryption_key_hash
}

export async function createSecret(data: {
  projectId: string
  folderId?: string
  name: string
  value: string
  description?: string
  secretType?: string
  environment: string
  userId: string
  orgId: string
}): Promise<Secret> {
  const supabase = await createClient()

  // Get organization encryption key
  const orgKey = await getOrganizationKey(data.orgId)
  const crypto = new OrganizationCrypto(orgKey, data.orgId)

  // Encrypt the secret value
  const { encryptedValue, valueHash } = crypto.encryptSecret(data.value)

  // Insert the secret
  const secretData: SecretInsert = {
    project_id: data.projectId,
    folder_id: data.folderId || null,
    name: data.name,
    description: data.description || null,
    encrypted_value: encryptedValue,
    value_hash: valueHash,
    secret_type: (data.secretType as any) || "other",
    environment: data.environment as any,
    created_by: data.userId,
  }

  const { data: secret, error } = await supabase.from("secrets").insert(secretData).select().single()

  if (error) {
    throw new Error(`Failed to create secret: ${error.message}`)
  }

  // Log audit event
  await supabase.rpc("log_audit_event", {
    org_id: data.orgId,
    action_type: "created",
    resource_type_param: "secret",
    resource_id_param: secret.id,
    metadata_param: { secret_name: data.name },
  })

  return secret
}

export async function getSecret(secretId: string, orgId: string): Promise<{ secret: Secret; decryptedValue: string }> {
  const supabase = await createClient()

  // Check if user can access this secret
  const { data: canAccess, error: accessError } = await supabase.rpc("can_access_secret", { secret_id_param: secretId })

  if (accessError || !canAccess) {
    throw new Error("Access denied to secret")
  }

  // Get the secret
  const { data: secret, error } = await supabase.from("secrets").select("*").eq("id", secretId).single()

  if (error || !secret) {
    throw new Error("Secret not found")
  }

  // Decrypt the value
  const orgKey = await getOrganizationKey(orgId)
  const crypto = new OrganizationCrypto(orgKey, orgId)
  const decryptedValue = crypto.decryptSecret(secret.encrypted_value)

  // Verify integrity
  if (!crypto.verifySecret(decryptedValue, secret.value_hash)) {
    throw new Error("Secret integrity check failed")
  }

  // Log access event
  await supabase.rpc("log_audit_event", {
    org_id: orgId,
    action_type: "accessed",
    resource_type_param: "secret",
    resource_id_param: secretId,
    metadata_param: { secret_name: secret.name },
  })

  return { secret, decryptedValue }
}

export async function updateSecret(
  secretId: string,
  orgId: string,
  updates: {
    name?: string
    value?: string
    description?: string
    secretType?: string
  },
  userId: string,
): Promise<Secret> {
  const supabase = await createClient()

  // Get current secret
  const { secret: currentSecret } = await getSecret(secretId, orgId)

  const updateData: any = {}

  if (updates.name) updateData.name = updates.name
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.secretType) updateData.secret_type = updates.secretType

  // If value is being updated, encrypt it
  if (updates.value) {
    const orgKey = await getOrganizationKey(orgId)
    const crypto = new OrganizationCrypto(orgKey, orgId)
    const { encryptedValue, valueHash } = crypto.encryptSecret(updates.value)

    updateData.encrypted_value = encryptedValue
    updateData.value_hash = valueHash
    updateData.version = (currentSecret.version || 1) + 1

    // Create version history
    await supabase.from("secret_versions").insert({
      secret_id: secretId,
      version: currentSecret.version || 1,
      encrypted_value: currentSecret.encrypted_value,
      value_hash: currentSecret.value_hash,
      created_by: userId,
    })
  }

  // Update the secret
  const { data: secret, error } = await supabase.from("secrets").update(updateData).eq("id", secretId).select().single()

  if (error) {
    throw new Error(`Failed to update secret: ${error.message}`)
  }

  // Log audit event
  await supabase.rpc("log_audit_event", {
    org_id: orgId,
    action_type: "updated",
    resource_type_param: "secret",
    resource_id_param: secretId,
    metadata_param: {
      secret_name: secret.name,
      updated_fields: Object.keys(updates),
    },
  })

  return secret
}

export async function deleteSecret(secretId: string, orgId: string): Promise<void> {
  const supabase = await createClient()

  // Get secret name for audit log
  const { secret } = await getSecret(secretId, orgId)

  // Delete the secret
  const { error } = await supabase.from("secrets").delete().eq("id", secretId)

  if (error) {
    throw new Error(`Failed to delete secret: ${error.message}`)
  }

  // Log audit event
  await supabase.rpc("log_audit_event", {
    org_id: orgId,
    action_type: "deleted",
    resource_type_param: "secret",
    resource_id_param: secretId,
    metadata_param: { secret_name: secret.name },
  })
}

export async function getProjectSecrets(projectId: string): Promise<Secret[]> {
  const supabase = await createClient()

  const { data: secrets, error } = await supabase
    .from("secrets")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch project secrets: ${error.message}`)
  }

  return secrets || []
}

export async function getFolderSecrets(folderId: string): Promise<Secret[]> {
  const supabase = await createClient()

  const { data: secrets, error } = await supabase
    .from("secrets")
    .select("*")
    .eq("folder_id", folderId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch folder secrets: ${error.message}`)
  }

  return secrets || []
}
