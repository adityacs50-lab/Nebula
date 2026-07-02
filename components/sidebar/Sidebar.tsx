"use client";

import { useState } from "react";
import Link from "next/link";
import { useReactFlow } from "reactflow";
import {
  Sparkles,
  Search,
  Home,
  Clock,
  MessageSquare,
  Folder,
  Share2,
  ChevronDown,
} from "lucide-react";
import { TeamspaceList } from "./TeamspaceList";
import { ToolsList } from "./ToolsList";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useBlocks } from "@/hooks/useBlocks";
import { useCanvasStore } from "@/store/canvasStore";
import { BLOCK_COLORS, BLOCK_LABELS } from "@/types/blocks";
import { cn, initials } from "@/lib/utils";

/** Fixed 220px left sidebar for the workspace view. */
export function Sidebar() {
  const { user } = useAuth();
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    typeof meta.full_name === "string" ? meta.full_name : "Aditya Shinde";
  const email = user?.email ?? "shindeadityau@gmail.com";

  const { blocks, addBlock } = useBlocks();
  const setSelectedBlockId = useCanvasStore((s) => s.setSelectedBlockId);
  const { setCenter } = useReactFlow();
  const [filesOpen, setFilesOpen] = useState(false);

  function focusBlock(id: string, position: { x: number; y: number }) {
    setSelectedBlockId(id);
    setCenter(position.x + 200, position.y + 150, { zoom: 1, duration: 400 });
  }

  function jumpToAIChat() {
    const existing = (blocks ?? []).find((b) => b.type === "ai-chat");
    if (existing) {
      focusBlock(existing.id, existing.position);
      return;
    }
    const id = addBlock("ai-chat", { x: 240, y: 200 });
    if (typeof id === "string") focusBlock(id, { x: 240, y: 200 });
  }

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-4 pb-3 pt-4 font-semibold"
      >
        <Sparkles size={16} className="text-primary" />
        <span className="text-sm">Nebula</span>
      </Link>

      {/* Search */}
      <div className="px-3 pb-3">
        <button className="flex h-8 w-full items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-xs text-text-secondary transition-colors hover:border-primary/50">
          <Search size={12} />
          <span>Search...</span>
          <kbd className="ml-auto rounded border border-border bg-surface px-1 py-0.5 text-[9px]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {/* Navigation */}
        <nav>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/dashboard"
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
              >
                <Home size={13} />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard?view=recent"
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
              >
                <Clock size={13} />
                Recent
              </Link>
            </li>
            <li>
              <button
                onClick={jumpToAIChat}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
              >
                <MessageSquare size={13} />
                AI Chat
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilesOpen((v) => !v)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                  filesOpen
                    ? "bg-surface-hover text-white"
                    : "text-text-secondary hover:bg-surface-hover hover:text-white",
                )}
              >
                <Folder size={13} />
                My Files
                <ChevronDown
                  size={12}
                  className={cn(
                    "ml-auto transition-transform",
                    filesOpen && "rotate-180",
                  )}
                />
              </button>
              {filesOpen && (
                <ul className="mt-0.5 space-y-0.5 border-l border-border pl-3">
                  {(blocks ?? []).length === 0 ? (
                    <li className="px-2 py-1.5 text-[11px] text-text-secondary/70">
                      No blocks on this canvas yet.
                    </li>
                  ) : (
                    (blocks ?? []).map((block) => (
                      <li key={block.id}>
                        <button
                          onClick={() => focusBlock(block.id, block.position)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: BLOCK_COLORS[block.type] }}
                          />
                          <span className="truncate">
                            {block.data.title || BLOCK_LABELS[block.type]}
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/dashboard?view=shared"
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
              >
                <Share2 size={13} />
                Shared with me
              </Link>
            </li>
          </ul>
        </nav>

        <TeamspaceList />
        <ToolsList />
      </div>

      {/* User footer */}
      <div className="border-t border-border p-3">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            {initials(name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">{name}</p>
            <p className="truncate text-[10px] text-text-secondary">{email}</p>
          </div>
        </div>
        <Button size="sm" className="w-full">
          Upgrade to Pro
        </Button>
      </div>
    </aside>
  );
}
