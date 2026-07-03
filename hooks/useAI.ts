"use client";

import { useCallback } from "react";
import { useOthers, useSelf, useStorage } from "@/lib/liveblocks/config";
import { buildCanvasContext, type CanvasContext } from "@/lib/canvas/context";
import { useCanvasStore } from "@/store/canvasStore";
import type { Block, ChatRole, CodeLanguage } from "@/types/blocks";
import type { Workspace } from "@/types/workspace";

export type OutgoingChatMessage = {
  role: ChatRole;
  content: string;
};

/**
 * Client-side AI gateway. Builds the live canvas context from Liveblocks
 * storage + presence and injects it into every request, so Gemini always
 * has the full picture of what the whole team is doing.
 */
export function useAI(workspaceId: string) {
  const blocks = useStorage((root) => root.blocks);
  const others = useOthers();
  const self = useSelf();
  const workspaceName = useCanvasStore((s) => s.workspaceName);

  const getCanvasContext = useCallback((): CanvasContext => {
    const plainBlocks: Block[] = blocks
      ? (JSON.parse(JSON.stringify(blocks)) as Block[])
      : [];
    const memberNames = [
      self?.info?.name ?? "You",
      ...others.map((o) => o.info?.name ?? "Teammate"),
    ];
    const workspace: Workspace = {
      id: workspaceId,
      name: workspaceName,
      createdBy: self?.id ?? "unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: memberNames.map((name, i) => ({
        id: `member-${i}`,
        name,
        role: i === 0 ? "owner" : "member",
      })),
      recentActivity: plainBlocks.slice(-10).map((b, i) => ({
        id: `activity-${i}`,
        user: b.lastEditedBy,
        action: "edited",
        target: b.data.title,
        at: b.lastEditedAt,
      })),
    };
    return buildCanvasContext(plainBlocks, workspace);
  }, [blocks, others, self, workspaceId, workspaceName]);

  const sendChat = useCallback(
    async (
      messages: OutgoingChatMessage[],
      onToken: (partial: string) => void,
    ): Promise<string> => {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          canvasContext: getCanvasContext(),
        }),
      });
      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `AI request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      // Stream tokens as they arrive and surface each partial to the UI
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        onToken(full);
      }
      return full;
    },
    [getCanvasContext],
  );

  const generateCode = useCallback(
    async (prompt: string, language: CodeLanguage): Promise<string> => {
      const res = await fetch("/api/ai/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language,
          canvasContext: getCanvasContext(),
        }),
      });
      const payload = (await res.json()) as { code?: string; error?: string };
      if (!res.ok || payload.error) {
        throw new Error(payload.error ?? `AI request failed (${res.status})`);
      }
      return payload.code ?? "";
    },
    [getCanvasContext],
  );

  const generateImage = useCallback(async (prompt: string): Promise<string> => {
    const res = await fetch("/api/ai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const payload = (await res.json()) as { imageUrl?: string; error?: string };
    if (!res.ok || payload.error) {
      throw new Error(payload.error ?? `AI request failed (${res.status})`);
    }
    return payload.imageUrl ?? "";
  }, []);

  return { sendChat, generateCode, generateImage, getCanvasContext };
}
