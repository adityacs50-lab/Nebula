import { NextResponse } from "next/server";
import { anthropicConfigured, CLAUDE_MODEL, getAnthropicClient } from "@/lib/claude/client";
import type { CanvasContext } from "@/lib/canvas/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CodeRequestBody = {
  prompt: string;
  language: string;
  canvasContext: CanvasContext;
};

export async function POST(req: Request): Promise<Response> {
  if (!anthropicConfigured()) {
    return NextResponse.json(
      {
        error:
          "Nebula AI is not connected yet. Add your ANTHROPIC_API_KEY to .env.local (see README.md) and restart the server.",
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

  const { prompt, language, canvasContext } = body;
  if (!prompt || !language) {
    return NextResponse.json(
      { error: "prompt and language are required" },
      { status: 400 },
    );
  }

  const client = getAnthropicClient();

  try {
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: `You are the code generation engine inside Nebula — a shared AI workspace for founding teams.

You can see the team's entire canvas, so generated code should fit what they are already building.

Current canvas state:
${JSON.stringify(canvasContext, null, 2)}

Rules:
- Respond with ONLY the code, no prose, no explanations
- Do not wrap the code in markdown fences
- Write production-quality, idiomatic ${language}
- Include brief comments only where a non-obvious decision needs context
- If other blocks on the canvas define related code or flows, stay consistent with them`,
      messages: [
        {
          role: "user",
          content: `Generate ${language} code for the following:\n\n${prompt}`,
        },
      ],
    });

    let code = "";
    for (const block of response.content) {
      if (block.type === "text") code += block.text;
    }
    code = stripFences(code.trim());

    return NextResponse.json({ code });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Code generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function stripFences(text: string): string {
  const fence = /^```[a-zA-Z]*\n([\s\S]*?)\n```$/m;
  const match = text.match(fence);
  return match ? match[1] : text;
}
