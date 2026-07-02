import { anthropicConfigured, CLAUDE_MODEL, getAnthropicClient } from "@/lib/claude/client";
import type { CanvasContext } from "@/lib/canvas/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRequestBody = {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  canvasContext: CanvasContext;
};

export async function POST(req: Request): Promise<Response> {
  if (!anthropicConfigured()) {
    return new Response(
      "Nebula AI is not connected yet. Add your ANTHROPIC_API_KEY to .env.local (see README.md) and restart the server.",
      { status: 503 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages, canvasContext } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages array is required", { status: 400 });
  }

  const client = getAnthropicClient();

  const stream = client.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: `You are an AI assistant embedded in Nebula — a shared AI workspace for founding teams.

You have full visibility into everything this founding team is working on right now.

Current canvas state:
${JSON.stringify(canvasContext, null, 2)}

Guidelines:
- Always respond with awareness of the full canvas context
- Reference what other team members are working on when relevant
- Be concise, direct, and builder-focused
- You're talking to founders building something real — match their energy
- If you see connections between different blocks on the canvas, point them out`,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (text) => {
        controller.enqueue(encoder.encode(text));
      });
      stream.on("end", () => {
        controller.close();
      });
      stream.on("error", (error) => {
        controller.enqueue(
          encoder.encode(`\n\n[Nebula AI error: ${error.message}]`),
        );
        controller.close();
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
