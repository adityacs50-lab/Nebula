"use client";

import { useOthers, useSelf } from "@/lib/liveblocks/config";
import { initials } from "@/lib/utils";

export type PresenceUser = {
  key: string;
  name: string;
  color: string;
  isSelf: boolean;
};

/** Everyone currently connected to the room, self first. */
export function usePresenceUsers(): PresenceUser[] {
  const self = useSelf();
  const others = useOthers();
  const users: PresenceUser[] = [];
  if (self) {
    users.push({
      key: `self-${self.connectionId}`,
      name: self.info?.name ?? "You",
      color: self.info?.color ?? "#7C3AED",
      isSelf: true,
    });
  }
  for (const other of others) {
    users.push({
      key: `other-${other.connectionId}`,
      name: other.info?.name ?? other.presence.name ?? "Teammate",
      color: other.info?.color ?? other.presence.color ?? "#3B82F6",
      isSelf: false,
    });
  }
  return users;
}

/** Compact list of who's online — used inside the Share dropdown. */
export function Presence() {
  const users = usePresenceUsers();

  return (
    <ul className="flex flex-col gap-2">
      {users.map((user) => (
        <li key={user.key} className="flex items-center gap-2.5 text-sm">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: user.color }}
          >
            {initials(user.name)}
          </span>
          <span className="text-text-primary/90">
            {user.name}
            {user.isSelf && (
              <span className="ml-1.5 text-xs text-text-secondary">(you)</span>
            )}
          </span>
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-success" />
        </li>
      ))}
      {users.length === 0 && (
        <li className="text-xs text-text-secondary">Connecting...</li>
      )}
    </ul>
  );
}
