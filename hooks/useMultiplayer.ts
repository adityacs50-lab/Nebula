"use client";

import { useCallback } from "react";
import {
  useOthers,
  useSelf,
  useUpdateMyPresence,
} from "@/lib/liveblocks/config";
import type { XYPosition } from "@/types/blocks";

/**
 * Presence helpers: live cursor positions (in canvas/flow coordinates so
 * they stay accurate across zoom levels) and "who is editing what".
 */
export function useMultiplayer() {
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();
  const self = useSelf();

  const moveCursor = useCallback(
    (cursor: XYPosition | null) => {
      updateMyPresence({ cursor });
    },
    [updateMyPresence],
  );

  const setActiveBlock = useCallback(
    (activeBlockId: string | null) => {
      updateMyPresence({ activeBlockId });
    },
    [updateMyPresence],
  );

  const editorOfBlock = useCallback(
    (blockId: string): { name: string; color: string } | null => {
      for (const other of others) {
        if (other.presence.activeBlockId === blockId) {
          return {
            name: other.info?.name ?? other.presence.name ?? "Teammate",
            color: other.info?.color ?? other.presence.color ?? "#7C3AED",
          };
        }
      }
      return null;
    },
    [others],
  );

  return { others, self, moveCursor, setActiveBlock, editorOfBlock };
}
