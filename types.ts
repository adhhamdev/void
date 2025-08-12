// Core application types for SecureVault

export interface Project {
  id: string
  name: string
  description: string
  secret_count: number
  folder_count: number
  last_activity: string
  environment: string
  organization_id?: string
  created_at?: string
  updated_at?: string
  default_environment?: string
}

export interface RecentActivity {
  id: string
  action: string
  resource_type: string
  resource_name: string
  user_name: string
  created_at: string
  organization_id?: string
  user_id?: string
  metadata?: Record<string, any>
}

export interface Secret {
  id: string
  name: string
  description?: string
  lastModified: string
  environment: string
  type: string
  project_id?: string
  folder_id?: string
  created_by?: string
  encrypted_value?: string
  value_hash?: string
  version?: number
  created_at?: string
  updated_at?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  encryption_key_hash: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: "owner" | "admin" | "member"
  joined_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  name: string
  description?: string
  project_id: string
  parent_folder_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface SearchFilter {
  query: string
  environment: string[]
  secretType: string[]
  dateRange: {
    from?: Date
    to?: Date
  }
  status: string[]
  createdBy: string[]
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  optional?: boolean
}

export interface TeamMember {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  role?: string
  permissions?: string
  lastAccess?: string
}

export interface SecretPermission {
  id: string
  permission_level: string
  granted_at: string
  expires_at?: string
  user: User
  granted_by_user: User
}

export interface AuditLog {
  id: string
  action: string
  resource_type: string
  resource_id: string
  user_id: string
  organization_id: string
  metadata: Record<string, any>
  created_at: string
}

export interface UserPreferences {
  user_id: string
  theme: "light" | "dark" | "system"
  timezone: string
  email_notifications: boolean
  security_notifications: boolean
  onboarding_completed: boolean
  onboarding_step: number
  created_at: string
  updated_at: string
}
