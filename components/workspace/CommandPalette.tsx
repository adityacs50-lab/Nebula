"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useReactFlow } from "reactflow";
import { useTeam } from "@/hooks/useTeam";
import { useBlocks } from "@/hooks/useBlocks";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { BLOCK_LABELS, type BlockType } from "@/types/blocks";
import { cn } from "@/lib/utils";

type CommandItem = {
  label: string;
  hint?: string;
  run: () => void;
};

/** Linear-style Cmd+K palette: every action, fuzzy-searchable. */
export function CommandPalette({ workspaceId }: { workspaceId: string }) {
  const open = useWorkspaceStore((s) => s.commandPaletteOpen);
  const setOpen = useWorkspaceStore((s) => s.setCommandPaletteOpen);
  const setActiveMemberId = useWorkspaceStore((s) => s.setActiveMemberId);
  const setSelectedBlockId = useWorkspaceStore((s) => s.setSelectedBlockId);
  const focusTeamAI = useWorkspaceStore((s) => s.focusTeamAI);
  const { team, me } = useTeam();
  const { addBlock } = useBlocks();
  const { setTheme, resolvedTheme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();

  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const commands: CommandItem[] = useMemo(() => {
    const addAt = (type: BlockType) => {
      setActiveMemberId(me.id);
      const flow = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      const id = addBlock(type, flow);
      if (typeof id === "string") setSelectedBlockId(id);
      setOpen(false);
    };

    const items: CommandItem[] = [
      {
        label: "Go to My Workspace",
        hint: "G W",
        run: () => {
          setActiveMemberId(me.id);
          setOpen(false);
        },
      },
      ...(["ai-chat", "code", "research", "task", "outreach", "notes"] as BlockType[]).map(
        (type) => ({
          label: `Add ${BLOCK_LABELS[type]} block`,
          hint: `A ${BLOCK_LABELS[type][0]}`,
          run: () => addAt(type),
        }),
      ),
      ...team
        .filter((m) => m.id !== me.id)
        .map((m) => ({
          label: `View ${m.name}'s workspace`,
          run: () => {
            setActiveMemberId(m.id);
            setOpen(false);
          },
        })),
      {
        label: "Copy invite link",
        run: () => {
          void fetch("/api/workspace/invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workspaceId }),
          })
            .then((r) => r.json())
            .then((p: { inviteUrl?: string }) => {
              if (p.inviteUrl) void navigator.clipboard.writeText(p.inviteUrl);
            });
          setOpen(false);
        },
      },
      {
        label: "Toggle dark/light mode",
        hint: "T T",
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          setOpen(false);
        },
      },
      {
        label: "Ask Team AI",
        hint: "T A",
        run: () => {
          focusTeamAI();
          setOpen(false);
        },
      },
    ];
    return items;
  }, [
    team,
    me.id,
    addBlock,
    screenToFlowPosition,
    setActiveMemberId,
    setSelectedBlockId,
    setOpen,
    setTheme,
    resolvedTheme,
    focusTeamAI,
    workspaceId,
  ]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    // simple fuzzy: all query chars appear in order
    return commands.filter((c) => {
      const label = c.label.toLowerCase();
      let pos = 0;
      for (const ch of q) {
        pos = label.indexOf(ch, pos);
        if (pos === -1) return false;
        pos += 1;
      }
      return true;
    });
  }, [commands, query]);

  useEffect(() => setIndex(0), [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[index]?.run();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 pt-[18vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-surface-hover shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 border-b border-border px-3.5">
              <Search size={14} className="text-text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command..."
                className="h-11 flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[9px] text-text-muted">
                ESC
              </kbd>
            </div>
            <div className="nowheel max-h-72 overflow-y-auto p-1.5">
              {filtered.length === 0 && (
                <p className="px-3 py-4 text-center text-xs text-text-muted">
                  No matching commands
                </p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.label}
                  onClick={cmd.run}
                  onMouseEnter={() => setIndex(i)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] transition-colors duration-100",
                    i === index
                      ? "bg-surface text-text-primary"
                      : "text-text-secondary",
                  )}
                >
                  {cmd.label}
                  {cmd.hint && (
                    <span className="text-[10px] uppercase tracking-[0.06em] text-text-muted">
                      {cmd.hint}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
