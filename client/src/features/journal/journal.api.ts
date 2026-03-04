// src/features/journal/journal.api.ts
import { api } from "../../services/api";
import type { JournalEntry } from "./journal.types";
import type { JournalBlock } from "../../../types/journal";
import { compressJournalImage } from "../../utils/imageUtils";

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

export const deleteJournal = async (entryId: string) => {
  const res = await api.delete(`/${entryId}`);
  return res.data;
};

/**
 * Compress an image and upload it to Firebase Storage via the backend.
 * @returns { imageUrl, imagePath } — imageUrl is the persistent HTTPS URL,
 *   imagePath is the Storage path needed for future deletion.
 */
export const uploadJournalImage = async (
  blockId: string,
  localUri: string,
): Promise<{ imageUrl: string; imagePath: string }> => {
  const compressed = await compressJournalImage(localUri);

  const formData = new FormData();
  // @ts-ignore — React Native's FormData accepts this file object format
  formData.append("file", {
    uri: compressed.uri,
    type: "image/jpeg",
    name: `${blockId}.jpg`,
  });
  formData.append("blockId", blockId);

  const res = await api.post("/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000, // 30 s for uploads
  });
  return res.data;
};
