"use client";

import { useCallback } from "react";
import { useTeamAI } from "./useTeamAI";
import { useTeam } from "./useTeam";
import type { ChatRole, CodeLanguage } from "@/types/blocks";

export type OutgoingChatMessage = {
  role: ChatRole;
  content: string;
};

/**
 * Personal-workspace AI calls. Every request carries the full team
 * context, so even a private AI chat knows what the rest of the team is
 * doing right now.
 */
export function useAI() {
  const { getTeamContext } = useTeamAI();
  const { me } = useTeam();

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
          memberName: me.name,
          teamContext: getTeamContext(),
        }),
      });
      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `AI request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        onToken(full);
      }
      return full;
    },
    [getTeamContext, me.name],
  );

  const generateCode = useCallback(
    async (prompt: string, language: CodeLanguage): Promise<string> => {
      const res = await fetch("/api/ai/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language,
          teamContext: getTeamContext(),
        }),
      });
      const payload = (await res.json()) as { code?: string; error?: string };
      if (!res.ok || payload.error) {
        throw new Error(payload.error ?? `AI request failed (${res.status})`);
      }
      return payload.code ?? "";
    },
    [getTeamContext],
  );

  /**
   * Small non-streaming helpers: summarize a URL/text, draft an outreach
   * message, produce a one-line feed summary. Returns null when the AI
   * isn't configured so callers can fall back to templates.
   */
  const assist = useCallback(
    async (
      mode: "summarize" | "draft_outreach" | "feed_summary",
      payload: Record<string, string>,
    ): Promise<string | null> => {
      try {
        const res = await fetch("/api/ai/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, ...payload }),
        });
        const data = (await res.json()) as { text?: string; error?: string };
        if (!res.ok || !data.text) return null;
        return data.text;
      } catch {
        return null;
      }
    },
    [],
  );

  return { sendChat, generateCode, assist };
}
