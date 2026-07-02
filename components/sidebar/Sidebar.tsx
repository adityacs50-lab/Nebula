"use client";

import Link from "next/link";
import {
  Sparkles,
  Search,
  Home,
  Clock,
  MessageSquare,
  Folder,
  Share2,
} from "lucide-react";
import { TeamspaceList } from "./TeamspaceList";
import { ToolsList } from "./ToolsList";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: <Home size={13} />, active: true },
  { label: "Recent", icon: <Clock size={13} /> },
  { label: "AI Chat", icon: <MessageSquare size={13} /> },
  { label: "My Files", icon: <Folder size={13} /> },
  { label: "Shared with me", icon: <Share2 size={13} /> },
];

/** Fixed 220px left sidebar for the workspace view. */
export function Sidebar() {
  const { user } = useAuth();
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    typeof meta.full_name === "string" ? meta.full_name : "Aditya Shinde";
  const email = user?.email ?? "shindeadityau@gmail.com";

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
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <button
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    item.active
                      ? "bg-surface-hover text-white"
                      : "text-text-secondary hover:bg-surface-hover hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
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
