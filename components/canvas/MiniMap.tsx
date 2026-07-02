"use client";

import { MiniMap as ReactFlowMiniMap, type Node } from "reactflow";
import { BLOCK_COLORS, type BlockType } from "@/types/blocks";

function nodeColor(node: Node): string {
  const type = node.type as BlockType | undefined;
  return type && type in BLOCK_COLORS ? BLOCK_COLORS[type] : "#7C3AED";
}

export function MiniMap() {
  return (
    <ReactFlowMiniMap
      position="bottom-right"
      nodeColor={nodeColor}
      nodeStrokeWidth={0}
      maskColor="rgba(13, 13, 13, 0.75)"
      pannable
      zoomable
      style={{ width: 160, height: 110 }}
    />
  );
}
