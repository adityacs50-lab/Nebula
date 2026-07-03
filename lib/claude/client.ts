import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Text models for chat + code generation, tried in order. Google renames
 * and retires model ids often, so routes walk this list and use the first
 * one the API accepts for this key.
 */
export const GEMINI_TEXT_MODELS = [
  "gemini-3.1-flash",
  "gemini-3-flash",
  "gemini-2.5-flash",
] as const;

/** Kept for anything still importing the single-model constant. */
export const GEMINI_MODEL = GEMINI_TEXT_MODELS[0];

/**
 * Image-capable models, tried in order. First is Nano Banana
 * (gemini-2.5-flash-image), then Nano Banana Pro
 * (gemini-3-pro-image-preview), then older ids. Quota-blocked models are
 * skipped too — Google's free tier gives some image models a hard limit
 * of 0, so a later entry may still work.
 */
export const GEMINI_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-3-pro-image-preview",
  "gemini-2.0-flash-preview-image-generation",
] as const;

export function geminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key) && !key!.startsWith("your_");
}

/** 404 / "not found" — the model id doesn't exist on this API version. */
export function isModelUnavailableError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();
  return (
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("not supported")
  );
}

/** 429 / quota exhausted — this key can't use the model right now. */
export function isQuotaError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();
  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("resource_exhausted") ||
    message.includes("rate limit")
  );
}

export const GEMINI_QUOTA_HINT =
  "Your Gemini API key is out of quota for this model (Google's free tier gives image models a limit of 0, and rate-limits text models per minute/day). Wait a bit and retry, or enable billing on your key at aistudio.google.com.";

/**
 * Server-only Gemini client. Constructed lazily so builds succeed
 * without an API key; routes return a helpful error at runtime instead.
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiConfigured()) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env.local — see README.md.",
    );
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}
