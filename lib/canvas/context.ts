import type { Block, BlockType } from "@/types/blocks";
import type { Activity, Workspace } from "@/types/workspace";

export interface CanvasContext {
  projectName: string;
  workspaceId: string;
  teamMembers: string[];
  blocks: BlockContext[];
  recentActivity: Activity[];
  timestamp: string;
}

export interface BlockContext {
  id: string;
  type: BlockType;
  title: string;
  content: string; // text summary of block content
  lastEditedBy: string;
  lastEditedAt: string;
  position: { x: number; y: number };
}

/**
 * Produces a plain-text summary of a block's contents so the AI can
 * "read" the whole canvas regardless of block type.
 */
export function extractBlockContent(block: Block): string {
  const { data } = block;
  switch (block.type) {
    case "ai-chat": {
      const messages = data.messages ?? [];
      return messages
        .map((m) => `${m.role === "user" ? (m.user ?? "User") : "AI"}: ${m.content}`)
        .join("\n");
    }
    case "generate-code":
    case "api-integration": {
      const parts: string[] = [];
      if (data.prompt) parts.push(`Prompt: ${data.prompt}`);
      if (data.language) parts.push(`Language: ${data.language}`);
      if (data.code) parts.push(`Code:\n${data.code}`);
      return parts.join("\n");
    }
    case "ai-image":
      return data.prompt
        ? `Image prompt: ${data.prompt}`
        : "Empty image block";
    case "user-flow": {
      const nodes = data.nodes ?? [];
      return `User flow: ${nodes.map((n) => n.label).join(" -> ")}`;
    }
    case "mind-map": {
      const nodes = data.mindNodes ?? [];
      const root = nodes.find((n) => n.parentId === null);
      const children = nodes.filter((n) => n.parentId !== null);
      return `Mind map "${root?.label ?? "Untitled"}" with branches: ${children
        .map((n) => n.label)
        .join(", ")}`;
    }
    default:
      return data.title;
  }
}

/**
 * The core differentiator: a live snapshot of everything the team is
 * working on. Rebuilt on every block change and injected into EVERY
 * Claude API call as system context.
 */
export function buildCanvasContext(
  blocks: Block[],
  workspace: Workspace,
): CanvasContext {
  return {
    projectName: workspace.name,
    workspaceId: workspace.id,
    teamMembers: workspace.members.map((m) => m.name),
    blocks: blocks.map((block) => ({
      id: block.id,
      type: block.type,
      title: block.data.title,
      content: extractBlockContent(block),
      lastEditedBy: block.lastEditedBy,
      lastEditedAt: block.lastEditedAt,
      position: block.position,
    })),
    recentActivity: workspace.recentActivity.slice(-10),
    timestamp: new Date().toISOString(),
  };
}
