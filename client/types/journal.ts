export type ImageBlock = {
  id: string;
  type: "image";
  /**
   * imageUrl: Firebase Storage HTTPS download URL (persisted, works across devices).
   * imageUri: local device URI (used transiently during upload for instant preview).
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
  type: "text";
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
  textAlign: "left" | "center" | "right";
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export type JournalBlock = TextBlock | ImageBlock;
