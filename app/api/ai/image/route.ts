import { NextResponse } from "next/server";
import type { GenerationConfig } from "@google/generative-ai";
import {
  geminiConfigured,
  GEMINI_IMAGE_MODELS,
  getGeminiClient,
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

function isModelUnavailableError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("not supported")
  );
}

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
      // Model retired/renamed on this API version — try the next one.
      if (isModelUnavailableError(error)) continue;
      break;
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : "Image generation failed";
  return NextResponse.json({ error: message }, { status: 500 });
}
