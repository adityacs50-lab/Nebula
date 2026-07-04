"use client";

import { useCallback, useMemo, type PointerEvent } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  useReactFlow,
  type Connection as FlowConnection,
  type Edge,
  type NodeChange,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus } from "lucide-react";
import { AIChatBlock } from "./blocks/AIChatBlock";
import { CodeBlock } from "./blocks/CodeBlock";
import { ResearchBlock } from "./blocks/ResearchBlock";
import { TaskBlock } from "./blocks/TaskBlock";
import { OutreachBlock } from "./blocks/OutreachBlock";
import { NotesBlock } from "./blocks/NotesBlock";
import { CanvasToolbar } from "./CanvasToolbar";
import { Cursors } from "@/components/multiplayer/Cursors";
import { useBlocks } from "@/hooks/useBlocks";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
  blockToNode,
  connectionToEdge,
  ADDABLE_BLOCK_TYPES,
  type BlockNode,
} from "@/lib/canvas/types";
import { BLOCK_COLORS, BLOCK_LABELS, type BlockType } from "@/types/blocks";

const nodeTypes: NodeTypes = {
  "ai-chat": AIChatBlock,
  code: CodeBlock,
  research: ResearchBlock,
  task: TaskBlock,
  outreach: OutreachBlock,
  notes: NotesBlock,
};

/**
 * The personal-workspace canvas. Shows only the active member's blocks;
 * locks all editing when you're visiting a teammate's workspace.
 */
export function Canvas() {
  const {
    blocks,
    visibleBlocks,
    connections,
    readOnly,
    addBlock,
    updateBlockPosition,
    addConnection,
  } = useBlocks();
  const { moveCursor, setActiveBlock } = useMultiplayer();
  const { screenToFlowPosition } = useReactFlow();
  const activeTool = useWorkspaceStore((s) => s.activeTool);
  const selectedBlockId = useWorkspaceStore((s) => s.selectedBlockId);
  const setSelectedBlockId = useWorkspaceStore((s) => s.setSelectedBlockId);
  const setZoom = useWorkspaceStore((s) => s.setZoom);
  const addMenu = useWorkspaceStore((s) => s.addMenu);
  const openAddMenu = useWorkspaceStore((s) => s.openAddMenu);
  const closeAddMenu = useWorkspaceStore((s) => s.closeAddMenu);

  const nodes: BlockNode[] = useMemo(() => {
    return visibleBlocks.map((block) => {
      const node = blockToNode(JSON.parse(JSON.stringify(block)));
      node.selected = block.id === selectedBlockId;
      if (readOnly) {
        node.draggable = false;
        node.connectable = false;
      }
      return node;
    });
  }, [visibleBlocks, selectedBlockId, readOnly]);

  const visibleIds = useMemo(
    () => new Set(visibleBlocks.map((b) => b.id)),
    [visibleBlocks],
  );

  const edges: Edge[] = useMemo(() => {
    if (!connections) return [];
    return connections
      .filter((c) => visibleIds.has(c.source) && visibleIds.has(c.target))
      .map((connection) =>
        connectionToEdge(JSON.parse(JSON.stringify(connection))),
      );
  }, [connections, visibleIds]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === "position" && change.position && !readOnly) {
          updateBlockPosition(change.id, change.position);
        } else if (change.type === "select") {
          if (change.selected) setSelectedBlockId(change.id);
          else if (selectedBlockId === change.id) setSelectedBlockId(null);
        }
      }
    },
    [updateBlockPosition, setSelectedBlockId, selectedBlockId, readOnly],
  );

  const onConnect = useCallback(
    (connection: FlowConnection) => {
      if (readOnly) return;
      if (connection.source && connection.target) {
        addConnection(connection.source, connection.target);
      }
    },
    [addConnection, readOnly],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const flow = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      moveCursor(flow);
    },
    [screenToFlowPosition, moveCursor],
  );

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      setSelectedBlockId(null);
      setActiveBlock(null);
      if (readOnly) return;
      if (addMenu.open) {
        closeAddMenu();
        return;
      }
      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
      openAddMenu({
        screen: { x: event.clientX - bounds.left, y: event.clientY - bounds.top },
        flow: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
      });
    },
    [
      addMenu.open,
      openAddMenu,
      closeAddMenu,
      setSelectedBlockId,
      setActiveBlock,
      screenToFlowPosition,
      readOnly,
    ],
  );

  const loading = blocks === null;

  return (
    <div
      className="relative h-full w-full"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => moveCursor(null)}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onMove={(_event, viewport) => setZoom(viewport.zoom)}
        onNodeDragStart={(_event, node) => !readOnly && setActiveBlock(node.id)}
        onNodeClick={(_event, node) => setSelectedBlockId(node.id)}
        zoomOnScroll={false}
        panOnScroll
        zoomActivationKeyCode="Control"
        panActivationKeyCode="Space"
        panOnDrag={activeTool === "hand"}
        selectionOnDrag={activeTool === "select" && !readOnly}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        minZoom={0.2}
        maxZoom={2.5}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.2}
          className="!bg-background"
          color="rgb(var(--border-strong))"
        />
      </ReactFlow>

      <Cursors />
      {!readOnly && <CanvasToolbar />}

      {/* Click-to-add block menu */}
      {addMenu.open && !readOnly && (
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-2"
          style={{ left: addMenu.screen.x, top: addMenu.screen.y }}
        >
          <div className="w-44 rounded-lg border border-border bg-surface-hover p-1.5 shadow-card">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-text-secondary">
              <Plus size={11} />
              Add block
            </div>
            {ADDABLE_BLOCK_TYPES.map((type: BlockType) => (
              <button
                key={type}
                onClick={() => {
                  const id = addBlock(type, addMenu.flow);
                  closeAddMenu();
                  if (typeof id === "string") setSelectedBlockId(id);
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] text-text-primary transition-colors duration-100 hover:bg-surface"
              >
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: BLOCK_COLORS[type] }}
                />
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-background/90">
          <span className="h-6 w-6 animate-spin rounded-full border-[1.5px] border-border border-t-primary" />
          <p className="text-[13px] text-text-secondary">Connecting…</p>
        </div>
      )}
    </div>
  );
}
