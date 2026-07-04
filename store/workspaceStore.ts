import { create } from "zustand";
import type { CanvasTool, AddMenuState } from "@/types/canvas";
import type { FeedType } from "@/types/feed";

type WorkspaceStore = {
  activeTool: CanvasTool;
  selectedBlockId: string | null;
  zoom: number;
  addMenu: AddMenuState;
  workspaceName: string;
  /** Team member whose canvas is currently displayed. */
  activeMemberId: string;
  /** The signed-in member (demo identity until Supabase auth fills it). */
  meId: string;
  feedFilter: FeedType | "all";
  feedMemberFilter: string | "all";
  /** Feed items that arrived while the user was looking elsewhere. */
  feedUnread: number;
  commandPaletteOpen: boolean;
  teamAIFocusToken: number;
  setActiveTool: (tool: CanvasTool) => void;
  setSelectedBlockId: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  openAddMenu: (menu: Omit<AddMenuState, "open">) => void;
  closeAddMenu: () => void;
  setWorkspaceName: (name: string) => void;
  setActiveMemberId: (id: string) => void;
  setMeId: (id: string) => void;
  setFeedFilter: (filter: FeedType | "all") => void;
  setFeedMemberFilter: (member: string | "all") => void;
  bumpFeedUnread: () => void;
  clearFeedUnread: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  focusTeamAI: () => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  activeTool: "select",
  selectedBlockId: null,
  zoom: 1,
  addMenu: { open: false, screen: { x: 0, y: 0 }, flow: { x: 0, y: 0 } },
  workspaceName: "Project Nebula",
  activeMemberId: "me",
  meId: "me",
  feedFilter: "all",
  feedMemberFilter: "all",
  feedUnread: 0,
  commandPaletteOpen: false,
  teamAIFocusToken: 0,
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setZoom: (zoom) => set({ zoom }),
  openAddMenu: (menu) => set({ addMenu: { ...menu, open: true } }),
  closeAddMenu: () =>
    set((state) => ({ addMenu: { ...state.addMenu, open: false } })),
  setWorkspaceName: (name) => set({ workspaceName: name }),
  setActiveMemberId: (id) => set({ activeMemberId: id, selectedBlockId: null }),
  setMeId: (id) =>
    set((state) => ({
      meId: id,
      activeMemberId:
        state.activeMemberId === state.meId ? id : state.activeMemberId,
    })),
  setFeedFilter: (filter) => set({ feedFilter: filter }),
  setFeedMemberFilter: (member) => set({ feedMemberFilter: member }),
  bumpFeedUnread: () =>
    set((state) => ({ feedUnread: Math.min(state.feedUnread + 1, 99) })),
  clearFeedUnread: () => set({ feedUnread: 0 }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  focusTeamAI: () =>
    set((state) => ({ teamAIFocusToken: state.teamAIFocusToken + 1 })),
}));
