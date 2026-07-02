import Anthropic from "@anthropic-ai/sdk";

export const CLAUDE_MODEL = "claude-sonnet-4-6";

export function anthropicConfigured(): boolean {
  const key = process.env.ANTHROPIC_API_KEY;
  return Boolean(key) && !key!.startsWith("your_");
}

/**
 * Server-only Anthropic client. Constructed lazily so builds succeed
 * without an API key; routes return a helpful error at runtime instead.
 */
export function getAnthropicClient(): Anthropic {
  if (!anthropicConfigured()) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Add it to .env.local — see README.md.",
    );
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
