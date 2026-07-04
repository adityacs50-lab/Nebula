"use client";

import { useState } from "react";
import type { NodeProps } from "reactflow";
import { Check, Plus } from "lucide-react";
import { BaseBlock } from "./BaseBlock";
import type { BlockNodeData } from "@/lib/canvas/types";
import type { TaskItem, TaskPriority } from "@/types/blocks";
import { useBlocks } from "@/hooks/useBlocks";
import { generateId, cn } from "@/lib/utils";

const PRIORITY_ORDER: TaskPriority[] = ["high", "medium", "low"];
const PRIORITY_COLOR: Record<TaskPriority, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#888888",
};

export function TaskBlock({ id, data, selected }: NodeProps<BlockNodeData>) {
  const { block } = data;
  const { updateBlockData, postFeedItem } = useBlocks();
  const [draft, setDraft] = useState("");

  const tasks = block.data.tasks ?? [];
  const done = tasks.filter((t) => t.done).length;

  function addTask() {
    const text = draft.trim();
    if (!text) return;
    const task: TaskItem = {
      id: generateId("task"),
      text,
      done: false,
      priority: "medium",
    };
    updateBlockData(id, { tasks: [...tasks, task] });
    setDraft("");
  }

  function toggleTask(taskId: string) {
    const next = tasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t,
    );
    updateBlockData(id, { tasks: next });
    const toggled = next.find((t) => t.id === taskId);
    if (toggled?.done) {
      postFeedItem({
        type: "task_complete",
        title: `Completed: ${toggled.text.slice(0, 70)}`,
        summary: `${next.filter((t) => t.done).length}/${next.length} tasks done today.`,
        blockId: id,
      });
    }
  }

  function cyclePriority(taskId: string) {
    updateBlockData(id, {
      tasks: tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              priority:
                PRIORITY_ORDER[
                  (PRIORITY_ORDER.indexOf(t.priority) + 1) % PRIORITY_ORDER.length
                ],
            }
          : t,
      ),
    });
  }

  return (
    <BaseBlock
      id={id}
      type="task"
      title={block.data.title}
      selected={selected}
      minimized={Boolean(block.data.minimized)}
    >
      <div className="flex h-full flex-col p-2.5">
        {/* progress */}
        <div className="mb-2 shrink-0">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-[0.06em] text-text-secondary">
              Progress
            </span>
            <span className="text-[11px] tabular-nums text-text-secondary">
              {done}/{tasks.length}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full bg-success transition-[width] duration-200"
              style={{ width: tasks.length ? `${(done / tasks.length) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <div className="nowheel min-h-0 flex-1 space-y-0.5 overflow-y-auto">
          {tasks.length === 0 && (
            <p className="pt-6 text-center text-xs text-text-muted">
              No tasks · Add what you&apos;re working on today
            </p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors duration-100 hover:bg-surface-hover"
            >
              <button
                onClick={() => toggleTask(task.id)}
                aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-100",
                  task.done
                    ? "border-success bg-success text-white"
                    : "border-border-strong hover:border-success",
                )}
              >
                {task.done && <Check size={10} />}
              </button>
              <span
                className={cn(
                  "flex-1 truncate text-[13px]",
                  task.done
                    ? "text-text-muted line-through"
                    : "text-text-primary",
                )}
              >
                {task.text}
              </span>
              <button
                onClick={() => cyclePriority(task.id)}
                title={`Priority: ${task.priority}`}
                className="h-2 w-2 shrink-0 rounded-full opacity-70 transition-opacity hover:opacity-100"
                style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
              />
            </div>
          ))}
        </div>

        <div className="mt-2 flex shrink-0 items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Add a task..."
            className="nodrag h-8 flex-1 rounded-md border border-border bg-background px-3 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <button
            onClick={addTask}
            disabled={!draft.trim()}
            aria-label="Add task"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition-colors duration-100 hover:bg-surface-hover hover:text-text-primary disabled:opacity-40"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </BaseBlock>
  );
}
