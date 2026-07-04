"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useTeamAI } from "@/hooks/useTeamAI";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  { label: "Team status", prompt: "What's everyone working on right now?" },
  { label: "What's blocking us?", prompt: "What are our current blockers and what decisions are pending?" },
  { label: "Today's wins", prompt: "What did the team accomplish today?" },
  { label: "Investor update", prompt: "Write our weekly investor update based on the team's actual activity." },
];

/**
 * The shared team brain, docked at the bottom of the feed. Every answer
 * is grounded in the live snapshot of all members' blocks and the feed.
 */
export function TeamAI() {
  const { askTeamAI } = useTeamAI();
  const focusToken = useWorkspaceStore((s) => s.teamAIFocusToken);
  const inputRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (focusToken > 0) inputRef.current?.focus();
  }, [focusToken]);

  useEffect(() => {
    const el = answerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [answer]);

  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setError(null);
    setBusy(true);
    setAnswer("");
    setInput("");
    try {
      await askTeamAI(question.trim(), setAnswer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Team AI request failed");
      setAnswer(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shrink-0 border-t border-border bg-surface">
      <div className="flex items-center gap-2 px-4 pb-1 pt-3">
        <Sparkles size={12} className="text-primary" />
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-secondary">
          Nebula Team AI
        </span>
        <span className="text-[11px] text-text-muted">
          Ask anything about your team
        </span>
      </div>

      {/* Quick prompts */}
      <div className="nowheel flex gap-1.5 overflow-x-auto px-4 py-2">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            onClick={() => void ask(qp.prompt)}
            disabled={busy}
            className="shrink-0 rounded border border-border px-2 py-1 text-[11px] text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Answer */}
      {(answer !== null || error) && (
        <div
          ref={answerRef}
          className="nowheel mx-4 mb-2 max-h-44 overflow-y-auto rounded-md border border-border bg-background px-3 py-2.5"
        >
          {error ? (
            <p className="text-xs text-error">{error}</p>
          ) : (
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-text-primary/90">
              {answer}
              {busy && (
                <span className="ml-0.5 inline-block h-3 w-1.5 animate-blink bg-primary align-middle" />
              )}
            </p>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-2.5">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void ask(input);
          }}
          placeholder="Ask your team AI..."
          className="h-8 flex-1 rounded-md border border-border bg-background px-3 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
        <button
          onClick={() => void ask(input)}
          disabled={!input.trim() || busy}
          aria-label="Send"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition-opacity duration-100 hover:opacity-90 disabled:opacity-40",
          )}
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
