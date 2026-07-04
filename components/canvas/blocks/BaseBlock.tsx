"use client";

import { type ReactNode } from "react";
import { Handle, NodeResizer, Position } from "reactflow";
import {
  MessageSquare,
  Code2,
  Search,
  CheckSquare,
  Send,
  FileText,
  Minus,
  Maximize2,
  X,
  Pencil,
} from "lucide-react";
import { BLOCK_COLORS, type BlockType } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { cn } from "@/lib/utils";

const BLOCK_ICONS: Record<BlockType, ReactNode> = {
  "ai-chat": <MessageSquare size={13} />,
  code: <Code2 size={13} />,
  research: <Search size={13} />,
  task: <CheckSquare size={13} />,
  outreach: <Send size={13} />,
  notes: <FileText size={13} />,
};

export type BaseBlockProps = {
  id: string;
  type: BlockType;
  title: string;
  selected: boolean;
  minimized: boolean;
  children: ReactNode;
};

/**
 * Shared chrome for every canvas block. Linear-flavored: elevated
 * surface, 3px type-colored left border, no shadow at rest, subtle
 * accent glow only when selected. Read-only when viewing a teammate's
 * workspace — controls hide and edits are blocked upstream.
 */
export function BaseBlock({
  id,
  type,
  title,
  selected,
  minimized,
  children,
}: BaseBlockProps) {
  const color = BLOCK_COLORS[type];
  const { updateBlockData, updateBlockSize, deleteBlock, readOnly } =
    useBlocks();
  const { editorOfBlock, setActiveBlock } = useMultiplayer();
  const editor = editorOfBlock(id);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg border bg-surface transition-[border-color,box-shadow] duration-100",
        selected
          ? "border-primary shadow-[0_0_0_1px_rgb(var(--accent)),0_0_12px_rgba(124,58,237,0.15)]"
          : "border-border hover:border-border-strong",
      )}
      style={{ borderLeft: `3px solid ${color}` }}
      onPointerDownCapture={() => !readOnly && setActiveBlock(id)}
    >
      <NodeResizer
        isVisible={selected && !minimized && !readOnly}
        minWidth={280}
        minHeight={180}
        onResizeEnd={(_event, params) =>
          updateBlockSize(id, params.width, params.height)
        }
      />

      <Handle type="target" position={Position.Left} className="!-left-1.5" id="in" />
      <Handle type="source" position={Position.Right} className="!-right-1.5" id="out" />

      {/* Header / drag handle */}
      <div className="nebula-drag-handle flex shrink-0 cursor-grab items-center gap-2 border-b border-border px-3 py-2 active:cursor-grabbing">
        <span style={{ color }}>{BLOCK_ICONS[type]}</span>
        <span className="truncate text-[13px] font-medium text-text-primary">
          {title}
        </span>
        {type === "ai-chat" && (
          <span className="rounded border border-border px-1 py-px text-[9px] uppercase tracking-[0.06em] text-text-secondary">
            Gemini
          </span>
        )}
        {editor && (
          <span
            className="ml-1 flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium text-white"
            style={{ backgroundColor: editor.color }}
          >
            <Pencil size={8} />
            {editor.name}
          </span>
        )}
        {!readOnly && (
          <div className="ml-auto flex items-center gap-0.5">
            <HeaderButton
              label="Minimize"
              onClick={() => updateBlockData(id, { minimized: !minimized })}
            >
              <Minus size={11} />
            </HeaderButton>
            <HeaderButton
              label="Maximize"
              onClick={() => {
                updateBlockData(id, { minimized: false });
                updateBlockSize(id, 640, 520);
              }}
            >
              <Maximize2 size={10} />
            </HeaderButton>
            <HeaderButton label="Close" danger onClick={() => deleteBlock(id)}>
              <X size={11} />
            </HeaderButton>
          </div>
        )}
      </div>

      {/* Body */}
      {!minimized && (
        <div className={cn("min-h-0 flex-1", readOnly && "pointer-events-none opacity-90")}>
          {children}
        </div>
      )}
    </div>
  );
}

function HeaderButton({
  children,
  label,
  onClick,
  danger,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "rounded p-1 text-text-secondary transition-colors duration-100",
        danger
          ? "hover:bg-error/15 hover:text-error"
          : "hover:bg-surface-hover hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}
