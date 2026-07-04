"use client";

import { useState } from "react";
import type { NodeProps } from "reactflow";
import { Check, Copy, Play, Wand2 } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import { CodeView } from "./CodeView";
import { Dropdown } from "@/components/ui/Dropdown";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { CodeLanguage } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { useAI } from "@/hooks/useAI";

const LANGUAGES: Array<{ value: CodeLanguage; label: string }> = [
  { value: "Python", label: "Python" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "Rust", label: "Rust" },
  { value: "Go", label: "Go" },
];

export function CodeBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData, postFeedItem } = useBlocks();
  const { generateCode } = useAI();

  const [prompt, setPrompt] = useState(block.data.prompt ?? "");
  const [generating, setGenerating] = useState(false);
  const [running, setRunning] = useState(false);
  const [ranOk, setRanOk] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const language: CodeLanguage = block.data.language ?? "TypeScript";
  const code = block.data.code ?? "";

  async function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setError(null);
    setGenerating(true);
    try {
      const generated = await generateCode(prompt.trim(), language);
      updateBlockData(id, { code: generated, prompt: prompt.trim() });
      postFeedItem({
        type: "code",
        title: `Generated ${language} code`,
        summary: `${prompt.trim().slice(0, 120)} — ${generated.split("\n").length} lines, copy-ready.`,
        blockId: id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  function handleRun() {
    if (!code || running) return;
    setRunning(true);
    setRanOk(false);
    window.setTimeout(() => {
      setRunning(false);
      setRanOk(true);
      window.setTimeout(() => setRanOk(false), 2500);
    }, 900);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <BaseBlock
      id={id}
      type="code"
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
            placeholder="Describe the code you need..."
            className="nodrag h-8 flex-1 rounded-md border border-border bg-background px-3 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <Dropdown
            size="sm"
            className="nodrag w-28 shrink-0"
            options={LANGUAGES}
            value={language}
            onChange={(value) => updateBlockData(id, { language: value })}
          />
        </div>

        <div className="relative min-h-0 flex-1">
          {code ? (
            <CodeView code={code} language={language} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border text-[13px] text-text-secondary">
              {generating ? "Generating..." : "Generated code will appear here"}
            </div>
          )}
        </div>

        {error && <p className="shrink-0 text-[11px] text-error">{error}</p>}

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => void handleGenerate()}
            disabled={!prompt.trim() || generating}
            className="flex h-7 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-white transition-opacity duration-100 hover:opacity-90 disabled:opacity-40"
          >
            <Wand2 size={11} />
            {generating ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={handleRun}
            disabled={!code || running}
            className="flex h-7 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-text-primary transition-colors duration-100 hover:bg-surface-hover disabled:opacity-40"
          >
            <Play size={11} />
            {running ? "Running..." : "Run"}
          </button>
          {ranOk && (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <Check size={12} />
              Success
            </span>
          )}
          <button
            onClick={() => void handleCopy()}
            disabled={!code}
            className="ml-auto flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-text-secondary transition-colors duration-100 hover:text-text-primary disabled:opacity-40"
          >
            {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </BaseBlock>
  );
}
