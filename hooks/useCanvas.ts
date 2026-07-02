"use client";

import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import { useCanvasStore } from "@/store/canvasStore";
import { useBlocks } from "./useBlocks";
import type { BlockType } from "@/types/blocks";

/**
 * Canvas-level behaviors shared by the toolbar, add-menu, and canvas
 * surface. Must be used inside a <ReactFlowProvider>.
 */
export function useCanvas() {
  const { zoomIn, zoomOut, zoomTo, getZoom, screenToFlowPosition } =
    useReactFlow();
  const store = useCanvasStore();
  const { addBlock } = useBlocks();

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
    window.setTimeout(() => store.setZoom(getZoom()), 220);
  }, [zoomIn, getZoom, store]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
    window.setTimeout(() => store.setZoom(getZoom()), 220);
  }, [zoomOut, getZoom, store]);

  const resetZoom = useCallback(() => {
    zoomTo(1, { duration: 200 });
    store.setZoom(1);
  }, [zoomTo, store]);

  const addBlockAtScreen = useCallback(
    (type: BlockType, screen: { x: number; y: number }) => {
      const flow = screenToFlowPosition(screen);
      const id = addBlock(type, flow);
      store.closeAddMenu();
      if (typeof id === "string") store.setSelectedBlockId(id);
    },
    [screenToFlowPosition, addBlock, store],
  );

  const addBlockAtFlow = useCallback(
    (type: BlockType, flow: { x: number; y: number }) => {
      const id = addBlock(type, flow);
      store.closeAddMenu();
      if (typeof id === "string") store.setSelectedBlockId(id);
    },
    [addBlock, store],
  );

  return {
    ...store,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
    addBlockAtScreen,
    addBlockAtFlow,
  };
}
