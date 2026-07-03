import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  hasConfiguredValue,
  supabaseEnvConfigured,
} from "./config";

export function supabaseAdminConfigured(): boolean {
  return supabaseEnvConfigured() && hasConfiguredValue(getSupabaseServiceRoleKey());
}

/**
 * Server-only Supabase client authenticated as the service role. Bypasses
 * RLS entirely — use it only for trusted server-side operations that must
 * read/write rows the caller's own session isn't authorized to see yet,
 * like verifying an invite token before the invitee is a workspace member.
 * Never import this from a Client Component.
 */
export function createAdminClient(): SupabaseClient {
  if (!supabaseAdminConfigured()) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to .env.local — see README.md.",
    );
  }
  return createSupabaseClient(getSupabaseUrl()!, getSupabaseServiceRoleKey()!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
