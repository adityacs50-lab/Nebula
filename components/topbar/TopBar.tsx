"use client";

import { Play, Command } from "lucide-react";
import { OnlineAvatars } from "./OnlineAvatars";
import { ShareButton } from "./ShareButton";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

const VIEWS = ["Canvas", "Feed", "Files"] as const;
export type TopBarView = (typeof VIEWS)[number];

export function TopBar({
  workspaceId,
  view,
  onViewChange,
}: {
  workspaceId: string;
  view: TopBarView;
  onViewChange: (view: TopBarView) => void;
}) {
  const workspaceName = useWorkspaceStore((s) => s.workspaceName);
  const zoom = useWorkspaceStore((s) => s.zoom);
  const feedUnread = useWorkspaceStore((s) => s.feedUnread);
  const setCommandPaletteOpen = useWorkspaceStore((s) => s.setCommandPaletteOpen);

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <div className="flex min-w-0 items-center gap-2">
        <h1 className="truncate text-[13px] font-semibold text-text-primary">
          {workspaceName}
        </h1>
        <span className="rounded border border-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-text-secondary">
          Free
        </span>
      </div>

      {/* View switcher */}
      <div className="mx-auto flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={cn(
              "relative rounded px-3 py-1 text-xs transition-colors duration-100",
              view === v
                ? "bg-surface-hover text-text-primary"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {v}
            {v === "Feed" && feedUnread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          title="Command palette (⌘K)"
          className="flex h-7 items-center gap-1.5 rounded-md border border-border px-2 text-[11px] text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary"
        >
          <Command size={11} />K
        </button>
        <OnlineAvatars />
        <ShareButton workspaceId={workspaceId} />
        <button
          aria-label="Present"
          title="Present"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary"
        >
          <Play size={12} />
        </button>
        <span className="w-9 text-right text-xs tabular-nums text-text-secondary">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </header>
  );
}
