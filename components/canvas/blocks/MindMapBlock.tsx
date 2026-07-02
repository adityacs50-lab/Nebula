"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { NodeProps } from "reactflow";
import { Plus } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { MindMapNode } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { generateId, cn } from "@/lib/utils";

const CYAN = "#06B6D4";

/**
 * A lightweight SVG mind map: central node, radiating children connected
 * with curved bezier lines. Double-click to rename, drag to reposition,
 * "+" to branch.
 */
export function MindMapBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData } = useBlocks();
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = block.data.mindNodes ?? [];
  const [draft, setDraft] = useState<MindMapNode[] | null>(null);
  const [editing, setEditing] = useState<{ id: string; label: string } | null>(
    null,
  );
  const dragState = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const displayNodes = draft ?? nodes;
  const root = displayNodes.find((n) => n.parentId === null);

  function commit(next: MindMapNode[]) {
    updateBlockData(id, { mindNodes: next });
    setDraft(null);
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    node: MindMapNode,
  ) {
    if (node.parentId === null) return; // root is fixed at the center
    event.stopPropagation();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragState.current = {
      nodeId: node.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: node.x,
      originY: node.y,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    setDraft(
      (draft ?? nodes).map((n) =>
        n.id === drag.nodeId
          ? { ...n, x: drag.originX + dx, y: drag.originY + dy }
          : n,
      ),
    );
  }

  function handlePointerUp() {
    if (dragState.current && draft) commit(draft);
    dragState.current = null;
  }

  function addChild(parent: MindMapNode) {
    const angle = Math.random() * Math.PI * 2;
    const child: MindMapNode = {
      id: generateId("mind"),
      label: "New idea",
      x: parent.x + Math.cos(angle) * 120,
      y: parent.y + Math.sin(angle) * 90,
      parentId: parent.id,
    };
    commit([...displayNodes, child]);
    setEditing({ id: child.id, label: child.label });
  }

  function saveEdit() {
    if (!editing) return;
    commit(
      displayNodes.map((n) =>
        n.id === editing.id ? { ...n, label: editing.label || n.label } : n,
      ),
    );
    setEditing(null);
  }

  return (
    <BaseBlock
      id={id}
      type="mind-map"
      title={block.data.title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div
        ref={containerRef}
        className="nodrag nowheel relative h-full overflow-hidden rounded-lg bg-background"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Bezier connectors — SVG origin pinned to the block center so
            paths can use the same center-relative coordinates as nodes */}
        <svg
          className="absolute left-1/2 top-1/2 overflow-visible"
          width="1"
          height="1"
        >
          {displayNodes
            .filter((n) => n.parentId !== null)
            .map((node) => {
              const parent = displayNodes.find((p) => p.id === node.parentId);
              if (!parent) return null;
              return <BezierLink key={node.id} from={parent} to={node} />;
            })}
        </svg>

        {/* Nodes */}
        {displayNodes.map((node) => {
          const isRoot = node.parentId === null;
          const isEditing = editing?.id === node.id;
          return (
            <div
              key={node.id}
              className="group absolute"
              style={{
                left: `calc(50% + ${node.x}px)`,
                top: `calc(50% + ${node.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                onPointerDown={(e) => handlePointerDown(e, node)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditing({ id: node.id, label: node.label });
                }}
                className={cn(
                  "cursor-grab select-none whitespace-nowrap rounded-lg border px-3 py-1.5 text-[11px] transition-colors active:cursor-grabbing",
                  isRoot
                    ? "border-[#06B6D4] bg-[#06B6D4]/15 font-semibold text-[#67E8F9]"
                    : "border-border bg-surface text-text-primary hover:border-[#06B6D4]/60",
                )}
              >
                {isEditing ? (
                  <input
                    autoFocus
                    value={editing.label}
                    onChange={(e) =>
                      setEditing({ id: node.id, label: e.target.value })
                    }
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditing(null);
                    }}
                    className="w-24 bg-transparent text-[11px] text-white focus:outline-none"
                  />
                ) : (
                  node.label
                )}
              </div>
              {/* Add child */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addChild(node);
                }}
                aria-label="Add child node"
                className="absolute -right-2 -top-2 hidden h-4 w-4 items-center justify-center rounded-full bg-[#06B6D4] text-black transition-transform hover:scale-110 group-hover:flex"
              >
                <Plus size={10} />
              </button>
            </div>
          );
        })}

        {!root && (
          <div className="flex h-full items-center justify-center text-xs text-text-secondary">
            Empty mind map
          </div>
        )}
      </div>
    </BaseBlock>
  );
}

function BezierLink({ from, to }: { from: MindMapNode; to: MindMapNode }) {
  const midX = from.x + (to.x - from.x) / 2;
  return (
    <path
      d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
      stroke={CYAN}
      strokeOpacity={0.5}
      strokeWidth={1.5}
      fill="none"
    />
  );
}
