"use client";

import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import {
  LiveList,
  RoomProvider,
  roomIdForWorkspace,
} from "@/lib/liveblocks/config";
import { initialBlocks } from "@/lib/canvas/initialBlocks";
import { Canvas } from "@/components/canvas/Canvas";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopBar } from "@/components/topbar/TopBar";
import { useCanvasStore } from "@/store/canvasStore";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { recordRecentWorkspace } from "@/lib/recentWorkspaces";
import type { Connection } from "@/types/blocks";

export default function WorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  const workspaceId = params.id;
  const setWorkspaceName = useCanvasStore((s) => s.setWorkspaceName);

  useEffect(() => {
    recordRecentWorkspace(workspaceId);
  }, [workspaceId]);

  // Pull the real workspace name from Supabase when configured;
  // fall back to the demo name otherwise.
  useEffect(() => {
    if (!supabaseConfigured() || workspaceId === "demo") {
      setWorkspaceName("Project Nebula");
      return;
    }
    const supabase = createClient();
    supabase
      .from("workspaces")
      .select("name")
      .eq("id", workspaceId)
      .single()
      .then(({ data }) => {
        if (data?.name) setWorkspaceName(data.name as string);
      });
  }, [workspaceId, setWorkspaceName]);

  return (
    <RoomProvider
      id={roomIdForWorkspace(workspaceId)}
      initialPresence={{
        cursor: null,
        name: "",
        color: "#7C3AED",
        activeBlockId: null,
      }}
      initialStorage={{
        blocks: new LiveList(initialBlocks),
        connections: new LiveList<Connection>([]),
      }}
    >
      <ReactFlowProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar workspaceId={workspaceId} />
            <main className="relative min-h-0 flex-1">
              <Canvas />
            </main>
          </div>
        </div>
      </ReactFlowProvider>
    </RoomProvider>
  );
}
