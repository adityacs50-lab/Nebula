import {
  geminiConfigured,
  GEMINI_TEXT_MODELS,
  getGeminiClient,
  isModelUnavailableError,
  isQuotaError,
} from "@/lib/claude/client";
import type { CanvasContext } from "@/lib/canvas/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRequestBody = {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  canvasContext: CanvasContext;
};

export async function POST(req: Request): Promise<Response> {
  if (!geminiConfigured()) {
    return new Response(
      "Nebula AI is not connected yet. Add your GEMINI_API_KEY to .env.local (see README.md) and restart the server.",
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

  const client = getGeminiClient();
  const systemInstruction = `You are an AI assistant embedded in Nebula — a shared AI workspace for founding teams.

You have full visibility into everything this founding team is working on right now.

Current canvas state:
${JSON.stringify(canvasContext, null, 2)}

Guidelines:
- Always respond with awareness of the full canvas context
- Reference what other team members are working on when relevant
- Be concise, direct, and builder-focused
- You're talking to founders building something real — match their energy
- If you see connections between different blocks on the canvas, point them out`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      void (async () => {
        let lastError: unknown = null;
        for (const modelName of GEMINI_TEXT_MODELS) {
          const model = client.getGenerativeModel({
            model: modelName,
            systemInstruction,
          });
          let emitted = false;
          try {
            const result = await model.generateContentStream({ contents });
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                emitted = true;
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
            return;
          } catch (error) {
            lastError = error;
            // Model missing or quota-blocked for this key and nothing has
            // been streamed yet — safe to retry with the next model.
            if (
              !emitted &&
              (isModelUnavailableError(error) || isQuotaError(error))
            ) {
              continue;
            }
            break;
          }
        }
        controller.enqueue(
          encoder.encode(
            `\n\n[Nebula AI error: ${lastError instanceof Error ? lastError.message : "Unknown error"}]`,
          ),
        );
        controller.close();
      })();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
