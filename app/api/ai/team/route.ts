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

type TeamRequestBody = {
  question: string;
  teamContext: TeamContext;
};

export async function POST(req: Request): Promise<Response> {
  if (!geminiConfigured()) {
    return new Response(
      "Nebula Team AI is not connected yet. Add your GEMINI_API_KEY to .env.local (see README.md) and restart the server.",
      { status: 503 },
    );
  }

  let body: TeamRequestBody;
  try {
    body = (await req.json()) as TeamRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return new Response("question is required", { status: 400 });
  }

  const client = getGeminiClient();
  const systemInstruction = `You are Nebula Team AI — the shared brain of a founding team.
You have complete visibility into everything every team member is working on right now.

Team context:
${JSON.stringify(body.teamContext, null, 2)}

Answer questions about the team with:
- Specific facts from their actual activity
- Names of team members
- Real tasks, conversations, and findings
- Actionable insights
- Direct, founder-friendly tone
- No fluff, no generic advice

If asked for team status, format as:
[Member name]: [One line of what they're working on]
Then: Key wins, blockers, and what needs a decision.`;

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
            const result = await model.generateContentStream({
              contents: [{ role: "user", parts: [{ text: question }] }],
            });
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
            `\n\n[Team AI error: ${lastError instanceof Error ? lastError.message : "Unknown error"}]`,
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
