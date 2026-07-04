"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity } from "lucide-react";
import { FeedItemRow } from "./FeedItem";
import { FeedFilter } from "./FeedFilter";
import { TeamAI } from "./TeamAI";
import { useTeamFeed } from "@/hooks/useTeamFeed";
import { useWorkspaceStore } from "@/store/workspaceStore";

/**
 * The heartbeat of Nebula OS: everything every member does lands here
 * in real time, with the Team AI docked underneath.
 */
export function TeamFeed() {
  const { filtered, loading, feedItems } = useTeamFeed();
  const bumpFeedUnread = useWorkspaceStore((s) => s.bumpFeedUnread);
  const prevCount = useRef<number | null>(null);

  // Track newly arrived items for the unread dot on the Feed tab
  useEffect(() => {
    const count = feedItems?.length ?? 0;
    if (prevCount.current !== null && count > prevCount.current) {
      bumpFeedUnread();
    }
    prevCount.current = count;
  }, [feedItems?.length, bumpFeedUnread]);

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-surface">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 pb-2 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-secondary">
            Team feed
          </h2>
        </div>
        <FeedFilter />
      </div>

      {/* Stream */}
      <div className="nowheel min-h-0 flex-1 overflow-y-auto">
        {loading && (
          <div className="space-y-3 p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 w-2/5 rounded bg-surface-hover" />
                <div className="h-3 w-4/5 rounded bg-surface-hover" />
              </div>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 pt-16 text-center">
            <Activity size={18} className="text-text-muted" />
            <p className="text-[13px] text-text-secondary">No activity yet</p>
            <p className="text-[11px] text-text-muted">
              Your team&apos;s work will appear here
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <FeedItemRow item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Team AI — always visible */}
      <TeamAI />
    </div>
  );
}
