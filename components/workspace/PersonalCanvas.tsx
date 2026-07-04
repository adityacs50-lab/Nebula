"use client";

import { ArrowLeft, Eye, Plus } from "lucide-react";
import { Canvas } from "@/components/canvas/Canvas";
import { useTeam } from "@/hooks/useTeam";
import { useBlocks } from "@/hooks/useBlocks";
import { useWorkspaceStore } from "@/store/workspaceStore";

/**
 * The center column: header bar naming whose workspace you're on
 * (with read-only affordances for teammates'), above the canvas.
 */
export function PersonalCanvas() {
  const { team, me } = useTeam();
  const { addBlock } = useBlocks();
  const activeMemberId = useWorkspaceStore((s) => s.activeMemberId);
  const setActiveMemberId = useWorkspaceStore((s) => s.setActiveMemberId);
  const setSelectedBlockId = useWorkspaceStore((s) => s.setSelectedBlockId);

  const activeMember =
    team.find((m) => m.id === activeMemberId) ?? me;
  const mine = activeMemberId === me.id;

  function quickAdd() {
    const id = addBlock("ai-chat", {
      x: 120 + Math.random() * 160,
      y: 100 + Math.random() * 120,
    });
    if (typeof id === "string") setSelectedBlockId(id);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Canvas header */}
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: activeMember.color }}
        />
        <span className="truncate text-[13px] font-medium text-text-primary">
          {mine ? "My Workspace" : `${activeMember.name}'s Workspace`}
        </span>
        {mine ? (
          <>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] text-text-muted">
              <Eye size={11} />
              visible to team
            </span>
            <button
              onClick={quickAdd}
              className="flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-white transition-opacity duration-100 hover:opacity-90"
            >
              <Plus size={12} />
              Add block
            </button>
          </>
        ) : (
          <>
            <span className="rounded border border-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-text-secondary">
              Read only
            </span>
            <button
              onClick={() => setActiveMemberId(me.id)}
              className="ml-auto flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary"
            >
              <ArrowLeft size={12} />
              Back to mine
            </button>
          </>
        )}
      </div>

      <main className="relative min-h-0 flex-1">
        <Canvas key={activeMemberId} />
      </main>
    </div>
  );
}
