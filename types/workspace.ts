export type WorkspaceRole = "owner" | "member";

export type MemberStatus = "online" | "away" | "offline";

/** A founding-team member with their workspace identity. */
export type TeamMember = {
  id: string;
  name: string;
  color: string;
  role: string;
  status: MemberStatus;
};

export const MEMBER_COLORS = [
  "#7C3AED",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
] as const;

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
