import { NextResponse } from "next/server";
import {
  geminiConfigured,
  GEMINI_TEXT_MODELS,
  getGeminiClient,
  isModelUnavailableError,
  isQuotaError,
} from "@/lib/claude/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AssistBody = {
  mode: "summarize" | "draft_outreach" | "feed_summary";
  url?: string;
  text?: string;
  topic?: string;
  contactName?: string;
  company?: string;
  channel?: string;
  memberName?: string;
};

/**
 * Small, non-streaming AI helpers: URL/topic summaries for Research
 * blocks, outreach message drafts, and one-line feed summaries. Callers
 * treat a 503 as "fall back to a template".
 */
export async function POST(req: Request): Promise<Response> {
  if (!geminiConfigured()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 503 },
    );
  }

  let body: AssistBody;
  try {
    body = (await req.json()) as AssistBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let prompt = "";
  if (body.mode === "summarize") {
    let pageText = "";
    if (body.url) {
      pageText = await fetchReadable(body.url);
    }
    prompt = `Summarize the following for a founding team's research canvas in 2-3 crisp sentences. Lead with the single most decision-relevant fact.\n\nTopic: ${body.topic ?? body.url ?? ""}\n\nContent:\n${pageText || body.text || body.topic || body.url || ""}`;
  } else if (body.mode === "draft_outreach") {
    prompt = `Draft a short, direct ${body.channel ?? "LinkedIn"} outreach message from a startup founder to ${body.contactName ?? "a prospect"} at ${body.company ?? "their company"}. 3-4 sentences max, no buzzwords, one clear ask for a 15-minute call. Context about our product: Nebula OS, the operating system for founding teams — every member gets an AI workspace, everything flows into one shared team feed.`;
  } else if (body.mode === "feed_summary") {
    prompt = `Write ONE sentence (max 18 words) summarizing this team activity for a live team feed. No preamble, just the sentence.\n\nMember: ${body.memberName ?? ""}\nActivity:\n${body.text ?? ""}`;
  } else {
    return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
  }

  const client = getGeminiClient();
  let lastError: unknown = null;
  for (const modelName of GEMINI_TEXT_MODELS) {
    try {
      const model = client.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 512 },
      });
      const text = (await result.response).text().trim();
      return NextResponse.json({ text, model: modelName });
    } catch (error) {
      lastError = error;
      if (isModelUnavailableError(error) || isQuotaError(error)) continue;
      break;
    }
  }
  return NextResponse.json(
    {
      error:
        lastError instanceof Error ? lastError.message : "Assist call failed",
    },
    { status: 500 },
  );
}

/** Best-effort fetch of a URL, stripped to readable-ish text. */
async function fetchReadable(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "NebulaOS/1.0 (+research-block)" },
    });
    if (!res.ok) return "";
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 8000);
  } catch {
    return "";
  }
}
