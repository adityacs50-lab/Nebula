export type BlockType =
  | "ai-chat"
  | "generate-code"
  | "ai-image"
  | "user-flow"
  | "api-integration"
  | "mind-map";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  timestamp: string;
  user?: string;
};

export type CodeLanguage =
  | "Python"
  | "JavaScript"
  | "TypeScript"
  | "Rust"
  | "Go";

export type FlowNodeKind = "start" | "action" | "end";

export type FlowNode = {
  id: string;
  label: string;
  type: FlowNodeKind;
};

export type MindMapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId: string | null;
};

/**
 * All block payloads live in a single JSON-serializable shape so blocks can
 * be stored directly inside Liveblocks Storage (Lson) and Supabase jsonb.
 * Declared as type aliases (not interfaces) so they satisfy Liveblocks' Json
 * structural constraints.
 */
export type BlockData = {
  title: string;
  messages?: ChatMessage[];
  language?: CodeLanguage;
  prompt?: string;
  code?: string;
  imageIndex?: number;
  nodes?: FlowNode[];
  mindNodes?: MindMapNode[];
  minimized?: boolean;
};

export type XYPosition = {
  x: number;
  y: number;
};

export type BlockSize = {
  width: number;
  height: number;
};

export type Block = {
  id: string;
  type: BlockType;
  position: XYPosition;
  size: BlockSize;
  data: BlockData;
  lastEditedBy: string;
  lastEditedAt: string;
};

export type Connection = {
  id: string;
  source: string;
  target: string;
};

export const BLOCK_COLORS: Record<BlockType, string> = {
  "ai-chat": "#7C3AED",
  "generate-code": "#3B82F6",
  "ai-image": "#EC4899",
  "user-flow": "#F59E0B",
  "api-integration": "#10B981",
  "mind-map": "#06B6D4",
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  "ai-chat": "AI Chat",
  "generate-code": "Generate Code",
  "ai-image": "AI Image",
  "user-flow": "User Flow",
  "api-integration": "API Integration",
  "mind-map": "Mind Map",
};

export const DEFAULT_BLOCK_SIZES: Record<BlockType, BlockSize> = {
  "ai-chat": { width: 420, height: 320 },
  "generate-code": { width: 420, height: 340 },
  "ai-image": { width: 380, height: 360 },
  "user-flow": { width: 440, height: 300 },
  "api-integration": { width: 420, height: 340 },
  "mind-map": { width: 440, height: 340 },
};
