"use client";

import { useCallback } from "react";
import { useStorage } from "@/lib/liveblocks/config";
import { buildTeamContext } from "@/lib/context/teamContext";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useTeam } from "./useTeam";
import type { Block } from "@/types/blocks";
import type { FeedItem } from "@/types/feed";

/**
 * The Team AI gateway. Snapshots every member's blocks plus the feed
 * into a TeamContext and streams Gemini's answer back token by token.
 */
export function useTeamAI() {
  const blocks = useStorage((root) => root.blocks);
  const feedItems = useStorage((root) => root.feedItems);
  const workspaceName = useWorkspaceStore((s) => s.workspaceName);
  const { team } = useTeam();

  const getTeamContext = useCallback(() => {
    const plainBlocks: Block[] = blocks
      ? (JSON.parse(JSON.stringify(blocks)) as Block[])
      : [];
    const plainFeed: FeedItem[] = feedItems
      ? (JSON.parse(JSON.stringify(feedItems)) as FeedItem[])
      : [];
    return buildTeamContext(workspaceName, team, plainBlocks, plainFeed);
  }, [blocks, feedItems, workspaceName, team]);

  const askTeamAI = useCallback(
    async (
      question: string,
      onToken: (partial: string) => void,
    ): Promise<string> => {
      const res = await fetch("/api/ai/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, teamContext: getTeamContext() }),
      });
      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `Team AI request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        onToken(full);
      }
      return full;
    },
    [getTeamContext],
  );

  return { askTeamAI, getTeamContext };
}
