"use client";

import { useMemo } from "react";
import { useOthers, useSelf } from "@/lib/liveblocks/config";
import { DEMO_TEAM } from "@/lib/demo";
import { useWorkspaceStore } from "@/store/workspaceStore";
import type { TeamMember } from "@/types/workspace";

/**
 * The team roster: the demo five, with "me" replaced by the signed-in
 * user's identity (from Liveblocks auth) and online status upgraded by
 * live presence when a real teammate is connected.
 */
export function useTeam() {
  const self = useSelf();
  const others = useOthers();
  const meId = useWorkspaceStore((s) => s.meId);

  return useMemo(() => {
    const onlineNames = new Set(
      others.map((o) => o.info?.name ?? o.presence.name),
    );

    const team: TeamMember[] = DEMO_TEAM.map((member) => {
      if (member.id === meId) {
        return {
          ...member,
          name: self?.info?.name ?? member.name,
          color: self?.info?.color ?? member.color,
          status: "online" as const,
        };
      }
      return onlineNames.has(member.name)
        ? { ...member, status: "online" as const }
        : member;
    });

    const me = team.find((m) => m.id === meId) ?? team[0];
    return { team, me };
  }, [others, self, meId]);
}
