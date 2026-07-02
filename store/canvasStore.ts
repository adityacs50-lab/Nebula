import { create } from "zustand";
import type { AddMenuState, CanvasTool } from "@/types/canvas";

type CanvasStore = {
  activeTool: CanvasTool;
  selectedBlockId: string | null;
  zoom: number;
  addMenu: AddMenuState;
  workspaceName: string;
  setActiveTool: (tool: CanvasTool) => void;
  setSelectedBlockId: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  openAddMenu: (menu: Omit<AddMenuState, "open">) => void;
  closeAddMenu: () => void;
  setWorkspaceName: (name: string) => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  activeTool: "select",
  selectedBlockId: null,
  zoom: 1,
  addMenu: { open: false, screen: { x: 0, y: 0 }, flow: { x: 0, y: 0 } },
  workspaceName: "Project Nebula",
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setZoom: (zoom) => set({ zoom }),
  openAddMenu: (menu) => set({ addMenu: { ...menu, open: true } }),
  closeAddMenu: () =>
    set((state) => ({ addMenu: { ...state.addMenu, open: false } })),
  setWorkspaceName: (name) => set({ workspaceName: name }),
}));
