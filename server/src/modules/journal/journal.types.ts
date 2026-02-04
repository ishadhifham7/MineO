// journal.types.ts

export type CanvasBlockType = 'text' | 'image' | 'sticker';

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CanvasBlock {
  id: string;
  type: CanvasBlockType;
  content: string;
  transform: CanvasTransform;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  isPinnedToTimeline: boolean;
  createdAt: number;
  updatedAt: number;
}
