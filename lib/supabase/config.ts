export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce" as const,
  },
}

export const authConfig = {
  redirectTo: {
    login: "/auth/callback",
    logout: "/auth",
    emailConfirmation: "/auth/callback",
    passwordReset: "/auth/reset-password",
  },
  magicLink: {
    emailRedirectTo:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/auth/callback"
        : `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/auth/callback`,
  },
}
