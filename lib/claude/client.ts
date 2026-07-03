import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_MODEL = "gemini-2.5-flash";
export const GEMINI_IMAGE_MODEL = "gemini-2.0-flash-exp";

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
