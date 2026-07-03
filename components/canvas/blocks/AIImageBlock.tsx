"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { NodeProps } from "reactflow";
import { Check, Copy, Download, Loader2, Maximize2, Wand2 } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import { useBlocks } from "@/hooks/useBlocks";
import { useAI } from "@/hooks/useAI";
import { cn } from "@/lib/utils";

const MAX_HISTORY = 4;

/** Image generation block, backed by Gemini's image-capable model. */
export function AIImageBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const params = useParams<{ id: string }>();
  const workspaceId = params?.id ?? "demo";
  const { updateBlockData } = useBlocks();
  const { generateImage } = useAI(workspaceId);

  const [prompt, setPrompt] = useState(block.data.prompt ?? "");
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = block.data.images ?? [];
  const hasImage = images.length > 0;
  const activeIndex = Math.min(block.data.imageIndex ?? 0, images.length - 1);
  const activeImage = hasImage ? images[activeIndex] : null;

  async function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setError(null);
    setGenerating(true);
    try {
      const imageUrl = await generateImage(prompt.trim());
      const nextImages = [imageUrl, ...images].slice(0, MAX_HISTORY);
      updateBlockData(id, {
        prompt: prompt.trim(),
        images: nextImages,
        imageIndex: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!activeImage) return;
    await navigator.clipboard.writeText(activeImage);
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
              if (e.key === "Enter") void handleGenerate();
            }}
            placeholder="Describe an image..."
            className="nodrag h-8 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-secondary/60 focus:border-[#EC4899] focus:outline-none"
          />
          <button
            onClick={() => void handleGenerate()}
            disabled={!prompt.trim() || generating}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#EC4899] px-3 text-[11px] font-medium text-white transition-colors hover:bg-[#EC4899]/80 disabled:opacity-40"
          >
            {generating ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Wand2 size={11} />
            )}
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>

        <div
          className={cn(
            "relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-background",
            expanded && "fixed inset-8 z-50",
          )}
        >
          {generating ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-text-secondary">
              <Loader2 size={20} className="animate-spin text-[#EC4899]" />
              Gemini is generating your image...
            </div>
          ) : activeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage}
              alt={block.data.prompt ?? "Generated image"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-secondary">
              Your image will appear here
            </div>
          )}
          {activeImage && !generating && (
            <div className="absolute right-2 top-2 flex gap-1">
              <ImageAction label="Download">
                <a href={activeImage} download="nebula-image.png">
                  <Download size={11} />
                </a>
              </ImageAction>
              <ImageAction
                label="Expand"
                onClick={() => setExpanded((v) => !v)}
              >
                <Maximize2 size={11} />
              </ImageAction>
              <ImageAction label="Copy image data" onClick={() => void handleCopy()}>
                {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
              </ImageAction>
            </div>
          )}
        </div>

        {error && <p className="shrink-0 text-[10px] text-error">{error}</p>}

        {/* Thumbnail strip with generation history */}
        {images.length > 1 && (
          <div className="flex shrink-0 gap-1.5">
            {images.map((src, i) => (
              <button
                key={src.slice(0, 32) + i}
                onClick={() => updateBlockData(id, { imageIndex: i })}
                className={cn(
                  "h-10 w-14 overflow-hidden rounded-md border transition-all",
                  i === activeIndex
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
