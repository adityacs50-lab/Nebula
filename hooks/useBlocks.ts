"use client";

import { useCallback } from "react";
import { useMutation, useStorage } from "@/lib/liveblocks/config";
import {
  DEFAULT_BLOCK_SIZES,
  BLOCK_LABELS,
  type Block,
  type BlockData,
  type BlockType,
  type Connection,
  type XYPosition,
} from "@/types/blocks";
import type { FeedItem, FeedType } from "@/types/feed";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useTeam } from "./useTeam";
import { generateId } from "@/lib/utils";

/**
 * Reads/writes against shared canvas state. Every mutation stamps
 * lastEditedBy/lastEditedAt, and significant updates publish a FeedItem
 * so the whole team sees the work land in the Team Feed instantly.
 */
export function useBlocks() {
  const blocks = useStorage((root) => root.blocks);
  const connections = useStorage((root) => root.connections);
  const { me } = useTeam();
  const activeMemberId = useWorkspaceStore((s) => s.activeMemberId);

  const addBlock = useMutation(
    ({ storage }, type: BlockType, position: XYPosition) => {
      const list = storage.get("blocks");
      const block: Block = {
        id: generateId("block"),
        type,
        ownerId: me.id,
        ownerName: me.name,
        ownerColor: me.color,
        position,
        size: DEFAULT_BLOCK_SIZES[type],
        lastEditedBy: me.name,
        lastEditedAt: new Date().toISOString(),
        data: defaultDataForType(type),
      };
      list.push(block);
      return block.id;
    },
    [me],
  );

  const updateBlockPosition = useMutation(
    ({ storage }, id: string, position: XYPosition) => {
      const list = storage.get("blocks");
      const index = list.toArray().findIndex((b) => b.id === id);
      if (index === -1) return;
      const block = list.get(index);
      if (!block) return;
      list.set(index, { ...block, position });
    },
    [],
  );

  const updateBlockSize = useMutation(
    ({ storage }, id: string, width: number, height: number) => {
      const list = storage.get("blocks");
      const index = list.toArray().findIndex((b) => b.id === id);
      if (index === -1) return;
      const block = list.get(index);
      if (!block) return;
      list.set(index, { ...block, size: { width, height } });
    },
    [],
  );

  const updateBlockData = useMutation(
    ({ storage }, id: string, data: Partial<BlockData>) => {
      const list = storage.get("blocks");
      const index = list.toArray().findIndex((b) => b.id === id);
      if (index === -1) return;
      const block = list.get(index);
      if (!block) return;
      list.set(index, {
        ...block,
        data: { ...block.data, ...data },
        lastEditedBy: me.name,
        lastEditedAt: new Date().toISOString(),
      });
    },
    [me],
  );

  const deleteBlock = useMutation(({ storage }, id: string) => {
    const list = storage.get("blocks");
    const index = list.toArray().findIndex((b) => b.id === id);
    if (index !== -1) list.delete(index);
    const edges = storage.get("connections");
    edges
      .toArray()
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => c.source === id || c.target === id)
      .map(({ i }) => i)
      .reverse()
      .forEach((i) => edges.delete(i));
  }, []);

  const addConnection = useMutation(
    ({ storage }, source: string, target: string) => {
      const edges = storage.get("connections");
      const exists = edges
        .toArray()
        .some((c) => c.source === source && c.target === target);
      if (exists) return;
      const connection: Connection = { id: generateId("conn"), source, target };
      edges.push(connection);
    },
    [],
  );

  /** Publish an activity item to the Team Feed (top of the list). */
  const postFeedItem = useMutation(
    (
      { storage },
      input: { type: FeedType; title: string; summary: string; blockId?: string },
    ) => {
      const feed = storage.get("feedItems");
      const item: FeedItem = {
        id: generateId("feed"),
        memberId: me.id,
        memberName: me.name,
        memberColor: me.color,
        type: input.type,
        title: input.title,
        summary: input.summary,
        createdAt: new Date().toISOString(),
        blockId: input.blockId,
      };
      feed.insert(item, 0);
      // keep the live feed bounded
      while (feed.length > 200) feed.delete(feed.length - 1);
    },
    [me],
  );

  /** Blocks belonging to the member whose workspace is on screen. */
  const visibleBlocks = (blocks ?? []).filter(
    (b) => b.ownerId === activeMemberId,
  );

  const readOnly = activeMemberId !== me.id;

  return {
    blocks,
    visibleBlocks,
    connections,
    readOnly,
    addBlock,
    updateBlockPosition,
    updateBlockSize,
    updateBlockData,
    deleteBlock,
    addConnection,
    postFeedItem,
  };
}

function defaultDataForType(type: BlockType): BlockData {
  switch (type) {
    case "ai-chat":
      return { title: BLOCK_LABELS[type], messages: [] };
    case "code":
      return { title: BLOCK_LABELS[type], language: "TypeScript", code: "" };
    case "research":
      return { title: "", url: "", summary: "", notes: "", tags: [] };
    case "task":
      return { title: "Today's Tasks", tasks: [] };
    case "outreach":
      return { title: BLOCK_LABELS[type], contacts: [] };
    case "notes":
      return { title: "Untitled note", body: "", important: false };
  }
}
