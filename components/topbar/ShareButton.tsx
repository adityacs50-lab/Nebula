"use client";

import { useState } from "react";
import { ChevronDown, Check, Copy, Link2 } from "lucide-react";
import { MenuDropdown } from "@/components/ui/Dropdown";
import { Presence } from "@/components/multiplayer/Presence";
import { Button } from "@/components/ui/Button";

export function ShareButton({ workspaceId }: { workspaceId: string }) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function generateInvite() {
    if (inviteUrl || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const payload = (await res.json()) as { inviteUrl?: string };
      setInviteUrl(payload.inviteUrl ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <MenuDropdown
      trigger={
        <Button size="sm" onClick={() => void generateInvite()}>
          Share
          <ChevronDown size={13} />
        </Button>
      }
    >
      <h3 className="mb-3 text-sm font-semibold">Share this canvas</h3>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 flex-1 items-center gap-2 truncate rounded-lg border border-border bg-background px-2.5 font-mono text-[10px] text-text-secondary">
          <Link2 size={11} className="shrink-0" />
          <span className="truncate">
            {loading ? "Generating link..." : (inviteUrl ?? "Invite link")}
          </span>
        </div>
        <button
          onClick={() => void copy()}
          disabled={!inviteUrl}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
          aria-label="Copy invite link"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Online now
      </h4>
      <Presence />
    </MenuDropdown>
  );
}
