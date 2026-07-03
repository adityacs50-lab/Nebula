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

const DEMO_WORKSPACE = {
  id: "demo",
  name: "Project Nebula",
  membersCount: 4,
  lastActive: new Date().toISOString(),
  role: "owner" as const,
};

/** List the current user's workspaces. */
export async function GET(): Promise<Response> {
  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    return NextResponse.json({ workspaces: [DEMO_WORKSPACE], demo: true });
  }
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (isSupabaseInvalidApiKeyError(authError)) {
    return NextResponse.json({ workspaces: [DEMO_WORKSPACE], demo: true });
  }
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: memberships, error } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, updated_at)")
    .eq("user_id", user.id);

  if (error) {
    if (isSupabaseMissingTableError(error)) {
      return NextResponse.json({ error: SUPABASE_SETUP_HINT }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type MembershipRow = {
    workspace_id: string;
    role: string | null;
    workspaces: { id: string; name: string; updated_at: string } | null;
  };

  const rows = (memberships ?? []) as unknown as MembershipRow[];
  const ids = rows.map((r) => r.workspace_id);

  const counts = new Map<string, number>();
  if (ids.length > 0) {
    const { data: allMembers } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .in("workspace_id", ids);
    for (const m of (allMembers ?? []) as Array<{ workspace_id: string }>) {
      counts.set(m.workspace_id, (counts.get(m.workspace_id) ?? 0) + 1);
    }
  }

  const workspaces = rows
    .filter((r) => r.workspaces !== null)
    .map((r) => ({
      id: r.workspaces!.id,
      name: r.workspaces!.name,
      membersCount: counts.get(r.workspace_id) ?? 1,
      lastActive: r.workspaces!.updated_at,
      role: (r.role ?? "member") as "owner" | "member",
    }))
    .sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime(),
    );

  return NextResponse.json({ workspaces });
}

/** Create a workspace and add the creator as its owner. */
export async function POST(req: Request): Promise<Response> {
  let name = "Untitled Workspace";
  try {
    const body = (await req.json()) as { name?: string };
    if (body.name) name = body.name;
  } catch {
    // keep default name
  }

  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    return NextResponse.json({
      workspace: { ...DEMO_WORKSPACE, id: generateId("ws"), name },
      demo: true,
    });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (isSupabaseInvalidApiKeyError(authError)) {
    return NextResponse.json({
      workspace: { ...DEMO_WORKSPACE, id: generateId("ws"), name },
      demo: true,
    });
  }
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Generate the id client-side and insert WITHOUT .select(): reading the
  // row back would be blocked by RLS (the select policy requires
  // membership, and the membership row doesn't exist yet — chicken/egg).
  const workspaceId = globalThis.crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const { error } = await supabase
    .from("workspaces")
    .insert({ id: workspaceId, name, created_by: user.id });

  if (error) {
    if (isSupabaseMissingTableError(error)) {
      return NextResponse.json({ error: SUPABASE_SETUP_HINT }, { status: 503 });
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to create workspace" },
      { status: 500 },
    );
  }

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspaceId, user_id: user.id, role: "owner" });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({
    workspace: {
      id: workspaceId,
      name,
      membersCount: 1,
      lastActive: createdAt,
    },
  });
}
