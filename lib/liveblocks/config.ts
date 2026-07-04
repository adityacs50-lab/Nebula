import { createClient, LiveList } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import type { Block, Connection, XYPosition } from "@/types/blocks";
import type { FeedItem } from "@/types/feed";
import type { MemberStatus } from "@/types/workspace";

const client = createClient({
  authEndpoint: "/api/liveblocks/auth",
  throttle: 16,
});

export type Presence = {
  cursor: XYPosition | null;
  name: string;
  color: string;
  activeBlockId: string | null;
  /** Whose workspace this user is currently viewing. */
  activeWorkspace: string;
  status: MemberStatus;
};

export type Storage = {
  blocks: LiveList<Block>;
  connections: LiveList<Connection>;
  feedItems: LiveList<FeedItem>;
};

export type UserMeta = {
  id: string;
  info: {
    name: string;
    color: string;
    email: string;
  };
};

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage, UserMeta>(client);

export function roomIdForWorkspace(workspaceId: string): string {
  // v2: Nebula OS rooms carry per-member blocks + the team feed. New
  // room id so pre-OS rooms (old block schema) don't collide.
  return `nebula-os-${workspaceId}`;
}

export { LiveList };
