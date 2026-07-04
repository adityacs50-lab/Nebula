"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { FEED_TYPE_LABELS, type FeedType } from "@/types/feed";
import { cn } from "@/lib/utils";

const TABS: Array<{ value: FeedType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "ai_chat", label: FEED_TYPE_LABELS.ai_chat },
  { value: "code", label: FEED_TYPE_LABELS.code },
  { value: "research", label: FEED_TYPE_LABELS.research },
  { value: "task_complete", label: FEED_TYPE_LABELS.task_complete },
  { value: "outreach", label: FEED_TYPE_LABELS.outreach },
];

export function FeedFilter() {
  const feedFilter = useWorkspaceStore((s) => s.feedFilter);
  const setFeedFilter = useWorkspaceStore((s) => s.setFeedFilter);

  return (
    <div className="nowheel flex gap-1 overflow-x-auto pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setFeedFilter(tab.value)}
          className={cn(
            "shrink-0 rounded px-2 py-1 text-[11px] transition-colors duration-100",
            feedFilter === tab.value
              ? "bg-surface-hover font-medium text-text-primary"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
