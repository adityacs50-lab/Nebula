import type { Block } from "@/types/blocks";
import type { FeedItem } from "@/types/feed";
import type { TeamMember } from "@/types/workspace";

/**
 * Demo team roster. When Supabase auth is live the signed-in user
 * replaces "me"; the rest stay as illustrative teammates until real
 * members join via invite links.
 */
export const DEMO_TEAM: TeamMember[] = [
  { id: "me", name: "Aditya", color: "#7C3AED", role: "Product & Eng", status: "online" },
  { id: "bhavishya", name: "Bhavishya", color: "#3B82F6", role: "Growth", status: "online" },
  { id: "kshitij", name: "Kshitij", color: "#10B981", role: "Hardware", status: "online" },
  { id: "vaibhav", name: "Vaibhav", color: "#F59E0B", role: "Sales", status: "away" },
  { id: "yash", name: "Yash", color: "#EC4899", role: "Community", status: "offline" },
];

const now = Date.now();
const ago = (mins: number) => new Date(now - mins * 60_000).toISOString();

export const DEMO_BLOCKS: Block[] = [
  {
    id: "seed-aditya-chat",
    type: "ai-chat",
    ownerId: "me",
    ownerName: "Aditya",
    ownerColor: "#7C3AED",
    position: { x: 80, y: 60 },
    size: { width: 420, height: 340 },
    lastEditedBy: "Aditya",
    lastEditedAt: ago(4),
    data: {
      title: "AI Chat",
      messages: [
        {
          role: "user",
          content: "Why would JWT sessions expire early on staging?",
          timestamp: ago(6),
          user: "Aditya",
        },
        {
          role: "assistant",
          content:
            "Most likely a clock skew or a too-short `exp` claim. Check whether staging signs tokens with seconds vs milliseconds — a 1000x mistake makes sessions die instantly.",
          timestamp: ago(5),
        },
      ],
    },
  },
  {
    id: "seed-aditya-tasks",
    type: "task",
    ownerId: "me",
    ownerName: "Aditya",
    ownerColor: "#7C3AED",
    position: { x: 560, y: 60 },
    size: { width: 360, height: 320 },
    lastEditedBy: "Aditya",
    lastEditedAt: ago(12),
    data: {
      title: "Today's Tasks",
      tasks: [
        { id: "t1", text: "Fix JWT expiry bug", done: true, priority: "high" },
        { id: "t2", text: "Deploy auth fix to staging", done: true, priority: "high" },
        { id: "t3", text: "Prep demo for BuildFast call", done: false, priority: "high" },
        { id: "t4", text: "Review Kshitij's supplier quote", done: false, priority: "medium" },
      ],
    },
  },
  {
    id: "seed-bhavishya-outreach",
    type: "outreach",
    ownerId: "bhavishya",
    ownerName: "Bhavishya",
    ownerColor: "#3B82F6",
    position: { x: 80, y: 60 },
    size: { width: 460, height: 340 },
    lastEditedBy: "Bhavishya",
    lastEditedAt: ago(15),
    data: {
      title: "Founder Outreach",
      contacts: [
        { id: "c1", name: "Rohan M.", company: "BuildFast", channel: "LinkedIn", status: "Replied", notes: "Replied in 5 min. Very warm." },
        { id: "c2", name: "Priya S.", company: "DataLayer", channel: "Email", status: "Opened" },
        { id: "c3", name: "Alex K.", company: "Loopcast", channel: "Twitter", status: "Sent" },
      ],
    },
  },
  {
    id: "seed-kshitij-research",
    type: "research",
    ownerId: "kshitij",
    ownerName: "Kshitij",
    ownerColor: "#10B981",
    position: { x: 80, y: 60 },
    size: { width: 400, height: 340 },
    lastEditedBy: "Kshitij",
    lastEditedAt: ago(60),
    data: {
      title: "RPLIDAR suppliers",
      url: "https://slamtec.com/en/Lidar/A1",
      summary:
        "Direct-from-manufacturer pricing is ~40% below our current distributor. MOQ 10 units, 3-week lead time.",
      notes: "Need budget approval before Friday to hit the build window.",
      tags: ["technical", "market"],
    },
  },
  {
    id: "seed-vaibhav-tasks",
    type: "task",
    ownerId: "vaibhav",
    ownerName: "Vaibhav",
    ownerColor: "#F59E0B",
    position: { x: 80, y: 60 },
    size: { width: 360, height: 320 },
    lastEditedBy: "Vaibhav",
    lastEditedAt: ago(90),
    data: {
      title: "Sales pipeline",
      tasks: [
        { id: "v1", text: "Discovery call with Rohan (tomorrow 11am)", done: false, priority: "high" },
        { id: "v2", text: "Send follow-up deck to DataLayer", done: false, priority: "medium" },
      ],
    },
  },
  {
    id: "seed-yash-notes",
    type: "notes",
    ownerId: "yash",
    ownerName: "Yash",
    ownerColor: "#EC4899",
    position: { x: 80, y: 60 },
    size: { width: 380, height: 300 },
    lastEditedBy: "Yash",
    lastEditedAt: ago(150),
    data: {
      title: "r/startups post",
      body: "# Launch post traction\n\n- 47 upvotes in 3 hours\n- 2 inbound beta requests\n- Best comment: *\"finally someone gets founding team chaos\"*\n\nNext: reply to every comment tonight.",
      important: true,
    },
  },
];

export const DEMO_FEED: FeedItem[] = [
  {
    id: "feed-1",
    memberId: "me",
    memberName: "Aditya",
    memberColor: "#7C3AED",
    type: "task_complete",
    title: "Finished auth flow debug",
    summary: "AI helped identify JWT expiry bug. Fix deployed to staging.",
    createdAt: ago(4),
    blockId: "seed-aditya-tasks",
    reactions: { like: 2, fire: 1 },
  },
  {
    id: "feed-2",
    memberId: "bhavishya",
    memberName: "Bhavishya",
    memberColor: "#3B82F6",
    type: "outreach",
    title: "Outreach: 20 founders contacted",
    summary: "3 opened. Rohan from BuildFast most engaged — replied within 5 mins.",
    createdAt: ago(15),
    blockId: "seed-bhavishya-outreach",
    reactions: { fire: 2 },
  },
  {
    id: "feed-3",
    memberId: "kshitij",
    memberName: "Kshitij",
    memberColor: "#10B981",
    type: "research",
    title: "Research: RPLIDAR suppliers",
    summary: "Found supplier 40% cheaper than current. Link saved to canvas.",
    createdAt: ago(60),
    blockId: "seed-kshitij-research",
    reactions: { like: 1 },
  },
  {
    id: "feed-4",
    memberId: "vaibhav",
    memberName: "Vaibhav",
    memberColor: "#F59E0B",
    type: "outreach",
    title: "Call booked with BuildFast",
    summary: "Discovery call with Rohan tomorrow 11am. Demo needs to be flawless.",
    createdAt: ago(90),
    blockId: "seed-vaibhav-tasks",
  },
  {
    id: "feed-5",
    memberId: "yash",
    memberName: "Yash",
    memberColor: "#EC4899",
    type: "note",
    title: "Reddit post getting traction",
    summary: "47 upvotes on r/startups, 2 inbound beta requests.",
    createdAt: ago(150),
    blockId: "seed-yash-notes",
  },
];
