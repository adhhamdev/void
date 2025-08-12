import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"
import { supabaseConfig } from "./config"

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: supabaseConfig.auth,
    })
  }
  return supabaseClient
}

export const supabase = createClient()
