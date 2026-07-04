"use client";

import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import {
  LiveList,
  RoomProvider,
  roomIdForWorkspace,
} from "@/lib/liveblocks/config";
import { DEMO_BLOCKS, DEMO_FEED } from "@/lib/demo";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { recordRecentWorkspace } from "@/lib/recentWorkspaces";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import type { Connection } from "@/types/blocks";

export default function WorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  const workspaceId = params.id;
  const setWorkspaceName = useWorkspaceStore((s) => s.setWorkspaceName);

  useEffect(() => {
    recordRecentWorkspace(workspaceId);
  }, [workspaceId]);

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
        activeWorkspace: "me",
        status: "online",
      }}
      initialStorage={{
        blocks: new LiveList(DEMO_BLOCKS),
        connections: new LiveList<Connection>([]),
        feedItems: new LiveList(DEMO_FEED),
      }}
    >
      <ReactFlowProvider>
        <WorkspaceLayout workspaceId={workspaceId} />
      </ReactFlowProvider>
    </RoomProvider>
  );
}
