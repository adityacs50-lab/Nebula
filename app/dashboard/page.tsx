"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  Users,
  Clock,
  UserPlus,
  LayoutGrid,
  LogOut,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { relativeTime } from "@/lib/utils";
import { getRecentWorkspaceIds } from "@/lib/recentWorkspaces";
import type { WorkspaceSummary } from "@/types/workspace";

const VIEW_COPY: Record<string, { title: string; subtitle: string; empty: string }> = {
  recent: {
    title: "Recently visited",
    subtitle: "Workspaces you've opened on this device.",
    empty: "You haven't opened any workspaces on this device yet.",
  },
  shared: {
    title: "Shared with me",
    subtitle: "Workspaces you've joined that someone else owns.",
    empty: "No workspaces have been shared with you yet.",
  },
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "";
  const { user, signOut, configured } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteFor, setInviteFor] = useState<WorkspaceSummary | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadWorkspaces = useCallback(async () => {
    try {
      const res = await fetch("/api/workspace");
      const payload = (await res.json()) as {
        workspaces?: WorkspaceSummary[];
        error?: string;
      };
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      setWorkspaces(payload.workspaces ?? []);
    } catch {
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadWorkspaces();
  }, [loadWorkspaces]);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName || "Untitled Workspace" }),
      });
      const payload = (await res.json()) as {
        workspace?: { id: string };
        error?: string;
      };
      if (payload.workspace) {
        router.push(`/workspace/${payload.workspace.id}`);
      }
    } finally {
      setCreating(false);
      setCreateOpen(false);
    }
  }

  async function openInvite(workspace: WorkspaceSummary) {
    setInviteFor(workspace);
    setInviteUrl(null);
    setCopied(false);
    const res = await fetch("/api/workspace", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId: workspace.id }),
    });
    const payload = (await res.json()) as { inviteUrl?: string };
    setInviteUrl(payload.inviteUrl ?? null);
  }

  async function copyInvite() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const displayName =
    (user?.user_metadata as Record<string, unknown> | undefined)?.full_name ??
    user?.email ??
    "Founder";

  const visibleWorkspaces = useMemo(() => {
    if (view === "recent") {
      const recentIds = getRecentWorkspaceIds();
      const byId = new Map(workspaces.map((w) => [w.id, w]));
      return recentIds.map((id) => byId.get(id)).filter(Boolean) as WorkspaceSummary[];
    }
    if (view === "shared") {
      return workspaces.filter((w) => w.role && w.role !== "owner");
    }
    return workspaces;
  }, [workspaces, view]);

  const copy = VIEW_COPY[view];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Sparkles size={18} className="text-primary" />
            Nebula
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-text-secondary sm:block">
              {String(displayName)}
            </span>
            {configured && (
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
              >
                <LogOut size={14} />
                Log out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {copy?.title ?? "Your workspaces"}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {copy?.subtitle ?? "Pick a canvas or spin up a new one for your team."}
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            New workspace
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl border border-border bg-surface"
              />
            ))}
          </div>
        ) : visibleWorkspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
            <p className="text-sm text-text-secondary">
              {copy?.empty ?? "No workspaces yet."}
            </p>
            {view && (
              <Link
                href="/dashboard"
                className="mt-3 text-xs text-primary hover:underline"
              >
                View all workspaces
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleWorkspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-xl border border-border bg-surface transition-all hover:border-primary/50 hover:shadow-glow-soft"
              >
                <Link href={`/workspace/${workspace.id}`} className="block p-5">
                  {/* thumbnail */}
                  <div
                    className="mb-4 flex h-20 items-center justify-center rounded-lg border border-border bg-background"
                    style={{
                      backgroundImage:
                        "radial-gradient(#232323 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  >
                    <LayoutGrid
                      size={22}
                      className="text-text-secondary transition-colors group-hover:text-primary"
                    />
                  </div>
                  <h2 className="mb-2 truncate font-semibold">
                    {workspace.name}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Users size={12} />
                      {workspace.membersCount}{" "}
                      {workspace.membersCount === 1 ? "member" : "members"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {relativeTime(workspace.lastActive)}
                    </span>
                  </div>
                </Link>
                <div className="border-t border-border px-5 py-2.5">
                  <button
                    onClick={() => void openInvite(workspace)}
                    className="flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-primary"
                  >
                    <UserPlus size={12} />
                    Invite team members
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create workspace modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a workspace"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Workspace name"
            placeholder="Project Nebula"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
          <Button loading={creating} onClick={() => void handleCreate()}>
            Create and open canvas
          </Button>
        </div>
      </Modal>

      {/* Invite modal */}
      <Modal
        open={inviteFor !== null}
        onClose={() => setInviteFor(null)}
        title={`Invite to ${inviteFor?.name ?? "workspace"}`}
      >
        <p className="mb-4 text-sm text-text-secondary">
          Anyone with this link can join the canvas. Links expire after 7 days.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 truncate rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-text-secondary">
            {inviteUrl ?? "Generating link..."}
          </div>
          <Button size="sm" onClick={() => void copyInvite()} disabled={!inviteUrl}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
