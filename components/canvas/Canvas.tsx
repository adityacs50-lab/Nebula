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
import { GenerateCodeBlock } from "./blocks/GenerateCodeBlock";
import { AIImageBlock } from "./blocks/AIImageBlock";
import { UserFlowBlock } from "./blocks/UserFlowBlock";
import { APIIntegrationBlock } from "./blocks/APIIntegrationBlock";
import { MindMapBlock } from "./blocks/MindMapBlock";
import { CanvasToolbar } from "./CanvasToolbar";
import { MiniMap } from "./MiniMap";
import { Cursors } from "@/components/multiplayer/Cursors";
import { useBlocks } from "@/hooks/useBlocks";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { useCanvasStore } from "@/store/canvasStore";
import {
  blockToNode,
  connectionToEdge,
  ADDABLE_BLOCK_TYPES,
  type BlockNode,
} from "@/lib/canvas/types";
import { BLOCK_COLORS, BLOCK_LABELS, type BlockType } from "@/types/blocks";

const nodeTypes: NodeTypes = {
  "ai-chat": AIChatBlock,
  "generate-code": GenerateCodeBlock,
  "ai-image": AIImageBlock,
  "user-flow": UserFlowBlock,
  "api-integration": APIIntegrationBlock,
  "mind-map": MindMapBlock,
};

/**
 * The infinite multiplayer canvas. Must be rendered inside both a
 * Liveblocks <RoomProvider> and a <ReactFlowProvider> (the workspace page
 * provides both so the sidebar/topbar can share the same contexts).
 */
export function Canvas() {
  const {
    blocks,
    connections,
    addBlock,
    updateBlockPosition,
    addConnection,
  } = useBlocks();
  const { moveCursor, setActiveBlock } = useMultiplayer();
  const { screenToFlowPosition } = useReactFlow();
  const activeTool = useCanvasStore((s) => s.activeTool);
  const selectedBlockId = useCanvasStore((s) => s.selectedBlockId);
  const setSelectedBlockId = useCanvasStore((s) => s.setSelectedBlockId);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const addMenu = useCanvasStore((s) => s.addMenu);
  const openAddMenu = useCanvasStore((s) => s.openAddMenu);
  const closeAddMenu = useCanvasStore((s) => s.closeAddMenu);

  const nodes: BlockNode[] = useMemo(() => {
    if (!blocks) return [];
    return blocks.map((block) => {
      const node = blockToNode(JSON.parse(JSON.stringify(block)));
      node.selected = block.id === selectedBlockId;
      return node;
    });
  }, [blocks, selectedBlockId]);

  const edges: Edge[] = useMemo(() => {
    if (!connections) return [];
    return connections.map((connection) =>
      connectionToEdge(JSON.parse(JSON.stringify(connection))),
    );
  }, [connections]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === "position" && change.position) {
          updateBlockPosition(change.id, change.position);
        } else if (change.type === "select") {
          if (change.selected) setSelectedBlockId(change.id);
          else if (selectedBlockId === change.id) setSelectedBlockId(null);
        }
      }
    },
    [updateBlockPosition, setSelectedBlockId, selectedBlockId],
  );

  const onConnect = useCallback(
    (connection: FlowConnection) => {
      if (connection.source && connection.target) {
        addConnection(connection.source, connection.target);
      }
    },
    [addConnection],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const flow = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      moveCursor(flow);
    },
    [screenToFlowPosition, moveCursor],
  );

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      setSelectedBlockId(null);
      setActiveBlock(null);
      if (addMenu.open) {
        closeAddMenu();
        return;
      }
      const bounds = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();
      openAddMenu({
        screen: {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        },
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
        onNodeDragStart={(_event, node) => setActiveBlock(node.id)}
        onNodeClick={(_event, node) => setSelectedBlockId(node.id)}
        // Smooth zoom on Ctrl+scroll, pan on scroll / Space+drag
        zoomOnScroll={false}
        panOnScroll
        zoomActivationKeyCode="Control"
        panActivationKeyCode="Space"
        panOnDrag={activeTool === "hand"}
        selectionOnDrag={activeTool === "select"}
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
          color="#2A2A2A"
        />
        <MiniMap />
      </ReactFlow>

      <Cursors />
      <CanvasToolbar />

      {/* Click-to-add block menu */}
      {addMenu.open && (
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-2"
          style={{ left: addMenu.screen.x, top: addMenu.screen.y }}
        >
          <div className="w-48 rounded-xl border border-border bg-surface p-1.5 shadow-card">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
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
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-text-primary transition-colors hover:bg-surface-hover"
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

      {/* Storage loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-background/90">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-text-secondary">
            Connecting to your team canvas...
          </p>
          <p className="max-w-xs text-center text-xs text-text-secondary/70">
            If this never resolves, check that your Liveblocks keys are set in
            .env.local (see README.md).
          </p>
        </div>
      )}
    </div>
  );
}
