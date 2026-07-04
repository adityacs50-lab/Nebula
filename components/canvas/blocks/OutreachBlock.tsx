"use client";

import { useState } from "react";
import type { NodeProps } from "reactflow";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import { Dropdown } from "@/components/ui/Dropdown";
import type { BlockNodeData } from "@/lib/canvas/types";
import type {
  OutreachChannel,
  OutreachContact,
  OutreachStatus,
} from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { useAI } from "@/hooks/useAI";
import { generateId } from "@/lib/utils";

const CHANNELS: Array<{ value: OutreachChannel; label: string }> = [
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Email", label: "Email" },
  { value: "Twitter", label: "Twitter" },
];

const STATUSES: OutreachStatus[] = [
  "Sent",
  "Opened",
  "Replied",
  "Call Booked",
  "Closed",
];

const STATUS_COLOR: Record<OutreachStatus, string> = {
  Sent: "#888888",
  Opened: "#3B82F6",
  Replied: "#10B981",
  "Call Booked": "#F59E0B",
  Closed: "#7C3AED",
};

export function OutreachBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData, postFeedItem } = useBlocks();
  const { assist } = useAI();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [channel, setChannel] = useState<OutreachChannel>("LinkedIn");
  const [draftFor, setDraftFor] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);

  const contacts = block.data.contacts ?? [];
  const replied = contacts.filter(
    (c) => c.status === "Replied" || c.status === "Call Booked",
  ).length;

  function addContact() {
    if (!name.trim()) return;
    const contact: OutreachContact = {
      id: generateId("contact"),
      name: name.trim(),
      company: company.trim(),
      channel,
      status: "Sent",
    };
    const next = [...contacts, contact];
    updateBlockData(id, { contacts: next });
    setName("");
    setCompany("");
    postFeedItem({
      type: "outreach",
      title: `Reached out to ${contact.name}${contact.company ? ` (${contact.company})` : ""}`,
      summary: `${next.length} contacted so far. ${replied} replies.`,
      blockId: id,
    });
  }

  function cycleStatus(contactId: string) {
    const next = contacts.map((c) =>
      c.id === contactId
        ? {
            ...c,
            status:
              STATUSES[(STATUSES.indexOf(c.status) + 1) % STATUSES.length],
          }
        : c,
    );
    updateBlockData(id, { contacts: next });
    const contact = next.find((c) => c.id === contactId);
    if (contact && (contact.status === "Replied" || contact.status === "Call Booked")) {
      postFeedItem({
        type: "outreach",
        title:
          contact.status === "Call Booked"
            ? `Call booked with ${contact.name}`
            : `${contact.name} replied`,
        summary: `${next.filter((c) => c.status === "Replied" || c.status === "Call Booked").length} warm leads in the pipeline.`,
        blockId: id,
      });
    }
  }

  async function handleDraft(contact: OutreachContact) {
    setDraftFor(contact.id);
    setDraft(null);
    const text = await assist("draft_outreach", {
      contactName: contact.name,
      company: contact.company,
      channel: contact.channel,
    });
    setDraft(
      text ??
        "AI isn't configured — add GEMINI_API_KEY to draft outreach messages.",
    );
  }

  return (
    <BaseBlock
      id={id}
      type="outreach"
      title={block.data.title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="flex h-full flex-col p-2.5">
        <div className="mb-2 flex shrink-0 items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="nodrag h-8 w-0 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="nodrag h-8 w-0 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <Dropdown
            size="sm"
            className="nodrag w-24 shrink-0"
            options={CHANNELS}
            value={channel}
            onChange={setChannel}
          />
          <button
            onClick={addContact}
            disabled={!name.trim()}
            aria-label="Add contact"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-opacity duration-100 hover:opacity-90 disabled:opacity-40"
          >
            <Plus size={13} />
          </button>
        </div>

        <div className="nowheel min-h-0 flex-1 space-y-1 overflow-y-auto">
          {contacts.length === 0 && (
            <p className="pt-6 text-center text-xs text-text-muted">
              No contacts yet · Track who you&apos;ve reached out to
            </p>
          )}
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-md border border-border px-2.5 py-2 transition-colors duration-100 hover:border-border-strong"
            >
              <div className="flex items-center gap-2">
                <span className="truncate text-[13px] font-medium text-text-primary">
                  {contact.name}
                </span>
                {contact.company && (
                  <span className="truncate text-[11px] text-text-secondary">
                    {contact.company}
                  </span>
                )}
                <span className="ml-auto text-[10px] uppercase tracking-[0.06em] text-text-muted">
                  {contact.channel}
                </span>
                <button
                  onClick={() => cycleStatus(contact.id)}
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    color: STATUS_COLOR[contact.status],
                    backgroundColor: `${STATUS_COLOR[contact.status]}1a`,
                  }}
                >
                  {contact.status}
                </button>
                <button
                  onClick={() => void handleDraft(contact)}
                  title="Draft message with AI"
                  aria-label="Draft message with AI"
                  className="rounded p-1 text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary"
                >
                  {draftFor === contact.id && draft === null ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Sparkles size={11} />
                  )}
                </button>
              </div>
              {draftFor === contact.id && draft && (
                <p className="mt-2 rounded-md bg-background px-2.5 py-2 text-[11px] leading-relaxed text-text-primary/85">
                  {draft}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 flex shrink-0 items-center justify-between text-[11px] text-text-secondary">
          <span>{contacts.length} contacted</span>
          <span>{replied} replied / booked</span>
        </div>
      </div>
    </BaseBlock>
  );
}
