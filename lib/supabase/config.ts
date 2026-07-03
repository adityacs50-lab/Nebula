const PLACEHOLDER_PARTS = ["your_", "placeholder", "example"];

let apiKeyValid: boolean | null = null;

export function hasConfiguredValue(value: string | undefined): value is string {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return !PLACEHOLDER_PARTS.some((part) => normalized.includes(part));
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function supabaseEnvConfigured(): boolean {
  return (
    hasConfiguredValue(getSupabaseUrl()) &&
    hasConfiguredValue(getSupabasePublishableKey())
  );
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
}

export function getSupabasePublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY
  );
}

export async function supabaseApiKeyAvailable(): Promise<boolean> {
  if (!supabaseEnvConfigured()) return false;
  if (apiKeyValid !== null) return apiKeyValid;

  try {
    const url = `${getSupabaseUrl()}/auth/v1/settings`;
    const key = getSupabasePublishableKey()!;
    const response = await fetch(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (response.status === 401) {
      apiKeyValid = false;
      return false;
    }
  } catch {
    apiKeyValid = false;
    return false;
  }

  apiKeyValid = true;
  return true;
}

export function markSupabaseApiKeyInvalid(): void {
  apiKeyValid = false;
}

export function isSupabaseInvalidApiKeyError(error: unknown): boolean {
  if (!error) return false;

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && "message" in error
        ? String(error.message)
        : String(error);

  return message.toLowerCase().includes("invalid api key");
}
