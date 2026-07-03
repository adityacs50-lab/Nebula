import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Image-capable models, tried in order. Google renames/retires these
 * fairly often (gemini-2.0-flash-exp is already gone), so the image route
 * walks this list and uses the first one the API accepts.
 */
export const GEMINI_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
] as const;

export function geminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key) && !key!.startsWith("your_");
}

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
