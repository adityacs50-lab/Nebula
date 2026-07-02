"use client";

import { usePresenceUsers } from "@/components/multiplayer/Presence";
import { initials } from "@/lib/utils";

const MAX_VISIBLE = 3;

/** Stacked avatars of everyone in the room right now. */
export function OnlineAvatars() {
  const users = usePresenceUsers();
  const visible = users.slice(0, MAX_VISIBLE);
  const overflow = users.length - visible.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map((user) => (
          <span
            key={user.key}
            title={user.isSelf ? `${user.name} (you)` : user.name}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[9px] font-semibold text-white"
            style={{ backgroundColor: user.color }}
          >
            {initials(user.name)}
          </span>
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-1.5 text-xs text-text-secondary">+{overflow}</span>
      )}
    </div>
  );
}
