import type { Entry } from './types';

export type RemovedEntry = { entry: Entry; index: number };

export function removeEntry(entries: Entry[], id: string): { entries: Entry[]; removed: RemovedEntry | null } {
  const index = entries.findIndex((entry) => entry.id === id);
  if (index < 0) return { entries, removed: null };
  return { entries: entries.filter((entry) => entry.id !== id), removed: { entry: entries[index], index } };
}

export function restoreEntry(entries: Entry[], removed: RemovedEntry): Entry[] {
  const restored = [...entries];
  restored.splice(Math.min(removed.index, restored.length), 0, removed.entry);
  return restored;
}
