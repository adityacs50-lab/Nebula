import { NextResponse } from "next/server";
import { createClient, supabaseServerConfigured } from "@/lib/supabase/server";
import {
  isSupabaseInvalidApiKeyError,
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
    .select("workspace_id, workspaces(id, name, updated_at)")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type MembershipRow = {
    workspace_id: string;
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
    }));

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

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({ name, created_by: user.id })
    .select("id, name, updated_at")
    .single();

  if (error || !workspace) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create workspace" },
      { status: 500 },
    );
  }

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspace.id, user_id: user.id, role: "owner" });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({
    workspace: {
      id: workspace.id as string,
      name: workspace.name as string,
      membersCount: 1,
      lastActive: workspace.updated_at as string,
    },
  });
}

/** Create an invite link for a workspace. */
export async function PATCH(req: Request): Promise<Response> {
  let workspaceId = "";
  try {
    const body = (await req.json()) as { workspaceId?: string };
    workspaceId = body.workspaceId ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    const token = generateId("invite");
    return NextResponse.json({
      inviteUrl: `${origin}/invites/${token}`,
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
      inviteUrl: `${origin}/workspace/${workspaceId || "demo"}?invite=${token}`,
      demo: true,
    });
  }
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: invite, error } = await supabase
    .from("invites")
    .insert({ workspace_id: workspaceId, created_by: user.id })
    .select("token")
    .single();

  if (error || !invite) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create invite" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    inviteUrl: `${origin}/invites/${invite.token as string}`,
  });
}
