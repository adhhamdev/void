import crypto from "crypto"

export class OrganizationCrypto {
  private masterKey: string
  private orgId: string

  constructor(masterKey: string, orgId: string) {
    this.masterKey = masterKey
    this.orgId = orgId
  }

  // Derive organization-specific key
  private deriveKey(): Buffer {
    return crypto.pbkdf2Sync(this.masterKey, this.orgId, 100000, 32, "sha256")
  }

  // Encrypt secret value
  encryptSecret(value: string): { encryptedValue: string; valueHash: string } {
    const key = this.deriveKey()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher("aes-256-cbc", key)

    let encrypted = cipher.update(value, "utf8", "hex")
    encrypted += cipher.final("hex")

    const encryptedValue = iv.toString("hex") + ":" + encrypted
    const valueHash = crypto.createHash("sha256").update(value).digest("hex")

    return { encryptedValue, valueHash }
  }

  // Decrypt secret value
  decryptSecret(encryptedValue: string): string {
    const key = this.deriveKey()
    const [ivHex, encrypted] = encryptedValue.split(":")
    const iv = Buffer.from(ivHex, "hex")

    const decipher = crypto.createDecipher("aes-256-cbc", key)
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  // Verify secret integrity
  verifySecret(value: string, hash: string): boolean {
    const computedHash = crypto.createHash("sha256").update(value).digest("hex")
    return computedHash === hash
  }

  // Generate secure API key
  static generateApiKey(): string {
    return "sk_" + crypto.randomBytes(32).toString("hex")
  }

  // Hash API key for storage
  static hashApiKey(apiKey: string): string {
    return crypto.createHash("sha256").update(apiKey).digest("hex")
  }
}

// Generate master encryption key
export function generateMasterKey(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Generate salt for key derivation
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex")
}
