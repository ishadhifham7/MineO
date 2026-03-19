// src/features/journal/journal.types.ts
import type { JournalBlock } from "../../../types/journal";

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  chapters: string[];
  isPinnedToTimeline: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface JournalEntryWithBlocks extends JournalEntry {
  blocks: JournalBlock[];
}

export interface JournalState {
  entryId: string | null;
  date: string | null;
  title: string;
  chapters: string[];
  isPinnedToTimeline: boolean;
  createdAt: number | null;
  updatedAt: number | null;
  isNew: boolean;
  blocks: JournalBlock[];
  isLoading: boolean;
  error: string | null;
}
