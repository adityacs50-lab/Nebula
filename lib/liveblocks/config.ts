import { createClient, LiveList } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import type { Block, Connection, XYPosition } from "@/types/blocks";

const client = createClient({
  authEndpoint: "/api/liveblocks/auth",
  throttle: 16,
});

export type Presence = {
  cursor: XYPosition | null;
  name: string;
  color: string;
  activeBlockId: string | null;
};

export type Storage = {
  blocks: LiveList<Block>;
  connections: LiveList<Connection>;
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
  return `nebula-workspace-${workspaceId}`;
}

export { LiveList };
