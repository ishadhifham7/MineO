export type ImageBlock = {
  id: string;
  type: "image";
  imageUri: string;
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
