"use client";

import { useState } from "react";
import type { NodeProps } from "reactflow";
import { Eye, PenLine, Star } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import { useBlocks } from "@/hooks/useBlocks";
import { relativeTime, cn } from "@/lib/utils";

/**
 * Lightweight notes with markdown-lite rendering (bold, italic,
 * headings, bullets) — no editor library. Marking a note important
 * publishes it to the Team Feed.
 */
export function NotesBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData, postFeedItem } = useBlocks();
  const [preview, setPreview] = useState(false);

  const title = block.data.title ?? "Untitled note";
  const body = block.data.body ?? "";
  const important = Boolean(block.data.important);

  function toggleImportant() {
    const next = !important;
    updateBlockData(id, { important: next });
    if (next) {
      postFeedItem({
        type: "note",
        title: `Noted: ${title.slice(0, 70)}`,
        summary: body.replace(/[#*-]/g, "").replace(/\s+/g, " ").trim().slice(0, 140) || "Marked as important.",
        blockId: id,
      });
    }
  }

  return (
    <BaseBlock
      id={id}
      type="notes"
      title={title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="flex h-full flex-col p-2.5">
        <div className="mb-2 flex shrink-0 items-center gap-2">
          <input
            value={title}
            onChange={(e) => updateBlockData(id, { title: e.target.value })}
            className="nodrag h-8 flex-1 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-text-primary focus:border-primary focus:outline-none"
          />
          <button
            onClick={toggleImportant}
            title={important ? "Important" : "Mark important"}
            aria-label="Mark important"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border transition-colors duration-100",
              important
                ? "border-warning/40 bg-warning/10 text-warning"
                : "border-border text-text-secondary hover:text-text-primary",
            )}
          >
            <Star size={13} fill={important ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => setPreview((v) => !v)}
            title={preview ? "Edit" : "Preview"}
            aria-label={preview ? "Edit" : "Preview"}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition-colors duration-100 hover:text-text-primary"
          >
            {preview ? <PenLine size={13} /> : <Eye size={13} />}
          </button>
        </div>

        {preview ? (
          <div className="nowheel min-h-0 flex-1 space-y-1 overflow-y-auto rounded-md border border-border bg-background px-3 py-2.5">
            {renderMarkdownLite(body)}
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => updateBlockData(id, { body: e.target.value })}
            placeholder="Write anything. **bold**, *italic*, # heading, - bullets"
            className="nodrag min-h-0 flex-1 resize-none rounded-md border border-border bg-background px-3 py-2.5 text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        )}

        <p className="mt-1.5 shrink-0 text-right text-[10px] tabular-nums text-text-muted">
          edited {relativeTime(block.lastEditedAt)}
        </p>
      </div>
    </BaseBlock>
  );
}

function renderMarkdownLite(text: string) {
  if (!text.trim())
    return <p className="text-xs text-text-muted">Nothing here yet.</p>;
  return text.split("\n").map((line, i) => {
    if (line.startsWith("# "))
      return (
        <p key={i} className="text-sm font-semibold text-text-primary">
          {renderInline(line.slice(2))}
        </p>
      );
    if (line.startsWith("- "))
      return (
        <p key={i} className="flex gap-2 text-[13px] text-text-primary/90">
          <span className="text-text-muted">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </p>
      );
    if (!line.trim()) return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-[13px] leading-relaxed text-text-primary/90">
        {renderInline(line)}
      </p>
    );
  });
}

function renderInline(text: string) {
  const parts: Array<React.ReactNode> = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**"))
      parts.push(
        <strong key={key++} className="font-semibold text-text-primary">
          {token.slice(2, -2)}
        </strong>,
      );
    else
      parts.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
