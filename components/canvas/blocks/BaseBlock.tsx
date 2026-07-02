"use client";

import { type ReactNode } from "react";
import { Handle, NodeResizer, Position } from "reactflow";
import {
  MessageSquare,
  Code2,
  Image as ImageIcon,
  GitBranch,
  Plug,
  Network,
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
  "generate-code": <Code2 size={13} />,
  "ai-image": <ImageIcon size={13} />,
  "user-flow": <GitBranch size={13} />,
  "api-integration": <Plug size={13} />,
  "mind-map": <Network size={13} />,
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
 * Shared chrome for every canvas block: drag handle header, colored left
 * border, resize handles, min/max/close controls, selection glow, and the
 * "Being edited by X" multiplayer indicator.
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
  const { updateBlockData, updateBlockSize, deleteBlock } = useBlocks();
  const { editorOfBlock, setActiveBlock } = useMultiplayer();
  const editor = editorOfBlock(id);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl border bg-surface transition-shadow duration-150",
        selected ? "border-primary shadow-glow" : "border-border shadow-card",
      )}
      style={{ borderLeft: `4px solid ${color}` }}
      onPointerDownCapture={() => setActiveBlock(id)}
    >
      <NodeResizer
        isVisible={selected && !minimized}
        minWidth={280}
        minHeight={180}
        onResizeEnd={(_event, params) =>
          updateBlockSize(id, params.width, params.height)
        }
      />

      <Handle
        type="target"
        position={Position.Left}
        className="!-left-1.5"
        id="in"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!-right-1.5"
        id="out"
      />

      {/* Header / drag handle */}
      <div className="nebula-drag-handle flex shrink-0 cursor-grab items-center gap-2 border-b border-border px-3 py-2 active:cursor-grabbing">
        <span style={{ color }}>{BLOCK_ICONS[type]}</span>
        <span className="truncate text-xs font-medium text-text-primary">
          {title}
        </span>
        {editor && (
          <span
            className="ml-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-medium text-white"
            style={{ backgroundColor: editor.color }}
          >
            <Pencil size={8} />
            {editor.name} is editing
          </span>
        )}
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
      </div>

      {/* Body */}
      {!minimized && <div className="min-h-0 flex-1">{children}</div>}
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
        "rounded p-1 text-text-secondary transition-colors",
        danger ? "hover:bg-error/15 hover:text-error" : "hover:bg-surface-hover hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
