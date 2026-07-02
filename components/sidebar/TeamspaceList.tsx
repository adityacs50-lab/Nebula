"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Teamspace = {
  name: string;
  active?: boolean;
};

const DEFAULT_TEAMSPACES: Teamspace[] = [
  { name: "Project Nebula", active: true },
  { name: "Design System" },
  { name: "Marketing" },
  { name: "Research Lab" },
];

export function TeamspaceList() {
  const [teamspaces, setTeamspaces] = useState<Teamspace[]>(DEFAULT_TEAMSPACES);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  function addTeamspace() {
    const name = newName.trim();
    if (name) setTeamspaces((prev) => [...prev, { name }]);
    setNewName("");
    setAdding(false);
  }

  return (
    <div>
      <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Teamspaces
      </h3>
      <ul className="space-y-0.5">
        {teamspaces.map((teamspace) => (
          <li key={teamspace.name}>
            <button
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                teamspace.active
                  ? "bg-primary/10 text-white"
                  : "text-text-secondary hover:bg-surface-hover hover:text-white",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  teamspace.active ? "bg-primary" : "bg-border",
                )}
              />
              <span className="truncate">{teamspace.name}</span>
            </button>
          </li>
        ))}
      </ul>
      {adding ? (
        <div className="mt-1 px-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={addTeamspace}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTeamspace();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="Teamspace name"
            className="h-7 w-full rounded-md border border-border bg-background px-2 text-xs text-white placeholder:text-text-secondary/60 focus:border-primary focus:outline-none"
          />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-white"
        >
          <Plus size={12} />
          New teamspace
        </button>
      )}
    </div>
  );
}
