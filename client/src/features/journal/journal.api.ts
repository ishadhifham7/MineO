// src/features/journal/journal.api.ts
import { api } from "../../services/api";
import type { JournalEntry } from "./journal.types";
import type { JournalBlock } from "../../../types/journal";

export const getJournalByDate = async (date: string) => {
  const res = await api.get(`?date=${date}`);
  return res.data; // null or journal object
};

export const getJournalById = async (id: string) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const createJournal = async (payload: {
  date: string;
  title: string;
  isPinnedToTimeline: boolean;
  blocks: JournalBlock[];
}) => {
  const res = await api.post("", payload);
  return res.data; // returns JournalEntry
};

export const updateCanvas = async (id: string, blocks: JournalBlock[]) => {
  const res = await api.put(`/${id}/canvas`, { blocks });
  return res.data;
};

export const updateMeta = async (
  id: string,
  meta: { title?: string; isPinnedToTimeline?: boolean },
) => {
  const res = await api.patch(`/${id}/meta`, meta);
  return res.data;
};

export const getJournalDates = async (): Promise<string[]> => {
  const res = await api.get<{ dates: string[] }>("/dates");
  return res.data.dates;
};

export const getJournalsByDate = async (
  date: string,
): Promise<import("./journal.types").JournalEntryWithBlocks[]> => {
  const res = await api.get(`/all-by-date?date=${encodeURIComponent(date)}`);
  return res.data;
};

export const getAllJournals = async (): Promise<
  import("./journal.types").JournalEntryWithBlocks[]
> => {
  const res = await api.get("/all");
  return res.data;
};
