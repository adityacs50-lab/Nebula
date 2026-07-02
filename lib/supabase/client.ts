import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "public-anon-key-placeholder";

let browserClient: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url) && !url!.startsWith("your_");
}

/**
 * Browser-side Supabase client. Falls back to placeholder credentials when
 * env vars are missing so the app can still boot in demo mode.
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = supabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : FALLBACK_URL;
  const key = supabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : FALLBACK_KEY;
  browserClient = createBrowserClient(url, key);
  return browserClient;
}
