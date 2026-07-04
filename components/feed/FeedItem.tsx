"use client";

import { ArrowUpRight, Flame, MessageCircle, ThumbsUp } from "lucide-react";
import { useTeamFeed } from "@/hooks/useTeamFeed";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { relativeTime } from "@/lib/utils";
import type { FeedItem, FeedReaction } from "@/types/feed";

/**
 * One activity row: member indicator, title, one-line summary, jump
 * link to the source block, and lightweight reactions.
 */
export function FeedItemRow({ item }: { item: FeedItem }) {
  const setActiveMemberId = useWorkspaceStore((s) => s.setActiveMemberId);
  const setSelectedBlockId = useWorkspaceStore((s) => s.setSelectedBlockId);

  function jumpToBlock() {
    setActiveMemberId(item.memberId);
    if (item.blockId) setSelectedBlockId(item.blockId);
  }

  return (
    <div className="group flex gap-3 border-b border-border px-4 py-3 transition-colors duration-100 hover:bg-surface-hover">
      {/* member indicator */}
      <span
        className="mt-0.5 h-full w-[3px] shrink-0 self-stretch rounded-sm"
        style={{ backgroundColor: item.memberColor }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-medium text-text-primary">
            {item.memberName}
          </span>
          <span className="ml-auto shrink-0 text-[11px] tabular-nums text-text-muted">
            {relativeTime(item.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-[13px] text-text-primary/90">{item.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
          {item.summary}
        </p>
        <div className="mt-1.5 flex items-center gap-1">
          <button
            onClick={jumpToBlock}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-text-secondary transition-colors duration-100 hover:text-primary"
          >
            View in canvas
            <ArrowUpRight size={10} />
          </button>
          <span className="ml-auto flex items-center gap-0.5 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
            <ReactionButton item={item} reaction="like">
              <ThumbsUp size={11} />
            </ReactionButton>
            <ReactionButton item={item} reaction="fire">
              <Flame size={11} />
            </ReactionButton>
            <ReactionButton item={item} reaction="comment">
              <MessageCircle size={11} />
            </ReactionButton>
          </span>
        </div>
      </div>
    </div>
  );
}

function ReactionButton({
  item,
  reaction,
  children,
}: {
  item: FeedItem;
  reaction: FeedReaction;
  children: React.ReactNode;
}) {
  const { react } = useTeamFeed();
  const count = item.reactions?.[reaction] ?? 0;
  return (
    <button
      onClick={() => react(item.id, reaction)}
      className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-text-secondary transition-colors duration-100 hover:bg-surface hover:text-text-primary"
    >
      {children}
      {count > 0 && <span className="tabular-nums">{count}</span>}
    </button>
  );
}
