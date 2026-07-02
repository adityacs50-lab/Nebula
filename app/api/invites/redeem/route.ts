import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Invalid invite link", { status: 400 });
  }

  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/auth/login?redirect_to=${encodeURIComponent(request.url)}`);
  }

  // Find the invite
  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();

  if (inviteError || !invite) {
    return new Response("Invalid or expired invite", { status: 404 });
  }

  // Check if expired
  if (new Date(invite.expires_at) < new Date()) {
    return new Response("Invite has expired", { status: 410 });
  }

  // Check if already used
  if (invite.used_by) {
    return new Response("Invite has already been used", { status: 409 });
  }

  // Add user to workspace members
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: invite.workspace_id,
      user_id: user.id,
      role: "member",
    });

  if (memberError) {
    // User might already be a member
    if (!memberError.message.includes("duplicate")) {
      return new Response("Failed to join workspace", { status: 500 });
    }
  }

  // Mark invite as used
  await supabase
    .from("invites")
    .update({ used_by: user.id })
    .eq("id", invite.id);

  redirect(`/workspace/${invite.workspace_id}`);
}
