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

/** Recent activity grouped per member — powers digests and history views. */
export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") ?? "";

  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    return NextResponse.json({ activity: {}, demo: true });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (isSupabaseInvalidApiKeyError(authError)) {
    return NextResponse.json({ activity: {}, demo: true });
  }
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("feed_items")
    .select("member_name, type, title, summary, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    if (isSupabaseMissingTableError(error)) {
      return NextResponse.json({ error: SUPABASE_SETUP_HINT }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const activity: Record<
    string,
    Array<{ type: string; title: string; summary: string; created_at: string }>
  > = {};
  for (const row of data ?? []) {
    const key = row.member_name as string;
    activity[key] = activity[key] ?? [];
    if (activity[key].length < 15) {
      activity[key].push({
        type: row.type,
        title: row.title,
        summary: row.summary,
        created_at: row.created_at,
      });
    }
  }
  return NextResponse.json({ activity });
}
