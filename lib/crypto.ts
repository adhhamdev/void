import CryptoJS from "crypto-js"

// Client-side encryption utilities
export class CryptoUtils {
  private static readonly ALGORITHM = "AES"
  private static readonly KEY_SIZE = 256
  private static readonly IV_SIZE = 128

  // Generate a random encryption key
  static generateKey(): string {
    return CryptoJS.lib.WordArray.random(this.KEY_SIZE / 8).toString()
  }

  // Generate a random IV
  static generateIV(): string {
    return CryptoJS.lib.WordArray.random(this.IV_SIZE / 8).toString()
  }

  // Encrypt data with AES-256
  static encrypt(data: string, key: string): { encrypted: string; iv: string } {
    const iv = this.generateIV()
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()

    return { encrypted, iv }
  }

  // Decrypt data with AES-256
  static decrypt(encryptedData: string, key: string, iv: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  // Hash data with SHA-256
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString()
  }

  // Generate HMAC for integrity checking
  static generateHMAC(data: string, key: string): string {
    return CryptoJS.HmacSHA256(data, key).toString()
  }

  // Verify HMAC
  static verifyHMAC(data: string, key: string, hmac: string): boolean {
    const computedHMAC = this.generateHMAC(data, key)
    return computedHMAC === hmac
  }

  // Derive key from password using PBKDF2
  static deriveKey(password: string, salt: string, iterations = 10000): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: this.KEY_SIZE / 32,
      iterations: iterations,
    }).toString()
  }

  // Generate a secure random salt
  static generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString()
  }
}

// Organization-level encryption key management
export class OrganizationCrypto {
  private orgKey: string
  private orgId: string

  constructor(orgKey: string, orgId: string) {
    this.orgKey = orgKey
    this.orgId = orgId
  }

  // Encrypt secret value for storage
  encryptSecret(value: string): { encryptedValue: string; valueHash: string } {
    const { encrypted, iv } = CryptoUtils.encrypt(value, this.orgKey)
    const encryptedValue = `${iv}:${encrypted}`
    const valueHash = CryptoUtils.hash(value)

    return { encryptedValue, valueHash }
  }

  // Decrypt secret value
  decryptSecret(encryptedValue: string): string {
    const [iv, encrypted] = encryptedValue.split(":")
    return CryptoUtils.decrypt(encrypted, this.orgKey, iv)
  }

  // Verify secret integrity
  verifySecret(value: string, storedHash: string): boolean {
    const computedHash = CryptoUtils.hash(value)
    return computedHash === storedHash
  }
}
