// features/journal/journal.types.ts
import type { JournalBlock } from "../../../types/journal";

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  isPinnedToTimeline: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DayJournal extends JournalEntry {
  blocks: JournalBlock[];
}
