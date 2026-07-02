import type { Node, Edge } from "reactflow";
import type { Block, BlockType, Connection } from "@/types/blocks";

/** Data payload carried on every react-flow node in the canvas. */
export type BlockNodeData = {
  block: Block;
};

export type BlockNode = Node<BlockNodeData>;

export function blockToNode(block: Block): BlockNode {
  return {
    id: block.id,
    type: block.type,
    position: block.position,
    data: { block },
    dragHandle: ".nebula-drag-handle",
    style: {
      width: block.size.width,
      height: block.data.minimized ? undefined : block.size.height,
    },
  };
}

export function connectionToEdge(connection: Connection): Edge {
  return {
    id: connection.id,
    source: connection.source,
    target: connection.target,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#7C3AED", strokeWidth: 2, opacity: 0.7 },
  };
}

export const ADDABLE_BLOCK_TYPES: BlockType[] = [
  "ai-chat",
  "generate-code",
  "ai-image",
  "user-flow",
  "api-integration",
  "mind-map",
];
