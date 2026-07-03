import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, Sparkles } from "lucide-react";
import { createClient, supabaseServerConfigured } from "@/lib/supabase/server";
import {
  isSupabaseInvalidApiKeyError,
  isSupabaseMissingTableError,
  SUPABASE_SETUP_HINT,
  supabaseApiKeyAvailable,
} from "@/lib/supabase/config";
import { createAdminClient, supabaseAdminConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join workspace — Nebula",
};

type InviteRow = {
  id: string;
  workspace_id: string;
  expires_at: string;
  used_by: string | null;
};

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  // Demo mode — no real backend configured yet, just drop into the demo canvas.
  if (!supabaseServerConfigured() || !(await supabaseApiKeyAvailable())) {
    redirect("/workspace/demo");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (isSupabaseInvalidApiKeyError(authError)) {
    redirect("/workspace/demo");
  }

  if (!user) {
    redirect(
      `/auth/login?redirect_to=${encodeURIComponent(`/invite/${token}`)}`,
    );
  }

  if (!supabaseAdminConfigured()) {
    return (
      <InviteError message="Invite links aren't fully set up yet — ask whoever runs this workspace to add SUPABASE_SERVICE_ROLE_KEY." />
    );
  }

  // Read with the admin client: the invitee isn't a workspace member yet,
  // so the invites_select RLS policy would otherwise hide this row.
  const admin = createAdminClient();
  const { data: invite, error: inviteError } = await admin
    .from("invites")
    .select("id, workspace_id, expires_at, used_by")
    .eq("token", token)
    .maybeSingle<InviteRow>();

  if (inviteError || !invite) {
    if (isSupabaseMissingTableError(inviteError)) {
      return <InviteError message={SUPABASE_SETUP_HINT} />;
    }
    return <InviteError message="This invite link is invalid." />;
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return (
      <InviteError message="This invite link has expired. Ask your teammate to send a new one." />
    );
  }

  if (invite.used_by && invite.used_by !== user.id) {
    return (
      <InviteError message="This invite link has already been used by someone else." />
    );
  }

  if (invite.used_by !== user.id) {
    const { error: memberError } = await admin
      .from("workspace_members")
      .insert({
        workspace_id: invite.workspace_id,
        user_id: user.id,
        role: "member",
      });

    if (memberError && !memberError.message.toLowerCase().includes("duplicate")) {
      return (
        <InviteError message="Something went wrong joining this workspace. Try the link again." />
      );
    }

    await admin.from("invites").update({ used_by: user.id }).eq("id", invite.id);
  }

  redirect(`/workspace/${invite.workspace_id}`);
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <Sparkles size={20} className="text-primary" />
          Nebula
        </Link>
        <div className="rounded-xl border border-border bg-surface p-8 text-center shadow-card">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-error/10 p-3">
              <AlertCircle size={22} className="text-error" />
            </div>
          </div>
          <h1 className="text-lg font-semibold">Invite link invalid</h1>
          <p className="mt-2 text-sm text-text-secondary">{message}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
