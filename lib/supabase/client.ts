import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  supabaseEnvConfigured,
} from "./config";

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "public-anon-key-placeholder";

let browserClient: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
  return supabaseEnvConfigured();
}

/**
 * Browser-side Supabase client. Falls back to placeholder credentials when
 * env vars are missing so the app can still boot in demo mode.
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = supabaseConfigured()
    ? getSupabaseUrl()!
    : FALLBACK_URL;
  const key = supabaseConfigured()
    ? getSupabasePublishableKey()!
    : FALLBACK_KEY;
  browserClient = createBrowserClient(url, key);
  return browserClient;
}
