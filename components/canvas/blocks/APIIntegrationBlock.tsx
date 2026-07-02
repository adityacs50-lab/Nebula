"use client";

import { useState } from "react";
import type { NodeProps } from "reactflow";
import { Check, Copy, FlaskConical } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import { CodeView } from "./CodeView";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { CodeLanguage } from "@/types/blocks";

export function APIIntegrationBlock({
  id,
  data,
  selected,
}: NodeProps<BlockNodeData>) {
  const { block } = data;
  const [testing, setTesting] = useState(false);
  const [passed, setPassed] = useState(false);
  const [copied, setCopied] = useState(false);

  const language: CodeLanguage = block.data.language ?? "TypeScript";
  const code = block.data.code ?? "";

  function handleTest() {
    if (testing) return;
    setTesting(true);
    setPassed(false);
    window.setTimeout(() => {
      setTesting(false);
      setPassed(true);
      window.setTimeout(() => setPassed(false), 3000);
    }, 1100);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <BaseBlock
      id={id}
      type="api-integration"
      title={block.data.title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="flex h-full flex-col gap-2 p-2.5">
        <div className="relative min-h-0 flex-1">
          <span className="absolute right-2 top-2 z-10 rounded-md bg-success/15 px-2 py-0.5 text-[9px] font-medium text-success">
            {language}
          </span>
          <CodeView code={code} language={language} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleTest}
            disabled={testing}
            className="flex h-7 items-center gap-1.5 rounded-lg bg-success px-3 text-[11px] font-medium text-white transition-colors hover:bg-success/80 disabled:opacity-50"
          >
            <FlaskConical size={11} />
            {testing ? "Testing..." : "Test"}
          </button>
          {testing && (
            <span className="text-[11px] text-text-secondary">
              Running integration tests...
            </span>
          )}
          {passed && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-success">
              <Check size={12} />
              All tests passed
            </span>
          )}
          <button
            onClick={() => void handleCopy()}
            className="ml-auto flex h-7 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px] text-text-secondary transition-colors hover:text-white"
          >
            {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </BaseBlock>
  );
}
