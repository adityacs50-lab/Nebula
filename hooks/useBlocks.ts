"use client";

import { useCallback } from "react";
import { useMutation, useSelf, useStorage } from "@/lib/liveblocks/config";
import {
  DEFAULT_BLOCK_SIZES,
  type Block,
  type BlockData,
  type BlockType,
  type Connection,
  type XYPosition,
  BLOCK_LABELS,
} from "@/types/blocks";
import { generateId } from "@/lib/utils";

/**
 * All reads/writes against the shared Liveblocks canvas state. Every
 * mutation stamps lastEditedBy/lastEditedAt so the canvas context the AI
 * sees always knows who touched what.
 */
export function useBlocks() {
  const blocks = useStorage((root) => root.blocks);
  const connections = useStorage((root) => root.connections);
  const self = useSelf();
  const editorName = self?.info?.name ?? "Someone";

  const addBlock = useMutation(
    ({ storage }, type: BlockType, position: XYPosition) => {
      const list = storage.get("blocks");
      const block: Block = {
        id: generateId("block"),
        type,
        position,
        size: DEFAULT_BLOCK_SIZES[type],
        lastEditedBy: editorName,
        lastEditedAt: new Date().toISOString(),
        data: defaultDataForType(type),
      };
      list.push(block);
      return block.id;
    },
    [editorName],
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
        lastEditedBy: editorName,
        lastEditedAt: new Date().toISOString(),
      });
    },
    [editorName],
  );

  const deleteBlock = useMutation(({ storage }, id: string) => {
    const list = storage.get("blocks");
    const index = list.toArray().findIndex((b) => b.id === id);
    if (index !== -1) list.delete(index);
    const edges = storage.get("connections");
    const remaining = edges
      .toArray()
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => c.source === id || c.target === id)
      .map(({ i }) => i)
      .reverse();
    for (const i of remaining) edges.delete(i);
  }, []);

  const addConnection = useMutation(
    ({ storage }, source: string, target: string) => {
      const edges = storage.get("connections");
      const exists = edges
        .toArray()
        .some((c) => c.source === source && c.target === target);
      if (exists) return;
      const connection: Connection = {
        id: generateId("conn"),
        source,
        target,
      };
      edges.push(connection);
    },
    [],
  );

  return {
    blocks,
    connections,
    addBlock,
    updateBlockPosition,
    updateBlockSize,
    updateBlockData,
    deleteBlock,
    addConnection,
  };
}

function defaultDataForType(type: BlockType): BlockData {
  switch (type) {
    case "ai-chat":
      return { title: BLOCK_LABELS[type], messages: [] };
    case "generate-code":
      return { title: BLOCK_LABELS[type], language: "TypeScript", code: "" };
    case "ai-image":
      return { title: BLOCK_LABELS[type], prompt: "" };
    case "user-flow":
      return {
        title: BLOCK_LABELS[type],
        nodes: [
          { id: "start", label: "Start", type: "start" },
          { id: "step-1", label: "Step 1", type: "action" },
          { id: "end", label: "Done", type: "end" },
        ],
      };
    case "api-integration":
      return {
        title: BLOCK_LABELS[type],
        language: "TypeScript",
        code: "import { api } from '@/lib/api'\n\nexport async function healthCheck() {\n  const res = await api.get('/health')\n  return res.status === 200\n}",
      };
    case "mind-map":
      return {
        title: BLOCK_LABELS[type],
        mindNodes: [
          { id: "root", label: "Core Idea", x: 0, y: 0, parentId: null },
          { id: "n1", label: "Growth", x: -130, y: -70, parentId: "root" },
          { id: "n2", label: "Product", x: 130, y: -70, parentId: "root" },
          { id: "n3", label: "Revenue", x: -130, y: 70, parentId: "root" },
          { id: "n4", label: "Team", x: 130, y: 70, parentId: "root" },
        ],
      };
  }
}
