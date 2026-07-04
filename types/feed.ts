export type FeedType =
  | "ai_chat"
  | "code"
  | "research"
  | "task_complete"
  | "outreach"
  | "note";

export type FeedReaction = "like" | "fire" | "comment";

export type FeedItem = {
  id: string;
  memberId: string;
  memberName: string;
  memberColor: string;
  type: FeedType;
  title: string;
  /** One-line summary of what happened. */
  summary: string;
  /** ISO timestamp. */
  createdAt: string;
  /** Block to focus when jumping to the member's canvas. */
  blockId?: string;
  reactions?: Partial<Record<FeedReaction, number>>;
};

export const FEED_TYPE_LABELS: Record<FeedType, string> = {
  ai_chat: "AI Chats",
  code: "Code",
  research: "Research",
  task_complete: "Tasks",
  outreach: "Outreach",
  note: "Notes",
};
