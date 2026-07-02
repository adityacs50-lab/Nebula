import type { XYPosition } from "./blocks";

export type CanvasTool =
  | "select"
  | "hand"
  | "shape"
  | "sticky"
  | "connect"
  | "pen"
  | "text";

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type AddMenuState = {
  open: boolean;
  /** Screen coordinates for positioning the popover */
  screen: XYPosition;
  /** Flow (canvas) coordinates where the new block should be placed */
  flow: XYPosition;
};

export type CursorPresence = {
  cursor: XYPosition | null;
  name: string;
  color: string;
  activeBlockId: string | null;
};

export const CURSOR_COLORS = [
  "#7C3AED",
  "#EC4899",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#06B6D4",
] as const;

export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}
