"use client";

import { useEffect, useRef, useState } from "react";
import type { NodeProps } from "reactflow";
import { Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { ChatMessage } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { useAI, type OutgoingChatMessage } from "@/hooks/useAI";
import { useTeam } from "@/hooks/useTeam";
import { formatTime, initials, cn } from "@/lib/utils";

/**
 * Personal AI chat. Every request carries the full team context; after
 * each answer a one-line summary is posted to the Team Feed so the rest
 * of the team knows what was explored.
 */
export function AIChatBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData, postFeedItem } = useBlocks();
  const { sendChat, assist } = useAI();
  const { me } = useTeam();

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = block.data.messages ?? [];

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
      user: me.name,
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

      // Post a one-line summary to the Team Feed (AI polish, template fallback)
      const aiSummary = await assist("feed_summary", {
        memberName: me.name,
        text: `Q: ${content}\nA: ${full.slice(0, 400)}`,
      });
      postFeedItem({
        type: "ai_chat",
        title: `Asked AI about ${content.slice(0, 60)}${content.length > 60 ? "…" : ""}`,
        summary: aiSummary ?? full.replace(/\s+/g, " ").slice(0, 140),
        blockId: id,
      });
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
              <Sparkles size={16} className="text-text-muted" />
              <p className="text-[13px] text-text-secondary">
                Ask anything — the AI sees your whole team&apos;s work
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <MessageRow key={index} message={message} />
          ))}
          {thinking && (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Thinking...
            </div>
          )}
          {streaming !== null && (
            <MessageRow
              message={{ role: "assistant", content: streaming, timestamp: formatTime() }}
              streaming
            />
          )}
          {error && (
            <p className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
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
            placeholder="Ask anything..."
            className="nodrag h-8 flex-1 rounded-md border border-border bg-background px-3 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || thinking || streaming !== null}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition-opacity duration-100 hover:opacity-90 disabled:opacity-40"
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
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white",
          isUser ? "bg-secondary" : "bg-primary",
        )}
      >
        {isUser ? initials(message.user ?? "You") : <Sparkles size={11} />}
      </span>
      <div className={cn("min-w-0 flex-1", isUser && "text-right")}>
        <div className={cn("mb-0.5 flex items-baseline gap-2", isUser && "flex-row-reverse")}>
          <span className="text-[11px] font-medium text-text-primary">
            {isUser ? (message.user ?? "You") : "AI"}
          </span>
          <span className="text-[10px] tabular-nums text-text-muted">
            {message.timestamp}
          </span>
        </div>
        {isUser ? (
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-text-primary/90">
            {message.content}
          </p>
        ) : (
          <div className="text-left text-[13px] leading-relaxed text-text-primary/90">
            <MarkdownContent content={message.content} />
            {streaming && (
              <span className="ml-0.5 inline-block h-3 w-1.5 animate-blink bg-primary align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold text-text-primary">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="mb-1.5 list-disc space-y-0.5 pl-4 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-1.5 list-decimal space-y-0.5 pl-4 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            {children}
          </a>
        ),
        code: ({ children, className }) => {
          const isBlock = Boolean(className);
          return isBlock ? (
            <code className="my-1.5 block overflow-x-auto rounded-md bg-background px-2.5 py-2 font-mono text-[12px]">
              {children}
            </code>
          ) : (
            <code className="rounded bg-background px-1 py-0.5 font-mono text-[12px]">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="whitespace-pre-wrap">{children}</pre>,
        h1: ({ children }) => (
          <h1 className="mb-1.5 text-sm font-semibold text-text-primary">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-1.5 text-sm font-semibold text-text-primary">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-1 text-[13px] font-semibold text-text-primary">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-1.5 border-l-2 border-border pl-2.5 text-text-secondary">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
