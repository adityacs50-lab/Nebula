import { NextResponse } from "next/server";
import { createClient, supabaseServerConfigured } from "@/lib/supabase/server";
import {
  isSupabaseInvalidApiKeyError,
  isSupabaseMissingTableError,
  SUPABASE_SETUP_HINT,
  supabaseApiKeyAvailable,
} from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Durable feed history. The live feed rides Liveblocks; this endpoint
 * persists items to Supabase so history survives room eviction and can
 * be queried across sessions. Demo mode: accepted but not stored.
 */
export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") ?? "";

  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    return NextResponse.json({ items: [], demo: true });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (isSupabaseInvalidApiKeyError(authError)) {
    return NextResponse.json({ items: [], demo: true });
  }
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("feed_items")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    if (isSupabaseMissingTableError(error)) {
      return NextResponse.json({ error: SUPABASE_SETUP_HINT }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request): Promise<Response> {
  let body: {
    workspaceId?: string;
    memberName?: string;
    memberColor?: string;
    type?: string;
    title?: string;
    summary?: string;
    blockId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (isSupabaseInvalidApiKeyError(authError)) {
    return NextResponse.json({ ok: true, demo: true });
  }
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error } = await supabase.from("feed_items").insert({
    workspace_id: body.workspaceId,
    member_id: user.id,
    member_name: body.memberName ?? "Member",
    member_color: body.memberColor ?? "#7C3AED",
    type: body.type ?? "note",
    title: body.title ?? "",
    summary: body.summary ?? "",
    block_id: body.blockId ?? null,
  });

  if (error) {
    if (isSupabaseMissingTableError(error)) {
      return NextResponse.json({ error: SUPABASE_SETUP_HINT }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
