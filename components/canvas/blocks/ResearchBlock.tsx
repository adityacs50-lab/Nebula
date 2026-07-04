"use client";

import { useState } from "react";
import type { NodeProps } from "reactflow";
import { Link2, Loader2, Sparkles } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { ResearchTag } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { useAI } from "@/hooks/useAI";
import { cn } from "@/lib/utils";

const TAGS: ResearchTag[] = ["competitor", "market", "technical", "customer"];

export function ResearchBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData, postFeedItem } = useBlocks();
  const { assist } = useAI();

  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = block.data.title ?? "";
  const url = block.data.url ?? "";
  const summary = block.data.summary ?? "";
  const notes = block.data.notes ?? "";
  const tags = block.data.tags ?? [];

  async function handleSummarize() {
    if (!url.trim() || summarizing) return;
    setError(null);
    setSummarizing(true);
    try {
      const text = await assist("summarize", {
        url: url.trim(),
        topic: title || url.trim(),
      });
      if (!text) {
        setError("AI isn't configured — add GEMINI_API_KEY to summarize links.");
        return;
      }
      updateBlockData(id, { summary: text });
      postFeedItem({
        type: "research",
        title: `Research: ${title || url.trim().slice(0, 60)}`,
        summary: text.replace(/\s+/g, " ").slice(0, 140),
        blockId: id,
      });
    } finally {
      setSummarizing(false);
    }
  }

  function toggleTag(tag: ResearchTag) {
    updateBlockData(id, {
      tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    });
  }

  return (
    <BaseBlock
      id={id}
      type="research"
      title={title || "Research"}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="nowheel flex h-full flex-col gap-2 overflow-y-auto p-2.5">
        <input
          value={title}
          onChange={(e) => updateBlockData(id, { title: e.target.value })}
          placeholder="What are you researching?"
          className="nodrag h-8 shrink-0 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 flex-1 items-center gap-2 rounded-md border border-border bg-background px-2.5">
            <Link2 size={12} className="shrink-0 text-text-muted" />
            <input
              value={url}
              onChange={(e) => updateBlockData(id, { url: e.target.value })}
              placeholder="Paste any link..."
              className="nodrag h-full w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <button
            onClick={() => void handleSummarize()}
            disabled={!url.trim() || summarizing}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-white transition-opacity duration-100 hover:opacity-90 disabled:opacity-40"
          >
            {summarizing ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Sparkles size={11} />
            )}
            Summarize
          </button>
        </div>

        {error && <p className="shrink-0 text-[11px] text-error">{error}</p>}

        {summary && (
          <div className="shrink-0 rounded-md border border-border bg-background px-3 py-2.5 text-xs leading-relaxed text-text-primary/90">
            {summary}
          </div>
        )}

        <textarea
          value={notes}
          onChange={(e) => updateBlockData(id, { notes: e.target.value })}
          placeholder="Your notes..."
          className="nodrag min-h-[64px] flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-xs leading-relaxed text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        />

        <div className="flex shrink-0 flex-wrap gap-1.5">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded px-2 py-1 text-[11px] transition-colors duration-100",
                tags.includes(tag)
                  ? "bg-primary/15 text-primary"
                  : "border border-border text-text-secondary hover:text-text-primary",
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </BaseBlock>
  );
}
