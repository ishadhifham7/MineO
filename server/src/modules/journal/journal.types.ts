export type ImageBlock = {
  id: string;
  type: 'image';
  /**
   * imageUrl: Firebase Storage HTTPS download URL (used in production).
   * imageUri: local device URI (used transiently during upload, not persisted).
   * At least one must be present.
   */
  imageUrl?: string;
  imageUri?: string;
  /** Firebase Storage path — required for deletion, e.g. users/{uid}/journal/{blockId}.jpg */
  imagePath?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
};

export type TextBlock = {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export type JournalBlock = TextBlock | ImageBlock;

export interface JournalEntry {
  id: string;
  userId: string; // Owner of the journal entry
  date: string;
  title?: string;
  isPinnedToTimeline: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DayJournal extends JournalEntry {
  blocks: JournalBlock[];
}
