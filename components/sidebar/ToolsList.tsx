"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Code2,
  LayoutTemplate,
  Network,
  ChevronDown,
} from "lucide-react";
import { useCanvas } from "@/hooks/useCanvas";
import { useBlocks } from "@/hooks/useBlocks";
import { cn } from "@/lib/utils";
import type { BlockType } from "@/types/blocks";

const TOOLS: Array<{
  label: string;
  icon: React.ReactNode;
  blockType: BlockType | null;
}> = [
  { label: "AI Image", icon: <ImageIcon size={13} />, blockType: "ai-image" },
  { label: "Code", icon: <Code2 size={13} />, blockType: "generate-code" },
  { label: "Templates", icon: <LayoutTemplate size={13} />, blockType: null },
  { label: "Mind Map", icon: <Network size={13} />, blockType: "mind-map" },
];

type Template = {
  label: string;
  description: string;
  blocks: Array<{ type: BlockType; offset: { x: number; y: number } }>;
};

const TEMPLATES: Template[] = [
  {
    label: "Product brainstorm",
    description: "AI Chat + Mind Map, connected",
    blocks: [
      { type: "ai-chat", offset: { x: 0, y: 0 } },
      { type: "mind-map", offset: { x: 460, y: 40 } },
    ],
  },
  {
    label: "Feature spec",
    description: "AI Chat + User Flow, connected",
    blocks: [
      { type: "ai-chat", offset: { x: 0, y: 0 } },
      { type: "user-flow", offset: { x: 460, y: 20 } },
    ],
  },
  {
    label: "API design",
    description: "API Integration + Generate Code, connected",
    blocks: [
      { type: "api-integration", offset: { x: 0, y: 0 } },
      { type: "generate-code", offset: { x: 460, y: 20 } },
    ],
  },
];

/** Quick tools — clicking one drops the matching block onto the canvas. */
export function ToolsList() {
  const { addBlockAtFlow } = useCanvas();
  const { addConnection } = useBlocks();
  const [templatesOpen, setTemplatesOpen] = useState(false);

  function applyTemplate(template: Template) {
    const base = { x: 200 + Math.random() * 120, y: 200 + Math.random() * 120 };
    const ids: string[] = [];
    for (const { type, offset } of template.blocks) {
      const id = addBlockAtFlow(type, {
        x: base.x + offset.x,
        y: base.y + offset.y,
      });
      if (typeof id === "string") ids.push(id);
    }
    for (let i = 0; i < ids.length - 1; i++) {
      addConnection(ids[i], ids[i + 1]);
    }
    setTemplatesOpen(false);
  }

  return (
    <div>
      <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Tools
      </h3>
      <ul className="space-y-0.5">
        {TOOLS.map((tool) => (
          <li key={tool.label}>
            {tool.blockType ? (
              <button
                onClick={() =>
                  addBlockAtFlow(tool.blockType as BlockType, {
                    x: 200 + Math.random() * 200,
                    y: 200 + Math.random() * 200,
                  })
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
              >
                {tool.icon}
                {tool.label}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setTemplatesOpen((v) => !v)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                    templatesOpen
                      ? "bg-surface-hover text-white"
                      : "text-text-secondary hover:bg-surface-hover hover:text-white",
                  )}
                >
                  {tool.icon}
                  {tool.label}
                  <ChevronDown
                    size={12}
                    className={cn(
                      "ml-auto transition-transform",
                      templatesOpen && "rotate-180",
                    )}
                  />
                </button>
                {templatesOpen && (
                  <ul className="mt-0.5 space-y-0.5 border-l border-border pl-3">
                    {TEMPLATES.map((template) => (
                      <li key={template.label}>
                        <button
                          onClick={() => applyTemplate(template)}
                          className="flex w-full flex-col items-start rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-hover"
                        >
                          <span className="text-[11px] text-white">
                            {template.label}
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            {template.description}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
