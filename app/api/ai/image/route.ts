import { NextResponse } from "next/server";
import type { GenerationConfig } from "@google/generative-ai";
import {
  geminiConfigured,
  GEMINI_IMAGE_MODELS,
  GEMINI_QUOTA_HINT,
  getGeminiClient,
  isModelUnavailableError,
  isQuotaError,
} from "@/lib/claude/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImageRequestBody = {
  prompt: string;
};

/**
 * Gemini image models return images when the request opts in via
 * responseModalities. The installed SDK's GenerationConfig type predates
 * this field, so we extend it locally — the value still serializes
 * straight through to the REST API.
 */
type ImageGenerationConfig = GenerationConfig & {
  responseModalities?: string[];
};

export async function POST(req: Request): Promise<Response> {
  if (!geminiConfigured()) {
    return NextResponse.json(
      {
        error:
          "Nebula AI is not connected yet. Add your GEMINI_API_KEY to .env.local (see README.md) and restart the server.",
      },
      { status: 503 },
    );
  }

  let body: ImageRequestBody;
  try {
    body = (await req.json()) as ImageRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const client = getGeminiClient();
  let lastError: unknown = null;
  let sawQuotaError = false;

  for (const modelName of GEMINI_IMAGE_MODELS) {
    const model = client.getGenerativeModel({ model: modelName });
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        } as ImageGenerationConfig,
      });

      const parts = result.response.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((part) => Boolean(part.inlineData));

      if (!imagePart?.inlineData) {
        return NextResponse.json(
          {
            error:
              "Gemini didn't return an image for this prompt. Try rephrasing it.",
          },
          { status: 502 },
        );
      }

      const mimeType = imagePart.inlineData.mimeType || "image/png";
      const dataUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;

      return NextResponse.json({ imageUrl: dataUrl, model: modelName });
    } catch (error) {
      lastError = error;
      // Model retired/renamed, or this key has zero quota for it (free
      // tier gives some image models limit: 0) — try the next one.
      if (isQuotaError(error)) {
        sawQuotaError = true;
        continue;
      }
      if (isModelUnavailableError(error)) continue;
      break;
    }
  }

  // A quota block anywhere in the chain is the real story — the trailing
  // 404s from legacy model ids are just noise.
  if (sawQuotaError || isQuotaError(lastError)) {
    return NextResponse.json({ error: GEMINI_QUOTA_HINT }, { status: 429 });
  }
  const message =
    lastError instanceof Error ? lastError.message : "Image generation failed";
  return NextResponse.json({ error: message }, { status: 500 });
}
