"use client";

import { useState } from "react";
import type { NodeProps } from "reactflow";
import { Check, Copy, Download, Maximize2, Wand2 } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import { useBlocks } from "@/hooks/useBlocks";
import { cn } from "@/lib/utils";

const VARIATIONS = [
  "/assets/placeholder-1.svg",
  "/assets/placeholder-2.svg",
  "/assets/placeholder-3.svg",
  "/assets/placeholder-4.svg",
];

/**
 * Image generation block. Uses local placeholder art — real image
 * generation requires a separate image API, so we simulate the flow while
 * keeping prompt + selection in shared state.
 */
export function AIImageBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData } = useBlocks();
  const [prompt, setPrompt] = useState(block.data.prompt ?? "");
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasImage = typeof block.data.imageIndex === "number";
  const activeIndex = block.data.imageIndex ?? 0;
  const activeImage = VARIATIONS[activeIndex % VARIATIONS.length];

  function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    window.setTimeout(() => {
      updateBlockData(id, {
        prompt: prompt.trim(),
        imageIndex: Math.floor(Math.random() * VARIATIONS.length),
      });
      setGenerating(false);
    }, 1200);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `${window.location.origin}${activeImage}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <BaseBlock
      id={id}
      type="ai-image"
      title={block.data.title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="flex h-full flex-col gap-2 p-2.5">
        <div className="flex shrink-0 items-center gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
            placeholder="Describe an image..."
            className="nodrag h-8 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-secondary/60 focus:border-[#EC4899] focus:outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#EC4899] px-3 text-[11px] font-medium text-white transition-colors hover:bg-[#EC4899]/80 disabled:opacity-40"
          >
            <Wand2 size={11} />
            {generating ? "Dreaming..." : "Generate"}
          </button>
        </div>

        <div
          className={cn(
            "relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-background",
            expanded && "fixed inset-8 z-50",
          )}
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage}
              alt={block.data.prompt ?? "Generated image"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-secondary">
              {generating ? "Generating variations..." : "Your image will appear here"}
            </div>
          )}
          {hasImage && (
            <div className="absolute right-2 top-2 flex gap-1">
              <ImageAction label="Download">
                <a href={activeImage} download="nebula-image.svg">
                  <Download size={11} />
                </a>
              </ImageAction>
              <ImageAction
                label="Expand"
                onClick={() => setExpanded((v) => !v)}
              >
                <Maximize2 size={11} />
              </ImageAction>
              <ImageAction label="Copy link" onClick={() => void handleCopy()}>
                {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
              </ImageAction>
            </div>
          )}
        </div>

        {/* Thumbnail strip with variations */}
        {hasImage && (
          <div className="flex shrink-0 gap-1.5">
            {VARIATIONS.map((src, i) => (
              <button
                key={src}
                onClick={() => updateBlockData(id, { imageIndex: i })}
                className={cn(
                  "h-10 w-14 overflow-hidden rounded-md border transition-all",
                  i === activeIndex % VARIATIONS.length
                    ? "border-[#EC4899]"
                    : "border-border opacity-60 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Variation ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </BaseBlock>
  );
}

function ImageAction({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
    >
      {children}
    </button>
  );
}
