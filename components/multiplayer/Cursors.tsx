"use client";

import { useViewport } from "reactflow";
import { useOthers } from "@/lib/liveblocks/config";

/**
 * Renders every other user's live cursor. Cursor positions are stored in
 * flow (canvas) coordinates, so we project them through the current
 * viewport transform — cursors stay glued to the canvas while you pan
 * and zoom. Colors: Maya=#7C3AED, Sam=#EC4899, Alex=#3B82F6,
 * Taylor=#10B981, David=#F59E0B.
 */
export function Cursors() {
  const others = useOthers();
  const { x, y, zoom } = useViewport();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {others.map((other) => {
        const cursor = other.presence.cursor;
        if (!cursor) return null;
        const color = other.info?.color ?? other.presence.color ?? "#7C3AED";
        const name = other.info?.name ?? other.presence.name ?? "Teammate";
        const screenX = cursor.x * zoom + x;
        const screenY = cursor.y * zoom + y;
        return (
          <div
            key={other.connectionId}
            className="nebula-cursor absolute left-0 top-0"
            style={{ transform: `translate(${screenX}px, ${screenY}px)` }}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 1.5L13.5 7L8 8.5L6 14L2 1.5Z"
                fill={color}
                stroke="#0D0D0D"
                strokeWidth="1"
              />
            </svg>
            <span
              className="ml-3 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
