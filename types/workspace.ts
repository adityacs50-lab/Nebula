export type WorkspaceRole = "owner" | "member";

export type WorkspaceMember = {
  id: string;
  name: string;
  email?: string;
  role: WorkspaceRole;
};

export type Activity = {
  id: string;
  user: string;
  action: string;
  target: string;
  at: string;
};

export type Workspace = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
  recentActivity: Activity[];
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  membersCount: number;
  lastActive: string;
  role?: WorkspaceRole;
};

export type Invite = {
  id: string;
  workspaceId: string;
  token: string;
  expiresAt: string;
};
