"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  Position,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "reactflow";
import type { NodeProps } from "reactflow";
import { Minus, Plus } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { FlowNode, FlowNodeKind } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";

const KIND_COLORS: Record<FlowNodeKind, string> = {
  start: "#10B981",
  action: "#F59E0B",
  end: "#7C3AED",
};

/** A miniature react-flow diagram embedded inside a canvas block. */
export function UserFlowBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  return (
    <BaseBlock
      id={id}
      type="user-flow"
      title={block.data.title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="nodrag nowheel h-full p-2">
        <ReactFlowProvider>
          <InnerFlow blockId={id} nodes={block.data.nodes ?? []} />
        </ReactFlowProvider>
      </div>
    </BaseBlock>
  );
}

function InnerFlow({
  blockId,
  nodes,
}: {
  blockId: string;
  nodes: FlowNode[];
}) {
  const { updateBlockData } = useBlocks();
  const { zoomIn, zoomOut } = useReactFlow();
  const [zoom, setZoom] = useState(80);
  const [editing, setEditing] = useState<{ id: string; label: string } | null>(
    null,
  );

  const flowNodes: Node[] = useMemo(
    () =>
      nodes.map((node, index) => ({
        id: node.id,
        position: { x: index * 150, y: (index % 2) * 60 },
        data: { label: node.label },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          background: "#0D0D0D",
          border: `1.5px solid ${KIND_COLORS[node.type]}`,
          color: "#FFFFFF",
          borderRadius: 8,
          fontSize: 10,
          padding: "6px 10px",
          width: "auto",
        },
      })),
    [nodes],
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      nodes.slice(0, -1).map((node, index) => ({
        id: `${node.id}-${nodes[index + 1].id}`,
        source: node.id,
        target: nodes[index + 1].id,
        animated: true,
        style: { stroke: "#F59E0B", strokeWidth: 1.5, opacity: 0.7 },
      })),
    [nodes],
  );

  const handleDoubleClick: NodeMouseHandler = (_event, node) => {
    const current = nodes.find((n) => n.id === node.id);
    if (current) setEditing({ id: current.id, label: current.label });
  };

  function saveEdit() {
    if (!editing) return;
    updateBlockData(blockId, {
      nodes: nodes.map((n) =>
        n.id === editing.id ? { ...n, label: editing.label || n.label } : n,
      ),
    });
    setEditing(null);
  }

  return (
    <div className="relative h-full overflow-hidden rounded-lg border border-border bg-background">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll
        panOnDrag
        onNodeDoubleClick={handleDoubleClick}
        onMove={(_event, viewport) => setZoom(Math.round(viewport.zoom * 100))}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#2A2A2A"
        />
      </ReactFlow>

      {/* Zoom controls */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg border border-border bg-surface px-1.5 py-1 text-[10px] text-text-secondary">
        <button
          className="rounded p-0.5 hover:text-white"
          onClick={() => zoomOut({ duration: 150 })}
          aria-label="Zoom out"
        >
          <Minus size={10} />
        </button>
        <span className="w-8 text-center">{zoom}%</span>
        <button
          className="rounded p-0.5 hover:text-white"
          onClick={() => zoomIn({ duration: 150 })}
          aria-label="Zoom in"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Inline node editor */}
      {editing && (
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5 rounded-lg border border-border bg-surface p-1.5 shadow-card">
          <input
            autoFocus
            value={editing.label}
            onChange={(e) => setEditing({ ...editing, label: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditing(null);
            }}
            className="h-6 w-32 rounded-md border border-border bg-background px-2 text-[10px] text-white focus:border-block-flow focus:outline-none"
          />
          <button
            onClick={saveEdit}
            className="rounded-md bg-block-flow px-2 py-1 text-[10px] font-medium text-black"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
