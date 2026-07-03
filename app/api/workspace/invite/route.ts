import { NextResponse } from "next/server";
import { createClient, supabaseServerConfigured } from "@/lib/supabase/server";
import {
  isSupabaseInvalidApiKeyError,
  isSupabaseMissingTableError,
  SUPABASE_SETUP_HINT,
  supabaseApiKeyAvailable,
} from "@/lib/supabase/config";
import { generateId } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InviteRequestBody = {
  workspaceId?: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DEMO_WORKSPACE_HINT =
  "You're on the demo canvas, which isn't a real workspace in the database. Create a workspace from the dashboard, open it, then share that one.";

/**
 * Build invite URLs from the host the user is actually browsing on
 * (x-forwarded-* on Vercel/proxies, Host locally), so deployed apps hand
 * out production links with zero config. NEXT_PUBLIC_APP_URL is the
 * fallback for exotic setups where the request host can't be trusted.
 */
function resolveOrigin(req: Request): string {
  const requestUrl = new URL(req.url);
  const proto =
    req.headers.get("x-forwarded-proto") ??
    requestUrl.protocol.replace(":", "");
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    requestUrl.host;
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Creates an invite link for a workspace. The insert runs through the
 * caller's own session (not the admin client), so Postgres RLS enforces
 * that only existing workspace members can mint invites — see
 * supabase/migrations/001_initial.sql's `invites_insert` policy.
 */
export async function POST(req: Request): Promise<Response> {
  let workspaceId = "";
  try {
    const body = (await req.json()) as InviteRequestBody;
    workspaceId = body.workspaceId ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId is required" },
      { status: 400 },
    );
  }

  const origin = resolveOrigin(req);

  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    const token = generateId("invite");
    return NextResponse.json({
      inviteUrl: `${origin}/invite/${token}`,
      demo: true,
    });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (isSupabaseInvalidApiKeyError(authError)) {
    const token = generateId("invite");
    return NextResponse.json({
      inviteUrl: `${origin}/invite/${token}`,
      demo: true,
    });
  }
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Supabase is live, but "demo" (or anything non-UUID) isn't a real
  // workspace row — inserting it would fail with a Postgres uuid error.
  if (!UUID_RE.test(workspaceId)) {
    return NextResponse.json({ error: DEMO_WORKSPACE_HINT }, { status: 400 });
  }

  const { data: invite, error } = await supabase
    .from("invites")
    .insert({ workspace_id: workspaceId, created_by: user.id })
    .select("token")
    .single();

  if (error || !invite) {
    if (isSupabaseMissingTableError(error)) {
      return NextResponse.json({ error: SUPABASE_SETUP_HINT }, { status: 503 });
    }
    const isRlsDenied = error?.message
      .toLowerCase()
      .includes("row-level security");
    return NextResponse.json(
      {
        error: isRlsDenied
          ? "You must be a member of this workspace to create an invite."
          : (error?.message ?? "Failed to create invite"),
      },
      { status: isRlsDenied ? 403 : 500 },
    );
  }

  return NextResponse.json({
    inviteUrl: `${origin}/invite/${invite.token as string}`,
  });
}
