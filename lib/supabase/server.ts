import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "public-anon-key-placeholder";

export function supabaseServerConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url) && !url!.startsWith("your_");
}

/**
 * Server-side Supabase client for Route Handlers and Server Components.
 * Reads/writes the auth session from Next.js cookies.
 */
export function createClient(): SupabaseClient {
  const cookieStore = cookies();
  const url = supabaseServerConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : FALLBACK_URL;
  const key = supabaseServerConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : FALLBACK_KEY;

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component — safe to ignore, the
          // middleware refreshes sessions instead.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // See above.
        }
      },
    },
  });
}
