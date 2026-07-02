"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Rust", label: "Rust" },
  { value: "Go", label: "Go" },
];

export function GenerateCodeBlock({
  id,
  data,
  selected,
}: NodeProps<BlockNodeData>) {
  const { block } = data;
  const params = useParams<{ id: string }>();
  const workspaceId = params?.id ?? "demo";
  const { updateBlockData } = useBlocks();
  const { generateCode } = useAI(workspaceId);

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
      type="generate-code"
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
            className="nodrag h-8 flex-1 rounded-lg border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-secondary/60 focus:border-secondary focus:outline-none"
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
          {/* Language badge */}
          <span className="absolute right-2 top-2 z-10 rounded-md bg-secondary/15 px-2 py-0.5 text-[9px] font-medium text-secondary">
            {language}
          </span>
          {code ? (
            <CodeView code={code} language={language} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-text-secondary">
              {generating
                ? "Gemini is writing code..."
                : "Generated code will appear here"}
            </div>
          )}
        </div>

        {error && <p className="shrink-0 text-[10px] text-error">{error}</p>}

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => void handleGenerate()}
            disabled={!prompt.trim() || generating}
            className="flex h-7 items-center gap-1.5 rounded-lg bg-secondary px-3 text-[11px] font-medium text-white transition-colors hover:bg-secondary/80 disabled:opacity-40"
          >
            <Wand2 size={11} />
            {generating ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={handleRun}
            disabled={!code || running}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-border px-3 text-[11px] text-text-primary transition-colors hover:border-success hover:text-success disabled:opacity-40"
          >
            <Play size={11} />
            {running ? "Running..." : "Run Code"}
          </button>
          {ranOk && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-success">
              <Check size={12} />
              Success
            </span>
          )}
          <button
            onClick={() => void handleCopy()}
            disabled={!code}
            className="ml-auto flex h-7 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px] text-text-secondary transition-colors hover:text-white disabled:opacity-40"
          >
            {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </BaseBlock>
  );
}
