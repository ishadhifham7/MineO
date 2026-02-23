// src/services/journal.service.ts
import { api } from "./api";
import type { JournalBlock } from "../../types/journal";

export const JournalApi = {
  getByDate(date: string) {
    return api.get("/", { params: { date } });
  },

  createJournal(data: {
    date: string;
    blocks: JournalBlock[];
    title?: string;
    isPinnedToTimeline?: boolean;
  }) {
    return api.post("/", data);
  },

  updateCanvas(entryId: string, blocks: JournalBlock[]) {
    return api.put(`/${entryId}/canvas`, { blocks });
  },

  getById(entryId: string) {
    return api.get(`/${entryId}`);
  },
};
