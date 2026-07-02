"use client";

import { Image as ImageIcon, Code2, LayoutTemplate, Network } from "lucide-react";
import { useCanvas } from "@/hooks/useCanvas";
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

/** Quick tools — clicking one drops the matching block onto the canvas. */
export function ToolsList() {
  const { addBlockAtFlow } = useCanvas();

  return (
    <div>
      <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Tools
      </h3>
      <ul className="space-y-0.5">
        {TOOLS.map((tool) => (
          <li key={tool.label}>
            <button
              onClick={() => {
                if (tool.blockType) {
                  addBlockAtFlow(tool.blockType, {
                    x: 200 + Math.random() * 200,
                    y: 200 + Math.random() * 200,
                  });
                }
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
            >
              {tool.icon}
              {tool.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
