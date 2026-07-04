"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Sparkles,
  Plus,
  Sun,
  Moon,
  User,
  Blocks,
  CreditCard,
  Check,
} from "lucide-react";
import { useTeam } from "@/hooks/useTeam";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

/**
 * 200px Nebula OS sidebar: team roster with presence dots, workspace
 * switcher (click a member to visit their canvas), settings, theme
 * toggle, and the invite action.
 */
export function Sidebar({ workspaceId }: { workspaceId: string }) {
  const { team, me } = useTeam();
  const activeMemberId = useWorkspaceStore((s) => s.activeMemberId);
  const setActiveMemberId = useWorkspaceStore((s) => s.setActiveMemberId);
  const { setActiveWorkspace } = useMultiplayer();
  const [invited, setInvited] = useState(false);

  function switchTo(memberId: string) {
    setActiveMemberId(memberId);
    setActiveWorkspace(memberId);
  }

  async function copyInvite() {
    try {
      const res = await fetch("/api/workspace/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const payload = (await res.json()) as { inviteUrl?: string };
      if (payload.inviteUrl) {
        await navigator.clipboard.writeText(payload.inviteUrl);
        setInvited(true);
        window.setTimeout(() => setInvited(false), 1800);
      }
    } catch {
      /* surfaced elsewhere */
    }
  }

  return (
    <aside className="flex h-full w-[200px] shrink-0 flex-col border-r border-border bg-surface">
      <Link href="/dashboard" className="flex items-center gap-2 px-4 pb-4 pt-4">
        <Sparkles size={15} className="text-primary" />
        <span className="text-[13px] font-semibold tracking-tight text-text-primary">
          Nebula OS
        </span>
      </Link>

      <div className="flex-1 space-y-5 overflow-y-auto px-2 pb-4">
        {/* Team members */}
        <section>
          <SectionLabel>Team members</SectionLabel>
          <ul className="space-y-px">
            {team.map((member) => (
              <li key={member.id}>
                <button
                  onClick={() => switchTo(member.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-[13px] transition-colors duration-100",
                    activeMemberId === member.id
                      ? "bg-surface-hover font-medium text-text-primary"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                  )}
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        member.status === "offline" && "opacity-30",
                        member.status === "away" && "opacity-60",
                      )}
                      style={{ backgroundColor: member.color }}
                    />
                  </span>
                  <span className="truncate">
                    {member.name}
                    {member.id === me.id && (
                      <span className="text-text-muted"> (you)</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => void copyInvite()}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[13px] text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary"
          >
            {invited ? (
              <Check size={12} className="text-success" />
            ) : (
              <Plus size={12} />
            )}
            {invited ? "Link copied" : "Invite member"}
          </button>
        </section>

        {/* Workspaces */}
        <section>
          <SectionLabel>Workspaces</SectionLabel>
          <ul className="space-y-px">
            {team.map((member) => (
              <li key={member.id}>
                <button
                  onClick={() => switchTo(member.id)}
                  className={cn(
                    "flex w-full items-center rounded-md px-3 py-1.5 text-left text-[13px] transition-colors duration-100",
                    activeMemberId === member.id
                      ? "bg-surface-hover font-medium text-text-primary"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                  )}
                >
                  <span className="truncate">
                    {member.id === me.id
                      ? "My Workspace"
                      : `${member.name}'s`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Settings */}
        <section>
          <SectionLabel>Settings</SectionLabel>
          <ul className="space-y-px">
            {[
              { icon: <User size={12} />, label: "Profile" },
              { icon: <Blocks size={12} />, label: "Integrations" },
              { icon: <CreditCard size={12} />, label: "Billing" },
            ].map((item) => (
              <li key={item.label}>
                <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-[13px] text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary">
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Footer: identity + theme toggle */}
      <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: me.color }}
          />
          <span className="truncate text-[13px] text-text-secondary">
            {me.name}
          </span>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-[0.06em] text-text-muted">
      {children}
    </h3>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // resolvedTheme is undefined during SSR — render the icon only after
  // mount so server and client HTML agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="rounded-md p-1.5 text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary"
    >
      {!mounted ? (
        <span className="block h-[13px] w-[13px]" />
      ) : resolvedTheme === "dark" ? (
        <Sun size={13} />
      ) : (
        <Moon size={13} />
      )}
    </button>
  );
}
