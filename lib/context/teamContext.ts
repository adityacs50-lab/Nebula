import type { Block } from "@/types/blocks";
import type { FeedItem } from "@/types/feed";
import type { TeamMember } from "@/types/workspace";

export type TeamMemberContext = {
  name: string;
  role: string;
  status: string;
  currentTasks: string[];
  recentActivity: string[];
  aiConversations: string[];
  research: string[];
  outreach: string[];
  notes: string[];
};

export type TeamContext = {
  workspace: string;
  timestamp: string;
  members: TeamMemberContext[];
  recentFeed: string[];
};

/**
 * The heart of Nebula OS: flattens every member's blocks + the team feed
 * into one compact snapshot that rides along with every AI call, so the
 * team AI genuinely knows what everyone is doing right now.
 */
export function buildTeamContext(
  workspaceName: string,
  team: TeamMember[],
  blocks: Block[],
  feed: FeedItem[],
): TeamContext {
  const members = team.map((member) => {
    const mine = blocks.filter((b) => b.ownerId === member.id);

    const currentTasks = mine
      .filter((b) => b.type === "task")
      .flatMap((b) => b.data.tasks ?? [])
      .filter((t) => !t.done)
      .map((t) => `${t.text} [${t.priority}]`);

    const aiConversations = mine
      .filter((b) => b.type === "ai-chat")
      .flatMap((b) => (b.data.messages ?? []).slice(-6))
      .map((m) => `${m.role === "user" ? member.name : "AI"}: ${clip(m.content, 200)}`);

    const research = mine
      .filter((b) => b.type === "research")
      .map((b) =>
        clip(
          `${b.data.title}${b.data.summary ? ` — ${b.data.summary}` : ""}${b.data.notes ? ` (notes: ${b.data.notes})` : ""}`,
          280,
        ),
      );

    const outreach = mine
      .filter((b) => b.type === "outreach")
      .map((b) => {
        const contacts = b.data.contacts ?? [];
        const replied = contacts.filter(
          (c) => c.status === "Replied" || c.status === "Call Booked",
        ).length;
        return `${contacts.length} contacts tracked, ${replied} replied/booked: ${contacts
          .map((c) => `${c.name} (${c.company}) — ${c.status}`)
          .join("; ")}`;
      });

    const notes = mine
      .filter((b) => b.type === "notes")
      .map((b) => clip(`${b.data.title}: ${b.data.body ?? ""}`, 240));

    const recentActivity = feed
      .filter((f) => f.memberId === member.id)
      .slice(0, 10)
      .map((f) => `${f.title} — ${f.summary}`);

    return {
      name: member.name,
      role: member.role,
      status: member.status,
      currentTasks,
      recentActivity,
      aiConversations,
      research,
      outreach,
      notes,
    };
  });

  return {
    workspace: workspaceName,
    timestamp: new Date().toISOString(),
    members,
    recentFeed: feed
      .slice(0, 20)
      .map((f) => `[${f.memberName}] ${f.title} — ${f.summary}`),
  };
}

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
