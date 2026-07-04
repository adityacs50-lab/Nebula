"use client";

import { useMemo } from "react";
import { useMutation, useStorage } from "@/lib/liveblocks/config";
import { useWorkspaceStore } from "@/store/workspaceStore";
import type { FeedReaction } from "@/types/feed";

/** Team Feed reads, filtering, and reactions. */
export function useTeamFeed() {
  const feedItems = useStorage((root) => root.feedItems);
  const feedFilter = useWorkspaceStore((s) => s.feedFilter);
  const feedMemberFilter = useWorkspaceStore((s) => s.feedMemberFilter);

  const filtered = useMemo(() => {
    let items = feedItems ? [...feedItems] : [];
    if (feedFilter !== "all") items = items.filter((f) => f.type === feedFilter);
    if (feedMemberFilter !== "all")
      items = items.filter((f) => f.memberId === feedMemberFilter);
    return items;
  }, [feedItems, feedFilter, feedMemberFilter]);

  const react = useMutation(
    ({ storage }, itemId: string, reaction: FeedReaction) => {
      const feed = storage.get("feedItems");
      const index = feed.toArray().findIndex((f) => f.id === itemId);
      if (index === -1) return;
      const item = feed.get(index);
      if (!item) return;
      const reactions = { ...(item.reactions ?? {}) };
      reactions[reaction] = (reactions[reaction] ?? 0) + 1;
      feed.set(index, { ...item, reactions });
    },
    [],
  );

  return { feedItems, filtered, react, loading: feedItems === null };
}
