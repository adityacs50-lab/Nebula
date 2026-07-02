import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseInvalidApiKeyError,
  supabaseApiKeyAvailable,
  supabaseEnvConfigured,
} from "./config";

/**
 * Refreshes the Supabase auth session on every request so Server
 * Components always see a valid session. No-ops when Supabase isn't
 * configured yet (demo mode).
 */
export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  let response = NextResponse.next({ request: { headers: request.headers } });

  if (!supabaseEnvConfigured() || !(await supabaseApiKeyAvailable())) {
    return response;
  }
  const url = getSupabaseUrl()!;
  const key = getSupabasePublishableKey()!;

  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const { error } = await supabase.auth.getUser();
  if (isSupabaseInvalidApiKeyError(error)) {
    return response;
  }
  return response;
}
