"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { OnlineAvatars } from "./OnlineAvatars";
import { ShareButton } from "./ShareButton";
import { useCanvasStore } from "@/store/canvasStore";
import { cn } from "@/lib/utils";

const VIEWS = ["Canvas", "Chat", "Files"] as const;
type View = (typeof VIEWS)[number];

export function TopBar({ workspaceId }: { workspaceId: string }) {
  const workspaceName = useCanvasStore((s) => s.workspaceName);
  const zoom = useCanvasStore((s) => s.zoom);
  const [view, setView] = useState<View>("Canvas");

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      {/* Workspace name + plan badge */}
      <div className="flex min-w-0 items-center gap-2">
        <h1 className="truncate text-sm font-semibold">{workspaceName}</h1>
        <span className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[9px] font-medium text-text-secondary">
          Free
        </span>
      </div>

      {/* View switcher */}
      <div className="mx-auto flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-md px-3 py-1 text-xs transition-colors",
              view === v
                ? "bg-surface-hover text-white"
                : "text-text-secondary hover:text-white",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Presence + actions */}
      <div className="flex items-center gap-3">
        <OnlineAvatars />
        <ShareButton workspaceId={workspaceId} />
        <button
          aria-label="Present"
          title="Present"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <Play size={13} />
        </button>
        <span className="w-10 text-right text-xs tabular-nums text-text-secondary">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </header>
  );
}
