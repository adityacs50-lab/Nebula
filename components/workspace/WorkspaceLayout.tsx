"use client";

import { useState } from "react";
import { TopBar, type TopBarView } from "@/components/topbar/TopBar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { PersonalCanvas } from "./PersonalCanvas";
import { TeamFeed } from "@/components/feed/TeamFeed";
import { CommandPalette } from "./CommandPalette";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

/**
 * Nebula OS shell: top bar over [sidebar | personal canvas | team feed].
 * The feed column is fixed at 380px on xl screens; below that the
 * Canvas/Feed tabs in the top bar switch the center view.
 */
export function WorkspaceLayout({ workspaceId }: { workspaceId: string }) {
  const [view, setView] = useState<TopBarView>("Canvas");
  const clearFeedUnread = useWorkspaceStore((s) => s.clearFeedUnread);

  function handleViewChange(next: TopBarView) {
    setView(next);
    if (next === "Feed") clearFeedUnread();
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopBar
        workspaceId={workspaceId}
        view={view}
        onViewChange={handleViewChange}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar workspaceId={workspaceId} />

        {/* Center: canvas (or feed on smaller screens via tabs) */}
        <div
          className={cn(
            "min-w-0 flex-1",
            view !== "Canvas" && "hidden xl:flex",
            view === "Canvas" && "flex",
          )}
        >
          <PersonalCanvas />
        </div>

        {/* Feed: always on xl; tab-controlled below */}
        <div
          className={cn(
            "w-full xl:w-[380px] xl:shrink-0",
            view === "Feed" ? "flex" : "hidden xl:flex",
          )}
        >
          <TeamFeed />
        </div>
      </div>

      <CommandPalette workspaceId={workspaceId} />
    </div>
  );
}
