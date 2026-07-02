"use client";

import {
  MousePointer2,
  Hand,
  Hexagon,
  StickyNote,
  ArrowUpRight,
  Pencil,
  Type,
  MoreHorizontal,
  Minus,
  Plus,
} from "lucide-react";
import { useCanvas } from "@/hooks/useCanvas";
import type { CanvasTool } from "@/types/canvas";
import { cn } from "@/lib/utils";

const TOOLS: Array<{ tool: CanvasTool; label: string; icon: React.ReactNode }> =
  [
    { tool: "select", label: "Select", icon: <MousePointer2 size={15} /> },
    { tool: "hand", label: "Hand", icon: <Hand size={15} /> },
    { tool: "shape", label: "Shape", icon: <Hexagon size={15} /> },
    { tool: "sticky", label: "Sticky", icon: <StickyNote size={15} /> },
    { tool: "connect", label: "Connect", icon: <ArrowUpRight size={15} /> },
    { tool: "pen", label: "Pen", icon: <Pencil size={15} /> },
    { tool: "text", label: "Text", icon: <Type size={15} /> },
  ];

/** Floating, centered bottom toolbar. */
export function CanvasToolbar() {
  const { activeTool, setActiveTool, zoom, handleZoomIn, handleZoomOut, resetZoom } =
    useCanvas();

  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 py-1.5 shadow-card">
      {TOOLS.map(({ tool, label, icon }) => (
        <button
          key={tool}
          title={label}
          aria-label={label}
          onClick={() => setActiveTool(tool)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            activeTool === tool
              ? "bg-primary/20 text-primary"
              : "text-text-secondary hover:bg-surface-hover hover:text-white",
          )}
        >
          {icon}
        </button>
      ))}
      <button
        title="More"
        aria-label="More tools"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
      >
        <MoreHorizontal size={15} />
      </button>

      <div className="mx-1 h-5 w-px bg-border" />

      <button
        title="Zoom out"
        aria-label="Zoom out"
        onClick={handleZoomOut}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
      >
        <Minus size={14} />
      </button>
      <button
        onClick={resetZoom}
        title="Reset zoom"
        className="w-12 text-center text-xs tabular-nums text-text-secondary transition-colors hover:text-white"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        title="Zoom in"
        aria-label="Zoom in"
        onClick={handleZoomIn}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
