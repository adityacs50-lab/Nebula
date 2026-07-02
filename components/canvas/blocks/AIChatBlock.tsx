"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type { NodeProps } from "reactflow";
import { Send, Sparkles } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { ChatMessage } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { useAI, type OutgoingChatMessage } from "@/hooks/useAI";
import { useSelf } from "@/lib/liveblocks/config";
import { formatTime, initials, cn } from "@/lib/utils";

/**
 * Full multiplayer chat with Claude. Every request carries the live
 * canvas context, and the streamed reply is written back into shared
 * state so the whole team sees the same conversation.
 */
export function AIChatBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const params = useParams<{ id: string }>();
  const workspaceId = params?.id ?? "demo";
  const { updateBlockData } = useBlocks();
  const { sendChat } = useAI(workspaceId);
  const self = useSelf();
  const myName = self?.info?.name ?? "You";

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = block.data.messages ?? [];

  // Scroll to bottom whenever a message lands or tokens stream in
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, streaming, thinking]);

  async function handleSend() {
    const content = input.trim();
    if (!content || thinking || streaming !== null) return;
    setError(null);
    setInput("");

    const userMessage: ChatMessage = {
      role: "user",
      content,
      timestamp: formatTime(),
      user: myName,
    };
    const nextMessages = [...messages, userMessage];
    updateBlockData(id, { messages: nextMessages });
    setThinking(true);

    const history: OutgoingChatMessage[] = nextMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      let started = false;
      const full = await sendChat(history, (partial) => {
        if (!started) {
          started = true;
          setThinking(false);
        }
        setStreaming(partial);
      });
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: full,
        timestamp: formatTime(),
      };
      updateBlockData(id, { messages: [...nextMessages, assistantMessage] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setThinking(false);
      setStreaming(null);
    }
  }

  return (
    <BaseBlock
      id={id}
      type="ai-chat"
      title={block.data.title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="flex h-full flex-col">
        <div
          ref={scrollRef}
          className="nowheel flex-1 space-y-3 overflow-y-auto px-3 py-3"
        >
          {messages.length === 0 && !thinking && streaming === null && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Sparkles size={18} className="text-primary" />
              <p className="text-xs text-text-secondary">
                Ask anything — Nebula AI can see the whole canvas.
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <MessageRow key={index} message={message} />
          ))}
          {thinking && (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Nebula AI is thinking...
            </div>
          )}
          {streaming !== null && (
            <MessageRow
              message={{
                role: "assistant",
                content: streaming,
                timestamp: formatTime(),
              }}
              streaming
            />
          )}
          {error && (
            <p className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
              {error}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 border-t border-border p-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Ask AI anything..."
            className="nodrag h-8 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:outline-none"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || thinking || streaming !== null}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </BaseBlock>
  );
}

function MessageRow({
  message,
  streaming,
}: {
  message: ChatMessage;
  streaming?: boolean;
}) {
  const isUser = message.role === "user";
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white",
          isUser ? "bg-secondary" : "bg-primary",
        )}
      >
        {isUser ? initials(message.user ?? "You") : <Sparkles size={11} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline gap-2">
          <span className="text-[11px] font-medium text-text-primary">
            {isUser ? (message.user ?? "You") : "Nebula AI"}
          </span>
          <span className="text-[9px] text-text-secondary">
            {message.timestamp}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-text-primary/90">
          {message.content}
          {streaming && (
            <span className="ml-0.5 inline-block h-3 w-1.5 animate-blink bg-primary align-middle" />
          )}
        </p>
      </div>
    </div>
  );
}
