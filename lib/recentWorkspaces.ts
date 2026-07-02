const STORAGE_KEY = "nebula:recent-workspaces";
const MAX_RECENT = 8;

/** Records a workspace visit in localStorage, most-recent-first. */
export function recordRecentWorkspace(workspaceId: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentWorkspaceIds();
    const next = [workspaceId, ...existing.filter((id) => id !== workspaceId)].slice(
      0,
      MAX_RECENT,
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private mode, etc.) — safe to ignore
  }
}

/** Reads the list of recently visited workspace IDs, most-recent-first. */
export function getRecentWorkspaceIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}
