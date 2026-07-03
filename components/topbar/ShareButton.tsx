"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Loader2, UserPlus } from "lucide-react";
import { MenuDropdown } from "@/components/ui/Dropdown";
import { Presence } from "@/components/multiplayer/Presence";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export function ShareButton({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  async function handleInviteTeammates() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/workspace/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const payload = (await res.json()) as {
        inviteUrl?: string;
        error?: string;
      };
      if (!res.ok || !payload.inviteUrl) {
        throw new Error(payload.error ?? "Failed to create invite link");
      }
      await navigator.clipboard.writeText(payload.inviteUrl);
      setToastOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create invite link",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MenuDropdown
        trigger={
          <Button size="sm">
            Share
            <ChevronDown size={13} />
          </Button>
        }
      >
        <h3 className="mb-3 text-sm font-semibold">Share this canvas</h3>
        <button
          onClick={() => void handleInviteTeammates()}
          disabled={loading}
          className="mb-4 flex w-full items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-left transition-colors hover:border-primary/50 disabled:opacity-50"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <UserPlus size={13} />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-white">
              Invite teammates
            </span>
            <span className="block truncate text-[10px] text-text-secondary">
              {loading
                ? "Generating link..."
                : "Copy a link that adds them to this workspace"}
            </span>
          </span>
        </button>
        {error && (
          <div className="mb-3">
            <p className="text-[11px] text-error">{error}</p>
            {error.includes("demo canvas") && (
              <Link
                href="/dashboard"
                className="mt-1.5 inline-block text-[11px] font-medium text-primary hover:underline"
              >
                Create a workspace →
              </Link>
            )}
          </div>
        )}
        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          Online now
        </h4>
        <Presence />
      </MenuDropdown>

      <Toast
        message="Invite link copied!"
        show={toastOpen}
        onDone={() => setToastOpen(false)}
      />
    </>
  );
}
