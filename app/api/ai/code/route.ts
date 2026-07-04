import { NextResponse } from "next/server";
import {
  geminiConfigured,
  GEMINI_TEXT_MODELS,
  getGeminiClient,
  isModelUnavailableError,
  isQuotaError,
} from "@/lib/claude/client";
import type { TeamContext } from "@/lib/context/teamContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CodeRequestBody = {
  prompt: string;
  language: string;
  teamContext: TeamContext;
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

  let body: CodeRequestBody;
  try {
    body = (await req.json()) as CodeRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, language, teamContext } = body;
  if (!prompt || !language) {
    return NextResponse.json(
      { error: "prompt and language are required" },
      { status: 400 },
    );
  }

  const client = getGeminiClient();
  const systemInstruction = `You are the code generation engine inside Nebula OS — the operating system for founding teams.

You can see everything the team is working on, so generated code should fit what they are already building.

Team context:
${JSON.stringify(teamContext, null, 2)}

Rules:
- Respond with ONLY the code, no prose, no explanations
- Do not wrap the code in markdown fences
- Write production-quality, idiomatic ${language}
- Include brief comments only where a non-obvious decision needs context
- If other blocks on the canvas define related code or flows, stay consistent with them`;

  let lastError: unknown = null;
  for (const modelName of GEMINI_TEXT_MODELS) {
    const model = client.getGenerativeModel({
      model: modelName,
      systemInstruction,
    });
    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate ${language} code for the following:\n\n${prompt}` }],
          },
        ],
        generationConfig: { maxOutputTokens: 2048 },
      });
      const response = await result.response;
      const code = stripFences(response.text().trim());

      return NextResponse.json({ code, model: modelName });
    } catch (error) {
      lastError = error;
      if (isModelUnavailableError(error) || isQuotaError(error)) continue;
      break;
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : "Code generation failed";
  return NextResponse.json({ error: message }, { status: 500 });
}

function stripFences(text: string): string {
  const trimmed = text.trim();
  const fence = /^```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)\r?\n?```$/;
  const match = trimmed.match(fence);
  return match ? match[1].trim() : trimmed;
}
