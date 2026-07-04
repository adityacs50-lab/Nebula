export type BlockType =
  | "ai-chat"
  | "code"
  | "research"
  | "task"
  | "outreach"
  | "notes";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  timestamp: string;
  user?: string;
};

export type CodeLanguage =
  | "Python"
  | "TypeScript"
  | "JavaScript"
  | "Rust"
  | "Go";

export type TaskPriority = "high" | "medium" | "low";

export type TaskItem = {
  id: string;
  text: string;
  done: boolean;
  priority: TaskPriority;
};

export type OutreachChannel = "LinkedIn" | "Email" | "Twitter";
export type OutreachStatus =
  | "Sent"
  | "Opened"
  | "Replied"
  | "Call Booked"
  | "Closed";

export type OutreachContact = {
  id: string;
  name: string;
  company: string;
  channel: OutreachChannel;
  status: OutreachStatus;
  notes?: string;
};

export type ResearchTag = "competitor" | "market" | "technical" | "customer";

/**
 * One JSON-serializable payload shape for all block types so blocks can
 * live in Liveblocks Storage (Lson) and Supabase jsonb.
 */
export type BlockData = {
  title: string;
  // ai-chat
  messages?: ChatMessage[];
  // code
  language?: CodeLanguage;
  prompt?: string;
  code?: string;
  // research
  url?: string;
  summary?: string;
  notes?: string;
  tags?: ResearchTag[];
  // task
  tasks?: TaskItem[];
  // outreach
  contacts?: OutreachContact[];
  // notes
  body?: string;
  important?: boolean;
  // shared
  minimized?: boolean;
};

export type XYPosition = { x: number; y: number };
export type BlockSize = { width: number; height: number };

export type Block = {
  id: string;
  type: BlockType;
  /** Which team member's workspace this block belongs to. */
  ownerId: string;
  ownerName: string;
  ownerColor: string;
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
  code: "#3B82F6",
  research: "#06B6D4",
  task: "#10B981",
  outreach: "#F59E0B",
  notes: "#888888",
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  "ai-chat": "AI Chat",
  code: "Code",
  research: "Research",
  task: "Tasks",
  outreach: "Outreach",
  notes: "Notes",
};

export const DEFAULT_BLOCK_SIZES: Record<BlockType, BlockSize> = {
  "ai-chat": { width: 420, height: 340 },
  code: { width: 440, height: 360 },
  research: { width: 400, height: 340 },
  task: { width: 360, height: 320 },
  outreach: { width: 460, height: 340 },
  notes: { width: 380, height: 300 },
};
